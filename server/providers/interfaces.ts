import { CreativeBrief, ScriptPackage, Scene } from '../types/index.js';

export interface BriefGenerationOptions {
  format?: string;
  duration?: number;
  tone?: string;
  targetPlatform?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface LLMProvider {
  name: string;
  generateBrief(prompt: string, options?: BriefGenerationOptions): Promise<CreativeBrief>;
  generateScript(prompt: string, brief: CreativeBrief): Promise<ScriptPackage>;
  decomposeStoryboard(script: ScriptPackage, brief: CreativeBrief): Promise<Omit<Scene, 'id' | 'projectId' | 'status'>[]>;
  chatAssistant(message: string, contextProject?: unknown): Promise<string>;
  generateTikTokMetadata(title: string, scriptText: string): Promise<{
    caption: string;
    hashtags: string[];
    hooks: string[];
    cta: string;
  }>;
  searchGrounding?(query: string): Promise<{
    text: string;
    sources: GroundingSource[];
  }>;
  createOrEditImage?(prompt: string, inputImageBase64?: string): Promise<{
    imageUrl: string;
    prompt: string;
  }>;
  animateImageToVideo?(prompt: string, inputImageBase64?: string, aspectRatio?: '16:9' | '9:16'): Promise<{
    videoUrl: string;
    duration: number;
    aspectRatio: '16:9' | '9:16';
  }>;
  generateMusic?(prompt: string, durationSeconds?: number, format?: 'clip' | 'track'): Promise<{
    audioUrl: string;
    duration: number;
    title: string;
  }>;
  liveVoiceChat?(message: string, history?: Array<{ role: string; content: string }>): Promise<{
    replyText: string;
  }>;
}

export interface GeneratedAssetResult {
  url: string;
  provider: string;
  width: number;
  height: number;
  format: string;
}

export interface ImageGenerationProvider {
  name: string;
  generateSceneVisual(prompt: string, style: string, aspectRatio?: string): Promise<GeneratedAssetResult>;
}

export interface SpeechProvider {
  name: string;
  synthesizeNarration(text: string, voiceName: string, speed?: number): Promise<{
    audioUrl: string;
    durationSeconds: number;
    wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  }>;
}
