import { TechType } from '@/types';

const TECH_TYPES = Object.values(TechType) as TechType[];

export const LEGACY_PRODUCT_ROUTE_REDIRECTS = {
  'h2-hop450': 'hydrogen',
  'hbot-st1700': 'hbot',
} as const;

export const getTechRouteSlug = (tech: TechType): string => tech.toLowerCase();

export const getAllTechRouteSlugs = (): string[] => TECH_TYPES.map(getTechRouteSlug);

export const getTechTypeFromRouteSlug = (value: string): TechType | null => {
  const normalized = value.trim().toUpperCase();
  return TECH_TYPES.includes(normalized as TechType) ? (normalized as TechType) : null;
};
