import { LLMProvider, ImageGenerationProvider, SpeechProvider, BriefGenerationOptions, GeneratedAssetResult } from './interfaces.js';
import { GeminiProvider } from './geminiProvider.js';
import { MockFallbackProvider } from './mockFallbackProvider.js';
import { CreativeBrief, ScriptPackage, Scene } from '../types/index.js';

export interface ProviderExecutionMetric {
  provider: string;
  operation: string;
  durationMs: number;
  success: boolean;
  error?: string;
}

export class ProviderRouter implements LLMProvider, ImageGenerationProvider, SpeechProvider {
  private geminiProvider: GeminiProvider;
  private fallbackProvider: MockFallbackProvider;
  private metrics: ProviderExecutionMetric[] = [];

  constructor() {
    this.geminiProvider = new GeminiProvider();
    this.fallbackProvider = new MockFallbackProvider();
  }

  public get name(): string {
    return this.geminiProvider.isAvailable() ? this.geminiProvider.name : this.fallbackProvider.name;
  }

  public getMetrics(): ProviderExecutionMetric[] {
    return this.metrics.slice(-100);
  }

  private logMetric(metric: ProviderExecutionMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
  }

  async generateBrief(prompt: string, options?: BriefGenerationOptions): Promise<CreativeBrief> {
    const startTime = Date.now();
    if (this.geminiProvider.isAvailable()) {
      try {
        const result = await this.geminiProvider.generateBrief(prompt, options);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'generateBrief',
          durationMs: Date.now() - startTime,
          success: true,
        });
        return result;
      } catch (err: unknown) {
        console.warn('Primary LLM provider failed, falling back to deterministic engine:', err);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'generateBrief',
          durationMs: Date.now() - startTime,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    const fallbackResult = await this.fallbackProvider.generateBrief(prompt, options);
    this.logMetric({
      provider: this.fallbackProvider.name,
      operation: 'generateBrief',
      durationMs: Date.now() - startTime,
      success: true,
    });
    return fallbackResult;
  }

  async generateScript(prompt: string, brief: CreativeBrief): Promise<ScriptPackage> {
    const startTime = Date.now();
    if (this.geminiProvider.isAvailable()) {
      try {
        const result = await this.geminiProvider.generateScript(prompt, brief);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'generateScript',
          durationMs: Date.now() - startTime,
          success: true,
        });
        return result;
      } catch (err: unknown) {
        console.warn('Primary LLM provider failed for script generation, invoking fallback:', err);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'generateScript',
          durationMs: Date.now() - startTime,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    const fallbackResult = await this.fallbackProvider.generateScript(prompt, brief);
    this.logMetric({
      provider: this.fallbackProvider.name,
      operation: 'generateScript',
      durationMs: Date.now() - startTime,
      success: true,
    });
    return fallbackResult;
  }

  async decomposeStoryboard(script: ScriptPackage, brief: CreativeBrief): Promise<Omit<Scene, 'id' | 'projectId' | 'status'>[]> {
    const startTime = Date.now();
    if (this.geminiProvider.isAvailable()) {
      try {
        const result = await this.geminiProvider.decomposeStoryboard(script, brief);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'decomposeStoryboard',
          durationMs: Date.now() - startTime,
          success: true,
        });
        return result;
      } catch (err: unknown) {
        console.warn('Primary LLM provider failed for storyboard decomposition, invoking fallback:', err);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'decomposeStoryboard',
          durationMs: Date.now() - startTime,
          success: false,
          error: (err as Error).message,
        });
      }
    }

    const fallbackResult = await this.fallbackProvider.decomposeStoryboard(script, brief);
    this.logMetric({
      provider: this.fallbackProvider.name,
      operation: 'decomposeStoryboard',
      durationMs: Date.now() - startTime,
      success: true,
    });
    return fallbackResult;
  }

  async chatAssistant(message: string, contextProject?: unknown): Promise<string> {
    const startTime = Date.now();
    if (this.geminiProvider.isAvailable()) {
      try {
        const result = await this.geminiProvider.chatAssistant(message, contextProject);
        this.logMetric({
          provider: this.geminiProvider.name,
          operation: 'chatAssistant',
          durationMs: Date.now() - startTime,
          success: true,
        });
        return result;
      } catch (err: unknown) {
        console.warn('Primary assistant failed, invoking fallback:', err);
      }
    }

    const fallbackResult = await this.fallbackProvider.chatAssistant(message);
    this.logMetric({
      provider: this.fallbackProvider.name,
      operation: 'chatAssistant',
      durationMs: Date.now() - startTime,
      success: true,
    });
    return fallbackResult;
  }

  async generateTikTokMetadata(title: string, scriptText: string): Promise<{
    caption: string;
    hashtags: string[];
    hooks: string[];
    cta: string;
  }> {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.generateTikTokMetadata(title, scriptText);
      } catch (err: unknown) {
        console.warn('Primary TikTok metadata generation failed, invoking fallback:', err);
      }
    }
    return this.fallbackProvider.generateTikTokMetadata(title, scriptText);
  }

  async searchGrounding(query: string) {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.searchGrounding(query);
      } catch (err) {
        console.warn('Primary search grounding failed, falling back:', err);
      }
    }
    return this.fallbackProvider.searchGrounding(query);
  }

  async createOrEditImage(prompt: string, inputImageBase64?: string) {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.createOrEditImage(prompt, inputImageBase64);
      } catch (err) {
        console.warn('Primary image generation/edit failed, falling back:', err);
      }
    }
    return this.fallbackProvider.createOrEditImage(prompt);
  }

  async animateImageToVideo(prompt: string, inputImageBase64?: string, aspectRatio: '16:9' | '9:16' = '9:16') {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.animateImageToVideo(prompt, inputImageBase64, aspectRatio);
      } catch (err) {
        console.warn('Primary Veo video animation failed, falling back:', err);
      }
    }
    return this.fallbackProvider.animateImageToVideo(prompt, inputImageBase64, aspectRatio);
  }

  async generateMusic(prompt: string, durationSeconds: number = 30, format: 'clip' | 'track' = 'clip') {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.generateMusic(prompt, durationSeconds, format);
      } catch (err) {
        console.warn('Primary Lyria music generation failed, falling back:', err);
      }
    }
    return this.fallbackProvider.generateMusic(prompt, durationSeconds);
  }

  async liveVoiceChat(message: string, history?: Array<{ role: string; content: string }>) {
    if (this.geminiProvider.isAvailable()) {
      try {
        return await this.geminiProvider.liveVoiceChat(message, history);
      } catch (err) {
        console.warn('Primary Live API voice chat failed, falling back:', err);
      }
    }
    return this.fallbackProvider.liveVoiceChat(message);
  }

  async generateSceneVisual(prompt: string, style: string, aspectRatio?: string): Promise<GeneratedAssetResult> {
    return this.fallbackProvider.generateSceneVisual(prompt, style);
  }

  async synthesizeNarration(text: string, voiceName: string, speed?: number) {
    return this.fallbackProvider.synthesizeNarration(text, voiceName, speed);
  }
}

export const providerRouter = new ProviderRouter();
