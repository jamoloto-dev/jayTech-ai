import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Film,
  Camera,
  Layers,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Share2,
  Mic,
  Music,
  Headphones,
  Sliders,
} from 'lucide-react';
import { Project, Scene } from '../../types/index.js';
import { videoRenderer, VOICE_PRESETS } from '../../services/videoRenderer.js';
import { api } from '../../services/api.js';

interface VideoEditorViewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onOpenTikTokEngine: (project: Project) => void;
}

export const VideoEditorView: React.FC<VideoEditorViewProps> = ({
  project,
  onUpdateProject,
  onOpenTikTokEngine,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [timeIntoScene, setTimeIntoScene] = useState(0);
  const [captionStyle, setCaptionStyle] = useState<'Karaoke Bold' | 'Cinematic'>('Karaoke Bold');
  const [isExporting, setIsExporting] = useState(false);

  // Audio Controls State
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('marcus');
  const [isPlayingPreviewSfx, setIsPlayingPreviewSfx] = useState(false);

  const scenes = project.scenes;
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      videoRenderer.stopPlaybackAudio();
    };
  }, []);

  // Sync Audio Settings with videoRenderer
  useEffect(() => {
    videoRenderer.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    videoRenderer.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    videoRenderer.setVoiceEnabled(isVoiceEnabled);
  }, [isVoiceEnabled]);

  useEffect(() => {
    videoRenderer.setMusicEnabled(isMusicEnabled);
  }, [isMusicEnabled]);

  useEffect(() => {
    videoRenderer.setSelectedVoice(selectedVoice);
  }, [selectedVoice]);

  // Animation Loop for Canvas Rendering & Audio Transition
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const renderLoop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying && currentScene) {
        setTimeIntoScene(prev => {
          const nextTime = prev + delta;
          if (nextTime >= currentScene.duration) {
            // Move to next scene
            if (currentSceneIndex < scenes.length - 1) {
              const nextIndex = currentSceneIndex + 1;
              setCurrentSceneIndex(nextIndex);
              videoRenderer.onSceneTransition(scenes[nextIndex]);
              return 0;
            } else {
              // Loop back to start
              setCurrentSceneIndex(0);
              videoRenderer.onSceneTransition(scenes[0]);
              return 0;
            }
          }
          return nextTime;
        });
      }

      // Draw canvas frame
      if (canvasRef.current && currentScene) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const serviceCanvas = videoRenderer.getCanvas();
          ctx.drawImage(serviceCanvas, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentSceneIndex, currentScene, scenes]);

  // Update canvas frame when time or scene changes
  useEffect(() => {
    if (!currentScene) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentScene.mediaUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80';
    img.onload = () => {
      videoRenderer.drawFrame(currentScene, timeIntoScene, img, captionStyle);
    };
    img.onerror = () => {
      videoRenderer.drawFrame(currentScene, timeIntoScene, null, captionStyle);
    };
  }, [currentScene, timeIntoScene, captionStyle]);

  const togglePlay = () => {
    if (!isPlaying) {
      videoRenderer.startPlaybackAudio(currentScene);
      setIsPlaying(true);
    } else {
      videoRenderer.stopPlaybackAudio();
      setIsPlaying(false);
    }
  };

  const handleSeekScene = (index: number) => {
    setCurrentSceneIndex(index);
    setTimeIntoScene(0);
    if (isPlaying && scenes[index]) {
      videoRenderer.onSceneTransition(scenes[index]);
    }
  };

  const handleTestSceneAudio = () => {
    setIsPlayingPreviewSfx(true);
    videoRenderer.triggerSceneSoundEffect(currentScene);
    videoRenderer.playSceneNarration(currentScene);
    setTimeout(() => setIsPlayingPreviewSfx(false), 2500);
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const pkgResponse = await api.getPublishingPackage(project.id);
      const pkg = pkgResponse.publishingPackage;
      const blob = await videoRenderer.exportPublishingZip(project, pkg.subtitlesSrt, pkg.metadataJson);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_TikTok_Package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="text-[#00F0FF] font-semibold">9:16 VERTICAL TIMELINE</span>
            <span aria-hidden="true">·</span>
            <span>{scenes.length} Scenes</span>
            <span aria-hidden="true">·</span>
            <span className="text-white font-mono">{totalDuration}s Total</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#10B981] font-mono flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio Engine Active</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{project.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTikTokEngine(project)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-xl text-xs font-semibold transition-all"
          >
            <Share2 className="w-4 h-4 text-[#FFB800]" />
            <span>TikTok Assistant</span>
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-[#00F0FF] hover:bg-[#33F3FF] disabled:opacity-50 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-[#00F0FF]/20"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Bundling Package...' : 'Export Package (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: 9:16 Video Player + Scene Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 9:16 Video Canvas Player with Live Equalizer */}
        <div className="lg:col-span-5 flex flex-col items-center bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-4">
          <div className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl border border-[#2A2F40] group">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1920}
              className="w-full h-full object-contain"
            />

            {/* Play/Pause Overlay Button */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
            >
              <div className="w-16 h-16 rounded-full bg-black/75 border border-[#00F0FF]/60 flex items-center justify-center text-[#00F0FF] shadow-2xl hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </div>
            </div>

            {/* Top Indicator */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-[#00F0FF] font-mono border border-white/10 flex items-center gap-2">
              <span>SCENE {currentSceneIndex + 1}/{scenes.length}</span>
              {isPlaying && (
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-2 bg-[#00F0FF] animate-pulse" />
                  <span className="w-1 h-3.5 bg-[#00F0FF] animate-pulse" style={{ animationDelay: '100ms' }} />
                  <span className="w-1 h-2.5 bg-[#00F0FF] animate-pulse" style={{ animationDelay: '200ms' }} />
                </span>
              )}
            </div>

            {/* Audio Status Pill in Player */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-mono border border-white/10 flex items-center gap-1.5">
              {isMuted ? (
                <span className="text-red-400 flex items-center gap-1">
                  <VolumeX className="w-3 h-3" /> MUTED
                </span>
              ) : (
                <span className="text-[#10B981] flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> AUDIO ON
                </span>
              )}
            </div>
          </div>

          {/* Transport Controls */}
          <div className="w-full max-w-[320px] flex items-center justify-between pt-1 text-xs text-[#94A3B8]">
            <button
              onClick={() => {
                if (currentSceneIndex > 0) handleSeekScene(currentSceneIndex - 1);
              }}
              className="p-2 hover:text-white rounded-lg transition-colors"
              title="Previous Scene"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#00F0FF] text-black flex items-center justify-center font-bold hover:bg-[#33F3FF] hover:scale-105 transition-all shadow-lg shadow-[#00F0FF]/25"
              title={isPlaying ? 'Pause' : 'Play with Sound'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (currentSceneIndex < scenes.length - 1) handleSeekScene(currentSceneIndex + 1);
              }}
              className="p-2 hover:text-white rounded-lg transition-colors"
              title="Next Scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-red-400 bg-red-950/30' : 'text-[#00F0FF] hover:text-white'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Sound Studio Control Panel */}
          <div className="w-full max-w-[320px] bg-[#0A0C10] border border-[#2A2F40] rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-white">
              <span className="flex items-center gap-1.5 text-[#00F0FF]">
                <Sliders className="w-3.5 h-3.5" />
                Sound Studio Controls
              </span>
              <span className="font-mono text-[#94A3B8]">{Math.round(volume * 100)}%</span>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={e => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full h-1.5 bg-[#1E2330] rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
            </div>

            {/* Audio Layer Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`py-1.5 px-2 text-[11px] rounded-lg border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  isVoiceEnabled
                    ? 'bg-[#1A1D26] border-[#00F0FF] text-white shadow-xs'
                    : 'bg-[#0E1015] border-[#2A2F40] text-[#64748B]'
                }`}
              >
                <Mic className="w-3 h-3 text-[#00F0FF]" />
                <span>Voice Narration</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMusicEnabled(!isMusicEnabled)}
                className={`py-1.5 px-2 text-[11px] rounded-lg border flex items-center justify-center gap-1.5 font-medium transition-all ${
                  isMusicEnabled
                    ? 'bg-[#1A1D26] border-[#FFB800] text-white shadow-xs'
                    : 'bg-[#0E1015] border-[#2A2F40] text-[#64748B]'
                }`}
              >
                <Music className="w-3 h-3 text-[#FFB800]" />
                <span>Cinematic Pad</span>
              </button>
            </div>

            {/* Voice Actor Preset Selector */}
            <div>
              <label className="block text-[10px] text-[#64748B] uppercase font-semibold mb-1">
                Narrator Voice Profile
              </label>
              <select
                value={selectedVoice}
                onChange={e => setSelectedVoice(e.target.value)}
                className="w-full bg-[#12141A] border border-[#2A2F40] rounded-lg p-1.5 text-xs text-white outline-none"
              >
                {VOICE_PRESETS.map(vp => (
                  <option key={vp.id} value={vp.id}>
                    {vp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Test Audio Button */}
            <button
              onClick={handleTestSceneAudio}
              disabled={isPlayingPreviewSfx}
              className="w-full py-2 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{isPlayingPreviewSfx ? 'Playing Audio...' : 'Test Scene Narration & SFX'}</span>
            </button>
          </div>
        </div>

        {/* Right: Inspector & Timeline Track Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Scene Card Details */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2F40] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] font-mono text-xs font-bold flex items-center justify-center">
                  {currentSceneIndex + 1}
                </span>
                <span className="font-bold text-white text-sm">Editing Scene {currentSceneIndex + 1}</span>
              </div>
              <span className="text-xs text-[#FFB800] font-mono font-semibold">{currentScene.duration}s</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">
                  Narration & Spoken Voice Track
                </label>
                <textarea
                  rows={2}
                  value={currentScene.narration}
                  onChange={e => {
                    const newScenes = [...scenes];
                    newScenes[currentSceneIndex] = {
                      ...currentScene,
                      narration: e.target.value,
                      captionText: e.target.value,
                    };
                    const updated = { ...project, scenes: newScenes };
                    onUpdateProject(updated);
                    api.updateProject(project.id, { scenes: newScenes });
                  }}
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">
                  Visual Prompt (AI Media Model)
                </label>
                <textarea
                  rows={2}
                  value={currentScene.visualPrompt}
                  onChange={e => {
                    const newScenes = [...scenes];
                    newScenes[currentSceneIndex] = { ...currentScene, visualPrompt: e.target.value };
                    const updated = { ...project, scenes: newScenes };
                    onUpdateProject(updated);
                    api.updateProject(project.id, { scenes: newScenes });
                  }}
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Sound Effect Cue</label>
                  <input
                    type="text"
                    value={currentScene.soundEffect || 'Low distant thunder rumble'}
                    onChange={e => {
                      const newScenes = [...scenes];
                      newScenes[currentSceneIndex] = { ...currentScene, soundEffect: e.target.value };
                      const updated = { ...project, scenes: newScenes };
                      onUpdateProject(updated);
                    }}
                    className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Caption Style</label>
                  <select
                    value={captionStyle}
                    onChange={e => setCaptionStyle(e.target.value as 'Karaoke Bold' | 'Cinematic')}
                    className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2 text-xs text-white outline-none"
                  >
                    <option value="Karaoke Bold">Karaoke Bold (Animated Word Highlighting)</option>
                    <option value="Cinematic">Cinematic Clean (Bottom Centered)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Bar Strip */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-3">
            <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider block">
              Multi-Scene Timeline
            </span>

            <div className="grid grid-cols-5 gap-2">
              {scenes.map((sc, idx) => (
                <button
                  key={sc.id || idx}
                  onClick={() => handleSeekScene(idx)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    idx === currentSceneIndex
                      ? 'bg-[#1A1D26] border-[#00F0FF] shadow-xs'
                      : 'bg-[#0E1015] border-[#2A2F40] hover:border-[#384055]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-white">S{idx + 1}</span>
                    <span className="text-[#FFB800]">{sc.duration}s</span>
                  </div>
                  <p className="text-[10px] text-[#94A3B8] line-clamp-2 mt-1">
                    {sc.captionText || sc.narration}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
