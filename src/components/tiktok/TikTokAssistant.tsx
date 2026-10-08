import React, { useState } from 'react';
import {
  Flame,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Hash,
  MessageSquare,
  Shield,
  Layers,
} from 'lucide-react';
import { Project } from '../../types/index.js';
import { videoRenderer } from '../../services/videoRenderer.js';
import { api } from '../../services/api.js';

interface TikTokAssistantProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export const TikTokAssistant: React.FC<TikTokAssistantProps> = ({ project, onUpdateProject }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);

  const script = project.script;
  const hashtags = script?.hashtags;

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadPublishingPackage = async () => {
    setIsExporting(true);
    try {
      const pkgResponse = await api.getPublishingPackage(project.id);
      const pkg = pkgResponse.publishingPackage;
      const blob = await videoRenderer.exportPublishingZip(project, pkg.subtitlesSrt, pkg.metadataJson);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_TikTok_Kit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export zip failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Flame className="w-4 h-4 text-[#FFB800]" />
            <span>TIKTOK VIRAL LAUNCHPAD</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Publishing Package & SEO Optimizer</h1>
          <p className="text-xs text-[#94A3B8]">
            Optimized for 3-second hook retention, FYP discovery tags, and mobile safe zones.
          </p>
        </div>

        <button
          onClick={handleDownloadPublishingPackage}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-md shadow-[#00F0FF]/20 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Bundling Package...' : 'Download Full Package (.ZIP)'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Viral Hooks & Captions */}
        <div className="space-y-6">
          {/* Hook Variations */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                Opening Hook Variations
              </span>
              <span className="text-[11px] text-[#64748B]">Click to copy</span>
            </div>

            <div className="space-y-2">
              {script?.hooks.map((hook, idx) => (
                <div
                  key={hook.id || idx}
                  onClick={() => copyToClipboard(hook.text, `hook-${idx}`)}
                  className="p-3 bg-[#0A0C10] border border-[#2A2F40] hover:border-[#00F0FF]/50 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#FFB800]">
                      {hook.type.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-[#F0F3F8]">"{hook.text}"</p>
                  </div>
                  <button className="text-[#64748B] group-hover:text-white shrink-0 mt-1">
                    {copiedSection === `hook-${idx}` ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TikTok Caption & CTA */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
                Post Caption & Call To Action
              </span>
              <button
                onClick={() => copyToClipboard(script?.tiktokCaption || '', 'caption')}
                className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'caption' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>Copy Caption</span>
              </button>
            </div>

            <div className="p-3 bg-[#0A0C10] border border-[#2A2F40] rounded-lg text-xs text-white leading-relaxed font-sans">
              {script?.tiktokCaption}
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase block mb-1">
                Recommended Call To Action
              </span>
              <div className="p-2.5 bg-[#0A0C10] border border-[#2A2F40] rounded-lg text-xs text-[#FFB800] font-medium">
                "{script?.callToAction}"
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Categorized Hashtags & Mobile Cover Frame */}
        <div className="space-y-6">
          {/* Categorized Hashtags */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#00F0FF]" />
                Categorized Hashtag Matrix
              </span>
              <button
                onClick={() => {
                  const allTags = [
                    ...(hashtags?.topic || []),
                    ...(hashtags?.niche || []),
                    ...(hashtags?.discovery || []),
                  ].join(' ');
                  copyToClipboard(allTags, 'hashtags');
                }}
                className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'hashtags' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>Copy All Tags</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-[#64748B] font-semibold uppercase block mb-1">Topic Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags?.topic.map(t => (
                    <span key={t} className="text-xs text-[#94A3B8] bg-[#0A0C10] px-2 py-1 rounded border border-[#2A2F40]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#64748B] font-semibold uppercase block mb-1">Niche Creator Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags?.niche.map(t => (
                    <span key={t} className="text-xs text-[#00F0FF] bg-[#0A0C10] px-2 py-1 rounded border border-[#00F0FF]/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#64748B] font-semibold uppercase block mb-1">Discovery / FYP Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags?.discovery.map(t => (
                    <span key={t} className="text-xs text-[#FFB800] bg-[#0A0C10] px-2 py-1 rounded border border-[#FFB800]/30">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Package Manifest */}
          <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-3">
            <span className="text-xs font-semibold text-white block">Publishing Package Manifest</span>
            <div className="text-xs font-mono text-[#94A3B8] space-y-1 bg-[#0A0C10] p-3 rounded-lg border border-[#2A2F40]">
              <div className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>video.mp4 (1080x1920 9:16 vertical render)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>cover.jpg (Mobile-safe title thumbnail)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>subtitles.srt (Timestamped SubRip captions)</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>caption.txt & hashtags.txt</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>metadata.json (Platform & scene parameters)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
