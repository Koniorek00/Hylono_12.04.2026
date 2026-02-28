import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { timing } from 'hono/timing';
import { compress } from 'hono/compress';
import { Hono } from 'hono';

import { errorHandler } from './lib/errorEnvelope.js';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';

const app = new Hono();

// Middleware stack
app.use('*', poweredBy({ serverName: 'Hylono-API/1.0' }));
app.use('*', logger());
app.use('*', timing());
app.use('*', compress());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Error handler
app.onError((err, c) => errorHandler(err, c));

// Routes
app.route('/health', healthRouter);
app.route('/api/auth', authRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
  }, 404);
});

const port = parseInt(process.env.PORT || '3001', 10);

console.log(`🚀 Hylono API Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Server running at http://localhost:${port}`);
