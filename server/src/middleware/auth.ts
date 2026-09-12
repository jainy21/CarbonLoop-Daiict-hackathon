import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/userService.js';
import { User, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'passwordHash'>;
}

/**
 * Authentication Middleware: Validates JWT Bearer token
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No or invalid bearer token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = userService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication token' });
  }

  const user = userService.getUserById(decoded.id) || userService.getUserByEmail(decoded.email);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User associated with token no longer exists' });
  }

  const { passwordHash: _, ...safeUser } = user;
  req.user = safeUser;
  next();
};

/**
 * Optional Authentication: Attaches req.user if token is present, else continues
 */
export const optionalAuthenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = userService.verifyToken(token);
    if (decoded) {
      const user = userService.getUserById(decoded.id) || userService.getUserByEmail(decoded.email);
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        req.user = safeUser;
      }
    }
  }

  next();
};

/**
 * Authorization Middleware: Checks if user has one of the allowed roles
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access restricted. Requires one of [${allowedRoles.join(', ')}]. Your role is '${req.user.role}'`
      });
    }

    next();
  };
};
