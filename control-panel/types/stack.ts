// control-panel/types/stack.ts
export type Phase = "infrastructure" | "1a" | "1b" | "1c" | "2" | "rnd";
export type Domain = "infrastructure" | "commerce" | "fleet" | "iot" | "crm" | "ai" | "marketing" | "education" | "health" | "security" | "platform" | "bi" | "internal";
export type Verdict = "ESSENTIAL" | "RECOMMENDED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ServiceStatus = "running" | "stopped" | "not-deployed" | "error" | "unknown";

export interface ServiceManifest {
  id: string; name: string; repository: string; domain: Domain;
  phase: Phase; verdict: Verdict;
  dockerImage?: string; buildFromSource?: boolean; defaultPort?: number;
  healthEndpoint?: string; docsUrl?: string;
  role?: string; riskLevel?: RiskLevel; riskNotes?: string; notes?: string;
}

export interface IntegrationFlow {
  source: string; target: string; data: string; via: string;
}

export interface StackManifest {
  meta: { project: string; version: string; totalServices: number; };
  infrastructure: ServiceManifest[];
  services: ServiceManifest[];
  integrations: IntegrationFlow[];
  rnd: Array<{ id: string; name: string; repository: string; description: string; }>;
}

export interface ServiceWithStatus extends ServiceManifest {
  status: ServiceStatus; url?: string;
}
