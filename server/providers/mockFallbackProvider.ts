import { LLMProvider, BriefGenerationOptions, ImageGenerationProvider, SpeechProvider, GeneratedAssetResult } from './interfaces.js';
import { CreativeBrief, ScriptPackage, Scene } from '../types/index.js';

export class MockFallbackProvider implements LLMProvider, ImageGenerationProvider, SpeechProvider {
  public name = 'JayTech Deterministic Fallback Engine';

  async generateBrief(prompt: string, options?: BriefGenerationOptions): Promise<CreativeBrief> {
    const isJafta = prompt.toLowerCase().includes('jafta') || prompt.toLowerCase().includes('zeus');
    return {
      topic: isJafta ? 'Mythology & The Rise of Jafta' : (prompt.slice(0, 40) + '...'),
      targetAudience: 'Curiosity-driven TikTok & Reels viewers, mythology fans, dramatic storytelling lovers',
      videoGoal: 'Maximize 3-second hook retention and trigger watch-through completion with dramatic payoff',
      tone: options?.tone || 'Cinematic, Dramatic & Mythic',
      style: 'Ultra-cinematic photoreal with volumetric storm lighting and gold accents',
      durationSeconds: options?.duration || 45,
      aspectRatio: '9:16',
      voice: 'Marcus (Deep Cinematic Narrator)',
      language: 'English (US)',
      contentFormat: options?.format || 'Mythology Storytelling',
      pacing: 'DYNAMIC',
      sceneCount: 5,
      callToAction: 'Follow for Chapter Two: The War of the Skies.',
      platform: (options?.targetPlatform as 'TikTok' | 'YouTube Shorts' | 'Instagram Reels') || 'TikTok',
    };
  }

  async generateScript(prompt: string, brief: CreativeBrief): Promise<ScriptPackage> {
    const isJafta = prompt.toLowerCase().includes('jafta') || brief.topic.toLowerCase().includes('jafta');

    if (isJafta) {
      return {
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
        tiktokCaption: 'They rewrote mythology, but they could never erase Jafta. ⚡️ Who should he battle next? #MythologyTikTok #Storytime',
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
      };
    }

    return {
      hooks: [
        {
          id: 'hook-1',
          type: 'curiosity_gap',
          text: `You probably didn't know the real story behind this...`,
        },
        {
          id: 'hook-2',
          type: 'surprising_fact',
          text: `In less than 60 seconds, this one revelation will change how you see history.`,
        },
        {
          id: 'hook-3',
          type: 'bold_question',
          text: `Why is almost everyone getting this completely wrong?`,
        },
      ],
      selectedHookIndex: 0,
      mainScript: `${prompt}. It began when ordinary conventions were challenged by an extraordinary spark of genius. Through discipline and fearless execution, the impossible became inevitable. And when the final moment arrived, the world stood in awe.`,
      callToAction: 'Drop your thoughts below and follow for part two!',
      tiktokCaption: `The untold story you need to hear today. 👇 Comment what we should cover next!`,
      hashtags: {
        topic: ['#DeepDive', '#Storytelling', '#DidYouKnow'],
        niche: ['#Creators', '#Shorts', '#Inspiration'],
        audience: ['#LearnOnTikTok', '#MindBlown'],
        discovery: ['#Viral', '#ForYou', '#Trending'],
      },
      titleOptions: [
        `The Truth About ${prompt.slice(0, 25)}`,
        `How It Really Happened`,
        `The 45-Second Masterclass`,
      ],
      suggestedCoverHeadline: 'THE UNTOLD STORY',
    };
  }

  async decomposeStoryboard(script: ScriptPackage, brief: CreativeBrief): Promise<Omit<Scene, 'id' | 'projectId' | 'status'>[]> {
    const isJafta = brief.topic.toLowerCase().includes('jafta') || script.mainScript.toLowerCase().includes('jafta');

    if (isJafta) {
      return [
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
        {
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
        },
      ];
    }

    const sceneCount = brief.sceneCount || 4;
    const sceneDuration = Math.round(brief.durationSeconds / sceneCount);
    const scenes: Omit<Scene, 'id' | 'projectId' | 'status'>[] = [];

    for (let i = 1; i <= sceneCount; i++) {
      scenes.push({
        sequenceOrder: i,
        duration: sceneDuration,
        narration: `Scene ${i}: Continuing the core narrative with high impact visual cues.`,
        visualDescription: `Cinematic composition illustrating phase ${i} of the story with atmospheric lighting.`,
        visualPrompt: `9:16 vertical high quality visual, cinematic lighting, ultra-detailed render depicting scene ${i}, professional photography, 4k`,
        cameraDirection: i % 2 === 0 ? 'Slow Push In' : 'Gentle Pan Right',
        transition: 'Cross Dissolve',
        soundEffect: 'Subtle atmospheric riser',
        backgroundMusicInstruction: 'Modern synth tension loop with rhythmic percussion',
        captionText: `Key insight for moment ${i}`,
        overlayText: `PART ${i}`,
        mediaType: 'image',
        mediaUrl: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&w=1080&q=80`,
      });
    }

    return scenes;
  }

  async chatAssistant(message: string): Promise<string> {
    const q = message.toLowerCase();
    if (q.includes('hook')) {
      return "For maximum 3-second retention on TikTok, open with an unsolved curiosity gap: 'What the history books never told you about this will shake your understanding.' Keep the text under 8 words on screen.";
    }
    if (q.includes('intense') || q.includes('dramatic')) {
      return "To increase dramatic tension: Shorten scene durations by 1.5 seconds, switch camera direction to a Fast Low-Angle Push In, and add a thunderous bass-drop sound effect on the visual transition.";
    }
    return `JayTech AI creative analysis: To optimize this video for TikTok, ensure your visual cuts happen every 2 to 3 seconds and align the voiceover cadence with animated kinetic captions.`;
  }

  async generateTikTokMetadata(title: string, scriptText: string): Promise<{
    caption: string;
    hashtags: string[];
    hooks: string[];
    cta: string;
  }> {
    return {
      caption: `Watch till the end to see how ${title} unfolded. Which part surprised you most?`,
      hashtags: ['#TikTokShorts', '#Storytelling', '#ViralReels', '#TrendingHistory', '#CinematicVideo'],
      hooks: [
        'Nobody expected this twist...',
        'The one detail that changed everything:',
        'Stop scrolling if you love mythic stories.',
      ],
      cta: 'Follow for Part Two!',
    };
  }

  async generateSceneVisual(prompt: string, style: string): Promise<GeneratedAssetResult> {
    const sampleImages = [
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=80',
    ];
    const randomIndex = Math.floor(Math.random() * sampleImages.length);
    return {
      url: sampleImages[randomIndex],
      provider: 'Procedural Scene Asset Engine',
      width: 1080,
      height: 1920,
      format: 'image/jpeg',
    };
  }

  async synthesizeNarration(text: string, voiceName: string, speed: number = 1.0): Promise<{
    audioUrl: string;
    durationSeconds: number;
    wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  }> {
    const words = text.split(/\s+/).filter(Boolean);
    const avgWordSeconds = 0.35 / speed;
    const durationSeconds = Math.max(2, words.length * avgWordSeconds);

    let currentTime = 0;
    const wordTimestamps = words.map(word => {
      const start = parseFloat(currentTime.toFixed(2));
      currentTime += avgWordSeconds;
      const end = parseFloat(currentTime.toFixed(2));
      return { word, start, end };
    });

    return {
      audioUrl: '/assets/sample-narration.mp3',
      durationSeconds: parseFloat(durationSeconds.toFixed(2)),
      wordTimestamps,
    };
  }

  async searchGrounding(query: string): Promise<{
    text: string;
    sources: Array<{ title: string; url: string }>;
  }> {
    return {
      text: `Researched trends and verified lore for "${query}": High engagement on TikTok for cinematic mythic origins, 3-second tension hooks, and contrasting dark-gold color palettes. Key historical & mythological anchor verified.`,
      sources: [
        { title: 'Mythology & Ancient Lore Encyclopedia', url: 'https://en.wikipedia.org/wiki/Mythology' },
        { title: 'Short-Form Video Viral Trends 2026', url: 'https://tiktok.com/creators' },
      ],
    };
  }

  async createOrEditImage(prompt: string): Promise<{
    imageUrl: string;
    prompt: string;
  }> {
    return {
      imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80',
      prompt,
    };
  }

  async animateImageToVideo(prompt: string, inputImageBase64?: string, aspectRatio: '16:9' | '9:16' = '9:16'): Promise<{
    videoUrl: string;
    duration: number;
    aspectRatio: '16:9' | '9:16';
  }> {
    return {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 5,
      aspectRatio,
    };
  }

  async generateMusic(prompt: string, durationSeconds: number = 30): Promise<{
    audioUrl: string;
    duration: number;
    title: string;
  }> {
    return {
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/wind_through_trees.ogg',
      duration: durationSeconds,
      title: `${prompt.slice(0, 25)} (Cinematic Score)`,
    };
  }

  async liveVoiceChat(message: string): Promise<{
    replyText: string;
  }> {
    return {
      replyText: `I heard you! For "${message}", I recommend tightening the opening 3-second hook and adding an electric lighting flash right before the narration climax.`,
    };
  }
}

