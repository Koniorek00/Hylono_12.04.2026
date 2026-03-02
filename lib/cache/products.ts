import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';

export interface ProductCatalogItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: 'oxygen' | 'hydrogen' | 'light' | 'signal';
  readonly monthlyPriceEur: number;
}

export interface RemoteInventorySummary {
  readonly updatedAtIso: string;
  readonly availableUnits: number;
  readonly waitingListCount: number;
}

export interface SessionOfferSnapshot {
  readonly userId: string;
  readonly currency: 'EUR';
  readonly recommendedPlan: 'rental' | 'purchase';
}

const PRODUCT_CATALOG: readonly ProductCatalogItem[] = [
  {
    id: 'oxyhelp-mono',
    slug: 'oxyhelp-chamber-mono',
    name: 'Oxyhelp Mono Chamber',
    category: 'oxygen',
    monthlyPriceEur: 390,
  },
  {
    id: 'h2-home',
    slug: 'h2-home-system',
    name: 'H2 Home System',
    category: 'hydrogen',
    monthlyPriceEur: 210,
  },
  {
    id: 'nir-panel-pro',
    slug: 'nir-panel-pro',
    name: 'NIR Panel Pro',
    category: 'light',
    monthlyPriceEur: 180,
  },
] as const;

export async function getProductCatalog(): Promise<readonly ProductCatalogItem[]> {
  'use cache';

  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag('products');

  return PRODUCT_CATALOG;
}

export async function getRemoteInventorySummary(): Promise<RemoteInventorySummary> {
  'use cache: remote';

  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag('inventory-remote');

  return {
    updatedAtIso: new Date().toISOString(),
    availableUnits: 24,
    waitingListCount: 5,
  };
}

export async function getSessionOfferSnapshot(
  userId: string,
): Promise<SessionOfferSnapshot> {
  'use cache: private';

  cacheLife({ stale: 0, revalidate: 0, expire: 3600 });
  cacheTag(`session-offer-${userId}`);

  return {
    userId,
    currency: 'EUR',
    recommendedPlan: 'rental',
  };
}