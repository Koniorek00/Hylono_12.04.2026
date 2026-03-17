import net from "node:net";
import type { ServiceManifest, ServiceStatus } from "@/types/stack";

const REQUEST_TIMEOUT_MS = 2500;
const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export interface HealthResult {
  serviceId: string;
  status: ServiceStatus;
  url?: string;
  httpStatus: number | null;
  responseTimeMs: number;
  error?: string;
}

interface ProbeTarget {
  kind: "http" | "tcp" | "none";
  target?: string;
}

function resolveProbeTarget(service: ServiceManifest): ProbeTarget {
  if (service.healthEndpoint) {
    if (ABSOLUTE_URL_PATTERN.test(service.healthEndpoint)) {
      return { kind: "http", target: service.healthEndpoint };
    }

    if (service.defaultPort) {
      const endpoint = service.healthEndpoint.startsWith("/")
        ? service.healthEndpoint
        : `/${service.healthEndpoint}`;
      return {
        kind: "http",
        target: `http://localhost:${service.defaultPort}${endpoint}`,
      };
    }
  }

  if (service.defaultPort) {
    return { kind: "tcp", target: `localhost:${service.defaultPort}` };
  }

  if (service.embedded) {
    return { kind: "none", target: "embedded" };
  }

  return { kind: "none" };
}

async function checkHttp(target: string, serviceId: string): Promise<HealthResult> {
  const start = Date.now();

  try {
    const response = await fetch(target, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    return {
      serviceId,
      status: response.status >= 500 ? "error" : "running",
      url: target,
      httpStatus: response.status,
      responseTimeMs: Date.now() - start,
    };
  } catch (error) {
    return {
      serviceId,
      status: "stopped",
      url: target,
      httpStatus: null,
      responseTimeMs: Date.now() - start,
      error: (error as Error).message,
    };
  }
}

async function checkTcp(target: string, serviceId: string): Promise<HealthResult> {
  const [host, portValue] = target.split(":");
  const port = Number(portValue);
  const start = Date.now();

  return new Promise((resolve) => {
    let settled = false;
    const socket = net.createConnection({ host, port });

    const finish = (result: Omit<HealthResult, "responseTimeMs">) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolve({
        ...result,
        responseTimeMs: Date.now() - start,
      });
    };

    socket.setTimeout(REQUEST_TIMEOUT_MS);
    socket.once("connect", () => {
      finish({
        serviceId,
        status: "running",
        url: target,
        httpStatus: null,
      });
    });
    socket.once("timeout", () => {
      finish({
        serviceId,
        status: "stopped",
        url: target,
        httpStatus: null,
        error: "Connection timed out",
      });
    });
    socket.once("error", (error: NodeJS.ErrnoException) => {
      const status = error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT"
        ? "stopped"
        : "error";

      finish({
        serviceId,
        status,
        url: target,
        httpStatus: null,
        error: error.message,
      });
    });
  });
}

export async function checkHealth(service: ServiceManifest): Promise<HealthResult> {
  const probe = resolveProbeTarget(service);

  if (probe.kind === "http" && probe.target) {
    return checkHttp(probe.target, service.id);
  }

  if (probe.kind === "tcp" && probe.target) {
    return checkTcp(probe.target, service.id);
  }

  return {
    serviceId: service.id,
    status: service.embedded ? "not-deployed" : "unknown",
    url: probe.target,
    httpStatus: null,
    responseTimeMs: 0,
  };
}
