import React, { useState } from 'react';
import { Image as ImageIcon, Video, Music, Search, Download, Filter } from 'lucide-react';
import { MediaAsset } from '../../types/index.js';

interface MediaLibraryViewProps {
  assets: MediaAsset[];
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({ assets }) => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = assets.filter(asset => {
    const matchesType = filterType === 'all' || asset.fileType === filterType;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.generationPrompt && asset.generationPrompt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <ImageIcon className="w-4 h-4 text-[#00F0FF]" />
            <span>ASSET VAULT & PROVENANCE</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Creator Media Library</h1>
        </div>

        {/* Filter Tabs (Zero-Pill interactive segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-[#12141A] border border-[#2A2F40] rounded-lg">
          {(['all', 'image', 'video', 'audio'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === type
                  ? 'bg-[#1A1D26] text-white shadow-xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-[#12141A] border border-[#2A2F40] px-3 py-2 rounded-xl">
        <Search className="w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by asset name or generative prompt keyword..."
          className="bg-transparent text-xs text-white outline-none flex-1"
        />
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(asset => (
          <div
            key={asset.id}
            className="bg-[#12141A] border border-[#2A2F40] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#00F0FF]/50 transition-all"
          >
            <div className="aspect-[9/16] bg-[#0A0C10] relative overflow-hidden">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-[#00F0FF] font-mono">
                {asset.dimensions || '1080x1920'}
              </div>
            </div>

            <div className="p-3 space-y-1.5">
              <h4 className="text-xs font-bold text-white truncate">{asset.name}</h4>
              <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                {asset.generationPrompt || 'Generated visual asset for scene.'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-[#1E2330]">
                <span>{asset.provider}</span>
                <span>{(asset.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
