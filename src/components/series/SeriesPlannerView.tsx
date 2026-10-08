import React, { useState } from 'react';
import { Layers, Sparkles, Plus, Play, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { ContentSeries, Project } from '../../types/index.js';
import { api } from '../../services/api.js';

interface SeriesPlannerViewProps {
  series: ContentSeries[];
  onSelectProjectById: (projectId: string) => void;
  onCreateEpisodeProject: (title: string, prompt: string) => void;
}

export const SeriesPlannerView: React.FC<SeriesPlannerViewProps> = ({
  series,
  onSelectProjectById,
  onCreateEpisodeProject,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<ContentSeries>(series[0]);
  const [newConcept, setNewConcept] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNewSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept.trim()) return;
    setIsGenerating(true);
    try {
      const created = await api.createSeries({
        title: newConcept,
        concept: newConcept,
        totalEpisodes: 5,
        episodes: [
          { id: 'ep-1', episodeNumber: 1, title: 'Episode 1: The Origin', status: 'PLANNED' },
          { id: 'ep-2', episodeNumber: 2, title: 'Episode 2: The Trial of Fire', status: 'PLANNED' },
          { id: 'ep-3', episodeNumber: 3, title: 'Episode 3: Betrayal at Dawn', status: 'PLANNED' },
          { id: 'ep-4', episodeNumber: 4, title: 'Episode 4: The Ancient Army', status: 'PLANNED' },
          { id: 'ep-5', episodeNumber: 5, title: 'Episode 5: The Sovereign Claim', status: 'PLANNED' },
        ],
      });
      setSelectedSeries(created);
      setNewConcept('');
    } catch (err) {
      console.error('Failed to create series:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Layers className="w-4 h-4 text-[#00F0FF]" />
            <span>EPISODIC CONTINUITY ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Content Series Planner</h1>
          <p className="text-xs text-[#94A3B8]">
            Turn one core concept into a high-retention multi-part TikTok series with character and lore continuity.
          </p>
        </div>
      </div>

      {/* Series Selector / Generator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Existing Series & New Concept Input */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
            Active Creator Series
          </span>

          <div className="space-y-2">
            {series.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSeries(s)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSeries?.id === s.id
                    ? 'bg-[#1A1D26] border-[#00F0FF]'
                    : 'bg-[#12141A] border-[#2A2F40] hover:border-[#384055]'
                }`}
              >
                <h3 className="text-sm font-bold text-white">{s.title}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-1 mt-0.5">{s.concept}</p>
                <div className="text-[11px] text-[#00F0FF] font-mono mt-2">
                  {s.episodes.length} Episodes Planned
                </div>
              </div>
            ))}
          </div>

          {/* Quick Create New Series */}
          <form onSubmit={handleGenerateNewSeries} className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-4 space-y-3">
            <span className="text-xs font-semibold text-white block">Propose New Series</span>
            <input
              type="text"
              value={newConcept}
              onChange={e => setNewConcept(e.target.value)}
              placeholder="e.g. Ancient Greek Gods in Modern Tokyo"
              className="w-full bg-[#090A0E] border border-[#2A2F40] focus:border-[#00F0FF] rounded-lg p-2.5 text-xs text-white outline-none"
            />
            <button
              type="submit"
              disabled={isGenerating || !newConcept.trim()}
              className="w-full py-2 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Propose 5-Part Arc</span>
            </button>
          </form>
        </div>

        {/* Right Column: Episode Breakdown & Character Bible Continuity */}
        <div className="md:col-span-2 space-y-4">
          {selectedSeries && (
            <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl p-6 space-y-6">
              <div className="border-b border-[#2A2F40] pb-4">
                <span className="text-xs font-mono text-[#FFB800] uppercase font-bold">SERIES BIBLE</span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedSeries.title}</h2>
                <p className="text-xs text-[#94A3B8] mt-1">{selectedSeries.concept}</p>
              </div>

              {/* Episodes List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
                  Episodes Schedule
                </span>

                {selectedSeries.episodes.map(ep => (
                  <div
                    key={ep.id}
                    className="p-4 bg-[#0A0C10] border border-[#2A2F40] rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#1A1D26] border border-[#2A2F40] flex items-center justify-center font-mono font-bold text-xs text-[#00F0FF]">
                        {ep.episodeNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{ep.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                          <span>Status: {ep.status}</span>
                          {ep.projectId && <span>· Linked to Studio Project</span>}
                        </div>
                      </div>
                    </div>

                    <div>
                      {ep.projectId ? (
                        <button
                          onClick={() => onSelectProjectById(ep.projectId!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-lg text-xs font-semibold"
                        >
                          <Play className="w-3 h-3 text-[#00F0FF]" />
                          <span>Open Project</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onCreateEpisodeProject(
                              ep.title,
                              `Create a 45-second TikTok for ${ep.title} continuing the lore of ${selectedSeries.title}.`
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00F0FF] hover:bg-[#33F3FF] text-black rounded-lg text-xs font-bold shadow-xs shadow-[#00F0FF]/20"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Generate Episode</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
