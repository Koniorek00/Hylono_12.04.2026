import type { Context } from 'hono';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Standard API error response format
 */
export function errorResponse(c: Context, code: string, message: string, status: 400 | 401 | 403 | 404 | 500, details?: unknown) {
  return c.json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }, status);
}

/**
 * Global error handler 
 */
export function errorHandler(err: Error, c: Context) {
  console.error('🚨 Unhandled error:', err);

  // Known error types
  if (err instanceof Response) {
    return err;
  }

  if (err instanceof SyntaxError) {
    return errorResponse(c, 'BAD_REQUEST', 'Invalid JSON in request body', 400);
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return errorResponse(c, 'VALIDATION_ERROR', 'Request validation failed', 400, {
      details: 'issues' in err ? (err as any).issues : undefined,
    });
  }

  // Generic server error
  return errorResponse(c, 'INTERNAL_ERROR', err.message || 'An unexpected error occurred', 500);
}

/**
 * Success response helper
 */
export function successResponse<T>(c: Context, data: T, status: 200 | 201 = 200) {
  return c.json({
    success: true,
    data,
  }, status);
}
