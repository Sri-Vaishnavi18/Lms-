import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-blue-collar-lms-jwt-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    phoneNumber?: string;
    badgeId?: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For quick prototyping and testing, allow an optional X-User-Id header if token not passed
    const fallbackUserId = req.headers['x-user-id'] as string;
    const fallbackRole = (req.headers['x-user-role'] as string) || 'WORKER';

    if (fallbackUserId) {
      req.user = { id: fallbackUserId, role: fallbackRole };
      return next();
    }

    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

