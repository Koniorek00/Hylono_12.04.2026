import fs from 'fs';
import path from 'path';
import type { StackManifest, ServiceManifest, IntegrationFlow } from '@/types/stack';

let cached: StackManifest | null = null;

export function getManifest(): StackManifest {
  if (cached) return cached;
  
  const manifestPath = process.env.MANIFEST_PATH 
    || path.resolve(process.cwd(), '..', 'manifest.json');
  
  const raw = fs.readFileSync(manifestPath, 'utf-8');
  cached = JSON.parse(raw) as StackManifest;
  return cached;
}

export function getServices(): ServiceManifest[] {
  const m = getManifest();
  return [...m.infrastructure, ...m.services];
}

export function getIntegrationFlows(): IntegrationFlow[] {
  return getManifest().integrations;
}

export function getServicesByPhase(phase: string): ServiceManifest[] {
  return getServices().filter(s => s.phase === phase);
}

export function getVerifiedLocalUiServices(): ServiceManifest[] {
  return getServices().filter((service) => {
    return Boolean(service.uiUrl) && (service.phase === 'infrastructure' || service.phase === '1a');
  });
}
