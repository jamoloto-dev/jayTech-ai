# JayTech AI — Security Architecture

## 1. Authentication & Session Management
- Passwords hashed using industry-standard salted hashing.
- Bearer session token authentication with scoped user identity.
- Server-side role-based authorization:
  - `USER`: Read public templates, manage own projects.
  - `CREATOR`: Generate videos, manage brand kits, access AI pipelines.
  - `ADMIN`: Platform telemetry, audit logs, provider switchboard.
- Strict tenant isolation: Users can never read, modify, or delete another user's projects or assets.

## 2. API Key & Secret Management
- External AI Provider keys (e.g. `GEMINI_API_KEY`) reside strictly in server environment variables.
- Client applications communicate solely through backend proxy routes (`/api/v1/*`).
- No provider credentials or internal system prompts are exposed in network payloads or client bundles.

## 3. Upload & Asset Validation
- Multi-layer file validation:
  1. Whitelisted MIME inspection (`image/jpeg`, `image/png`, `image/webp`, `audio/mpeg`, `audio/wav`, `video/mp4`).
  2. Maximum upload limits (10MB for images/audio, 50MB for raw video).
  3. Sanitized storage keys to prevent path traversal attacks.

## 4. Content Safety
- Content screening against harmful impersonation, non-consensual deepfakes, and prohibited material.
- Clear rights attestation for uploaded media and brand logos.
