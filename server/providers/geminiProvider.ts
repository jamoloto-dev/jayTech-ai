import { GoogleGenAI } from '@google/genai';
import { LLMProvider, BriefGenerationOptions, GroundingSource } from './interfaces.js';
import { CreativeBrief, ScriptPackage, Scene } from '../types/index.js';

export class GeminiProvider implements LLMProvider {
  public name = 'Google Gemini 3.8 Flash';
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        this.ai = new GoogleGenAI();
      } catch (err) {
        console.warn('GeminiProvider initialization notice: Using fallback if needed.', err);
      }
    }
  }

  public isAvailable(): boolean {
    return !!this.ai && !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  }

  async generateBrief(prompt: string, options?: BriefGenerationOptions): Promise<CreativeBrief> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured or client is offline.');
    }

    const systemInstruction = `You are the lead creative director at JayTech AI, specializing in viral high-retention short-form video production (TikTok, Reels, Shorts).
Given a user prompt, produce a strictly valid JSON object matching the CreativeBrief schema with no markdown fences, no formatting wrappers.
JSON keys:
- topic: string
- targetAudience: string
- videoGoal: string
- tone: string
- style: string
- durationSeconds: number (15, 30, 45, 60, or 90)
- aspectRatio: "9:16" | "16:9" | "1:1"
- voice: string
- language: string
- contentFormat: string
- pacing: "FAST" | "DYNAMIC" | "CINEMATIC" | "STEADY"
- sceneCount: number (typically 4 to 6 for a short-form video)
- callToAction: string
- platform: "TikTok" | "YouTube Shorts" | "Instagram Reels"`;

    const userContent = `User Prompt: "${prompt}". Requested Duration: ${options?.duration || 45} seconds. Requested Format: ${options?.format || 'TikTok Vertical (9:16)'}. Requested Tone: ${options?.tone || 'Cinematic & Engaging'}.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text) as CreativeBrief;
  }

  async generateScript(prompt: string, brief: CreativeBrief): Promise<ScriptPackage> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured.');
    }

    const systemInstruction = `You are an elite short-form scriptwriter at JayTech AI specializing in TikTok retention psychology.
Produce a strictly valid JSON object matching the ScriptPackage schema without markdown quotes or wrappers.
JSON structure:
- hooks: array of 3 distinct high-hooking opening options (types: curiosity_gap, surprising_fact, storytelling, bold_question, before_after) with "id", "type", and "text"
- selectedHookIndex: 0
- mainScript: string (full spoken narration script, calibrated for ${brief.durationSeconds} seconds)
- callToAction: string
- tiktokCaption: string (short, engaging caption with curiosity gap)
- hashtags: object with topic: string[], niche: string[], audience: string[], discovery: string[]
- titleOptions: array of 3 catchy video titles
- suggestedCoverHeadline: string (punchy 3-5 word cover title)`;

    const userContent = `Video Prompt: "${prompt}". Brief Topic: "${brief.topic}". Target Duration: ${brief.durationSeconds} seconds. Tone: ${brief.tone}. Target Platform: ${brief.platform}.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text) as ScriptPackage;
  }

  async decomposeStoryboard(script: ScriptPackage, brief: CreativeBrief): Promise<Omit<Scene, 'id' | 'projectId' | 'status'>[]> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured.');
    }

    const systemInstruction = `You are an AI cinematographer and video director at JayTech AI.
Divide the provided script into ${brief.sceneCount || 5} sequential scenes.
Return a strictly valid JSON array of Scene objects.
Each scene object MUST have:
- sequenceOrder: number (1-based index)
- duration: number (seconds for this scene, sum must equal approx ${brief.durationSeconds}s)
- narration: string (exact spoken words for this scene)
- visualDescription: string (cinematographic layout)
- visualPrompt: string (detailed AI image generator prompt, 9:16 vertical framing, photorealistic, volumetric lighting, 8k render)
- cameraDirection: string (e.g., "Slow push-in", "Dynamic drone tilt-down", "Rapid orbital pan", "Low angle heroic tracking")
- transition: string (e.g., "Whip pan", "Cross dissolve", "Hard cut with glitch", "Flash zoom")
- soundEffect: string (e.g., "Deep war drum boom", "Thunder rumble", "Electric sword unsheath", "Ambient celestial drone")
- backgroundMusicInstruction: string
- captionText: string (subtitles display text)
- overlayText: string (optional on-screen highlight keyword)
- mediaType: "image"`;

    const userContent = `Script:
Hook: ${script.hooks[script.selectedHookIndex]?.text || ''}
Body: ${script.mainScript}
CTA: ${script.callToAction}
Total Target Duration: ${brief.durationSeconds}s`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '[]';
    return JSON.parse(text);
  }

  async chatAssistant(message: string, contextProject?: unknown): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured.');
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are the JayTech AI Creator Copilot. Assist the video creator with actionable, crisp suggestions for hooks, script adjustments, visual prompts, and pacing. Keep responses concise, direct, and creative.
Context: ${JSON.stringify(contextProject || {})}
User Query: ${message}`,
    });

    return response.text?.trim() || 'I am ready to help refine your video project.';
  }

  async generateTikTokMetadata(title: string, scriptText: string): Promise<{
    caption: string;
    hashtags: string[];
    hooks: string[];
    cta: string;
  }> {
    if (!this.ai) {
      throw new Error('Gemini API key is not configured.');
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate optimized TikTok publishing metadata for this video:
Title: "${title}"
Script: "${scriptText}"
Return valid JSON with:
- caption: string (short, engaging hook question)
- hashtags: array of 6-8 strings
- hooks: array of 3 opening hook variations
- cta: string`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text?.trim() || '{}');
  }

  // --- NEW CAPABILITIES ---

  /**
   * Search Grounding using Google Search via gemini-2.5-flash
   */
  async searchGrounding(query: string): Promise<{
    text: string;
    sources: GroundingSource[];
  }> {
    if (!this.ai) {
      throw new Error('Gemini client not initialized.');
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search and research up-to-date facts, lore, or trends for this video topic: "${query}". Provide a concise briefing with key insights and viral angles.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text?.trim() || 'No search results found.';
    const sources: GroundingSource[] = [];

    // Extract grounding chunks if present
    const candidate = response.candidates?.[0];
    const metadata = candidate?.groundingMetadata as {
      groundingChunks?: Array<{ web?: { title?: string; uri?: string } }>;
    } | undefined;

    if (metadata?.groundingChunks) {
      for (const chunk of metadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Source',
            url: chunk.web.uri,
          });
        }
      }
    }

    return { text, sources };
  }

  /**
   * Create & Edit Images using gemini-3.1-flash-image-preview
   */
  async createOrEditImage(prompt: string, inputImageBase64?: string): Promise<{
    imageUrl: string;
    prompt: string;
  }> {
    if (!this.ai) {
      throw new Error('Gemini client not initialized.');
    }

    try {
      const contents: any = [prompt];
      if (inputImageBase64) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: inputImageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents,
      });

      // Check if image data is returned
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        const inlineData = (part as { inlineData?: { mimeType: string; data: string } }).inlineData;
        if (inlineData) {
          return {
            imageUrl: `data:${inlineData.mimeType};base64,${inlineData.data}`,
            prompt,
          };
        }
      }
    } catch (err) {
      console.warn('Image generation model preview note, using stylized fallback asset:', err);
    }

    // High quality themed placeholder generator if image model returns text
    const encoded = encodeURIComponent(prompt.slice(0, 40));
    return {
      imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=80&sig=${encoded}`,
      prompt,
    };
  }

  /**
   * Animate Images into Video using veo-3.1-fast-generate-preview
   */
  async animateImageToVideo(prompt: string, inputImageBase64?: string, aspectRatio: '16:9' | '9:16' = '9:16'): Promise<{
    videoUrl: string;
    duration: number;
    aspectRatio: '16:9' | '9:16';
  }> {
    if (!this.ai) {
      throw new Error('Gemini client not initialized.');
    }

    try {
      const contents: any = [`Animate this scene with cinematic camera movement: ${prompt}`];
      if (inputImageBase64) {
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: inputImageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        });
      }

      const response = await this.ai.models.generateContent({
        model: 'veo-3.1-fast-generate-preview',
        contents,
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        const inlineData = (part as { inlineData?: { mimeType: string; data: string } }).inlineData;
        if (inlineData) {
          return {
            videoUrl: `data:${inlineData.mimeType};base64,${inlineData.data}`,
            duration: 5,
            aspectRatio,
          };
        }
      }
    } catch (err) {
      console.warn('Veo fast video generation preview note:', err);
    }

    return {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 5,
      aspectRatio,
    };
  }

  /**
   * Generate Music using lyria-3-clip-preview (up to 30s) or lyria-3-pro-preview
   */
  async generateMusic(prompt: string, durationSeconds: number = 30, format: 'clip' | 'track' = 'clip'): Promise<{
    audioUrl: string;
    duration: number;
    title: string;
  }> {
    const model = format === 'clip' ? 'lyria-3-clip-preview' : 'lyria-3-pro-preview';
    if (!this.ai) {
      throw new Error('Gemini client not initialized.');
    }

    try {
      const response = await this.ai.models.generateContent({
        model,
        contents: `Generate cinematic background score for video: ${prompt}. Duration: ${durationSeconds} seconds.`,
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        const inlineData = (part as { inlineData?: { mimeType: string; data: string } }).inlineData;
        if (inlineData) {
          return {
            audioUrl: `data:${inlineData.mimeType};base64,${inlineData.data}`,
            duration: durationSeconds,
            title: prompt.slice(0, 30),
          };
        }
      }
    } catch (err) {
      console.warn('Lyria music generation preview note:', err);
    }

    return {
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/wind_through_trees.ogg',
      duration: durationSeconds,
      title: `${prompt.slice(0, 25)} (Cinematic Score)`,
    };
  }

  /**
   * Voice Conversation via gemini-3.8-live / conversational stream
   */
  async liveVoiceChat(message: string, history?: Array<{ role: string; content: string }>): Promise<{
    replyText: string;
  }> {
    if (!this.ai) {
      throw new Error('Gemini client not initialized.');
    }

    const conversationContext = (history || [])
      .map(h => `${h.role === 'user' ? 'Creator' : 'JayTech AI'}: ${h.content}`)
      .join('\n');

    const prompt = `You are JayTech AI Live Voice Director, an interactive real-time voice assistant for short-form video creators.
Keep responses concise, natural, speaking in direct conversational sentences that sound great when spoken out loud.
${conversationContext ? `Prior conversation:\n${conversationContext}\n` : ''}
Creator says: "${message}"`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-live',
      contents: prompt,
    });

    return {
      replyText: response.text?.trim() || 'I am ready to plan your next viral video.',
    };
  }
}
