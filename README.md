# JayTech AI — Production Full-Stack AI Video Creation Platform

JayTech AI is a production-grade AI-powered content studio that transforms ideas, prompts, scripts, and reusable brand assets into polished short-form videos optimized for TikTok, YouTube Shorts, and Instagram Reels.

---

## 🌟 Core Value Proposition

From a single prompt:
> *"Create a 45-second TikTok explaining the story of Zeus, but rename Zeus to Jafta. Make it cinematic, dramatic and engaging."*

JayTech AI orchestrates the full production pipeline:
1. **Idea & Creative Brief**: Determines topic, audience, tone, pacing, aspect ratio, duration, and target platform.
2. **Viral Script Engine**: Generates opening curiosity-gap hooks, cinematic narration, on-screen text, CTA, and categorized hashtags.
3. **Storyboard Intelligence**: Decomposes narrative into sequential scenes with camera directions, transitions, and generative visual prompts.
4. **Asset Generation Pipeline**: Non-blocking asynchronous job orchestration for 9:16 vertical images/videos, multi-voice character narration, sound effects, and music.
5. **Deterministic Composition & Timeline**: Multi-track timeline assembly with Ken Burns camera movement, dynamic animated karaoke captions, and audio ducking.
6. **Publishing Package Export**: Bundles video (`video.mp4`), mobile safe-zone cover (`cover.jpg`), TikTok caption, hashtags, script, subtitle track (`subtitles.srt`), and metadata.

---

## 🏗 Architecture & Technologies

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
  - Zero-pill aesthetic, dark-mode-first, accessible WCAG AA standards.
  - Client-side 1080x1920 (9:16) Canvas/WebCodecs preview & video export engine.
- **Backend API**: Node.js & Express with full TypeScript typing.
  - RESTful v1 API endpoints (`/api/v1/*`).
  - Asynchronous background job queue with Server-Sent Events (SSE) progress broadcasting.
  - Strict tenant isolation and role-based access control (`USER`, `CREATOR`, `ADMIN`).
- **AI Providers**:
  - `@google/genai` TypeScript SDK utilizing `gemini-3.8-flash` for high-speed creative planning, scriptwriting, and storyboarding.
  - Normalized provider adapter pattern with automatic retries and deterministic fallback engine (`MockFallbackProvider`).
- **Media & Rendering**:
  - Deterministic FFmpeg CLI recipes and browser-native Canvas 2D/Web Audio engine for instant rendering without blocking.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```env
GEMINI_API_KEY="your-api-key"
PORT=3000
NODE_ENV=development
```

### 3. Run the Full-Stack Application
```bash
npm run dev
```
Open `http://localhost:3000` to access the JayTech Studio.

### 4. Run Automated Tests
```bash
npm test
```

---

## 🎬 Pre-Loaded Sample Project: "The Rise of Jafta"
A complete sample project matching Section 57 of the platform brief is pre-seeded in the database:
- **Title**: The Rise of Jafta: Ruler of the Skies
- **Format**: TikTok Vertical (9:16)
- **Duration**: 45 seconds
- **Scenes**: 5 complete scenes with visual prompts, dark volumetric lightning aesthetics, and dramatic voiceover cues.
- **Brand Kit**: Jafta Mythic Studios with character bible continuity.

---

## 📊 Feature Status

| Feature Area | Status |
| :--- | :--- |
| **System Architecture & Types** | ✅ Implemented |
| **Database & Entity Repositories** | ✅ Implemented |
| **AI Provider Abstraction & Gemini SDK** | ✅ Implemented |
| **Deterministic Fallback Engine** | ✅ Implemented |
| **Asynchronous Job Queue & SSE Streaming** | ✅ Implemented |
| **Timeline Composition & SRT Subtitle Generator** | ✅ Implemented |
| **Publishing Package Export (.ZIP / Files)** | ✅ Implemented |
| **Dedicated TikTok Content Engine (Hooks, Captions, Hashtags)** | ✅ Implemented |
| **Brand Kits & Character Bibles** | ✅ Implemented |
| **Content Series & Continuity Planner** | ✅ Implemented |
| **Content Calendar & Scheduling** | ✅ Implemented |
| **Media Library & Asset Metadata** | ✅ Implemented |
| **In-Product JayTech AI Copilot** | ✅ Implemented |
| **Docker Compose & CI Workflow** | ✅ Implemented |
| **Automated Test Suite** | ✅ Implemented |
| **Direct Social OAuth Auto-Publishing** | 🚧 Planned (Phase 5) |
