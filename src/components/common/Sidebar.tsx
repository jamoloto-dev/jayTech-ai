import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Film,
  Flame,
  Layers,
  Calendar,
  Palette,
  Image as ImageIcon,
  BarChart3,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Video', icon: Sparkles, accent: true },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'editor', label: 'Timeline Editor', icon: Film },
    { id: 'tiktok', label: 'TikTok Engine', icon: Flame },
    { id: 'series', label: 'Content Series', icon: Layers },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'brand', label: 'Brand Kits', icon: Palette },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics & Usage', icon: BarChart3 },
    { id: 'admin', label: 'Admin Telemetry', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-30 w-64 h-full md:h-[calc(100vh-4rem)] bg-[#101217] border-r border-[#2A2F40] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col p-4 gap-6 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-[#2A2F40]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">Navigation</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
              Creator Studio
            </span>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1A1D26] text-white border-l-2 border-[#00F0FF] shadow-xs'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#151821]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-[#00F0FF]'
                          : item.accent
                          ? 'text-[#FFB800]'
                          : 'text-[#64748B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.accent && !isActive && (
                    <span className="text-[10px] text-[#00F0FF] font-mono">NEW</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Studio Health Card */}
        <div className="p-4 border-t border-[#2A2F40] bg-[#0C0E12]/60">
          <div className="flex items-center justify-between mb-1.5 text-xs text-[#94A3B8]">
            <span>AI Pipeline</span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>Operational</span>
            </div>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono truncate">
            Model: Gemini 3.8 Flash
          </div>
        </div>
      </aside>
    </>
  );
};
