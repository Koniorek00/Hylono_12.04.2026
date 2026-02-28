import type { ServiceManifest, ServiceStatus } from '@/types/stack';

export interface HealthResult {
  serviceId: string; status: ServiceStatus; 
  httpStatus: number | null; responseTimeMs: number; error?: string;
}

export async function checkHealth(service: ServiceManifest): Promise<HealthResult> {
  if (!service.healthEndpoint || !service.defaultPort) {
    return { serviceId: service.id, status: "unknown", httpStatus: null, responseTimeMs: 0 };
  }
  
  const url = `http://localhost:${service.defaultPort}${service.healthEndpoint}`;
  const start = Date.now();
  
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return {
      serviceId: service.id,
      status: res.ok ? "running" : "error",
      httpStatus: res.status,
      responseTimeMs: Date.now() - start
    };
  } catch (e) {
    return {
      serviceId: service.id, status: "stopped", httpStatus: null, 
      responseTimeMs: Date.now() - start, error: (e as Error).message
    };
  }
}
