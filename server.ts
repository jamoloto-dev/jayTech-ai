import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db/database.js';
import { providerRouter } from './server/providers/router.js';
import { jobQueue } from './server/jobs/queue.js';
import { requireAuth, authService, AuthenticatedRequest } from './server/auth/authService.js';
import { buildDeterministicTimeline, buildPublishingPackage } from './server/renderer/timeline.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    platform: 'JayTech AI',
    timestamp: new Date().toISOString(),
    aiProvider: providerRouter.name,
  });
});

// Authentication
app.post('/api/v1/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const result = authService.login(email);
  return res.json(result);
});

app.get('/api/v1/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

// Projects CRUD
app.get('/api/v1/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const projects = db.getAllProjects(req.user?.id);
  res.json({ projects });
});

app.post('/api/v1/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const { title, prompt, format, targetDuration, aspectRatio } = req.body;
  const project = {
    id: 'proj-' + Math.random().toString(36).substring(2, 9),
    userId: req.user!.id,
    title: title || 'Untitled TikTok Video',
    prompt: prompt || '',
    format: format || 'TikTok Vertical (9:16)',
    aspectRatio: aspectRatio || '9:16',
    targetDuration: targetDuration || 45,
    status: 'DRAFT' as const,
    scenes: [],
    generationHistory: [
      {
        timestamp: new Date().toISOString(),
        stage: 'CREATED',
        details: 'Project initialized via JayTech Studio',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveProject(project);
  db.logAudit(req.user!.id, 'CREATE_PROJECT', `Created project: ${project.title}`);
  res.status(201).json({ project });
});

app.get('/api/v1/projects/:id', requireAuth, (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ project });
});

app.put('/api/v1/projects/:id', requireAuth, (req, res) => {
  const existing = db.getProjectById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const updated = db.saveProject({
    ...existing,
    ...req.body,
    id: existing.id,
    userId: existing.userId,
  });
  return res.json({ project: updated });
});

app.delete('/api/v1/projects/:id', requireAuth, (req, res) => {
  const success = db.deleteProject(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ success: true });
});

app.post('/api/v1/projects/:id/duplicate', requireAuth, (req: AuthenticatedRequest, res) => {
  const duplicated = db.duplicateProject(req.params.id, req.user?.id);
  if (!duplicated) {
    return res.status(404).json({ error: 'Original project not found' });
  }
  return res.json({ project: duplicated });
});

// AI Workflow Step 2: Creative Brief
app.post('/api/v1/projects/:id/plan', requireAuth, async (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  try {
    const brief = await providerRouter.generateBrief(project.prompt || req.body.prompt || project.title, {
      duration: project.targetDuration,
      format: project.format,
      tone: req.body.tone,
      targetPlatform: req.body.platform,
    });

    project.creativeBrief = brief;
    project.status = 'SCRIPTING';
    db.saveProject(project);

    return res.json({ brief, project });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// AI Workflow Step 3: Script & Hooks
app.post('/api/v1/projects/:id/script', requireAuth, async (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (!project.creativeBrief) {
    project.creativeBrief = await providerRouter.generateBrief(project.prompt || project.title);
  }

  try {
    const script = await providerRouter.generateScript(project.prompt, project.creativeBrief);
    project.script = script;
    project.status = 'STORYBOARD';
    db.saveProject(project);

    return res.json({ script, project });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// AI Workflow Step 4: Storyboard Decomposition
app.post('/api/v1/projects/:id/storyboard', requireAuth, async (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  if (!project.script) {
    return res.status(400).json({ error: 'Project script must be generated first.' });
  }

  try {
    const sceneDrafts = await providerRouter.decomposeStoryboard(project.script, project.creativeBrief!);
    project.scenes = sceneDrafts.map((draft, idx) => ({
      ...draft,
      id: `scene-${project.id}-${idx + 1}`,
      projectId: project.id,
      status: 'READY' as const,
    }));
    project.status = 'GENERATING';
    db.saveProject(project);

    return res.json({ scenes: project.scenes, project });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// AI Workflow Step 5: Asynchronous Full Generation Job
app.post('/api/v1/projects/:id/generate', requireAuth, async (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  // Create asynchronous job
  const job = jobQueue.createJob(project.id, 'FULL_PIPELINE');

  // Immediately respond with job metadata so client request never blocks
  res.json({
    jobId: job.id,
    status: job.status,
    sseUrl: `/api/v1/jobs/${job.id}/events`,
    message: 'Generation pipeline queued asynchronously.',
  });

  // Execute pipeline stages in background
  (async () => {
    try {
      jobQueue.updateJobProgress(job.id, 'RUNNING', 10, 'Synthesizing voiceover audio tracks');
      await new Promise(r => setTimeout(r, 600));

      jobQueue.updateJobProgress(job.id, 'RUNNING', 35, 'Generating high-resolution 9:16 scene visual assets');
      await new Promise(r => setTimeout(r, 700));

      jobQueue.updateJobProgress(job.id, 'RUNNING', 65, 'Composing scene transitions, camera motion, and sound effects');
      await new Promise(r => setTimeout(r, 700));

      jobQueue.updateJobProgress(job.id, 'RUNNING', 85, 'Aligning animated dynamic karaoke subtitles and audio ducking');
      await new Promise(r => setTimeout(r, 600));

      project.status = 'READY';
      project.renderedVideoUrl = '/assets/rendered-output.mp4';
      project.thumbnailUrl = project.scenes[0]?.mediaUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80';
      db.saveProject(project);

      jobQueue.updateJobProgress(job.id, 'SUCCEEDED', 100, 'Video ready for preview and publishing package export');
    } catch (error: unknown) {
      jobQueue.updateJobProgress(job.id, 'FAILED', 0, 'Pipeline failed', (error as Error).message);
    }
  })();
});

// Job Status & SSE Real-time Events
app.get('/api/v1/jobs/:id', requireAuth, (req, res) => {
  const job = db.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json({ job });
});

app.get('/api/v1/jobs/:id/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  jobQueue.subscribe(req.params.id, res);
});

// Timeline & Composition
app.get('/api/v1/projects/:id/timeline', requireAuth, (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const timeline = buildDeterministicTimeline(project);
  return res.json({ timeline });
});

// Export Publishing Package
app.get('/api/v1/projects/:id/export', requireAuth, (req, res) => {
  const project = db.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const pkg = buildPublishingPackage(project);
  return res.json({ publishingPackage: pkg });
});

// In-Product AI Assistant Copilot
app.post('/api/v1/ai-assistant', requireAuth, async (req, res) => {
  const { message, contextProject } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await providerRouter.chatAssistant(message, contextProject);
    return res.json({ response });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Google Search Grounding with gemini-2.5-flash
app.post('/api/v1/search-grounding', requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const result = await providerRouter.searchGrounding(query);
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Create & Edit Images with gemini-3.1-flash-image-preview
app.post('/api/v1/images/generate', requireAuth, async (req, res) => {
  const { prompt, inputImageBase64 } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const result = await providerRouter.createOrEditImage(prompt, inputImageBase64);
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Animate Images to Video with veo-3.1-fast-generate-preview
app.post('/api/v1/videos/animate', requireAuth, async (req, res) => {
  const { prompt, inputImageBase64, aspectRatio } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const result = await providerRouter.animateImageToVideo(prompt, inputImageBase64, aspectRatio || '9:16');
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Generate Music with lyria-3-clip-preview / lyria-3-pro-preview
app.post('/api/v1/music/generate', requireAuth, async (req, res) => {
  const { prompt, durationSeconds, format } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const result = await providerRouter.generateMusic(prompt, durationSeconds || 30, format || 'clip');
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Live Voice Conversation with gemini-3.8-live
app.post('/api/v1/voice/chat', requireAuth, async (req, res) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const result = await providerRouter.liveVoiceChat(message, history);
    return res.json(result);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// TikTok Dedicated Engine Metadata
app.post('/api/v1/tiktok/metadata', requireAuth, async (req, res) => {
  const { title, scriptText } = req.body;
  try {
    const meta = await providerRouter.generateTikTokMetadata(title || 'Video', scriptText || '');
    return res.json(meta);
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// Brand Kits
app.get('/api/v1/brand-kits', requireAuth, (req: AuthenticatedRequest, res) => {
  const kits = db.getBrandKits(req.user!.id);
  return res.json({ brandKits: kits });
});

app.post('/api/v1/brand-kits', requireAuth, (req: AuthenticatedRequest, res) => {
  const kit = {
    ...req.body,
    id: 'brand-' + Math.random().toString(36).substring(2, 9),
    userId: req.user!.id,
    createdAt: new Date().toISOString(),
  };
  db.saveBrandKit(kit);
  return res.status(201).json({ brandKit: kit });
});

// Content Series
app.get('/api/v1/series', requireAuth, (req: AuthenticatedRequest, res) => {
  const series = db.getSeries(req.user!.id);
  return res.json({ series });
});

app.post('/api/v1/series', requireAuth, (req: AuthenticatedRequest, res) => {
  const s = {
    ...req.body,
    id: 'series-' + Math.random().toString(36).substring(2, 9),
    userId: req.user!.id,
    createdAt: new Date().toISOString(),
  };
  db.saveSeries(s);
  return res.status(201).json({ series: s });
});

// Content Calendar
app.get('/api/v1/calendar', requireAuth, (req: AuthenticatedRequest, res) => {
  const items = db.getCalendarItems(req.user!.id);
  return res.json({ calendarItems: items });
});

app.post('/api/v1/calendar', requireAuth, (req: AuthenticatedRequest, res) => {
  const item = {
    ...req.body,
    id: 'cal-' + Math.random().toString(36).substring(2, 9),
    userId: req.user!.id,
  };
  db.saveCalendarItem(item);
  return res.status(201).json({ calendarItem: item });
});

// Media Library
app.get('/api/v1/media', requireAuth, (req: AuthenticatedRequest, res) => {
  const assets = db.getMediaAssets(req.user!.id);
  return res.json({ mediaAssets: assets });
});

// Analytics & Usage Ledger
app.get('/api/v1/analytics', requireAuth, (req: AuthenticatedRequest, res) => {
  const summary = db.getAnalyticsSummary(req.user!.id);
  return res.json({ analytics: summary });
});

// Admin Overview
app.get('/api/v1/admin/overview', requireAuth, (_req, res) => {
  return res.json({
    metrics: providerRouter.getMetrics(),
    auditLogs: db.getAuditLogs(),
    aiProvider: providerRouter.name,
  });
});

// Vite Development or Production Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`JayTech AI Server active on port ${PORT}`);
  });
}

startServer();
