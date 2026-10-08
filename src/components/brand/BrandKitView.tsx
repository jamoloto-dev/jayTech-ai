import React, { useState } from 'react';
import { Palette, Shield, Sparkles, User, Image, Plus } from 'lucide-react';
import { BrandKit } from '../../types/index.js';

interface BrandKitViewProps {
  brandKits: BrandKit[];
  onUpdateBrandKit?: (kit: BrandKit) => void;
}

export const BrandKitView: React.FC<BrandKitViewProps> = ({ brandKits }) => {
  const [selectedKit, setSelectedKit] = useState<BrandKit>(brandKits[0]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Palette className="w-4 h-4 text-[#00F0FF]" />
            <span>BRAND IDENTITY & CHARACTER BIBLE</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Reusable Creator Brand Kits</h1>
          <p className="text-xs text-[#94A3B8]">
            Inherit colors, typography, preferred voiceover models, and recurring character appearance continuity automatically.
          </p>
        </div>
      </div>

      {selectedKit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Brand Kit Variables */}
          <div className="lg:col-span-5 bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-4">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block border-b border-[#2A2F40] pb-2">
              Brand Channel Settings
            </span>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Brand Kit Name</label>
                <input
                  type="text"
                  value={selectedKit.name}
                  readOnly
                  className="w-full bg-[#0A0C10] border border-[#2A2F40] rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">TikTok / Channel Handle</label>
                <input
                  type="text"
                  value={selectedKit.channelName}
                  readOnly
                  className="w-full bg-[#0A0C10] border border-[#2A2F40] rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Primary Color</label>
                  <div className="flex items-center gap-2 bg-[#0A0C10] border border-[#2A2F40] p-1.5 rounded-lg">
                    <span className="w-5 h-5 rounded-md" style={{ backgroundColor: selectedKit.primaryColor }} />
                    <span className="text-xs font-mono text-white">{selectedKit.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Secondary Accent</label>
                  <div className="flex items-center gap-2 bg-[#0A0C10] border border-[#2A2F40] p-1.5 rounded-lg">
                    <span className="w-5 h-5 rounded-md" style={{ backgroundColor: selectedKit.secondaryColor }} />
                    <span className="text-xs font-mono text-white">{selectedKit.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Preferred AI Voice</label>
                <input
                  type="text"
                  value={selectedKit.preferredVoice}
                  readOnly
                  className="w-full bg-[#0A0C10] border border-[#2A2F40] rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] font-semibold uppercase mb-1">Video Watermark</label>
                <input
                  type="text"
                  value={selectedKit.watermarkText}
                  readOnly
                  className="w-full bg-[#0A0C10] border border-[#2A2F40] rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Character Bible (Jafta and Recurring Entities) */}
          <div className="lg:col-span-7 bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2F40] pb-2">
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Character Bible (Continuity Memory)
              </span>
              <span className="text-xs text-[#00F0FF] font-mono">
                {selectedKit.characterBible.length} Characters Stored
              </span>
            </div>

            <div className="space-y-4">
              {selectedKit.characterBible.map(char => (
                <div key={char.name} className="p-4 bg-[#0A0C10] border border-[#2A2F40] rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-[#1A1D26] border border-[#2A2F40] shrink-0">
                      <img
                        src={char.visualReferences[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80'}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{char.name}</span>
                        <span className="text-[10px] text-[#FFB800] uppercase font-mono">Hero Protagonist</span>
                      </h4>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{char.description}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-[#12141A] p-3 rounded-lg border border-[#1E2330]">
                    <div className="text-[#64748B] font-semibold text-[11px] uppercase">Consistent Visual Prompt Anchors:</div>
                    <div className="text-[#F0F3F8] leading-relaxed font-mono text-[11px]">
                      {char.appearance} · {char.clothes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
