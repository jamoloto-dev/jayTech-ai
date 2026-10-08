# JayTech AI — Rendering Architecture & FFmpeg Pipeline

## 1. Multi-Tier Rendering Engine
JayTech AI implements a dual rendering strategy:
1. **In-Browser Deterministic Engine**:
   - High-fidelity 1080x1920 (9:16) rendering using HTML5 Canvas 2D + Web Audio API + MediaRecorder.
   - Provides sub-second real-time playback, audio scrubbing, Ken Burns camera zooms, and animated karaoke subtitle overlays directly in the creator's browser.
   - Allows instant video export without server queue delays.

2. **Server-Side FFmpeg Specification**:
   - Constructs deterministic FFmpeg filtergraphs for multi-clip assembly, cross-fades, audio ducking (narration over background music), and burnt-in subtitles (`subtitles.srt`).
   - Generates production-ready publishing bundles:
     - `video.mp4`
     - `cover.jpg`
     - `caption.txt`
     - `hashtags.txt`
     - `script.txt`
     - `subtitles.srt`
     - `metadata.json`

## 2. Sample FFmpeg Command
```bash
ffmpeg -y \
  -loop 1 -t 8.0 -i scene_1.jpg \
  -loop 1 -t 9.5 -i scene_2.jpg \
  -i narration.mp3 \
  -i bg_music.mp3 \
  -filter_complex "\
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0015,1.25)':d=200:s=1080x1920[v0]; \
    [1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0012,1.20)':d=237:s=1080x1920[v1]; \
    [v0][v1]concat=n=2:v=1:a=0[v_concat]; \
    [v_concat]subtitles=subtitles.srt:force_style='FontName=Inter,FontSize=24,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3'[vout]; \
    [2:a]volume=1.0[anarr]; \
    [3:a]volume=0.25[abg]; \
    [anarr][abg]amix=inputs=2:duration=first[aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  output_tiktok.mp4
```
