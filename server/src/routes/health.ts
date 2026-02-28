import { Hono } from 'hono';

export const healthRouter = new Hono();

/**
 * GET /health
 * Basic health check endpoint
 */
healthRouter.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.() || 0,
      service: 'Hylono API',
      version: '1.0.0',
    },
  });
});

/**
 * GET /health/liveness
 * Kubernetes-style liveness probe
 */
healthRouter.get('/liveness', (c) => {
  return c.json({ status: 'alive' });
});

/**
 * GET /health/readiness
 * Kubernetes-style readiness probe
 */
healthRouter.get('/readiness', (c) => {
  // In production, check DB connectivity, external services, etc.
  return c.json({ status: 'ready' });
});
