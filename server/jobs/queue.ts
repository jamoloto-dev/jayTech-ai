import { db } from '../db/database.js';
import { GenerationJob, JobStatus } from '../types/index.js';
import { Response } from 'express';

export type JobSubscriber = (job: GenerationJob) => void;

class JobQueueManager {
  private subscribers: Map<string, Set<Response>> = new Map();

  public subscribe(jobId: string, res: Response) {
    if (!this.subscribers.has(jobId)) {
      this.subscribers.set(jobId, new Set());
    }
    this.subscribers.get(jobId)!.add(res);

    // Initial message
    const job = db.getJob(jobId);
    if (job) {
      res.write(`data: ${JSON.stringify(job)}\n\n`);
    }

    reqCloseHandler(res, () => {
      this.unsubscribe(jobId, res);
    });
  }

  public unsubscribe(jobId: string, res: Response) {
    const subs = this.subscribers.get(jobId);
    if (subs) {
      subs.delete(res);
      if (subs.size === 0) {
        this.subscribers.delete(jobId);
      }
    }
  }

  public broadcast(job: GenerationJob) {
    db.saveJob(job);
    const subs = this.subscribers.get(job.id);
    if (subs && subs.size > 0) {
      const payload = `data: ${JSON.stringify(job)}\n\n`;
      for (const client of subs) {
        try {
          client.write(payload);
        } catch {
          subs.delete(client);
        }
      }
    }
  }

  public createJob(projectId: string, type: GenerationJob['type']): GenerationJob {
    const job: GenerationJob = {
      id: 'job-' + Math.random().toString(36).substring(2, 10),
      projectId,
      type,
      status: 'QUEUED',
      progress: 0,
      stageDescription: 'Job initialized and queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.saveJob(job);
    this.broadcast(job);
    return job;
  }

  public updateJobProgress(jobId: string, status: JobStatus, progress: number, stageDescription: string, errorMessage?: string): GenerationJob | null {
    const job = db.getJob(jobId);
    if (!job) return null;

    job.status = status;
    job.progress = Math.min(100, Math.max(0, progress));
    job.stageDescription = stageDescription;
    if (errorMessage) {
      job.errorMessage = errorMessage;
    }
    job.updatedAt = new Date().toISOString();

    this.broadcast(job);
    return job;
  }
}

function reqCloseHandler(res: Response, onClose: () => void) {
  res.on('close', onClose);
  res.on('finish', onClose);
}

export const jobQueue = new JobQueueManager();
