# JayTech AI — Database Architecture & Schema

## 1. Overview
The database layer uses UUID primary keys, UTC timestamp auditing, foreign key constraints, indexes for query performance, and soft-delete capabilities where justified. It operates seamlessly on SQLite for instant local development and test automation, and scales to PostgreSQL in production environments.

## 2. Core Entities

### `users`
- `id` (UUID, Primary Key)
- `email` (VARCHAR 255, Unique, Indexed)
- `password_hash` (VARCHAR 255)
- `name` (VARCHAR 100)
- `role` (VARCHAR 20, Default 'CREATOR') - Values: `USER`, `CREATOR`, `ADMIN`
- `plan` (VARCHAR 20, Default 'CREATOR_PRO') - Values: `FREE`, `CREATOR`, `PRO`, `ENTERPRISE`
- `credits_balance` (INTEGER, Default 1000)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `projects`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Indexed)
- `title` (VARCHAR 255)
- `prompt` (TEXT)
- `format` (VARCHAR 50) - E.g. 'TikTok Vertical (9:16)'
- `aspect_ratio` (VARCHAR 10, Default '9:16')
- `target_duration` (INTEGER) - Duration in seconds (15, 30, 45, 60, 90)
- `status` (VARCHAR 30) - `DRAFT`, `SCRIPTING`, `STORYBOARD`, `GENERATING`, `RENDERING`, `READY`, `FAILED`
- `creative_brief` (JSONB / TEXT) - Topic, audience, tone, pacing, CTA, platform
- `script` (JSONB / TEXT) - Hook, scene narration, CTA, hashtags, caption
- `brand_kit_id` (UUID, Foreign Key -> brand_kits.id, Nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `scenes`
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key -> projects.id, Indexed)
- `sequence_order` (INTEGER, Indexed)
- `duration` (FLOAT) - In seconds
- `narration` (TEXT)
- `visual_description` (TEXT)
- `visual_prompt` (TEXT)
- `camera_direction` (VARCHAR 50) - E.g. 'Slow Zoom In', 'Pan Left', 'Dutch Angle'
- `transition` (VARCHAR 50) - E.g. 'Cut', 'Dissolve', 'Wipe', 'Flash'
- `media_url` (TEXT, Nullable)
- `media_type` (VARCHAR 30) - `image`, `video`, `motion_graphic`
- `voiceover_url` (TEXT, Nullable)
- `sound_effect` (VARCHAR 100, Nullable)
- `status` (VARCHAR 30, Default 'READY') - `PENDING`, `GENERATING`, `READY`, `FAILED`
- `created_at` (TIMESTAMP)

### `generation_jobs`
- `id` (UUID, Primary Key)
- `project_id` (UUID, Foreign Key -> projects.id, Indexed)
- `job_type` (VARCHAR 50) - `FULL_PIPELINE`, `SCRIPT_GEN`, `IMAGE_GEN`, `VOICE_GEN`, `RENDER`
- `status` (VARCHAR 30) - `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED`
- `progress` (INTEGER) - 0 to 100
- `current_stage` (VARCHAR 100)
- `error_message` (TEXT, Nullable)
- `idempotency_key` (VARCHAR 100, Unique, Indexed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `brand_kits`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Indexed)
- `name` (VARCHAR 100)
- `channel_name` (VARCHAR 100)
- `primary_color` (VARCHAR 20)
- `secondary_color` (VARCHAR 20)
- `font_family` (VARCHAR 50)
- `preferred_voice` (VARCHAR 50)
- `caption_style` (VARCHAR 50) - E.g. 'Karaoke Bold', 'Cinematic Clean'
- `watermark_text` (VARCHAR 100)
- `character_bible` (JSONB / TEXT) - Structured character appearances (e.g. Jafta)
- `created_at` (TIMESTAMP)

### `content_series`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Indexed)
- `title` (VARCHAR 255)
- `concept` (TEXT)
- `total_episodes` (INTEGER)
- `created_at` (TIMESTAMP)

### `content_episodes`
- `id` (UUID, Primary Key)
- `series_id` (UUID, Foreign Key -> content_series.id, Indexed)
- `episode_number` (INTEGER)
- `title` (VARCHAR 255)
- `project_id` (UUID, Foreign Key -> projects.id, Nullable)
- `status` (VARCHAR 30) - `PLANNED`, `IN_PRODUCTION`, `READY`, `PUBLISHED`

### `calendar_items`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Indexed)
- `project_id` (UUID, Foreign Key -> projects.id, Nullable)
- `title` (VARCHAR 255)
- `scheduled_date` (VARCHAR 50)
- `platform` (VARCHAR 50) - `TikTok`, `YouTube Shorts`, `Instagram Reels`
- `status` (VARCHAR 30) - `DRAFT`, `SCHEDULED`, `PUBLISHED`

### `usage_ledger`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users.id, Indexed)
- `project_id` (UUID, Foreign Key -> projects.id, Nullable)
- `feature` (VARCHAR 50) - `SCRIPT_TOKENS`, `IMAGE_GEN`, `VOICE_MINUTES`, `RENDER_MINUTES`
- `units` (FLOAT)
- `credits_deducted` (INTEGER)
- `created_at` (TIMESTAMP)
