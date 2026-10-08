import { Project, Scene } from '../types/index.js';

export interface TimelineTrack {
  id: string;
  type: 'video' | 'narration' | 'music' | 'captions' | 'overlay';
  clips: Array<{
    sceneId: string;
    startTime: number;
    duration: number;
    sourceUrl?: string;
    label: string;
  }>;
}

export interface CompositionTimeline {
  projectId: string;
  aspectRatio: string;
  width: number;
  height: number;
  totalDurationSeconds: number;
  tracks: TimelineTrack[];
  ffmpegFiltergraph: string;
  ffmpegCommandLine: string;
}

export function buildDeterministicTimeline(project: Project): CompositionTimeline {
  const scenes = [...project.scenes].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  let currentTime = 0;

  const videoClips: TimelineTrack['clips'] = [];
  const narrationClips: TimelineTrack['clips'] = [];
  const captionClips: TimelineTrack['clips'] = [];

  scenes.forEach(scene => {
    videoClips.push({
      sceneId: scene.id,
      startTime: currentTime,
      duration: scene.duration,
      sourceUrl: scene.mediaUrl,
      label: `Scene ${scene.sequenceOrder} - ${scene.cameraDirection}`,
    });

    narrationClips.push({
      sceneId: scene.id,
      startTime: currentTime,
      duration: scene.duration,
      sourceUrl: scene.voiceoverUrl,
      label: scene.narration.slice(0, 30) + '...',
    });

    captionClips.push({
      sceneId: scene.id,
      startTime: currentTime,
      duration: scene.duration,
      label: scene.captionText,
    });

    currentTime += scene.duration;
  });

  const totalDuration = currentTime;
  const filtergraph = scenes
    .map((s, idx) => `[${idx}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0015,1.25)':d=${Math.round(s.duration * 25)}:s=1080x1920[v${idx}]`)
    .join(';\n');

  const concatLine = scenes.map((_, idx) => `[v${idx}]`).join('') + `concat=n=${scenes.length}:v=1:a=0[vout]`;

  const ffmpegCommandLine = `ffmpeg -y ${scenes.map((s, idx) => `-loop 1 -t ${s.duration} -i scene_${idx + 1}.jpg`).join(' ')} -filter_complex "${filtergraph}; ${concatLine}" -map "[vout]" -c:v libx264 -pix_fmt yuv420p output_9x16.mp4`;

  return {
    projectId: project.id,
    aspectRatio: project.aspectRatio || '9:16',
    width: 1080,
    height: 1920,
    totalDurationSeconds: totalDuration,
    tracks: [
      { id: 'track-video', type: 'video', clips: videoClips },
      { id: 'track-narration', type: 'narration', clips: narrationClips },
      {
        id: 'track-music',
        type: 'music',
        clips: [
          {
            sceneId: 'bg-music',
            startTime: 0,
            duration: totalDuration,
            label: 'Atmospheric Cinematic Synth & Drums',
          },
        ],
      },
      { id: 'track-captions', type: 'captions', clips: captionClips },
    ],
    ffmpegFiltergraph: filtergraph,
    ffmpegCommandLine,
  };
}

export function generateSrtSubtitles(scenes: Scene[]): string {
  let currentTime = 0;
  const srtBlocks: string[] = [];

  scenes.forEach((scene, index) => {
    const startSec = currentTime;
    const endSec = currentTime + scene.duration;
    currentTime = endSec;

    const formatTimestamp = (sec: number) => {
      const h = Math.floor(sec / 3600).toString().padStart(2, '0');
      const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(sec % 60).toString().padStart(2, '0');
      const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
      return `${h}:${m}:${s},${ms}`;
    };

    srtBlocks.push(`${index + 1}\n${formatTimestamp(startSec)} --> ${formatTimestamp(endSec)}\n${scene.captionText || scene.narration}\n`);
  });

  return srtBlocks.join('\n');
}

export function buildPublishingPackage(project: Project) {
  const hashtagsFormatted = [
    ...(project.script?.hashtags.topic || []),
    ...(project.script?.hashtags.niche || []),
    ...(project.script?.hashtags.discovery || []),
  ].join(' ');

  return {
    title: project.title,
    caption: project.script?.tiktokCaption || project.title,
    hashtags: hashtagsFormatted,
    scriptText: project.script?.mainScript || project.scenes.map(s => s.narration).join(' '),
    callToAction: project.script?.callToAction || 'Follow for part 2!',
    subtitlesSrt: generateSrtSubtitles(project.scenes),
    coverHeadline: project.script?.suggestedCoverHeadline || project.title,
    thumbnailUrl: project.thumbnailUrl,
    videoUrl: project.renderedVideoUrl || '/assets/rendered-output.mp4',
    metadataJson: JSON.stringify(
      {
        platform: 'TikTok',
        aspectRatio: '9:16',
        targetDuration: project.targetDuration,
        scenesCount: project.scenes.length,
        brandKitId: project.brandKitId,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
  };
}
