import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle2, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { CalendarItem } from '../../types/index.js';

interface CalendarViewProps {
  items: CalendarItem[];
  onSelectItem: (projectId?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ items, onSelectItem }) => {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'list'>('week');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <Calendar className="w-4 h-4 text-[#00F0FF]" />
            <span>EDITORIAL PUBLISHING CALENDAR</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Multi-Platform Content Schedule</h1>
        </div>

        {/* View Mode Tabs (following Zero-Pill interactive segmented control discipline) */}
        <div className="flex items-center gap-1 p-1 bg-[#12141A] border border-[#2A2F40] rounded-lg">
          {(['week', 'month', 'list'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? 'bg-[#1A1D26] text-white shadow-xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Week Grid View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day, idx) => {
            const dayItems = items.filter((_, i) => i % 7 === idx);
            return (
              <div key={day} className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-3 min-h-[220px] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] uppercase block mb-2">{day}</span>
                  <div className="space-y-2">
                    {dayItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item.projectId)}
                        className="p-2.5 bg-[#0A0C10] border border-[#2A2F40] hover:border-[#00F0FF]/50 rounded-lg cursor-pointer transition-all space-y-1"
                      >
                        <span className="text-[10px] text-[#00F0FF] font-mono uppercase block">{item.platform}</span>
                        <h4 className="text-xs font-bold text-white line-clamp-2">{item.projectTitle}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-[#FFB800]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-1 text-[11px] text-[#64748B] hover:text-white border border-dashed border-[#2A2F40] hover:border-[#384055] rounded-md transition-colors flex items-center justify-center gap-1 mt-3">
                  <Plus className="w-3 h-3" />
                  <span>Slot Video</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {(viewMode === 'list' || viewMode === 'month') && (
        <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl divide-y divide-[#1E2330] overflow-hidden">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.projectId)}
              className="p-4 hover:bg-[#161822] cursor-pointer transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1A1D26] border border-[#2A2F40] flex items-center justify-center text-[#00F0FF]">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.projectTitle}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>{item.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span>Scheduled: {item.scheduledDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#10B981] font-mono font-medium">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
