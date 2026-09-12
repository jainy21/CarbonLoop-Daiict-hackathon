import { Router, Response } from 'express';
import { userService } from '../services/userService.js';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

const VALID_ROLES: UserRole[] = [
  'waste_generator',
  'facility_operator',
  'municipality',
  'admin'
];

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, role, organization, facilityId } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        error: `Invalid role '${role}'. Must be one of: ${VALID_ROLES.join(', ')}`
      });
    }

    if (!organization || typeof organization !== 'string' || !organization.trim()) {
      return res.status(400).json({ error: 'Organization name is required.' });
    }

    const newUser = await userService.register({
      name,
      email,
      password,
      role,
      organization,
      facilityId
    });

    const token = userService.generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      user: safeUser,
      token,
      message: 'Account registered successfully.'
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { user, token } = await userService.authenticateUser(email, password);

    return res.json({
      user,
      token,
      message: 'Authentication successful.'
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Authentication failed.' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res: Response) => {
  return res.json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/users (Admin only)
 */
router.get('/users', authenticate, authorize('admin'), (_req: AuthenticatedRequest, res: Response) => {
  const users = userService.getAllUsers();
  return res.json(users);
});

export default router;
