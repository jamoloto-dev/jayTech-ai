import React, { useState } from 'react';
import { Music, Sparkles, X, Play, Pause, RefreshCw, Volume2, Check } from 'lucide-react';
import { api } from '../../services/api.js';

interface LyriaMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachMusic?: (audioUrl: string, title: string) => void;
}

export const LyriaMusicModal: React.FC<LyriaMusicModalProps> = ({
  isOpen,
  onClose,
  onAttachMusic,
}) => {
  const [prompt, setPrompt] = useState('Epic cinematic mythic trailer score with low war drums, soaring atmospheric brass, and dark choir tension');
  const [format, setFormat] = useState<'clip' | 'track'>('clip');
  const [duration, setDuration] = useState<number>(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<{ audioUrl: string; title: string; duration: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.generateMusic(prompt, duration, format);
      setGeneratedAudio(res);
    } catch (err) {
      console.error('Music generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2F40] flex items-center justify-between bg-[#161922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Lyria Music Generator</span>
                <span className="text-[10px] text-[#FFB800] font-mono font-semibold px-2 py-0.5 bg-[#FFB800]/10 rounded border border-[#FFB800]/20">
                  {format === 'clip' ? 'lyria-3-clip-preview' : 'lyria-3-pro-preview'}
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Generate custom soundtrack clips and background music</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Music Model Track Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormat('clip');
                  setDuration(30);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  format === 'clip'
                    ? 'bg-[#1A1D26] border-[#FFB800] text-white'
                    : 'bg-[#0A0C10] border-[#2A2F40] text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">Short Clip (Up to 30s)</div>
                  <div className="text-[10px] text-[#64748B]">lyria-3-clip-preview · TikTok / Reels</div>
                </div>
                {format === 'clip' && <Check className="w-4 h-4 text-[#FFB800]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormat('track');
                  setDuration(60);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  format === 'track'
                    ? 'bg-[#1A1D26] border-[#FFB800] text-white'
                    : 'bg-[#0A0C10] border-[#2A2F40] text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">Full Track (Up to 90s)</div>
                  <div className="text-[10px] text-[#64748B]">lyria-3-pro-preview · Extended Lore</div>
                </div>
                {format === 'track' && <Check className="w-4 h-4 text-[#FFB800]" />}
              </button>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Musical Composition Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe tempo, instruments, mood, energy arc (e.g. ambient strings building into heavy taiko drums)..."
              className="w-full bg-[#0A0C10] border border-[#2A2F40] focus:border-[#FFB800] rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Generated Audio Card */}
          {generatedAudio && (
            <div className="bg-[#0A0C10] border border-[#2A2F40] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#FFB800]" />
                  <span>{generatedAudio.title}</span>
                </span>
                <span className="text-[11px] text-[#00F0FF] font-mono">{generatedAudio.duration}s</span>
              </div>

              <audio src={generatedAudio.audioUrl} controls className="w-full h-8" />

              {onAttachMusic && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onAttachMusic(generatedAudio.audioUrl, generatedAudio.title);
                      onClose();
                    }}
                    className="px-4 py-2 bg-[#FFB800] text-black font-bold text-xs rounded-lg hover:bg-[#FFC933]"
                  >
                    Attach as Project Score
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2F40] bg-[#161822] flex justify-between items-center">
          <button onClick={onClose} className="px-4 py-2 text-xs text-[#94A3B8] hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFB800] hover:bg-[#FFC933] disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#FFB800]/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Track...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Lyria Music</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
