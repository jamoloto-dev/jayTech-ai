export type UserRole = 'USER' | 'CREATOR' | 'ADMIN';
export type ProjectStatus = 'DRAFT' | 'SCRIPTING' | 'STORYBOARD' | 'GENERATING' | 'RENDERING' | 'READY' | 'FAILED' | 'ARCHIVED';
export type JobStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'RETRYING';
export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';
  creditsBalance: number;
  createdAt: string;
}

export interface CreativeBrief {
  topic: string;
  targetAudience: string;
  videoGoal: string;
  tone: string;
  style: string;
  durationSeconds: number;
  aspectRatio: AspectRatio;
  voice: string;
  language: string;
  contentFormat: string;
  pacing: 'FAST' | 'DYNAMIC' | 'CINEMATIC' | 'STEADY';
  sceneCount: number;
  callToAction: string;
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';
}

export interface ScriptHook {
  id: string;
  type: 'curiosity_gap' | 'surprising_fact' | 'storytelling' | 'bold_question' | 'before_after';
  text: string;
}

export interface ScriptPackage {
  hooks: ScriptHook[];
  selectedHookIndex: number;
  mainScript: string;
  callToAction: string;
  tiktokCaption: string;
  hashtags: {
    topic: string[];
    niche: string[];
    audience: string[];
    discovery: string[];
  };
  titleOptions: string[];
  suggestedCoverHeadline: string;
}

export interface Scene {
  id: string;
  projectId: string;
  sequenceOrder: number;
  duration: number; // in seconds
  narration: string;
  visualDescription: string;
  visualPrompt: string;
  cameraDirection: string;
  transition: string;
  soundEffect?: string;
  backgroundMusicInstruction?: string;
  captionText: string;
  overlayText?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'motion_graphic';
  voiceoverUrl?: string;
  status: 'PENDING' | 'GENERATING' | 'READY' | 'FAILED';
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  format: string;
  aspectRatio: AspectRatio;
  targetDuration: number;
  status: ProjectStatus;
  creativeBrief?: CreativeBrief;
  script?: ScriptPackage;
  scenes: Scene[];
  brandKitId?: string;
  thumbnailUrl?: string;
  renderedVideoUrl?: string;
  generationHistory: Array<{
    timestamp: string;
    stage: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationJob {
  id: string;
  projectId: string;
  type: 'CONTENT_PLAN' | 'SCRIPT_GEN' | 'STORYBOARD_GEN' | 'FULL_PIPELINE' | 'RENDER';
  status: JobStatus;
  progress: number;
  stageDescription: string;
  errorMessage?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKit {
  id: string;
  userId: string;
  name: string;
  channelName: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  preferredVoice: string;
  captionStyle: 'Minimal' | 'Bold' | 'Creator' | 'Documentary' | 'Gaming' | 'Cinematic' | 'News';
  watermarkText: string;
  characterBible: Array<{
    name: string;
    description: string;
    appearance: string;
    clothes: string;
    visualReferences: string[];
  }>;
  createdAt: string;
}

export interface ContentSeries {
  id: string;
  userId: string;
  title: string;
  concept: string;
  totalEpisodes: number;
  episodes: Array<{
    id: string;
    episodeNumber: number;
    title: string;
    status: 'PLANNED' | 'IN_PRODUCTION' | 'READY' | 'PUBLISHED';
    projectId?: string;
  }>;
  createdAt: string;
}

export interface CalendarItem {
  id: string;
  userId: string;
  projectId?: string;
  projectTitle: string;
  scheduledDate: string;
  platform: 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';
  status: 'DRAFT' | 'IN_PRODUCTION' | 'READY' | 'PUBLISHED';
}

export interface MediaAsset {
  id: string;
  userId: string;
  name: string;
  fileType: 'image' | 'video' | 'audio' | 'thumbnail';
  url: string;
  sizeBytes: number;
  dimensions?: string;
  durationSeconds?: number;
  provider: string;
  generationPrompt?: string;
  projectId?: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  videosCreated: number;
  videosCompleted: number;
  totalRenderSeconds: number;
  totalAiCreditsUsed: number;
  averageGenerationTimeSeconds: number;
  providerSuccessRate: number;
  recentUsageLedger: Array<{
    id: string;
    feature: string;
    units: number;
    creditsDeducted: number;
    timestamp: string;
  }>;
}
