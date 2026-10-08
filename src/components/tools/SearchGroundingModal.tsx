import React, { useState } from 'react';
import { Globe, Search, ExternalLink, Sparkles, X, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../../services/api.js';

interface SearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseAsPrompt?: (topicPrompt: string) => void;
}

export const SearchGroundingModal: React.FC<SearchGroundingModalProps> = ({
  isOpen,
  onClose,
  onUseAsPrompt,
}) => {
  const [query, setQuery] = useState('Zeus origins and myths vs modern pop culture representation');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    text: string;
    sources: Array<{ title: string; url: string }>;
  } | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchGrounding(query);
      setResults(res);
    } catch (err) {
      console.error('Search grounding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2F40] flex items-center justify-between bg-[#161922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Search Grounding Engine</span>
                <span className="text-[10px] text-[#4285F4] font-mono font-semibold px-2 py-0.5 bg-[#4285F4]/10 rounded border border-[#4285F4]/20">
                  gemini-2.5-flash + Google Search
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Ground your videos in verified real-time facts and trending topics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#0A0C10] border border-[#2A2F40] focus-within:border-[#4285F4] rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-[#64748B]" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search topic, history, news, or viral hooks..."
                className="bg-transparent text-xs text-white outline-none flex-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-5 py-2 bg-[#4285F4] hover:bg-[#5294FF] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Grounding</span>
            </button>
          </form>

          {/* Research Results */}
          {results && (
            <div className="space-y-4">
              <div className="bg-[#0A0C10] border border-[#2A2F40] rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-[#4285F4] uppercase tracking-wider block">
                  Grounding Synthesis & Key Findings
                </span>
                <p className="text-xs text-[#F0F3F8] leading-relaxed whitespace-pre-line">
                  {results.text}
                </p>
              </div>

              {/* Web Sources */}
              {results.sources.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    Verified Google Search Citations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-[#0A0C10] border border-[#2A2F40] hover:border-[#4285F4] rounded-lg text-xs text-white flex items-center justify-between gap-2 group transition-colors"
                      >
                        <span className="truncate group-hover:text-[#4285F4]">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {onUseAsPrompt && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onUseAsPrompt(`Create a 45-second TikTok based on verified research: ${results.text.slice(0, 160)}...`);
                      onClose();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-md"
                  >
                    <span>Turn into Video Script</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
