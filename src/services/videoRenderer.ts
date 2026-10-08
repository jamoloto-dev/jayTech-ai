import JSZip from 'jszip';
import { Project, Scene } from '../types/index.js';

export interface RenderOptions {
  captionStyle?: 'Karaoke Bold' | 'Cinematic' | 'Minimal' | 'Documentary';
  enableKenBurns?: boolean;
  onProgress?: (progress: number) => void;
}

export interface VoicePreset {
  id: string;
  name: string;
  pitch: number;
  rate: number;
  gender: 'male' | 'female';
}

export const VOICE_PRESETS: VoicePreset[] = [
  { id: 'marcus', name: 'Marcus (Deep Cinematic Narrator)', pitch: 0.78, rate: 0.95, gender: 'male' },
  { id: 'aria', name: 'Aria (Dramatic Storyteller)', pitch: 1.05, rate: 0.96, gender: 'female' },
  { id: 'zephyr', name: 'Zephyr (Epic Mythic Lore)', pitch: 0.85, rate: 0.92, gender: 'male' },
  { id: 'morgan', name: 'Morgan (Documentary Voice)', pitch: 0.92, rate: 1.0, gender: 'male' },
];

export class VideoRendererService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audioCtx: AudioContext | null = null;
  private imagesCache: Map<string, HTMLImageElement> = new Map();

  // Audio Graph Nodes
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicOscillators: OscillatorNode[] = [];
  private musicTimer: number | null = null;

  // Speech State
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoiceId: string = 'marcus';
  private isVoiceEnabled = true;
  private isMusicEnabled = true;
  private currentVolume = 0.85;
  private isMuted = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080;
    this.canvas.height = 1920;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    this.ctx = context;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Music Sub-gain
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMusicEnabled ? 0.35 : 0, this.audioCtx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Sub-gain
      this.sfxGain = this.audioCtx.createGain();
      this.sfxGain.gain.setValueAtTime(0.55, this.audioCtx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.audioCtx.currentTime);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.setValueAtTime(enabled ? 0.35 : 0, this.audioCtx.currentTime);
    }
  }

  public setSelectedVoice(voiceId: string) {
    this.selectedVoiceId = voiceId;
  }

  private async loadImage(url: string): Promise<HTMLImageElement> {
    if (this.imagesCache.has(url)) {
      return this.imagesCache.get(url)!;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imagesCache.set(url, img);
        resolve(img);
      };
      img.onerror = () => {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 1080;
        fallbackCanvas.height = 1920;
        const fctx = fallbackCanvas.getContext('2d')!;
        const grad = fctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#090a0f');
        fctx.fillStyle = grad;
        fctx.fillRect(0, 0, 1080, 1920);

        fctx.fillStyle = '#00f0ff';
        fctx.font = 'bold 44px sans-serif';
        fctx.textAlign = 'center';
        fctx.fillText('JAYTECH AI CINEMATIC FRAME', 540, 960);

        const fallbackImg = new Image();
        fallbackImg.src = fallbackCanvas.toDataURL();
        this.imagesCache.set(url, fallbackImg);
        resolve(fallbackImg);
      };
      img.src = url;
    });
  }

  public drawFrame(
    scene: Scene,
    timeIntoScene: number,
    cachedImg: HTMLImageElement | null,
    captionStyle: string = 'Karaoke Bold'
  ) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Background Fill
    ctx.fillStyle = '#08090C';
    ctx.fillRect(0, 0, width, height);

    const progress = Math.min(1, Math.max(0, timeIntoScene / Math.max(0.1, scene.duration)));

    // Ken Burns Camera Simulation
    const zoom = 1.0 + progress * 0.12;
    const panY = (progress - 0.5) * 40;

    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2 + panY);

      // Cover scaling
      const imgAspect = cachedImg.naturalWidth / cachedImg.naturalHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        drawW = height * imgAspect;
        offsetX = (width - drawW) / 2;
      } else {
        drawH = width / imgAspect;
        offsetY = (height - drawH) / 2;
      }

      ctx.drawImage(cachedImg, offsetX, offsetY, drawW, drawH);
      ctx.restore();
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#090A0E');
      grad.addColorStop(0.5, '#151928');
      grad.addColorStop(1, '#090A0E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Atmospheric Vignette & Contrast Gradients
    const topVignette = ctx.createLinearGradient(0, 0, 0, 360);
    topVignette.addColorStop(0, 'rgba(0,0,0,0.85)');
    topVignette.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topVignette;
    ctx.fillRect(0, 0, width, 360);

    const bottomVignette = ctx.createLinearGradient(0, height - 600, 0, height);
    bottomVignette.addColorStop(0, 'rgba(0,0,0,0)');
    bottomVignette.addColorStop(0.7, 'rgba(0,0,0,0.88)');
    bottomVignette.addColorStop(1, 'rgba(0,0,0,0.98)');
    ctx.fillStyle = bottomVignette;
    ctx.fillRect(0, height - 600, width, 600);

    // Lightning/particle effects for dramatic storm scenes
    if (scene.visualPrompt.toLowerCase().includes('lightning') || scene.narration.toLowerCase().includes('thunder')) {
      const flashAlpha = Math.sin(timeIntoScene * 8) > 0.85 ? 0.35 : 0.04;
      ctx.fillStyle = `rgba(0, 240, 255, ${flashAlpha})`;
      ctx.fillRect(0, 0, width, height);
    }

    // Overlay Header Label
    if (scene.overlayText) {
      ctx.save();
      ctx.fillStyle = '#FFB800';
      ctx.font = '900 28px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 12;
      ctx.fillText(scene.overlayText.toUpperCase(), width / 2, 220);
      ctx.restore();
    }

    // Dynamic Captions
    const caption = scene.captionText || scene.narration;
    if (caption) {
      ctx.save();
      ctx.textAlign = 'center';

      const captionY = height - 380;
      const words = caption.split(' ');
      const activeWordIndex = Math.min(words.length - 1, Math.floor(progress * words.length));

      if (captionStyle === 'Karaoke Bold') {
        ctx.font = '900 52px Inter, sans-serif';
        const textMetrics = ctx.measureText(caption);
        const padding = 28;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(
          width / 2 - textMetrics.width / 2 - padding,
          captionY - 48,
          textMetrics.width + padding * 2,
          74,
          16
        );
        ctx.fill();

        let currentX = width / 2 - textMetrics.width / 2;
        words.forEach((word, idx) => {
          const wordWidth = ctx.measureText(word + ' ').width;
          if (idx === activeWordIndex) {
            ctx.fillStyle = '#00F0FF';
            ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
            ctx.shadowBlur = 18;
          } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 8;
          }
          ctx.fillText(word, currentX + wordWidth / 2, captionY);
          currentX += wordWidth;
        });
      } else {
        ctx.font = '600 46px Inter, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillText(caption, width / 2, captionY);
      }

      ctx.restore();
    }

    // Subtle Brand Watermark
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('JAYTECH AI', width / 2, height - 120);
    ctx.restore();
  }

  // --- AUDIO SYNTHESIS & MUSIC ENGINE ---

  public startPlaybackAudio(currentScene: Scene) {
    this.initAudio();
    this.startCinematicBackgroundMusic();
    this.playSceneNarration(currentScene);
    this.triggerSceneSoundEffect(currentScene);
  }

  public stopPlaybackAudio() {
    this.stopCinematicBackgroundMusic();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public onSceneTransition(newScene: Scene) {
    this.triggerSceneSoundEffect(newScene);
    this.playSceneNarration(newScene);
  }

  private startCinematicBackgroundMusic() {
    if (!this.audioCtx || !this.musicGain || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    try {
      const now = this.audioCtx.currentTime;

      // Low tension Drone Oscillators (D minor root: D2 = 73.4Hz, A2 = 110Hz)
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(73.4, now);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110.0, now);

      const droneGain = this.audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.35, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.musicGain);

      osc1.start(now);
      osc2.start(now);
      this.musicOscillators = [osc1, osc2];

      // Rhythm war drum loop every 2 seconds
      const playDrumBeat = () => {
        if (!this.isMusicPlaying) return;
        this.playWarDrum(0.5);
        this.musicTimer = window.setTimeout(playDrumBeat, 2000);
      };
      this.musicTimer = window.setTimeout(playDrumBeat, 800);
    } catch (err) {
      console.warn('Music engine notice:', err);
    }
  }

  private stopCinematicBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    for (const osc of this.musicOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored
      }
    }
    this.musicOscillators = [];
  }

  public playSceneNarration(scene: Scene) {
    if (!this.isVoiceEnabled || this.isMuted) return;

    const textToSpeak = scene.narration || scene.captionText;
    if (!textToSpeak) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const preset = VOICE_PRESETS.find(v => v.id === this.selectedVoiceId) || VOICE_PRESETS[0];

      utterance.pitch = preset.pitch;
      utterance.rate = preset.rate;
      utterance.volume = this.currentVolume;

      // Select matching browser voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find(v => v.lang.startsWith('en') && (preset.gender === 'female' ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('daniel'))) ||
          voices.find(v => v.lang.startsWith('en')) ||
          voices[0];
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      // Audio Ducking: lower background music slightly while speaking
      if (this.musicGain && this.audioCtx && this.isMusicEnabled) {
        this.musicGain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        utterance.onend = () => {
          if (this.musicGain && this.audioCtx && this.isMusicEnabled) {
            this.musicGain.gain.setTargetAtTime(0.35, this.audioCtx.currentTime, 0.4);
          }
        };
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }

  public triggerSceneSoundEffect(scene: Scene) {
    const sfxDesc = (scene.soundEffect || '').toLowerCase();
    const promptDesc = (scene.visualPrompt || '').toLowerCase();
    const narrationDesc = (scene.narration || '').toLowerCase();

    if (sfxDesc.includes('thunder') || promptDesc.includes('lightning') || narrationDesc.includes('thunder')) {
      this.playThunder();
    } else if (sfxDesc.includes('horn') || sfxDesc.includes('war')) {
      this.playWarHorn();
    } else if (sfxDesc.includes('chime') || sfxDesc.includes('gauntlet')) {
      this.playCelestialChime();
    } else if (sfxDesc.includes('clash') || sfxDesc.includes('blade') || sfxDesc.includes('strike')) {
      this.playBladeWhoosh();
    } else {
      this.playWarDrum(0.7);
    }
  }

  public playWarDrum(intensity = 0.6) {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.38);

    gain.gain.setValueAtTime(intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playThunder() {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(120, now + 1.6);

    gain.gain.setValueAtTime(0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  public playWarHorn() {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(146.8, now); // D3
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220.0, now); // A3

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.4);
    osc2.stop(now + 1.4);
  }

  public playCelestialChime() {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    [880, 1108, 1318].forEach((freq, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.3, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.9);
    });
  }

  public playBladeWhoosh() {
    if (!this.audioCtx || !this.sfxGain || this.isMuted) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public async generateCoverImage(project: Project): Promise<string> {
    const scene = project.scenes[0] || {
      duration: 5,
      narration: project.title,
      visualDescription: '',
      visualPrompt: '',
      cameraDirection: 'Center',
      transition: 'Cut',
      captionText: project.title,
      mediaType: 'image' as const,
      status: 'READY' as const,
      id: 'c',
      projectId: project.id,
      sequenceOrder: 1,
    };

    const img = scene.mediaUrl ? await this.loadImage(scene.mediaUrl) : null;
    this.drawFrame(scene, 1.0, img, 'Karaoke Bold');

    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 20;

    const headline = project.script?.suggestedCoverHeadline || project.title;
    ctx.fillText(headline.toUpperCase(), 540, 800);
    ctx.restore();

    return this.canvas.toDataURL('image/jpeg', 0.92);
  }

  public async exportPublishingZip(project: Project, srtText: string, metadataJson: string): Promise<Blob> {
    const zip = new JSZip();

    // 1. Cover Image
    const coverDataUrl = await this.generateCoverImage(project);
    const coverBase64 = coverDataUrl.split(',')[1];
    zip.file('cover.jpg', coverBase64, { base64: true });

    // 2. Subtitles SRT
    zip.file('subtitles.srt', srtText);

    // 3. TikTok Caption
    const captionContent = `${project.script?.tiktokCaption || project.title}\n\n${[
      ...(project.script?.hashtags.topic || []),
      ...(project.script?.hashtags.niche || []),
      ...(project.script?.hashtags.discovery || []),
    ].join(' ')}`;
    zip.file('caption.txt', captionContent);

    // 4. Hashtags
    zip.file(
      'hashtags.txt',
      [
        '# Topic Tags:',
        (project.script?.hashtags.topic || []).join(' '),
        '\n# Niche Tags:',
        (project.script?.hashtags.niche || []).join(' '),
        '\n# Discovery Tags:',
        (project.script?.hashtags.discovery || []).join(' '),
      ].join('\n')
    );

    // 5. Script
    zip.file(
      'script.txt',
      `Title: ${project.title}\nFormat: ${project.format}\nDuration: ${project.targetDuration}s\n\nHOOK:\n${
        project.script?.hooks[project.script?.selectedHookIndex || 0]?.text || ''
      }\n\nMAIN SCRIPT:\n${project.script?.mainScript || ''}\n\nCALL TO ACTION:\n${
        project.script?.callToAction || ''
      }`
    );

    // 6. Audio Narration Cue Sheet & Transcript
    zip.file(
      'narration_audio_track.txt',
      project.scenes.map(s => `[${s.duration}s] Scene ${s.sequenceOrder}: ${s.narration} (SFX: ${s.soundEffect || 'None'})`).join('\n\n')
    );

    // 7. Metadata JSON
    zip.file('metadata.json', metadataJson);

    return await zip.generateAsync({ type: 'blob' });
  }
}

export const videoRenderer = new VideoRendererService();
