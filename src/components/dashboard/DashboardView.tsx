import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Film,
  Calendar,
  Layers,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Video,
  Radio,
  Globe,
  Music,
  Image as ImageIcon,
} from 'lucide-react';
import { Project, AnalyticsSummary } from '../../types/index.js';

interface DashboardViewProps {
  projects: Project[];
  analytics: AnalyticsSummary | null;
  onSelectProject: (project: Project) => void;
  onStartNewProject: (prompt?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenVeo?: () => void;
  onOpenImageStudio?: () => void;
  onOpenMusicStudio?: () => void;
  onOpenSearchGrounding?: () => void;
  onOpenLiveVoice?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  analytics,
  onSelectProject,
  onStartNewProject,
  onNavigateTab,
  onOpenVeo,
  onOpenImageStudio,
  onOpenMusicStudio,
  onOpenSearchGrounding,
  onOpenLiveVoice,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  const quickTemplates = [
    {
      title: 'The Story of Jafta',
      prompt: 'Create a 45-second TikTok explaining the story of Zeus, but rename Zeus to Jafta. Make it cinematic, dramatic and engaging.',
      tag: 'Mythology',
    },
    {
      title: 'Ancient Warrior Awakening',
      prompt: 'Create a cinematic 60-second TikTok about the rise of an ancient warrior. Start with a powerful hook, dramatic narration and sound effects.',
      tag: 'History',
    },
    {
      title: '3 Mind-Bending Space Paradoxes',
      prompt: 'Create a 30-second high-energy video explaining the Fermi Paradox. Fast cuts, punchy curiosity hook, and bold captions.',
      tag: 'Science',
    },
    {
      title: 'The Discipline Code',
      prompt: 'Create a 45-second motivational short about solitary focus and relentless execution. Cinematic dark aesthetic with deep narration.',
      tag: 'Motivation',
    },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onStartNewProject(quickPrompt);
  };

  const jaftaProject = projects.find(p => p.id === 'proj-the-rise-of-jafta') || projects[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Welcome & Quick Prompt Composer */}
      <section className="bg-gradient-to-b from-[#161922] to-[#101217] border border-[#2A2F40] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Zap className="w-4 h-4" />
            <span>AI SHORT-FORM VIDEO STUDIO</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Turn any idea into a cinematic video in seconds.
          </h1>

          <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed">
            From raw concept to brief, script, 9:16 scene visual prompts, voiceover, and full TikTok publishing package.
          </p>

          <form onSubmit={handleQuickSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-[#090A0E] border border-[#2A2F40] focus-within:border-[#00F0FF] rounded-xl p-2 transition-all">
              <input
                type="text"
                value={quickPrompt}
                onChange={e => setQuickPrompt(e.target.value)}
                placeholder="Describe your video (e.g. Create a 45-second TikTok about Jafta, ruler of the skies...)"
                className="flex-1 bg-transparent text-sm text-white px-3 py-2.5 outline-none placeholder-[#64748B]"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-semibold text-xs rounded-lg transition-all shadow-md shadow-[#00F0FF]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Video</span>
              </button>
            </div>
          </form>

          {/* Quick Idea Starters */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
              Popular Creator Templates
            </span>
            <div className="flex flex-wrap gap-2">
              {quickTemplates.map(tmpl => (
                <button
                  key={tmpl.title}
                  onClick={() => onStartNewProject(tmpl.prompt)}
                  className="text-left text-xs bg-[#1A1D26] hover:bg-[#242835] border border-[#2A2F40] hover:border-[#00F0FF]/50 px-3 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-all flex items-center gap-2"
                >
                  <span className="text-[#FFB800] text-[10px] uppercase font-bold font-mono">
                    {tmpl.tag}
                  </span>
                  <span>{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced AI Studio Capabilities Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
            Next-Gen AI Media Engines
          </span>
          <span className="text-xs text-[#00F0FF] font-mono">All Features Connected</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Veo Video */}
          <div
            onClick={onOpenVeo}
            className="p-4 bg-[#12141A] hover:bg-[#1A1D26] border border-[#2A2F40] hover:border-[#00F0FF]/60 rounded-xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors">Veo Video</h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Animate photos (9:16 / 16:9)</p>
            </div>
            <span className="text-[9px] text-[#64748B] font-mono block">veo-3.1-fast-generate</span>
          </div>

          {/* Live Voice */}
          <div
            onClick={onOpenLiveVoice}
            className="p-4 bg-[#12141A] hover:bg-[#1A1D26] border border-[#2A2F40] hover:border-[#00F0FF]/60 rounded-xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors">Live Voice</h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Real-time voice chat</p>
            </div>
            <span className="text-[9px] text-[#64748B] font-mono block">gemini-3.8-live</span>
          </div>

          {/* Search Grounding */}
          <div
            onClick={onOpenSearchGrounding}
            className="p-4 bg-[#12141A] hover:bg-[#1A1D26] border border-[#2A2F40] hover:border-[#4285F4]/60 rounded-xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#4285F4] transition-colors">Search Grounding</h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Google Search data</p>
            </div>
            <span className="text-[9px] text-[#64748B] font-mono block">gemini-2.5-flash</span>
          </div>

          {/* Lyria Music */}
          <div
            onClick={onOpenMusicStudio}
            className="p-4 bg-[#12141A] hover:bg-[#1A1D26] border border-[#2A2F40] hover:border-[#FFB800]/60 rounded-xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#FFB800] transition-colors">Lyria Music</h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Clips & full tracks</p>
            </div>
            <span className="text-[9px] text-[#64748B] font-mono block">lyria-3-clip-preview</span>
          </div>

          {/* Image Studio */}
          <div
            onClick={onOpenImageStudio}
            className="p-4 bg-[#12141A] hover:bg-[#1A1D26] border border-[#2A2F40] hover:border-[#10B981]/60 rounded-xl cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-[#10B981] transition-colors">Image Studio</h4>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">Create & edit scenes</p>
            </div>
            <span className="text-[9px] text-[#64748B] font-mono block">gemini-3.1-flash-image</span>
          </div>
        </div>
      </section>

      {/* Featured Project Showcase: The Rise of Jafta */}
      {jaftaProject && (
        <section className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div
                className="w-24 h-40 bg-[#1A1D26] rounded-lg overflow-hidden border border-[#2A2F40] relative shrink-0 cursor-pointer group"
                onClick={() => onSelectProject(jaftaProject)}
              >
                <img
                  src={jaftaProject.thumbnailUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80'}
                  alt={jaftaProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-[#00F0FF] fill-current" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                  <span className="text-[#FFB800] font-bold">DEMO SPECIFICATION SEED</span>
                  <span aria-hidden="true">·</span>
                  <span>TikTok 9:16 Vertical</span>
                  <span aria-hidden="true">·</span>
                  <span>45 Seconds</span>
                </div>
                <h2 className="text-xl font-bold text-white hover:text-[#00F0FF] transition-colors cursor-pointer" onClick={() => onSelectProject(jaftaProject)}>
                  {jaftaProject.title}
                </h2>
                <p className="text-xs text-[#94A3B8] max-w-xl line-clamp-2">
                  {jaftaProject.prompt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#64748B] pt-1">
                  <span>5 Cinematic Scenes</span>
                  <span aria-hidden="true">·</span>
                  <span>Script & Hooks Ready</span>
                  <span aria-hidden="true">·</span>
                  <span>Audio & Timeline Synced</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto">
              <button
                onClick={() => onSelectProject(jaftaProject)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-lg text-xs font-semibold transition-all"
              >
                <Film className="w-4 h-4 text-[#00F0FF]" />
                <span>Open in Timeline</span>
              </button>
              <button
                onClick={() => onNavigateTab('tiktok')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#33F3FF] text-black rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <span>TikTok Publishing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Production Telemetry Stats */}
      {analytics && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#12141A] border border-[#2A2F40] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Videos Created</span>
            <div className="text-2xl font-bold text-white">{analytics.videosCreated}</div>
            <div className="text-[11px] text-[#94A3B8]">{analytics.videosCompleted} fully rendered</div>
          </div>

          <div className="bg-[#12141A] border border-[#2A2F40] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Video Seconds</span>
            <div className="text-2xl font-bold text-[#00F0FF]">{analytics.totalRenderSeconds}s</div>
            <div className="text-[11px] text-[#94A3B8]">High-retention 9:16 vertical</div>
          </div>

          <div className="bg-[#12141A] border border-[#2A2F40] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Provider Latency</span>
            <div className="text-2xl font-bold text-white">{analytics.averageGenerationTimeSeconds}s</div>
            <div className="text-[11px] text-[#10B981]">Gemini 3.8 Flash pipeline</div>
          </div>

          <div className="bg-[#12141A] border border-[#2A2F40] p-4 rounded-xl space-y-1">
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">Success Rate</span>
            <div className="text-2xl font-bold text-[#FFB800]">{analytics.providerSuccessRate}%</div>
            <div className="text-[11px] text-[#94A3B8]">With automatic retry fallback</div>
          </div>
        </section>
      )}

      {/* Recent Projects List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Projects</h2>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-[#12141A] hover:bg-[#161822] border border-[#2A2F40] hover:border-[#00F0FF]/50 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex gap-3">
                <div className="w-16 h-24 bg-[#1A1D26] rounded-lg overflow-hidden shrink-0 border border-[#2A2F40] relative">
                  <img
                    src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-[#00F0FF] font-mono uppercase tracking-wider">
                    {project.status}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] line-clamp-2">
                    {project.prompt}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#1E2330]">
                <span>{project.scenes.length} Scenes · {project.targetDuration}s</span>
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
