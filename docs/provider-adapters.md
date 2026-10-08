# JayTech AI — AI Provider Abstraction & Routing

## 1. Provider Adapter Architecture
To prevent vendor lock-in and ensure platform resilience, JayTech AI isolates all external model calls behind normalized interfaces:

- **`LLMProvider`**: Planning, brainstorming, scriptwriting, hook generation, scene decomposition, and assistant copilot actions.
- **`ImageGenerationProvider`**: High-resolution scene asset generation, character reference rendering, and video cover art.
- **`VideoGenerationProvider`**: Clip motion generation from prompt + image start frames.
- **`SpeechProvider`**: High-fidelity narration synthesis with word-level alignment timestamps.
- **`MusicProvider`**: Atmospheric background audio and mood synchronization.

## 2. Normalized Interfaces

```typescript
export interface LLMProvider {
  name: string;
  generateBrief(prompt: string, options: BriefOptions): Promise<CreativeBrief>;
  generateScript(brief: CreativeBrief): Promise<ScriptPackage>;
  decomposeStoryboard(script: ScriptPackage): Promise<SceneDraft[]>;
  refinePrompt(userPrompt: string): Promise<string>;
  chatAssistant(history: ChatMessage[], query: string): Promise<string>;
}

export interface ImageGenerationProvider {
  name: string;
  generateSceneImage(prompt: string, aspectRatio: '9:16' | '16:9' | '1:1'): Promise<GeneratedMediaResult>;
}

export interface SpeechProvider {
  name: string;
  synthesizeVoiceover(text: string, voiceId: string, speed: number): Promise<SpeechResult>;
}
```

## 3. Production Providers & Fallback Strategy

1. **Primary LLM**: `@google/genai` TypeScript SDK using `gemini-3.8-flash`. All calls originate server-side; client API keys are never exposed.
2. **Fallback Provider**: `MockFallbackProvider` delivers deterministic, zero-latency fallbacks when API keys are unconfigured, rate-limited, or encountering upstream provider outages.
3. **Provider Router**:
   - Manages retries with exponential backoff.
   - Logs provider execution latency and token metrics to `usage_ledger`.
   - Protects against duplicate concurrent billing using idempotency keys.
