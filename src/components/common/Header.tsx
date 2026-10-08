import React from 'react';
import {
  Sparkles,
  Video,
  Wand2,
  Menu,
  LogIn,
  LogOut,
  Radio,
  Image as ImageIcon,
  Music,
  Globe,
  Database,
} from 'lucide-react';
import { User, Project } from '../../types/index.js';
import { signInWithGoogle, logOut, FirebaseUser } from '../../services/firebase.js';

interface HeaderProps {
  user: User;
  firebaseUser: FirebaseUser | null;
  currentProject: Project | null;
  activeTab: string;
  onOpenCopilot: () => void;
  onToggleMobileNav: () => void;
  onNewProject: () => void;
  isLandingMode: boolean;
  onToggleLanding: () => void;
  onOpenVeo: () => void;
  onOpenImageStudio: () => void;
  onOpenMusicStudio: () => void;
  onOpenSearchGrounding: () => void;
  onOpenLiveVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  firebaseUser,
  currentProject,
  activeTab,
  onOpenCopilot,
  onToggleMobileNav,
  onNewProject,
  isLandingMode,
  onToggleLanding,
  onOpenVeo,
  onOpenImageStudio,
  onOpenMusicStudio,
  onOpenSearchGrounding,
  onOpenLiveVoice,
}) => {
  const handleAuth = async () => {
    if (firebaseUser) {
      await logOut();
    } else {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.warn('Google sign-in popup note:', err);
      }
    }
  };

  return (
    <header className="h-16 border-b border-[#2A2F40] bg-[#12141A] px-3 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#F0F3F8] focus-visible:ring-2 focus-visible:ring-[#00F0FF] rounded-lg"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onToggleLanding}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#0088FF] flex items-center justify-center shadow-lg shadow-[#00F0FF]/20">
            <Video className="w-4 h-4 text-black font-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">JAYTECH</span>
              <span className="text-[#00F0FF] font-black text-xs tracking-wider">AI</span>
            </div>
            <span className="text-[10px] text-[#64748B] hidden sm:block tracking-wide font-medium">STUDIO V1.0</span>
          </div>
        </div>

        {/* Context Breadcrumb */}
        {currentProject && !isLandingMode && (
          <div className="hidden xl:flex items-center gap-2 pl-4 ml-4 border-l border-[#2A2F40] text-xs text-[#94A3B8]">
            <span className="text-[#64748B]">Project</span>
            <span aria-hidden="true">/</span>
            <span className="text-white font-medium truncate max-w-[180px]">{currentProject.title}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00F0FF] uppercase text-[11px] font-mono tracking-wider">{currentProject.status}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Quick AI Tool Triggers */}
        {!isLandingMode && (
          <div className="hidden md:flex items-center gap-1.5 pr-2 border-r border-[#2A2F40]">
            <button
              onClick={onOpenLiveVoice}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#1A1D26] hover:bg-[#252A38] border border-[#2A2F40] rounded-lg transition-colors"
              title="Real-time Voice Conversation with gemini-3.8-live"
            >
              <Radio className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
              <span className="hidden lg:inline">Live Voice</span>
            </button>

            <button
              onClick={onOpenVeo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#1A1D26] hover:bg-[#252A38] border border-[#2A2F40] rounded-lg transition-colors"
              title="Animate Images to Video with Veo"
            >
              <Video className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="hidden lg:inline">Veo Video</span>
            </button>

            <button
              onClick={onOpenSearchGrounding}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#1A1D26] hover:bg-[#252A38] border border-[#2A2F40] rounded-lg transition-colors"
              title="Google Search Grounding"
            >
              <Globe className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="hidden lg:inline">Search Grounding</span>
            </button>

            <button
              onClick={onOpenMusicStudio}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#1A1D26] hover:bg-[#252A38] border border-[#2A2F40] rounded-lg transition-colors"
              title="Generate Music with Lyria"
            >
              <Music className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="hidden lg:inline">Lyria Music</span>
            </button>

            <button
              onClick={onOpenImageStudio}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#1A1D26] hover:bg-[#252A38] border border-[#2A2F40] rounded-lg transition-colors"
              title="Create & Edit Images"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden lg:inline">Images</span>
            </button>
          </div>
        )}

        {/* Toggle Landing / App Mode */}
        <button
          onClick={onToggleLanding}
          className="text-xs text-[#94A3B8] hover:text-white px-2.5 py-1.5 rounded-lg border border-[#2A2F40] hover:border-[#384055] transition-colors"
        >
          {isLandingMode ? 'Enter Studio' : 'Landing'}
        </button>

        {/* AI Copilot Trigger */}
        {!isLandingMode && (
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#00F0FF] bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 rounded-lg transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copilot</span>
          </button>
        )}

        {/* Quick New Video */}
        {!isLandingMode && (
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-black bg-[#00F0FF] hover:bg-[#33F3FF] rounded-lg transition-all shadow-sm shadow-[#00F0FF]/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Video</span>
          </button>
        )}

        {/* Firebase Authentication & User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#2A2F40]">
          {firebaseUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-white truncate max-w-[120px]">
                  {firebaseUser.displayName || firebaseUser.email || user.name}
                </span>
                <span className="text-[10px] text-[#10B981] font-mono flex items-center justify-end gap-1">
                  <Database className="w-2.5 h-2.5" />
                  Firestore Synced
                </span>
              </div>
              <img
                src={firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-lg border border-[#00F0FF] object-cover"
              />
              <button
                onClick={handleAuth}
                className="p-1.5 text-[#94A3B8] hover:text-red-400 rounded-lg transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1D26] hover:bg-[#252A38] text-white border border-[#2A2F40] rounded-lg text-xs font-medium transition-colors"
              title="Sign in with Google via Firebase Auth"
            >
              <LogIn className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span className="hidden sm:inline">Google Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
