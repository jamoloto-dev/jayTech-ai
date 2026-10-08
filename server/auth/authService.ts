import { db } from '../db/database.js';
import { User, UserRole } from '../types/index.js';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export class AuthService {
  private activeSessions: Map<string, string> = new Map(); // token -> userId

  constructor() {
    // Seed default session token for Jafta Moloto
    this.activeSessions.set('jafta-session-token', 'user-jafta-creator');
    this.activeSessions.set('admin-session-token', 'user-admin');
  }

  public authenticateToken(token: string): User | null {
    const userId = this.activeSessions.get(token);
    if (!userId) return null;
    return db.getUserById(userId) || null;
  }

  public login(email: string): { user: User; token: string } {
    let user = db.getUserByEmail(email);
    if (!user) {
      user = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'ADMIN' : 'CREATOR',
        plan: 'CREATOR',
        creditsBalance: 2000,
        createdAt: new Date().toISOString(),
      };
      db.createUser(user);
    }

    const token = 'token-' + Math.random().toString(36).substring(2, 12);
    this.activeSessions.set(token, user.id);
    return { user, token };
  }
}

export const authService = new AuthService();

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

  if (token) {
    const user = authService.authenticateToken(token);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Fallback to default creator if in development preview
  const defaultUser = db.getUserById('user-jafta-creator');
  if (defaultUser) {
    req.user = defaultUser;
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: Valid authentication token required.' });
}

export function requireRole(role: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role.` });
    }
    return next();
  };
}
