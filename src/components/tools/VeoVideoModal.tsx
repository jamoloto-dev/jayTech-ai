import React, { useState } from 'react';
import { Video, Sparkles, Upload, X, Play, Download, Check, Film, RefreshCw } from 'lucide-react';
import { api } from '../../services/api.js';

interface VeoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVideoToProject?: (videoUrl: string, prompt: string) => void;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  isOpen,
  onClose,
  onAddVideoToProject,
}) => {
  const [prompt, setPrompt] = useState('Cinematic lightning surges around ancient warrior atop mountaintop, camera sweeps forward dynamically');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.animateImageToVideo(prompt, imageBase64 || undefined, aspectRatio);
      setGeneratedVideoUrl(res.videoUrl);
    } catch (err) {
      console.error('Veo video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2F40] flex items-center justify-between bg-[#161922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Veo Image-to-Video Studio</span>
                <span className="text-[10px] text-[#00F0FF] font-mono font-semibold px-2 py-0.5 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20">
                  veo-3.1-fast-generate-preview
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Animate photos or text prompts into motion video</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Video Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-[#1A1D26] border-[#00F0FF] text-white'
                    : 'bg-[#0A0C10] border-[#2A2F40] text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">9:16 Vertical (Portrait)</div>
                  <div className="text-[10px] text-[#64748B]">TikTok, YouTube Shorts, Reels</div>
                </div>
                {aspectRatio === '9:16' && <Check className="w-4 h-4 text-[#00F0FF]" />}
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-[#1A1D26] border-[#00F0FF] text-white'
                    : 'bg-[#0A0C10] border-[#2A2F40] text-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">16:9 Widescreen (Landscape)</div>
                  <div className="text-[10px] text-[#64748B]">YouTube, Desktop, Cinema</div>
                </div>
                {aspectRatio === '16:9' && <Check className="w-4 h-4 text-[#00F0FF]" />}
              </button>
            </div>
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Upload Source Photo (Optional for Image-to-Video)
            </label>
            <div className="flex gap-4 items-center">
              {imageBase64 ? (
                <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#00F0FF] shrink-0">
                  <img src={imageBase64} alt="Source" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImageBase64(null)}
                    className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded-md"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#2A2F40] hover:border-[#00F0FF]/60 rounded-xl p-5 cursor-pointer transition-colors bg-[#0A0C10]">
                  <Upload className="w-6 h-6 text-[#00F0FF] mb-1" />
                  <span className="text-xs text-white font-medium">Click to upload photo to animate</span>
                  <span className="text-[10px] text-[#64748B]">PNG, JPG, WebP supported</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Animation Prompt */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Animation & Camera Direction Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe motion: camera zoom, lighting shifts, particle effects..."
              className="w-full bg-[#0A0C10] border border-[#2A2F40] focus:border-[#00F0FF] rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Generated Video Preview */}
          {generatedVideoUrl && (
            <div className="bg-[#0A0C10] border border-[#2A2F40] rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-[#00F0FF]" />
                Veo Generated Video Preview
              </span>
              <div className="flex justify-center bg-black rounded-lg overflow-hidden border border-[#2A2F40] max-h-64">
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="max-h-64 object-contain"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                {onAddVideoToProject && (
                  <button
                    onClick={() => {
                      onAddVideoToProject(generatedVideoUrl, prompt);
                      onClose();
                    }}
                    className="px-4 py-2 bg-[#00F0FF] text-black font-bold text-xs rounded-lg hover:bg-[#33F3FF]"
                  >
                    Add to Timeline Scene
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2A2F40] bg-[#161822] flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#94A3B8] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Veo Video...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video with Veo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
