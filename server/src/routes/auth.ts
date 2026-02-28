import { Hono } from 'hono';
import { z } from 'zod';
import { errorResponse, successResponse } from '../lib/errorEnvelope';

// In-memory user store (replace with Prisma in production)
const users = new Map<string, {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
}>();

// Sessions store (in production, use Redis or similar)
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Simple hash function (in production, use bcrypt)
function hashPassword(password: string): string {
  let hash = 0;
  const salt = 'hylono_salt_2026';
  const combined = password + salt;
  for (let i = 0; i < 10000; i++) {
    const char = combined.charCodeAt(i % combined.length);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function createSession(userId: string): string {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
}

function getSessionUser(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId);
    return null;
  }
  return session.userId;
}

export const authRouter = new Hono();

/**
 * POST /api/auth/register
 * Register a new user
 */
authRouter.post('/register', async (c) => {
  const body = await c.req.json();
  
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return errorResponse(c, 'VALIDATION_ERROR', 'Invalid input', 400, result.error.issues);
  }

  const { email, password, name } = result.data;

  // Check if user exists
  if (users.has(email)) {
    return errorResponse(c, 'USER_EXISTS', 'User with this email already exists', 400);
  }

  // Hash password and create user
  const passwordHash = hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    name,
    createdAt: new Date(),
  };
  
  users.set(email, user);

  // Create session
  const sessionId = createSession(user.id);

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      session: {
        sessionId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  }, 201);
});

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
authRouter.post('/login', async (c) => {
  const body = await c.req.json();
  
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return errorResponse(c, 'VALIDATION_ERROR', 'Invalid input', 400, result.error.issues);
  }

  const { email, password } = result.data;

  // Find user
  const user = users.get(email);
  if (!user) {
    return errorResponse(c, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Verify password
  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return errorResponse(c, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
  }

  // Create session
  const sessionId = createSession(user.id);

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      session: {
        sessionId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  });
});

/**
 * POST /api/auth/logout
 * Destroy session
 */
authRouter.post('/logout', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (sessionId) {
    sessions.delete(sessionId);
  }

  return c.json({ success: true, data: { message: 'Logged out successfully' } });
});

/**
 * GET /api/auth/session
 * Get current session info
 */
authRouter.get('/session', async (c) => {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (!sessionId) {
    return errorResponse(c, 'NO_SESSION', 'No session provided', 401);
  }

  const userId = getSessionUser(sessionId);
  if (!userId) {
    return errorResponse(c, 'INVALID_SESSION', 'Session expired or invalid', 401);
  }

  // Find user by ID
  let user = null;
  for (const u of users.values()) {
    if (u.id === userId) {
      user = u;
      break;
    }
  }

  if (!user) {
    return errorResponse(c, 'USER_NOT_FOUND', 'User not found', 404);
  }

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    },
  });
});
