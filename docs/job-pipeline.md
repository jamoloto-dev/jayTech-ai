# JayTech AI — Asynchronous Job Pipeline

## 1. Principles
1. **Never Block HTTP Requests**: Complex generation tasks (script generation, multi-scene asset generation, rendering) are queued as asynchronous background jobs.
2. **Observable State**: Jobs transition through deterministic states:
   `QUEUED` -> `RUNNING` -> `SUCCEEDED` / `FAILED` / `CANCELLED`
3. **Idempotency**: Requests contain idempotency tokens to prevent accidental duplicate charges or double job enqueueing.
4. **Real-Time Client Updates**: The client streams status via Server-Sent Events (`/api/v1/jobs/:id/events`), receiving percentage milestones:
   - 0% Initialized
   - 15% Creative brief & script ready
   - 30% Storyboard scenes composed
   - 50% Voiceover audio generated
   - 75% Visual scene assets generated
   - 90% Audio mixing & caption tracks aligned
   - 100% Final composition ready

## 2. Event Payload Schema
```json
{
  "jobId": "c8f2a1b9-3991-4d32-9014-9b8823f99011",
  "status": "RUNNING",
  "progress": 65,
  "stage": "Generating visual assets for Scene 3 of 5",
  "updatedAt": "2026-09-24T22:30:00Z"
}
```
