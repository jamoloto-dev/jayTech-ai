import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Wand2,
  Film,
  Check,
  ChevronDown,
  ChevronUp,
  Volume2,
  Camera,
  Layers,
  Flame,
  Download,
  AlertCircle,
} from 'lucide-react';
import { Project, CreativeBrief, ScriptPackage, Scene, GenerationJob } from '../../types/index.js';
import { api } from '../../services/api.js';

interface StudioWizardProps {
  initialProject?: Project | null;
  onFinish: (project: Project) => void;
  onOpenEditor: (project: Project) => void;
  onOpenTikTokEngine: (project: Project) => void;
}

export const StudioWizard: React.FC<StudioWizardProps> = ({
  initialProject,
  onFinish,
  onOpenEditor,
  onOpenTikTokEngine,
}) => {
  // Steps: 1: Prompt & Format, 2: Brief, 3: Script, 4: Storyboard, 5: Asset Generation
  const [step, setStep] = useState<number>(initialProject?.status === 'READY' ? 4 : initialProject?.script ? 4 : initialProject?.creativeBrief ? 3 : 1);
  const [currentProject, setCurrentProject] = useState<Project | null>(initialProject || null);

  // Step 1 State
  const [prompt, setPrompt] = useState(
    initialProject?.prompt ||
      'Create a 45-second TikTok explaining the story of Zeus, but rename Zeus to Jafta. Make it cinematic, dramatic and engaging.'
  );
  const [format, setFormat] = useState(initialProject?.format || 'Mythology Storytelling');
  const [duration, setDuration] = useState<number>(initialProject?.targetDuration || 45);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  // Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 5 Job Tracking State
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);

  const formatOptions = [
    'Text to Video',
    'Mythology Storytelling',
    'Ancient History',
    'Motivational & Mindset',
    'Educational & Science',
    'Product Showcase',
    'Faceless Explainer',
    'Top 5 Countdown',
  ];

  // Handler: Step 1 -> Step 2 (Create / Plan)
  const handleCreateBrief = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let proj = currentProject;
      if (!proj) {
        proj = await api.createProject({
          title: prompt.slice(0, 35) + '...',
          prompt,
          format,
          targetDuration: duration,
          aspectRatio,
        });
      }

      const { brief, project: updated } = await api.generateBrief(proj.id, {
        tone: 'Cinematic & Dramatic',
        platform: 'TikTok',
      });

      setCurrentProject(updated);
      setStep(2);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Step 2 -> Step 3 (Script)
  const handleGenerateScript = async () => {
    if (!currentProject) return;
    setLoading(true);
    setError(null);
    try {
      const { script, project: updated } = await api.generateScript(currentProject.id);
      setCurrentProject(updated);
      setStep(3);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Step 3 -> Step 4 (Storyboard)
  const handleDecomposeStoryboard = async () => {
    if (!currentProject) return;
    setLoading(true);
    setError(null);
    try {
      const { scenes, project: updated } = await api.decomposeStoryboard(currentProject.id);
      setCurrentProject(updated);
      setStep(4);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handler: Step 4 -> Step 5 (Generate Assets & Render)
  const handleStartGeneration = async () => {
    if (!currentProject) return;
    setLoading(true);
    setError(null);
    setStep(5);

    try {
      const { jobId } = await api.enqueueGeneration(currentProject.id);
      api.subscribeToJob(jobId, updatedJob => {
        setCurrentJob(updatedJob);
        if (updatedJob.status === 'SUCCEEDED') {
          api.getProject(currentProject.id).then(freshProject => {
            setCurrentProject(freshProject);
            setLoading(false);
          });
        }
      });
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  // Scene Editing Helpers
  const updateScene = (index: number, updates: Partial<Scene>) => {
    if (!currentProject) return;
    const updatedScenes = [...currentProject.scenes];
    updatedScenes[index] = { ...updatedScenes[index], ...updates };
    const updatedProj = { ...currentProject, scenes: updatedScenes };
    setCurrentProject(updatedProj);
    api.updateProject(currentProject.id, { scenes: updatedScenes });
  };

  const reorderScene = (index: number, direction: 'up' | 'down') => {
    if (!currentProject) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentProject.scenes.length) return;

    const newScenes = [...currentProject.scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    // Resequence
    newScenes.forEach((s, idx) => (s.sequenceOrder = idx + 1));
    const updatedProj = { ...currentProject, scenes: newScenes };
    setCurrentProject(updatedProj);
    api.updateProject(currentProject.id, { scenes: newScenes });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Studio Workflow Stepper Header */}
      <div className="flex items-center justify-between border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI PRODUCTION PIPELINE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            {step === 1 && 'Step 1 — Creative Prompt & Format'}
            {step === 2 && 'Step 2 — Strategic Creative Brief'}
            {step === 3 && 'Step 3 — High-Retention Script & Hooks'}
            {step === 4 && 'Step 4 — Storyboard Scene Deck'}
            {step === 5 && 'Step 5 — Asset Synthesis & Rendering'}
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#94A3B8]">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => s < step && setStep(s)}
              disabled={s > step}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold transition-all ${
                s === step
                  ? 'bg-[#00F0FF] text-black shadow-xs shadow-[#00F0FF]/30'
                  : s < step
                  ? 'bg-[#1A1D26] text-[#00F0FF] hover:bg-[#252A38]'
                  : 'bg-[#12141A] text-[#475569] border border-[#2A2F40]'
              }`}
            >
              {s < step ? <Check className="w-3.5 h-3.5" /> : s}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Prompt & Creative Goal */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-6 space-y-4">
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              1. Choose Workflow / Content Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {formatOptions.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                    format === f
                      ? 'bg-[#1A1D26] border-[#00F0FF] text-white'
                      : 'bg-[#0E1015] border-[#2A2F40] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                2. Describe your video concept
              </label>
              <textarea
                rows={4}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="What should this video be about? Be as specific as you like..."
                className="w-full bg-[#090A0E] border border-[#2A2F40] focus:border-[#00F0FF] rounded-xl p-3 text-sm text-white outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Target Duration
                </label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60, 90].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDuration(sec)}
                      className={`flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                        duration === sec
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                          : 'bg-[#1A1D26] text-[#94A3B8] border-[#2A2F40] hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {[
                    { label: '9:16 (TikTok / Reels)', val: '9:16' as const },
                    { label: '16:9 (YouTube)', val: '16:9' as const },
                    { label: '1:1 (Square)', val: '1:1' as const },
                  ].map(ar => (
                    <button
                      key={ar.val}
                      type="button"
                      onClick={() => setAspectRatio(ar.val)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        aspectRatio === ar.val
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                          : 'bg-[#1A1D26] text-[#94A3B8] border-[#2A2F40] hover:text-white'
                      }`}
                    >
                      {ar.val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateBrief}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-[#00F0FF] hover:bg-[#33F3FF] disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Strategy...</span>
                </>
              ) : (
                <>
                  <span>Generate Creative Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Creative Brief Editor */}
      {step === 2 && currentProject?.creativeBrief && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2F40]">
              <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">
                Intelligent Strategy Specification
              </span>
              <span className="text-xs text-[#00F0FF] font-mono">
                {currentProject.creativeBrief.sceneCount} Scenes Planned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Topic</label>
                <input
                  type="text"
                  value={currentProject.creativeBrief.topic}
                  onChange={e =>
                    setCurrentProject({
                      ...currentProject,
                      creativeBrief: { ...currentProject.creativeBrief!, topic: e.target.value },
                    })
                  }
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Target Audience</label>
                <input
                  type="text"
                  value={currentProject.creativeBrief.targetAudience}
                  onChange={e =>
                    setCurrentProject({
                      ...currentProject,
                      creativeBrief: { ...currentProject.creativeBrief!, targetAudience: e.target.value },
                    })
                  }
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Tone & Pacing</label>
                <input
                  type="text"
                  value={`${currentProject.creativeBrief.tone} (${currentProject.creativeBrief.pacing})`}
                  onChange={e =>
                    setCurrentProject({
                      ...currentProject,
                      creativeBrief: { ...currentProject.creativeBrief!, tone: e.target.value },
                    })
                  }
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Call To Action (CTA)</label>
                <input
                  type="text"
                  value={currentProject.creativeBrief.callToAction}
                  onChange={e =>
                    setCurrentProject({
                      ...currentProject,
                      creativeBrief: { ...currentProject.creativeBrief!, callToAction: e.target.value },
                    })
                  }
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Video Goal</label>
              <textarea
                rows={2}
                value={currentProject.creativeBrief.videoGoal}
                onChange={e =>
                  setCurrentProject({
                    ...currentProject,
                    creativeBrief: { ...currentProject.creativeBrief!, videoGoal: e.target.value },
                  })
                }
                className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1D26] hover:bg-[#252A38] text-white text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Viral Script...</span>
                </>
              ) : (
                <>
                  <span>Approve Brief & Draft Script</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Script & Viral Hook Engine */}
      {step === 3 && currentProject?.script && (
        <div className="space-y-6 animate-fade-in">
          {/* Opening Hooks Section */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2F40]">
              <span className="text-xs font-semibold text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FFB800]" />
                Select Opening Hook (First 3 Seconds)
              </span>
              <span className="text-xs text-[#64748B]">Tested for watch-through retention</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentProject.script.hooks.map((hook, idx) => {
                const isSelected = currentProject.script?.selectedHookIndex === idx;
                return (
                  <div
                    key={hook.id || idx}
                    onClick={() => {
                      const updatedScript = { ...currentProject.script!, selectedHookIndex: idx };
                      setCurrentProject({ ...currentProject, script: updatedScript });
                      api.updateProject(currentProject.id, { script: updatedScript });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#1A1D26] border-[#00F0FF] shadow-sm shadow-[#00F0FF]/20'
                        : 'bg-[#0E1015] border-[#2A2F40] hover:border-[#384055]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-[#FFB800]">
                        {hook.type.replace('_', ' ')}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#00F0FF]" />}
                    </div>
                    <p className="text-xs text-white leading-relaxed">"{hook.text}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Script Body */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-6 space-y-4">
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Main Narration Script
            </label>
            <textarea
              rows={5}
              value={currentProject.script.mainScript}
              onChange={e => {
                const updatedScript = { ...currentProject.script!, mainScript: e.target.value };
                setCurrentProject({ ...currentProject, script: updatedScript });
                api.updateProject(currentProject.id, { script: updatedScript });
              }}
              className="w-full bg-[#090A0E] border border-[#2A2F40] focus:border-[#00F0FF] rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">
                  Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={currentProject.script.callToAction}
                  onChange={e => {
                    const updatedScript = { ...currentProject.script!, callToAction: e.target.value };
                    setCurrentProject({ ...currentProject, script: updatedScript });
                    api.updateProject(currentProject.id, { script: updatedScript });
                  }}
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">
                  Cover Headline
                </label>
                <input
                  type="text"
                  value={currentProject.script.suggestedCoverHeadline}
                  onChange={e => {
                    const updatedScript = { ...currentProject.script!, suggestedCoverHeadline: e.target.value };
                    setCurrentProject({ ...currentProject, script: updatedScript });
                    api.updateProject(currentProject.id, { script: updatedScript });
                  }}
                  className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2.5 text-xs text-white uppercase font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1D26] hover:bg-[#252A38] text-white text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleDecomposeStoryboard}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decomposing Storyboard...</span>
                </>
              ) : (
                <>
                  <span>Approve Script & Build Storyboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Storyboard Scenes Deck */}
      {step === 4 && currentProject?.scenes && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">
              {currentProject.scenes.length} Scenes Composed · Drag/Reorder Supported
            </span>
            <span className="text-xs text-[#00F0FF] font-mono">
              Total Duration: {currentProject.scenes.reduce((acc, s) => acc + s.duration, 0)}s
            </span>
          </div>

          <div className="space-y-4">
            {currentProject.scenes.map((scene, idx) => (
              <div
                key={scene.id || idx}
                className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-3 transition-all hover:border-[#384055]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2330]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1A1D26] text-[#00F0FF] font-mono font-bold text-xs flex items-center justify-center">
                      {scene.sequenceOrder}
                    </span>
                    <span className="text-xs font-bold text-white">Scene {scene.sequenceOrder}</span>
                    <span aria-hidden="true" className="text-[#475569]">·</span>
                    <span className="text-xs text-[#FFB800] font-mono font-semibold">{scene.duration}s</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => reorderScene(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#94A3B8] hover:text-white disabled:opacity-30"
                      title="Move Scene Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => reorderScene(idx, 'down')}
                      disabled={idx === currentProject.scenes.length - 1}
                      className="p-1 text-[#94A3B8] hover:text-white disabled:opacity-30"
                      title="Move Scene Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#64748B] font-semibold uppercase">
                      Spoken Narration & Captions
                    </label>
                    <textarea
                      rows={2}
                      value={scene.narration}
                      onChange={e => updateScene(idx, { narration: e.target.value, captionText: e.target.value })}
                      className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-[#64748B] font-semibold uppercase">
                      Visual Generation Prompt (9:16)
                    </label>
                    <textarea
                      rows={2}
                      value={scene.visualPrompt}
                      onChange={e => updateScene(idx, { visualPrompt: e.target.value })}
                      className="w-full bg-[#090A0E] border border-[#2A2F40] rounded-lg p-2 text-xs text-white resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-[#94A3B8] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Camera: {scene.cameraDirection}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>SFX: {scene.soundEffect || 'Subtle atmosphere'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1D26] hover:bg-[#252A38] text-white text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleStartGeneration}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Assets & Video</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Asset Generation & Real-time Progress */}
      {step === 5 && (
        <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl p-8 space-y-6 text-center animate-fade-in max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mx-auto text-[#00F0FF]">
            {currentJob?.status === 'SUCCEEDED' ? (
              <Check className="w-8 h-8 text-[#10B981]" />
            ) : (
              <RefreshCw className="w-8 h-8 animate-spin" />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {currentJob?.status === 'SUCCEEDED'
                ? 'Production Render Complete!'
                : 'Synthesizing Video Assets...'}
            </h2>
            <p className="text-xs text-[#94A3B8]">
              {currentJob?.stageDescription || 'Orchestrating visual prompts and timeline composition...'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-[#090A0E] rounded-full overflow-hidden border border-[#2A2F40]">
              <div
                className="h-full bg-gradient-to-r from-[#00F0FF] to-[#0088FF] transition-all duration-300 rounded-full"
                style={{ width: `${currentJob?.progress || 15}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
              <span>Stage: {currentJob?.status || 'RUNNING'}</span>
              <span>{currentJob?.progress || 15}%</span>
            </div>
          </div>

          {currentJob?.status === 'SUCCEEDED' && currentProject && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onOpenEditor(currentProject)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-md shadow-[#00F0FF]/20"
              >
                <Film className="w-4 h-4" />
                <span>Open in Video Timeline</span>
              </button>

              <button
                onClick={() => onOpenTikTokEngine(currentProject)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] font-semibold text-xs rounded-xl"
              >
                <Flame className="w-4 h-4 text-[#FFB800]" />
                <span>TikTok Publishing Package</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
