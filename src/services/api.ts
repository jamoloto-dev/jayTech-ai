import {
  Project,
  CreativeBrief,
  ScriptPackage,
  Scene,
  GenerationJob,
  BrandKit,
  ContentSeries,
  CalendarItem,
  MediaAsset,
  AnalyticsSummary,
} from '../types/index.js';

const API_BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<{ status: string; version: string; aiProvider: string }>(res);
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await handleResponse<{ projects: Project[] }>(res);
    return data.projects;
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async createProject(params: {
    title: string;
    prompt: string;
    format?: string;
    targetDuration?: number;
    aspectRatio?: '9:16' | '16:9' | '1:1';
  }): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    const data = await handleResponse<{ success: boolean }>(res);
    return data.success;
  },

  async duplicateProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, { method: 'POST' });
    const data = await handleResponse<{ project: Project }>(res);
    return data.project;
  },

  async generateBrief(id: string, options?: { tone?: string; platform?: string }): Promise<{ brief: CreativeBrief; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {}),
    });
    return handleResponse<{ brief: CreativeBrief; project: Project }>(res);
  },

  async generateScript(id: string): Promise<{ script: ScriptPackage; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}/script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ script: ScriptPackage; project: Project }>(res);
  },

  async decomposeStoryboard(id: string): Promise<{ scenes: Scene[]; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}/storyboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<{ scenes: Scene[]; project: Project }>(res);
  },

  async enqueueGeneration(id: string): Promise<{
    jobId: string;
    status: string;
    sseUrl: string;
  }> {
    const res = await fetch(`${API_BASE}/projects/${id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  async getPublishingPackage(id: string) {
    const res = await fetch(`${API_BASE}/projects/${id}/export`);
    return handleResponse<{
      publishingPackage: {
        title: string;
        caption: string;
        hashtags: string;
        scriptText: string;
        callToAction: string;
        subtitlesSrt: string;
        coverHeadline: string;
        thumbnailUrl?: string;
        videoUrl: string;
        metadataJson: string;
      };
    }>(res);
  },

  async askAssistant(message: string, contextProject?: unknown): Promise<string> {
    const res = await fetch(`${API_BASE}/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contextProject }),
    });
    const data = await handleResponse<{ response: string }>(res);
    return data.response;
  },

  async searchGrounding(query: string): Promise<{ text: string; sources: Array<{ title: string; url: string }> }> {
    const res = await fetch(`${API_BASE}/search-grounding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return handleResponse(res);
  },

  async generateOrEditImage(prompt: string, inputImageBase64?: string): Promise<{ imageUrl: string; prompt: string }> {
    const res = await fetch(`${API_BASE}/images/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, inputImageBase64 }),
    });
    return handleResponse(res);
  },

  async animateImageToVideo(prompt: string, inputImageBase64?: string, aspectRatio: '16:9' | '9:16' = '9:16'): Promise<{ videoUrl: string; duration: number; aspectRatio: '16:9' | '9:16' }> {
    const res = await fetch(`${API_BASE}/videos/animate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, inputImageBase64, aspectRatio }),
    });
    return handleResponse(res);
  },

  async generateMusic(prompt: string, durationSeconds?: number, format?: 'clip' | 'track'): Promise<{ audioUrl: string; duration: number; title: string }> {
    const res = await fetch(`${API_BASE}/music/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, durationSeconds, format }),
    });
    return handleResponse(res);
  },

  async liveVoiceChat(message: string, history?: Array<{ role: string; content: string }>): Promise<{ replyText: string }> {
    const res = await fetch(`${API_BASE}/voice/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    return handleResponse(res);
  },

  async getBrandKits(): Promise<BrandKit[]> {
    const res = await fetch(`${API_BASE}/brand-kits`);
    const data = await handleResponse<{ brandKits: BrandKit[] }>(res);
    return data.brandKits;
  },

  async createBrandKit(kit: Partial<BrandKit>): Promise<BrandKit> {
    const res = await fetch(`${API_BASE}/brand-kits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kit),
    });
    const data = await handleResponse<{ brandKit: BrandKit }>(res);
    return data.brandKit;
  },

  async getSeries(): Promise<ContentSeries[]> {
    const res = await fetch(`${API_BASE}/series`);
    const data = await handleResponse<{ series: ContentSeries[] }>(res);
    return data.series;
  },

  async createSeries(series: Partial<ContentSeries>): Promise<ContentSeries> {
    const res = await fetch(`${API_BASE}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(series),
    });
    const data = await handleResponse<{ series: ContentSeries }>(res);
    return data.series;
  },

  async getCalendar(): Promise<CalendarItem[]> {
    const res = await fetch(`${API_BASE}/calendar`);
    const data = await handleResponse<{ calendarItems: CalendarItem[] }>(res);
    return data.calendarItems;
  },

  async getMedia(): Promise<MediaAsset[]> {
    const res = await fetch(`${API_BASE}/media`);
    const data = await handleResponse<{ mediaAssets: MediaAsset[] }>(res);
    return data.mediaAssets;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/analytics`);
    const data = await handleResponse<{ analytics: AnalyticsSummary }>(res);
    return data.analytics;
  },

  async getAdminOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`);
    return handleResponse<{
      metrics: Array<{ provider: string; operation: string; durationMs: number; success: boolean }>;
      auditLogs: Array<{ id: string; userId: string; action: string; timestamp: string; details: string }>;
      aiProvider: string;
    }>(res);
  },

  subscribeToJob(jobId: string, onUpdate: (job: GenerationJob) => void): () => void {
    const eventSource = new EventSource(`${API_BASE}/jobs/${jobId}/events`);
    eventSource.onmessage = event => {
      try {
        const job = JSON.parse(event.data) as GenerationJob;
        onUpdate(job);
        if (job.status === 'SUCCEEDED' || job.status === 'FAILED') {
          eventSource.close();
        }
      } catch (err) {
        console.error('SSE JSON parse error:', err);
      }
    };
    eventSource.onerror = () => {
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  },
};
