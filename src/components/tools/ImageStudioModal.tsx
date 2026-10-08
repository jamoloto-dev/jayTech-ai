import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Upload, X, Check, RefreshCw, Download } from 'lucide-react';
import { api } from '../../services/api.js';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImage?: (imageUrl: string) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyImage,
}) => {
  const [prompt, setPrompt] = useState('Mythic ancient warrior with gleaming gold armor and obsidian cloak standing amidst lightning storm on mountaintop, 8k cinematic render');
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInputImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await api.generateOrEditImage(prompt, inputImage || undefined);
      setGeneratedImage(res.imageUrl);
    } catch (err) {
      console.error('Image generation error:', err);
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
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Image Creation & Editing Studio</span>
                <span className="text-[10px] text-[#00F0FF] font-mono font-semibold px-2 py-0.5 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20">
                  gemini-3.1-flash-image-preview
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Create brand-new visuals or edit existing scenes with text prompts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Optional Image Upload to Edit */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Reference Image to Edit (Optional)
            </label>
            {inputImage ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#00F0FF]">
                <img src={inputImage} alt="Reference" className="w-full h-full object-cover" />
                <button
                  onClick={() => setInputImage(null)}
                  className="absolute top-1 right-1 bg-black/80 text-white p-1 rounded-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 border border-dashed border-[#2A2F40] hover:border-[#00F0FF]/60 rounded-xl p-3 cursor-pointer bg-[#0A0C10] transition-colors">
                <Upload className="w-5 h-5 text-[#00F0FF]" />
                <span className="text-xs text-[#94A3B8]">Upload an image to modify with prompts</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Visual Creation / Edit Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the desired visual in detail: character, setting, lighting, atmosphere..."
              className="w-full bg-[#0A0C10] border border-[#2A2F40] focus:border-[#00F0FF] rounded-xl p-3 text-xs text-white outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Generated Result */}
          {generatedImage && (
            <div className="bg-[#0A0C10] border border-[#2A2F40] rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                Generated Image Output (9:16 Vertical)
              </span>
              <div className="flex justify-center bg-black rounded-lg overflow-hidden border border-[#2A2F40] max-h-72">
                <img src={generatedImage} alt="Generated" className="max-h-72 object-contain" />
              </div>
              {onApplyImage && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      onApplyImage(generatedImage);
                      onClose();
                    }}
                    className="px-4 py-2 bg-[#00F0FF] text-black font-bold text-xs rounded-lg hover:bg-[#33F3FF]"
                  >
                    Apply Image to Active Scene
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-lg shadow-[#00F0FF]/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{inputImage ? 'Edit Image' : 'Create Image'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
