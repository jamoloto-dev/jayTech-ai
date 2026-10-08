import React, { useState, useEffect } from 'react';
import { User, Project, BrandKit, ContentSeries, CalendarItem, MediaAsset, AnalyticsSummary } from './types/index.js';
import { api } from './services/api.js';
import { auth, onAuthStateChanged, FirebaseUser, db } from './services/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Header } from './components/common/Header.js';
import { Sidebar } from './components/common/Sidebar.js';
import { DashboardView } from './components/dashboard/DashboardView.js';
import { StudioWizard } from './components/studio/StudioWizard.js';
import { VideoEditorView } from './components/editor/VideoEditorView.js';
import { TikTokAssistant } from './components/tiktok/TikTokAssistant.js';
import { SeriesPlannerView } from './components/series/SeriesPlannerView.js';
import { CalendarView } from './components/calendar/CalendarView.js';
import { BrandKitView } from './components/brand/BrandKitView.js';
import { MediaLibraryView } from './components/media/MediaLibraryView.js';
import { AnalyticsView } from './components/analytics/AnalyticsView.js';
import { AdminView } from './components/admin/AdminView.js';
import { ProjectsView } from './components/projects/ProjectsView.js';
import { JayTechCopilotDrawer } from './components/assistant/JayTechCopilotDrawer.js';
import { LandingPageView } from './components/landing/LandingPageView.js';
import { VeoVideoModal } from './components/tools/VeoVideoModal.js';
import { ImageStudioModal } from './components/tools/ImageStudioModal.js';
import { LyriaMusicModal } from './components/tools/LyriaMusicModal.js';
import { SearchGroundingModal } from './components/tools/SearchGroundingModal.js';
import { LiveVoiceModal } from './components/tools/LiveVoiceModal.js';

export default function App() {
  const [user, setUser] = useState<User>({
    id: 'user-jafta-creator',
    email: 'moloto.jafta30@gmail.com',
    name: 'Jafta Moloto',
    role: 'CREATOR',
    plan: 'PRO',
    creditsBalance: 4850,
    createdAt: new Date().toISOString(),
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLandingMode, setIsLandingMode] = useState(false);

  // Advanced AI Tool Modals
  const [isVeoOpen, setIsVeoOpen] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [isMusicStudioOpen, setIsMusicStudioOpen] = useState(false);
  const [isSearchGroundingOpen, setIsSearchGroundingOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Additional Data
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [series, setSeries] = useState<ContentSeries[]>([]);
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setUser(prev => ({
          ...prev,
          id: fbUser.uid,
          email: fbUser.email || prev.email,
          name: fbUser.displayName || prev.name,
        }));

        // Persist/Sync user profile in Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          await setDoc(
            userRef,
            {
              id: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName,
              photoURL: fbUser.photoURL,
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Firestore user profile sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [projs, kits, ser, cal, med, anal] = await Promise.all([
        api.getProjects(),
        api.getBrandKits(),
        api.getSeries(),
        api.getCalendar(),
        api.getMedia(),
        api.getAnalytics(),
      ]);
      setProjects(projs);
      if (projs.length > 0 && !currentProject) {
        const jafta = projs.find(p => p.id === 'proj-the-rise-of-jafta') || projs[0];
        setCurrentProject(jafta);
      }
      setBrandKits(kits);
      setSeries(ser);
      setCalendar(cal);
      setMedia(med);
      setAnalytics(anal);
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync active project changes to Firestore when user is authenticated
  const syncProjectToFirestore = async (p: Project) => {
    if (!firebaseUser) return;
    try {
      const projRef = doc(db, 'projects', p.id);
      await setDoc(projRef, { ...p, userId: firebaseUser.uid, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Firestore project save notice:', err);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setActiveTab('editor');
  };

  const handleStartNewProject = (promptText?: string) => {
    if (promptText) {
      api
        .createProject({
          title: promptText.slice(0, 30) + '...',
          prompt: promptText,
          format: 'TikTok Vertical (9:16)',
          targetDuration: 45,
          aspectRatio: '9:16',
        })
        .then(newProj => {
          setProjects(prev => [newProj, ...prev]);
          setCurrentProject(newProj);
          setActiveTab('create');
          syncProjectToFirestore(newProj);
        });
    } else {
      setCurrentProject(null);
      setActiveTab('create');
    }
  };

  // Add generated Veo video to active scene
  const handleAddVeoVideo = (videoUrl: string, prompt: string) => {
    if (!currentProject || currentProject.scenes.length === 0) return;
    const newScenes = [...currentProject.scenes];
    newScenes[0] = {
      ...newScenes[0],
      mediaUrl: videoUrl,
      mediaType: 'video',
      visualPrompt: prompt,
    };
    const updated = { ...currentProject, scenes: newScenes };
    setCurrentProject(updated);
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    api.updateProject(currentProject.id, { scenes: newScenes });
    syncProjectToFirestore(updated);
  };

  // Apply generated Image to active scene
  const handleApplyImage = (imageUrl: string) => {
    if (!currentProject || currentProject.scenes.length === 0) return;
    const newScenes = [...currentProject.scenes];
    newScenes[0] = {
      ...newScenes[0],
      mediaUrl: imageUrl,
      mediaType: 'image',
    };
    const updated = { ...currentProject, scenes: newScenes };
    setCurrentProject(updated);
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    api.updateProject(currentProject.id, { scenes: newScenes });
    syncProjectToFirestore(updated);
  };

  return (
    <div className="min-h-screen bg-[#090A0E] text-[#F0F3F8] font-sans antialiased selection:bg-[#00F0FF]/30 selection:text-white flex flex-col">
      {/* Top Universal Header */}
      <Header
        user={user}
        firebaseUser={firebaseUser}
        currentProject={currentProject}
        activeTab={activeTab}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        onNewProject={() => handleStartNewProject()}
        isLandingMode={isLandingMode}
        onToggleLanding={() => setIsLandingMode(!isLandingMode)}
        onOpenVeo={() => setIsVeoOpen(true)}
        onOpenImageStudio={() => setIsImageStudioOpen(true)}
        onOpenMusicStudio={() => setIsMusicStudioOpen(true)}
        onOpenSearchGrounding={() => setIsSearchGroundingOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />

      {isLandingMode ? (
        <LandingPageView
          onEnterStudio={prompt => {
            setIsLandingMode(false);
            if (prompt) {
              const jafta = projects.find(p => p.id === 'proj-the-rise-of-jafta');
              if (jafta && prompt.toLowerCase().includes('jafta')) {
                setCurrentProject(jafta);
                setActiveTab('editor');
              } else {
                handleStartNewProject(prompt);
              }
            } else {
              setActiveTab('dashboard');
            }
          }}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isOpenMobile={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                projects={projects}
                analytics={analytics}
                onSelectProject={handleSelectProject}
                onStartNewProject={handleStartNewProject}
                onNavigateTab={setActiveTab}
                onOpenVeo={() => setIsVeoOpen(true)}
                onOpenImageStudio={() => setIsImageStudioOpen(true)}
                onOpenMusicStudio={() => setIsMusicStudioOpen(true)}
                onOpenSearchGrounding={() => setIsSearchGroundingOpen(true)}
                onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
              />
            )}

            {activeTab === 'create' && (
              <StudioWizard
                initialProject={currentProject}
                onFinish={p => {
                  setCurrentProject(p);
                  setActiveTab('editor');
                  syncProjectToFirestore(p);
                }}
                onOpenEditor={p => {
                  setCurrentProject(p);
                  setActiveTab('editor');
                }}
                onOpenTikTokEngine={p => {
                  setCurrentProject(p);
                  setActiveTab('tiktok');
                }}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsView
                projects={projects}
                onSelectProject={handleSelectProject}
                onNewProject={() => handleStartNewProject()}
                onRefreshProjects={loadData}
              />
            )}

            {activeTab === 'editor' && currentProject && (
              <VideoEditorView
                project={currentProject}
                onUpdateProject={p => {
                  setCurrentProject(p);
                  setProjects(prev => prev.map(item => (item.id === p.id ? p : item)));
                  syncProjectToFirestore(p);
                }}
                onOpenTikTokEngine={() => setActiveTab('tiktok')}
              />
            )}

            {activeTab === 'tiktok' && currentProject && (
              <TikTokAssistant
                project={currentProject}
                onUpdateProject={p => {
                  setCurrentProject(p);
                  setProjects(prev => prev.map(item => (item.id === p.id ? p : item)));
                  syncProjectToFirestore(p);
                }}
              />
            )}

            {activeTab === 'series' && (
              <SeriesPlannerView
                series={series}
                onSelectProjectById={id => {
                  const target = projects.find(p => p.id === id);
                  if (target) handleSelectProject(target);
                }}
                onCreateEpisodeProject={(title, prompt) => handleStartNewProject(prompt)}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                items={calendar}
                onSelectItem={projId => {
                  if (projId) {
                    const target = projects.find(p => p.id === projId);
                    if (target) handleSelectProject(target);
                  }
                }}
              />
            )}

            {activeTab === 'brand' && <BrandKitView brandKits={brandKits} />}

            {activeTab === 'media' && <MediaLibraryView assets={media} />}

            {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}

            {activeTab === 'admin' && <AdminView />}
          </main>
        </div>
      )}

      {/* AI Copilot Drawer */}
      <JayTechCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentProject={currentProject}
      />

      {/* Advanced AI Tool Modals */}
      <VeoVideoModal
        isOpen={isVeoOpen}
        onClose={() => setIsVeoOpen(false)}
        onAddVideoToProject={handleAddVeoVideo}
      />

      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
        onApplyImage={handleApplyImage}
      />

      <LyriaMusicModal
        isOpen={isMusicStudioOpen}
        onClose={() => setIsMusicStudioOpen(false)}
      />

      <SearchGroundingModal
        isOpen={isSearchGroundingOpen}
        onClose={() => setIsSearchGroundingOpen(false)}
        onUseAsPrompt={prompt => handleStartNewProject(prompt)}
      />

      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />
    </div>
  );
}
