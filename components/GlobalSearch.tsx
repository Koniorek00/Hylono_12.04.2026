import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, Clock, ArrowRight, FileText, Target, Package, Filter } from 'lucide-react';
import Image from 'next/image';
import { products } from '../content/products';
import { protocols } from '../content/protocols';
import { goals } from '../content/goals';
import { goalSearchTerms, synonymGroups } from '../config/searchSynonyms';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { getRecentSearches, addRecentSearch, clearRecentSearches, POPULAR_SEARCHES, getAutocompleteSuggestions, getRecentPages, RecentPage } from '../utils/searchStorage';

interface GlobalSearchProps {
  onNavigate: (page: string) => void;
}

type SearchResultType = 'product' | 'protocol' | 'goal' | 'page';
type SearchFilterTag = 'all' | 'product' | 'protocol' | 'goal';

interface BaseSearchItem {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  url: string;
  keywords: string[];
}

interface ProductSearchItem extends BaseSearchItem {
  type: 'product';
  image?: string;
  rentalFrom?: string;
}

interface ProtocolSearchItem extends BaseSearchItem {
  type: 'protocol';
}

interface GoalSearchItem extends BaseSearchItem {
  type: 'goal';
}

interface PageSearchItem extends BaseSearchItem {
  type: 'page';
}

type SearchItem = ProductSearchItem | ProtocolSearchItem | GoalSearchItem | PageSearchItem;

interface ScoredSearchItem {
  item: SearchItem;
  score: number;
}

const normalize = (value: string): string => value.toLowerCase().trim();

const splitTerms = (value: string): string[] =>
  normalize(value)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 1);

const modalityRouteByProduct = {
  mHBOT: 'product/HBOT',
  H2_inhalation: 'product/HYDROGEN',
  H2_water: 'product/HYDROGEN',
  RLT_NIR: 'product/RLT',
  PEMF: 'product/PEMF',
  VNS: 'product/VNS',
  O2: 'store',
} as const;

const searchPages: PageSearchItem[] = [
  {
    id: 'page-store',
    type: 'page',
    title: 'Store',
    description: 'Browse all technologies and compare purchase and rental paths',
    url: 'store',
    keywords: ['store', 'shop', 'products', 'buy', 'rent'],
  },
  {
    id: 'page-builder',
    type: 'page',
    title: 'Wellness Planner',
    description: 'Configure a stack based on your goal and routine',
    url: 'wellness-planner',
    keywords: ['builder', 'planner', 'stack', 'configure', 'protocol', 'wellness'],
  },
  {
    id: 'page-advisors',
    type: 'page',
    title: 'Advisors',
    description: 'Talk to an advisor about your protocol and setup',
    url: 'advisors',
    keywords: ['advisor', 'consultation', 'expert', 'help'],
  },
];

const typeBadgeStyles: Record<SearchResultType, string> = {
  product: 'bg-cyan-100 text-cyan-700',
  protocol: 'bg-violet-100 text-violet-700',
  goal: 'bg-emerald-100 text-emerald-700',
  page: 'bg-slate-100 text-slate-700',
};

const filterTagStyles: Record<SearchFilterTag, { active: string; inactive: string }> = {
  all: {
    active: 'bg-slate-900 text-white border-slate-900',
    inactive: 'bg-transparent text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50',
  },
  product: {
    active: 'bg-cyan-600 text-white border-cyan-600',
    inactive: 'bg-transparent text-cyan-700 border-cyan-300 hover:border-cyan-400 hover:bg-cyan-50',
  },
  protocol: {
    active: 'bg-violet-600 text-white border-violet-600',
    inactive: 'bg-transparent text-violet-700 border-violet-300 hover:border-violet-400 hover:bg-violet-50',
  },
  goal: {
    active: 'bg-emerald-600 text-white border-emerald-600',
    inactive: 'bg-transparent text-emerald-700 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50',
  },
};

const FILTER_TAGS: { value: SearchFilterTag; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'product', label: 'Product' },
  { value: 'protocol', label: 'Protocol' },
  { value: 'goal', label: 'Goal' },
];

interface FilterTagBarProps {
  activeFilter: SearchFilterTag;
  onFilterChange: (filter: SearchFilterTag) => void;
  resultCounts: { product: number; protocol: number; goal: number };
}

const FilterTagBar: React.FC<FilterTagBarProps> = ({ activeFilter, onFilterChange, resultCounts }) => {
  const tagRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    const tags = FILTER_TAGS;
    let newIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = (currentIndex + 1) % tags.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = currentIndex === 0 ? tags.length - 1 : currentIndex - 1;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = tags.length - 1;
    }

    if (newIndex !== currentIndex) {
      const nextTag = tags[newIndex];
      if (!nextTag) return;

      onFilterChange(nextTag.value);
      const buttons = tagRef.current?.querySelectorAll('button');
      buttons?.[newIndex]?.focus();
    }
  }, [onFilterChange]);

  return (
    <div
      ref={tagRef}
      className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 overflow-x-auto scrollbar-hide"
      role="radiogroup"
      aria-label="Filter search results by category"
    >
      <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400 flex items-center gap-1.5 shrink-0">
        <Filter size={12} /> Filter
      </span>
      <div className="flex items-center gap-2">
        {FILTER_TAGS.map((tag, index) => {
          const isActive = activeFilter === tag.value;
          const count = tag.value === 'all' 
            ? resultCounts.product + resultCounts.protocol + resultCounts.goal
            : resultCounts[tag.value];
          
          return (
            <button
              key={tag.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onFilterChange(tag.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] min-w-[44px]
                rounded-full border text-sm font-semibold 
                transition-all duration-150 ease-in-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500
                ${isActive ? filterTagStyles[tag.value].active : filterTagStyles[tag.value].inactive}
              `}
            >
              <span>{tag.label}</span>
              {count > 0 && (
                <span 
                  className={`
                    text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${isActive ? 'bg-white/20' : 'bg-current/10'}
                  `}
                  aria-label={`${count} result${count !== 1 ? 's' : ''}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const searchEnhancedEnabled = useFeatureFlag('feature_search_enhanced');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterTag>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    setRecentPages(getRecentPages());
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  // Reset filter when search closes
  useEffect(() => {
    if (!isOpen) {
      setActiveFilter('all');
    }
  }, [isOpen]);

  const synonymLookup = useMemo(() => {
    const lookup = new Map<string, Set<string>>();

    synonymGroups.forEach((group) => {
      const normalizedGroup = Array.from(new Set(group.map((term) => normalize(term))));
      normalizedGroup.forEach((term) => {
        if (!lookup.has(term)) lookup.set(term, new Set<string>());
        const targetSet = lookup.get(term);
        if (!targetSet) return;

        normalizedGroup.forEach((candidate) => {
          if (candidate !== term) targetSet.add(candidate);
        });
      });
    });

    return lookup;
  }, []);

  const searchableProducts = useMemo<ProductSearchItem[]>(
    () =>
      products.map((product) => ({
        id: product.id,
        type: 'product',
        title: product.title,
        description: product.shortDescription,
        url: modalityRouteByProduct[product.modality],
        image: product.images[0],
        rentalFrom: product.rentalPlans?.[0]?.monthlyPrice ? `€${product.rentalPlans[0].monthlyPrice}/mo` : undefined,
        keywords: [
          product.modality,
          ...product.goalTags,
          ...product.protocolIds,
          ...product.contraindications,
          ...product.safetyNotes,
          ...splitTerms(product.title),
          ...splitTerms(product.shortDescription),
        ],
      })),
    []
  );

  const searchableProtocols = useMemo<ProtocolSearchItem[]>(
    () =>
      protocols.map((protocol) => ({
        id: protocol.slug,
        type: 'protocol',
        title: protocol.title,
        description: protocol.shortDescription,
        url: `protocols/${protocol.slug}`,
        keywords: [
          protocol.goal,
          protocol.goalTag,
          protocol.targetAudience,
          ...protocol.evidenceIds,
          ...splitTerms(protocol.title),
          ...splitTerms(protocol.shortDescription),
        ],
      })),
    []
  );

  const searchableGoals = useMemo<GoalSearchItem[]>(
    () =>
      goals.map((goal) => ({
        id: goal.slug,
        type: 'goal',
        title: goal.title,
        description: goal.subtitle,
        url: `conditions/${goal.slug}`,
        keywords: [
          goal.slug,
          ...goal.evidenceIds,
          ...goal.modalities.map((modality) => modality.shortName),
          ...splitTerms(goal.title),
          ...splitTerms(goal.description),
          ...(goalSearchTerms[goal.slug] ?? []),
        ],
      })),
    []
  );

  const allSearchItems = useMemo<SearchItem[]>(
    () => [...searchableProducts, ...searchableProtocols, ...searchableGoals, ...searchPages],
    [searchableProducts, searchableProtocols, searchableGoals]
  );

  const expandedTerms = useMemo(() => {
    const queryTrimmed = normalize(query);
    if (!queryTrimmed) return [] as string[];

    const terms = new Set<string>([queryTrimmed, ...splitTerms(queryTrimmed)]);

    const goalEntries = Object.entries(goalSearchTerms).map(([goalKey, termsList]) => ({
      goalKey: normalize(goalKey),
      terms: termsList.map((term) => normalize(term)),
    }));

    Array.from(terms).forEach((term) => {
      synonymLookup.forEach((related, key) => {
        if (key === term || key.includes(term) || term.includes(key)) {
          terms.add(key);
          related.forEach((relatedTerm) => terms.add(relatedTerm));
        }
      });

      goalEntries.forEach((entry) => {
        const matchesGoalTerm = entry.terms.some(
          (goalTerm) => goalTerm === term || goalTerm.includes(term) || term.includes(goalTerm)
        );
        if (matchesGoalTerm) {
          terms.add(entry.goalKey);
          entry.terms.forEach((goalTerm) => terms.add(goalTerm));
        }
      });
    });

    return Array.from(terms).filter((term) => term.length > 1);
  }, [query, synonymLookup]);

  const scoredResults = useMemo<ScoredSearchItem[]>(() => {
    if (!query.trim()) return [];

    const normalizedQuery = normalize(query);

    return allSearchItems
      .map((item) => {
        const title = normalize(item.title);
        const description = normalize(item.description);
        const keywords = item.keywords.map((keyword) => normalize(keyword));

        let score = 0;

        if (title === normalizedQuery) score += 120;
        else if (title.startsWith(normalizedQuery)) score += 90;
        else if (title.includes(normalizedQuery)) score += 65;

        if (description.includes(normalizedQuery)) score += 30;

        expandedTerms.forEach((term) => {
          if (title.includes(term)) score += term === normalizedQuery ? 35 : 18;
          if (description.includes(term)) score += 12;
          if (keywords.some((keyword) => keyword.includes(term))) score += 22;
        });

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [allSearchItems, expandedTerms, query]);

  const groupedResults = useMemo(() => {
    const productsGroup = scoredResults.filter((entry) => entry.item.type === 'product').map((entry) => entry.item as ProductSearchItem);
    const protocolsGroup = scoredResults
      .filter((entry) => entry.item.type === 'protocol')
      .map((entry) => entry.item as ProtocolSearchItem);
    const goalsGroup = scoredResults.filter((entry) => entry.item.type === 'goal').map((entry) => entry.item as GoalSearchItem);

    return {
      products: productsGroup,
      protocols: protocolsGroup,
      goals: goalsGroup,
      total: productsGroup.length + protocolsGroup.length + goalsGroup.length,
    };
  }, [scoredResults]);

  // Result counts for filter badges
  const resultCounts = useMemo(
    () => ({
      product: groupedResults.products.length,
      protocol: groupedResults.protocols.length,
      goal: groupedResults.goals.length,
    }),
    [groupedResults]
  );

  // Filtered results based on active filter
  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') {
      // Return mixed results prioritized by relevance
      return {
        products: groupedResults.products.slice(0, isMobile ? 3 : 4),
        protocols: groupedResults.protocols.slice(0, isMobile ? 2 : 3),
        goals: groupedResults.goals.slice(0, isMobile ? 2 : 3),
        showProducts: groupedResults.products.length > 0,
        showProtocols: groupedResults.protocols.length > 0,
        showGoals: groupedResults.goals.length > 0,
      };
    }

    // Return only results matching the active filter
    if (activeFilter === 'product') {
      return {
        products: groupedResults.products.slice(0, isMobile ? 6 : 10),
        protocols: [],
        goals: [],
        showProducts: true,
        showProtocols: false,
        showGoals: false,
      };
    }
    if (activeFilter === 'protocol') {
      return {
        products: [],
        protocols: groupedResults.protocols.slice(0, isMobile ? 6 : 10),
        goals: [],
        showProducts: false,
        showProtocols: true,
        showGoals: false,
      };
    }
    if (activeFilter === 'goal') {
      return {
        products: [],
        protocols: [],
        goals: groupedResults.goals.slice(0, isMobile ? 6 : 10),
        showProducts: false,
        showProtocols: false,
        showGoals: true,
      };
    }

    return {
      products: [],
      protocols: [],
      goals: [],
      showProducts: false,
      showProtocols: false,
      showGoals: false,
    };
  }, [activeFilter, groupedResults, isMobile]);

  const legacyResults = useMemo(() => scoredResults.slice(0, 8).map((entry) => entry.item), [scoredResults]);

  const saveRecentSearch = (value: string) => {
    addRecentSearch(value);
    setRecentSearches(getRecentSearches());
  };

  const navigateToResult = (item: SearchItem) => {
    saveRecentSearch(query || item.title);
    setIsOpen(false);
    setQuery('');
    onNavigate(item.url);
  };

  // Autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];
    return getAutocompleteSuggestions(query, 5);
  }, [query]);

  const popularTerms = ['HBOT', 'Hydrogen', 'Protocols', 'Recovery', 'Financing'];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 text-sm"
        aria-label="Open global search"
      >
        <Search size={16} />
        <span className="hidden lg:inline">Search...</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[85]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[86] top-[12%] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Global search"
            >
              <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                <Search size={18} className="text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, protocols, goals..."
                  className="flex-1 text-base outline-none placeholder-slate-400"
                  aria-label="Search input"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter Tag Bar - only show when there's a query and results */}
              {query.trim() && searchEnhancedEnabled && groupedResults.total > 0 && (
                <FilterTagBar
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  resultCounts={resultCounts}
                />
              )}

              <div className="max-h-[60vh] overflow-y-auto p-3">
                {query.trim() ? (
                  searchEnhancedEnabled ? (
                    <div className="space-y-4">
                      {/* Autocomplete Suggestions - show when typing but before results */}
                      {autocompleteSuggestions.length > 0 && groupedResults.total === 0 && (
                        <section aria-labelledby="autocomplete-heading">
                          <h4 id="autocomplete-heading" className="px-1 mb-2 text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400">Suggestions</h4>
                          <div className="space-y-1">
                            {autocompleteSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => setQuery(suggestion)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                              >
                                <Search size={14} className="text-slate-400" />
                                <span className="text-sm text-slate-700">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {filteredResults.showProducts && filteredResults.products.length > 0 && (
                        <section aria-labelledby="products-heading">
                          <h4 id="products-heading" className="px-1 mb-2 text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400">Products</h4>
                          <div className="space-y-1">
                            {filteredResults.products.map((product) => (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => navigateToResult(product)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
                              >
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt=""
                                    width={44}
                                    height={44}
                                    className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Package size={16} aria-hidden="true" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 truncate">{product.title}</p>
                                  <p className="text-xs text-slate-500 truncate">{product.description}</p>
                                </div>
                                {product.rentalFrom && <span className="text-xs font-semibold text-slate-500">{product.rentalFrom}</span>}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {filteredResults.showProtocols && filteredResults.protocols.length > 0 && (
                        <section aria-labelledby="protocols-heading">
                          <h4 id="protocols-heading" className="px-1 mb-2 text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400">Protocols</h4>
                          <div className="space-y-1">
                            {filteredResults.protocols.map((protocol) => (
                              <button
                                key={protocol.id}
                                type="button"
                                onClick={() => navigateToResult(protocol)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
                              >
                                <FileText size={16} className="text-violet-500" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 truncate">{protocol.title}</p>
                                  <p className="text-xs text-slate-500 truncate">{protocol.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {filteredResults.showGoals && filteredResults.goals.length > 0 && (
                        <section aria-labelledby="goals-heading">
                          <h4 id="goals-heading" className="px-1 mb-2 text-[11px] uppercase tracking-[0.18em] font-bold text-slate-400">Goals</h4>
                          <div className="space-y-1">
                            {filteredResults.goals.map((goal) => (
                              <button
                                key={goal.id}
                                type="button"
                                onClick={() => navigateToResult(goal)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500"
                              >
                                <Target size={16} className="text-emerald-500" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-900 truncate">{goal.title}</p>
                                  <p className="text-xs text-slate-500 truncate">{goal.description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* No results for active filter */}
                      {groupedResults.total > 0 && activeFilter !== 'all' && resultCounts[activeFilter] === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-sm text-slate-700 mb-3">
                            No <span className="font-semibold">{activeFilter}</span> results found for "{query}"
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveFilter('all')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                          >
                            <X size={14} /> Clear filter
                          </button>
                        </div>
                      )}

                      {/* No results at all */}
                      {groupedResults.total === 0 && query.trim().length > 2 && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm text-slate-700 mb-3">No results found for "{query}"</p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                onNavigate('wellness-planner');
                              }}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                            >
                              Configure a stack <ArrowRight size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                onNavigate('advisors');
                              }}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900"
                            >
                              Talk to an advisor <ArrowRight size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                onNavigate('contact');
                              }}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-800"
                            >
                              Contact us <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {legacyResults.length > 0 ? (
                        legacyResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => navigateToResult(item)}
                            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                              <p className="text-xs text-slate-500 truncate">{item.description}</p>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${typeBadgeStyles[item.type]}`}>
                              {item.type}
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 p-4">No results for “{query}”.</p>
                      )}
                    </div>
                  )
                ) : (
                  <div className="space-y-4 p-1">
                    {/* Recent Pages - recently visited */}
                    {recentPages.length > 0 && (
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em] font-bold mb-2 flex items-center gap-1.5">
                          <FileText size={12} /> Recent pages
                        </p>
                        <div className="space-y-1">
                          {recentPages.slice(0, 3).map((page) => (
                            <button
                              key={page.url}
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                onNavigate(page.url);
                              }}
                              className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <ArrowRight size={12} className="text-slate-400" />
                              <span className="text-sm text-slate-700">{page.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {recentSearches.length > 0 && (
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em] font-bold mb-2 flex items-center gap-1.5">
                          <Clock size={12} /> Recent searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((recent) => (
                            <button
                              key={recent}
                              type="button"
                              onClick={() => setQuery(recent)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-600"
                            >
                              {recent}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em] font-bold mb-2">Popular searches</p>
                      <div className="flex flex-wrap gap-2">
                        {popularTerms.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 rounded-full text-xs font-semibold text-cyan-700"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
