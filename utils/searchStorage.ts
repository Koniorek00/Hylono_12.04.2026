/**
 * Shared search storage utility
 * Provides unified recent searches across GlobalSearch and MegaMenu
 */

const RECENT_SEARCHES_KEY = 'hylono_recent_searches';
const MAX_RECENT_SEARCHES = 6;

export const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .slice(0, MAX_RECENT_SEARCHES);
      }
    }
  } catch {
    // Ignore parse errors
  }
  
  return [];
};

export const addRecentSearch = (query: string): void => {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  const normalizedQuery = query.trim();
  const recent = getRecentSearches();
  
  // Remove duplicate if exists
  const filtered = recent.filter(item => item.toLowerCase() !== normalizedQuery.toLowerCase());
  
  // Add to beginning
  const updated = [normalizedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

export const clearRecentSearches = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage errors
  }
};

// Popular/trending searches (static suggestions)
export const POPULAR_SEARCHES = [
  'HBOT chamber',
  'Red light therapy',
  'PEMF for sleep',
  'Hydrogen water',
  'Recovery protocol',
  'Longevity stack',
  'Anti-aging',
  'Mitochondria',
] as const;

// All searchable terms for autocomplete (combined from popular + common queries)
export const AUTOCOMPLETE_TERMS = [
  ...POPULAR_SEARCHES,
  'HBOT',
  'Hyperbaric',
  'Oxygen therapy',
  'Hydrogen inhalation',
  'Molecular hydrogen',
  'Red light',
  'Near infrared',
  'NIR',
  'PEMF',
  'Vagus nerve',
  'VNS',
  'Protocols',
  'Stack builder',
  'Wellness planner',
  'Recovery',
  'Sleep',
  'Energy',
  'Focus',
  'Longevity',
  'Inflammation',
  'Pain relief',
  'Mental clarity',
  'Athletic performance',
  'Immune support',
  'Detox',
  'Cognitive enhancement',
  'Stress relief',
  'Blood flow',
  'Circulation',
  'Mitochondrial health',
  'Cellular energy',
  'ATP',
  'Neuroprotection',
  'Brain health',
  'Skin health',
  'Wound recovery support',
  'Muscle recovery',
  'Joint pain',
  'Arthritis',
  'Chronic fatigue',
  'Fibromyalgia',
] as const;

/**
 * Get autocomplete suggestions based on partial query
 * Returns matching terms that start with or contain the query
 */
export const getAutocompleteSuggestions = (query: string, maxResults = 5): string[] => {
  if (!query.trim() || query.trim().length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // First prioritize terms that start with the query
  const startsWithMatches: string[] = [];
  const containsMatches: string[] = [];
  
  AUTOCOMPLETE_TERMS.forEach(term => {
    const normalizedTerm = term.toLowerCase();
    if (normalizedTerm.startsWith(normalizedQuery)) {
      startsWithMatches.push(term);
    } else if (normalizedTerm.includes(normalizedQuery)) {
      containsMatches.push(term);
    }
  });
  
  // Also check recent searches
  const recent = getRecentSearches();
  recent.forEach(term => {
    const normalizedTerm = term.toLowerCase();
    if (normalizedTerm.startsWith(normalizedQuery) && !startsWithMatches.includes(term)) {
      startsWithMatches.push(term);
    } else if (normalizedTerm.includes(normalizedQuery) && !containsMatches.includes(term) && !startsWithMatches.includes(term)) {
      containsMatches.push(term);
    }
  });
  
  // Combine: starts with first, then contains, limit results
  return [...new Set([...startsWithMatches, ...containsMatches])].slice(0, maxResults);
};

// ============================================
// Recent Pages Tracking
// ============================================

const RECENT_PAGES_KEY = 'hylono_recent_pages';
const MAX_RECENT_PAGES = 8;

export interface RecentPage {
  url: string;
  title: string;
  timestamp: number;
}

export const getRecentPages = (): RecentPage[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = window.localStorage.getItem(RECENT_PAGES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is RecentPage => 
            typeof item === 'object' && 
            item !== null &&
            'url' in item && 
            'title' in item &&
            typeof item.url === 'string' &&
            typeof item.title === 'string'
          )
          .slice(0, MAX_RECENT_PAGES);
      }
    }
  } catch {
    // Ignore parse errors
  }
  
  return [];
};

export const addRecentPage = (url: string, title: string): void => {
  if (typeof window === 'undefined' || !url || !title) return;
  
  const recent = getRecentPages();
  
  // Remove existing entry with same URL
  const filtered = recent.filter(item => item.url !== url);
  
  // Add to beginning with timestamp
  const updated: RecentPage[] = [
    { url, title, timestamp: Date.now() },
    ...filtered
  ].slice(0, MAX_RECENT_PAGES);
  
  try {
    window.localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
};

export const clearRecentPages = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(RECENT_PAGES_KEY);
  } catch {
    // Ignore storage errors
  }
};
