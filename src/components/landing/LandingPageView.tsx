import React from 'react';
import {
  Sparkles,
  Play,
  Film,
  ArrowRight,
  Flame,
  Layers,
  Palette,
  Check,
  Zap,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterStudio: (initialPrompt?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterStudio }) => {
  const faqs = [
    {
      q: 'How does JayTech AI turn a text prompt into a full short-form video?',
      a: 'JayTech AI orchestrates a multi-step pipeline: it crafts a strategic creative brief, drafts hook options and narration, decomposes the story into scenes, generates 9:16 visual prompts, and prepares synchronized subtitles and publishing metadata.',
    },
    {
      q: 'Is this optimized for TikTok, Shorts, and Reels?',
      a: 'Yes. Every project is framed strictly in vertical 9:16 with mobile-safe text zones, opening 3-second retention hooks, and categorized hashtag bundles.',
    },
    {
      q: 'Can I edit scenes and customize my own brand style?',
      a: 'Absolutely. Creators retain complete manual control over every scene narration, visual prompt, camera direction, subtitle font style, and brand kit colors.',
    },
    {
      q: 'What is included in the TikTok Publishing Package?',
      a: 'Each export packages video.mp4, cover.jpg, caption.txt, hashtags.txt, script.txt, subtitles.srt, and metadata.json in a single ready-to-publish archive.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0E] text-[#F0F3F8] selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 md:pt-24 md:pb-32 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12141A] border border-[#2A2F40] text-xs text-[#00F0FF]">
          <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>PRODUCTION-READY AI VIDEO CREATION</span>
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Turn an idea into a video with <span className="text-[#00F0FF]">JayTech AI</span>.
        </h1>

        <p className="text-base md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Write your idea. JayTech AI helps turn it into a script, scenes, narration, visuals, captions and a finished short-form video.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onEnterStudio('Create a 45-second TikTok explaining the story of Zeus, but rename Zeus to Jafta. Make it cinematic, dramatic and engaging.')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-extrabold text-sm rounded-xl shadow-lg shadow-[#00F0FF]/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterStudio('The Rise of Jafta')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#12141A] hover:bg-[#1A1D26] text-white border border-[#2A2F40] text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-[#FFB800] fill-current" />
            <span>Watch Jafta Demo (45s)</span>
          </button>
        </div>
      </section>

      {/* Interactive Interactive Preview Demo Area */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#2A2F40] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-[#64748B] font-mono ml-2">demo_jafta_mythology_timeline.mp4</span>
            </div>
            <span className="text-xs text-[#00F0FF] font-mono">1080 × 1920 (9:16)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Frame */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-52 aspect-[9/16] bg-black rounded-xl overflow-hidden border border-[#2A2F40] shadow-lg relative">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80"
                  alt="Jafta Warrior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-3">
                  <div className="bg-[#00F0FF] text-black text-[10px] font-black px-2 py-0.5 rounded w-max mb-1">
                    KARAOKE CAPTIONS
                  </div>
                  <p className="text-xs font-bold text-white leading-tight">
                    "Before kings ruled the earth, the skies belonged to Jafta."
                  </p>
                </div>
              </div>
            </div>

            {/* Script & Pipeline Summary */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-[#FFB800] font-mono font-bold">VIRAL HOOK GENERATION</span>
                <h3 className="text-lg font-bold text-white">The Rise of Jafta: Ruler of the Skies</h3>
                <p className="text-xs text-[#94A3B8]">
                  Orchestrated from prompt to scene decomposition, dynamic camera directions, and TikTok export package.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#090A0E] border border-[#2A2F40] rounded-lg text-[#F0F3F8]">
                  <span className="text-[#00F0FF] font-semibold">Hook 1: </span>
                  "Before kings ruled the earth, the skies belonged to one name: Jafta."
                </div>
                <div className="p-2.5 bg-[#090A0E] border border-[#2A2F40] rounded-lg text-[#F0F3F8]">
                  <span className="text-[#FFB800] font-semibold">Scene 4 Climax: </span>
                  "With a single strike of celestial fury, the thunder obeyed his command."
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onEnterStudio('The Rise of Jafta')}
                  className="px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shadow-[#00F0FF]/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Video in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Pipeline Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-[#2A2F40] space-y-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs text-[#00F0FF] font-mono font-bold uppercase">End-to-End Workflow</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">How JayTech AI Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Creative Brief', desc: 'Determines target audience, tone, pacing, duration, and platform strategy.' },
            { step: '02', title: 'Viral Script', desc: 'Crafts high-converting opening hooks, full narration, CTA, and categorized hashtags.' },
            { step: '03', title: 'Storyboard Deck', desc: 'Divides script into scenes with camera movement and visual generation prompts.' },
            { step: '04', title: 'Asset Synthesis', desc: 'Non-blocking async generation of 9:16 visuals, character voices, and music.' },
            { step: '05', title: 'Publishing Export', desc: 'Exports ready-to-post package with video.mp4, cover.jpg, and subtitles.srt.' },
          ].map(item => (
            <div key={item.step} className="bg-[#12141A] border border-[#2A2F40] p-4 rounded-xl space-y-2">
              <span className="text-xl font-black text-[#00F0FF] font-mono">{item.step}</span>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 py-16 border-t border-[#2A2F40] space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#12141A] border border-[#2A2F40] p-5 rounded-xl space-y-1.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#00F0FF]" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
