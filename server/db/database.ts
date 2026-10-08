import {
  User,
  Project,
  Scene,
  BrandKit,
  ContentSeries,
  CalendarItem,
  MediaAsset,
  GenerationJob,
  AnalyticsSummary,
} from '../types/index.js';

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private brandKits: Map<string, BrandKit> = new Map();
  private series: Map<string, ContentSeries> = new Map();
  private calendar: Map<string, CalendarItem> = new Map();
  private media: Map<string, MediaAsset> = new Map();
  private jobs: Map<string, GenerationJob> = new Map();
  private auditLogs: Array<{ id: string; userId: string; action: string; timestamp: string; details: string }> = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed default user
    const defaultUser: User = {
      id: 'user-jafta-creator',
      email: 'moloto.jafta30@gmail.com',
      name: 'Jafta Moloto',
      role: 'CREATOR',
      plan: 'PRO',
      creditsBalance: 4850,
      createdAt: new Date().toISOString(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Seed Admin user
    const adminUser: User = {
      id: 'user-admin',
      email: 'admin@jaytech.ai',
      name: 'JayTech Platform Admin',
      role: 'ADMIN',
      plan: 'ENTERPRISE',
      creditsBalance: 999999,
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // Seed Default Brand Kit with Character Bible
    const defaultBrandKit: BrandKit = {
      id: 'brand-jafta-mythic',
      userId: defaultUser.id,
      name: 'Jafta Mythic Studios',
      channelName: '@JaftaChronicles',
      primaryColor: '#00F0FF',
      secondaryColor: '#FFB800',
      fontFamily: 'Inter',
      preferredVoice: 'Marcus (Deep Cinematic Narrator)',
      captionStyle: 'Cinematic',
      watermarkText: 'JAYTECH AI',
      characterBible: [
        {
          name: 'Jafta',
          description: 'The ancient mortal ruler who claimed sovereignty over the storm skies.',
          appearance: 'Black futuristic warrior with glowing gold storm armor, short fade hair, piercing amber eyes.',
          clothes: 'Gilded celestial aegis breastplate with runic gauntlets crackling with lightning arcs.',
          visualReferences: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.brandKits.set(defaultBrandKit.id, defaultBrandKit);

    // Seed Sample Project: The Rise of Jafta (per specification section 57)
    const jaftaProjectId = 'proj-the-rise-of-jafta';
    const jaftaScenes: Scene[] = [
      {
        id: 'scene-jafta-1',
        projectId: jaftaProjectId,
        sequenceOrder: 1,
        duration: 8,
        narration: 'Before kings ruled the earth, the skies belonged to one name...',
        visualDescription: 'Vast dark storm clouds gathering over an ancient mountain peak. Atmospheric volumetric lightning flash illuminates the silhouette of a warrior.',
        visualPrompt: 'Cinematic 9:16 vertical, massive dark thunderclouds, purple and gold lightning cracks in the sky, distant colossal mountain peak, photorealistic, Unreal Engine 5 render, anamorphic lens, 8k resolution',
        cameraDirection: 'Slow Push In',
        transition: 'Fade to Black',
        soundEffect: 'Low distant thunder rumble and ominous wind',
        backgroundMusicInstruction: 'Deep brass drone with rhythmic heartbeat pulse',
        captionText: 'Before kings ruled the earth...',
        overlayText: 'CHAPTER ONE',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1080&q=80',
        status: 'READY',
      },
      {
        id: 'scene-jafta-2',
        projectId: jaftaProjectId,
        sequenceOrder: 2,
        duration: 9,
        narration: 'Jafta. Born amidst the tempest of the forgotten peaks, he wielded lightning as his will.',
        visualDescription: 'Close-up hero portrait of Jafta. Striking black futuristic warrior with ornate gold sky armor, glowing storm runes on gauntlets.',
        visualPrompt: 'Cinematic 9:16 portrait of Jafta, majestic African warrior king with glowing gold armor and storm energy crackling around his hands, dark atmospheric lighting, masterpiece, hyperdetailed',
        cameraDirection: 'Low Angle Tilt Up',
        transition: 'Cross Dissolve',
        soundEffect: 'Electric arc crackle and metallic gauntlet chime',
        backgroundMusicInstruction: 'Strings swell in minor key, building tension',
        captionText: 'Jafta, ruler of the skies.',
        overlayText: 'THE CHOSEN RULER',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
        status: 'READY',
      },
      {
        id: 'scene-jafta-3',
        projectId: jaftaProjectId,
        sequenceOrder: 3,
        duration: 9,
        narration: 'When the shadow legions marched on the heavens, Jafta stood alone at the summit.',
        visualDescription: 'Wide cinematic perspective showing endless dark armies advancing across a craggy volcanic canyon beneath stormy skies.',
        visualPrompt: 'Cinematic 9:16 wide shot, ancient army of dark shadows marching across rugged mountain pass, torchlight flickering, dramatic mist, epic scale like Lord of the Rings, hyperrealistic',
        cameraDirection: 'Sweeping Aerial Dolly',
        transition: 'Whip Pan',
        soundEffect: 'War horn echo and marching armored footsteps',
        backgroundMusicInstruction: 'Heavy cinematic war drums accelerate',
        captionText: 'Shadow legions march on heaven.',
        overlayText: 'THE CONFLICT',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=80',
        status: 'READY',
      },
      {
        id: 'scene-jafta-4',
        projectId: jaftaProjectId,
        sequenceOrder: 4,
        duration: 10,
        narration: 'With a single strike of celestial fury, the thunder obeyed his command.',
        visualDescription: 'High action shot. Jafta leaping into the air, raising his twin celestial sky-blade as massive golden lightning strikes down directly into his weapon.',
        visualPrompt: 'Cinematic 9:16 action freeze frame, warrior leaping into thunderstorm, holding sky weapon, golden lightning blast striking from clouds into weapon, particles and sparks in 3D, epic climax',
        cameraDirection: 'Dynamic Dutch Angle Zoom',
        transition: 'Flash White',
        soundEffect: 'Massive explosive lightning thunderclap with bass drop',
        backgroundMusicInstruction: 'Full orchestral crescendo with choral choir chanting',
        captionText: 'The thunder obeyed his command.',
        overlayText: 'CELESTIAL POWER',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80',
        status: 'READY',
      },
      {
        id: 'scene-jafta-5',
        projectId: jaftaProjectId,
        sequenceOrder: 5,
        duration: 9,
        narration: 'The skies were forever claimed. Follow for Chapter Two: The War of the Skies.',
        visualDescription: 'Silhouetted triumphant hero standing at the mountain peak overlooking a realm crowned by dawn breaking through retreating storm clouds.',
        visualPrompt: 'Cinematic 9:16 silhouette of victorious warrior at summit, sunrise breaking through clouds with golden god rays, peaceful yet powerful aftermath, cinematic composition',
        cameraDirection: 'Slow Pull Out',
        transition: 'Fade Out',
        soundEffect: 'Gentle morning wind breeze and fading chime',
        backgroundMusicInstruction: 'Heroic resolving melody with lingering acoustic resonance',
        captionText: 'Follow for Chapter Two ⚡️',
        overlayText: 'FOLLOW FOR PART 2',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80',
        status: 'READY',
      },
    ];

    const jaftaProject: Project = {
      id: jaftaProjectId,
      userId: defaultUser.id,
      title: 'The Rise of Jafta: Ruler of the Skies',
      prompt: 'Create a cinematic mythology-style TikTok about Jafta, ruler of the skies. Make the opening mysterious, the narration dramatic and the visuals epic. Duration approximately 45 seconds.',
      format: 'TikTok Vertical (9:16)',
      aspectRatio: '9:16',
      targetDuration: 45,
      status: 'READY',
      creativeBrief: {
        topic: 'Mythology & The Sovereign of Storms',
        targetAudience: 'TikTok mythology enthusiasts, dark fantasy creators, cinematic lore followers',
        videoGoal: 'Achieve viral 3-second hook conversion and high comment discussion around African-mythic heroism',
        tone: 'Cinematic, Dramatic & Mythic',
        style: 'Dark volumetric storm aesthetics with gold celestial highlights',
        durationSeconds: 45,
        aspectRatio: '9:16',
        voice: 'Marcus (Deep Cinematic Narrator)',
        language: 'English (US)',
        contentFormat: 'Mythology Storytelling',
        pacing: 'DYNAMIC',
        sceneCount: 5,
        callToAction: 'Follow for Chapter Two: The War of the Skies.',
        platform: 'TikTok',
      },
      script: {
        hooks: [
          {
            id: 'hook-1',
            type: 'storytelling',
            text: 'Before kings ruled the earth, the skies belonged to one name: Jafta.',
          },
          {
            id: 'hook-2',
            type: 'curiosity_gap',
            text: 'You were told the ancient gods fought with thunder... but they forgot who forged it.',
          },
          {
            id: 'hook-3',
            type: 'bold_question',
            text: 'What happens when the mortal chosen by the heavens refuses to bow to Olympus?',
          },
        ],
        selectedHookIndex: 0,
        mainScript: 'Before kings ruled the earth, the skies belonged to one name: Jafta. Born amidst the tempest of the forgotten peaks, he wielded lightning not as a weapon... but as an extension of his will. When the shadow legions marched on the heavens, Jafta stood alone at the summit. With a single strike of celestial fury, the thunder obeyed his command... and the skies were forever claimed.',
        callToAction: 'Follow for Chapter Two: The War of the Skies.',
        tiktokCaption: 'They tried to erase him from history, but the skies remember Jafta. ⚡️ Who should he battle in Chapter 2? #MythologyTikTok #Jafta #LoreTok #DarkFantasy',
        hashtags: {
          topic: ['#MythologyTikTok', '#AncientGods', '#EpicStory'],
          niche: ['#Jafta', '#Storytelling', '#DarkFantasy'],
          audience: ['#TikTokCreators', '#LoreTok'],
          discovery: ['#ViralVideo', '#MustWatch', '#CinematicShorts'],
        },
        titleOptions: [
          'The Rise of Jafta: Ruler of the Skies',
          'The Forgotten God of Thunder',
          'Before Zeus: The Legend of Jafta',
        ],
        suggestedCoverHeadline: 'THE RULER OF SKIES',
      },
      scenes: jaftaScenes,
      brandKitId: defaultBrandKit.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
      generationHistory: [
        {
          timestamp: new Date().toISOString(),
          stage: 'PIPELINE_COMPLETE',
          details: 'Successfully generated 5 scenes, narrative audio, and 9:16 composition.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(jaftaProject.id, jaftaProject);

    // Seed Episodic Series
    const mythologySeries: ContentSeries = {
      id: 'series-mythology-legends',
      userId: defaultUser.id,
      title: 'The Primordial Sovereigns',
      concept: 'A 5-part cinematic universe exploring the forgotten rulers of the elements.',
      totalEpisodes: 5,
      episodes: [
        {
          id: 'ep-1',
          episodeNumber: 1,
          title: 'Episode 1: The Rise of Jafta (Skies)',
          status: 'READY',
          projectId: jaftaProjectId,
        },
        {
          id: 'ep-2',
          episodeNumber: 2,
          title: 'Episode 2: The Forge of Vulkan (Underworld)',
          status: 'PLANNED',
        },
        {
          id: 'ep-3',
          episodeNumber: 3,
          title: 'Episode 3: The Ocean Abyss (Tides)',
          status: 'PLANNED',
        },
        {
          id: 'ep-4',
          episodeNumber: 4,
          title: 'Episode 4: The Titan of Stone (Earth)',
          status: 'PLANNED',
        },
        {
          id: 'ep-5',
          episodeNumber: 5,
          title: 'Episode 5: The Eclipse War (Finale)',
          status: 'PLANNED',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    this.series.set(mythologySeries.id, mythologySeries);

    // Seed Calendar
    const calendarItem: CalendarItem = {
      id: 'cal-1',
      userId: defaultUser.id,
      projectId: jaftaProjectId,
      projectTitle: 'The Rise of Jafta: Ruler of the Skies',
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      platform: 'TikTok',
      status: 'READY',
    };
    this.calendar.set(calendarItem.id, calendarItem);

    // Seed Media Assets
    const mediaItems: MediaAsset[] = [
      {
        id: 'media-jafta-cover',
        userId: defaultUser.id,
        name: 'jafta_hero_portrait.jpg',
        fileType: 'image',
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
        sizeBytes: 1420800,
        dimensions: '1080x1920',
        provider: 'JayTech Visual Engine',
        generationPrompt: 'Cinematic portrait of Jafta African warrior king with glowing gold armor and storm energy',
        projectId: jaftaProjectId,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'media-storm-clouds',
        userId: defaultUser.id,
        name: 'thunderstorm_mountains.jpg',
        fileType: 'image',
        url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1080&q=80',
        sizeBytes: 1980000,
        dimensions: '1080x1920',
        provider: 'JayTech Visual Engine',
        projectId: jaftaProjectId,
        createdAt: new Date().toISOString(),
      },
    ];
    for (const m of mediaItems) {
      this.media.set(m.id, m);
    }
  }

  // User Methods
  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  // Project Methods
  getAllProjects(userId?: string): Project[] {
    const all = Array.from(this.projects.values());
    if (userId) {
      return all.filter(p => p.userId === userId);
    }
    return all;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.get(id);
  }

  saveProject(project: Project): Project {
    project.updatedAt = new Date().toISOString();
    this.projects.set(project.id, project);
    return project;
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  duplicateProject(id: string, newUserId?: string): Project | null {
    const original = this.projects.get(id);
    if (!original) return null;

    const newId = 'proj-' + Math.random().toString(36).substring(2, 9);
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      userId: newUserId || original.userId,
      title: `${original.title} (Copy)`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scenes: original.scenes.map(s => ({
        ...s,
        id: 'scene-' + Math.random().toString(36).substring(2, 9),
        projectId: newId,
      })),
    };
    this.projects.set(newId, duplicated);
    return duplicated;
  }

  // Jobs
  getJob(id: string): GenerationJob | undefined {
    return this.jobs.get(id);
  }

  saveJob(job: GenerationJob): GenerationJob {
    job.updatedAt = new Date().toISOString();
    this.jobs.set(job.id, job);
    return job;
  }

  getJobsByProject(projectId: string): GenerationJob[] {
    return Array.from(this.jobs.values()).filter(j => j.projectId === projectId);
  }

  // Brand Kits
  getBrandKits(userId: string): BrandKit[] {
    return Array.from(this.brandKits.values()).filter(b => b.userId === userId);
  }

  saveBrandKit(brandKit: BrandKit): BrandKit {
    this.brandKits.set(brandKit.id, brandKit);
    return brandKit;
  }

  // Series
  getSeries(userId: string): ContentSeries[] {
    return Array.from(this.series.values()).filter(s => s.userId === userId);
  }

  saveSeries(series: ContentSeries): ContentSeries {
    this.series.set(series.id, series);
    return series;
  }

  // Calendar
  getCalendarItems(userId: string): CalendarItem[] {
    return Array.from(this.calendar.values()).filter(c => c.userId === userId);
  }

  saveCalendarItem(item: CalendarItem): CalendarItem {
    this.calendar.set(item.id, item);
    return item;
  }

  // Media
  getMediaAssets(userId: string): MediaAsset[] {
    return Array.from(this.media.values()).filter(m => m.userId === userId);
  }

  saveMediaAsset(asset: MediaAsset): MediaAsset {
    this.media.set(asset.id, asset);
    return asset;
  }

  // Audit Logs
  logAudit(userId: string, action: string, details: string) {
    this.auditLogs.push({
      id: 'audit-' + Math.random().toString(36).substring(2, 9),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    if (this.auditLogs.length > 500) {
      this.auditLogs.shift();
    }
  }

  getAuditLogs(): Array<{ id: string; userId: string; action: string; timestamp: string; details: string }> {
    return this.auditLogs.slice(-100);
  }

  // Analytics
  getAnalyticsSummary(userId: string): AnalyticsSummary {
    const projects = this.getAllProjects(userId);
    const completed = projects.filter(p => p.status === 'READY');
    return {
      videosCreated: projects.length,
      videosCompleted: completed.length,
      totalRenderSeconds: completed.reduce((sum, p) => sum + (p.targetDuration || 45), 0),
      totalAiCreditsUsed: projects.length * 150,
      averageGenerationTimeSeconds: 14.8,
      providerSuccessRate: 98.6,
      recentUsageLedger: [
        {
          id: 'ledger-1',
          feature: 'Script & Hook Engine',
          units: 1450,
          creditsDeducted: 15,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'ledger-2',
          feature: 'Storyboard Decomposition',
          units: 5,
          creditsDeducted: 25,
          timestamp: new Date(Date.now() - 3500000).toISOString(),
        },
        {
          id: 'ledger-3',
          feature: 'Visual Scene Generation (5x 9:16)',
          units: 5,
          creditsDeducted: 75,
          timestamp: new Date(Date.now() - 3400000).toISOString(),
        },
        {
          id: 'ledger-4',
          feature: 'Voiceover & Caption Alignment',
          units: 45,
          creditsDeducted: 35,
          timestamp: new Date(Date.now() - 3300000).toISOString(),
        },
      ],
    };
  }
}

export const db = new InMemoryDatabase();
