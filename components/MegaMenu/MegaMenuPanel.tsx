import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { Search, X, Pointer, FileText, Sparkles, Files, FlaskConical, FileBarChart, ArrowRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuContext, SEARCH_DATABASE, SEARCH_SYNONYMS, SearchDatabaseItem } from './MegaMenuData';
import { getRecentSearches, addRecentSearch, POPULAR_SEARCHES, getAutocompleteSuggestions, getRecentPages, RecentPage } from '../../utils/searchStorage';

const SEARCH_TRANSITION = { duration: 0.12, ease: "easeOut" as const };
const CONTEXT_TRANSITION = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const };

// Filter tag types
type MegaMenuFilterTag = 'all' | 'Products' | 'Protocols' | 'Science' | 'Resources' | 'Tools';

const FILTER_TAGS: { value: MegaMenuFilterTag; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'Products', label: 'Products' },
    { value: 'Protocols', label: 'Protocols' },
    { value: 'Science', label: 'Science' },
    { value: 'Resources', label: 'Resources' },
    { value: 'Tools', label: 'Tools' },
];

// Category colors for headers and dots
const categoryColors: Record<string, { text: string; dot: string }> = {
    Products: { text: 'text-cyan-400', dot: 'bg-cyan-400' },
    Protocols: { text: 'text-violet-400', dot: 'bg-violet-400' },
    Science: { text: 'text-blue-400', dot: 'bg-blue-400' },
    Resources: { text: 'text-amber-400', dot: 'bg-amber-400' },
    Tools: { text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

const filterTagStyles: Record<MegaMenuFilterTag, { active: string; inactive: string }> = {
    all: {
        active: 'bg-white text-slate-900 border-white',
        inactive: 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:bg-white/5',
    },
    Products: {
        active: 'bg-cyan-400 text-slate-900 border-cyan-400',
        inactive: 'bg-transparent text-cyan-400/70 border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/5',
    },
    Protocols: {
        active: 'bg-violet-400 text-slate-900 border-violet-400',
        inactive: 'bg-transparent text-violet-400/70 border-violet-400/30 hover:border-violet-400/50 hover:bg-violet-400/5',
    },
    Science: {
        active: 'bg-blue-400 text-slate-900 border-blue-400',
        inactive: 'bg-transparent text-blue-400/70 border-blue-400/30 hover:border-blue-400/50 hover:bg-blue-400/5',
    },
    Resources: {
        active: 'bg-amber-400 text-slate-900 border-amber-400',
        inactive: 'bg-transparent text-amber-400/70 border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/5',
    },
    Tools: {
        active: 'bg-emerald-400 text-slate-900 border-emerald-400',
        inactive: 'bg-transparent text-emerald-400/70 border-emerald-400/30 hover:border-emerald-400/50 hover:bg-emerald-400/5',
    },
};

interface FilterTagBarProps {
    activeFilter: MegaMenuFilterTag;
    onFilterChange: (filter: MegaMenuFilterTag) => void;
    resultCounts: Record<MegaMenuFilterTag, number>;
}

const FilterTagBar: React.FC<FilterTagBarProps> = ({ activeFilter, onFilterChange, resultCounts }) => {
    const tagRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
        let newIndex = currentIndex;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            newIndex = (currentIndex + 1) % FILTER_TAGS.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            newIndex = currentIndex === 0 ? FILTER_TAGS.length - 1 : currentIndex - 1;
        } else if (event.key === 'Home') {
            event.preventDefault();
            newIndex = 0;
        } else if (event.key === 'End') {
            event.preventDefault();
            newIndex = FILTER_TAGS.length - 1;
        }

        if (newIndex !== currentIndex) {
            const nextTag = FILTER_TAGS[newIndex];
            if (!nextTag) return;

            onFilterChange(nextTag.value);
            const buttons = tagRef.current?.querySelectorAll('button');
            buttons?.[newIndex]?.focus();
        }
    }, [onFilterChange]);

    return (
        <div
            ref={tagRef}
            className="py-2 mb-4"
            role="radiogroup"
            aria-label="Filter search results by category"
        >
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 flex items-center gap-1.5 shrink-0 mb-2">
                <Filter size={10} /> Filter
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
                {FILTER_TAGS.map((tag, index) => {
                    const isActive = activeFilter === tag.value;
                    const count = resultCounts[tag.value];
                    
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
                                inline-flex items-center gap-1 px-2.5 py-1 min-h-[32px]
                                rounded-full border text-[11px] font-semibold 
                                transition-colors duration-150 ease-in-out
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500
                                ${isActive ? filterTagStyles[tag.value].active : filterTagStyles[tag.value].inactive}
                            `}
                        >
                            <span>{tag.label}</span>
                            {count > 0 && (
                                <span 
                                    className={`
                                        text-[9px] px-1 py-0.5 rounded-full min-w-[16px] text-center
                                        ${isActive ? 'bg-black/20' : 'bg-current/10'}
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

// Type definitions
interface SearchResultItem {
    id: number;
    title: string;
    category: string;
    desc: string;
    type: string;
}

interface FeaturedConfig {
    title: string;
    badge: string;
    badgeColor: string;
    desc: string;
    scienceScore?: number;
    points?: string[];
    action: string;
}

interface TechColorConfig {
    activeBg: string;
    activeBorder: string;
    activeShadow: string;
    iconActiveBg: string;
    iconActiveShadow: string;
    iconDefaultBg: string;
    iconDefaultText: string;
    subtitleActive: string;
    subtitleDefault: string;
    barActive: string;
    arrowActive: string;
    shimmer: string;
    featured: FeaturedConfig;
    trendingTags: string[];
}

interface MegaMenuPanelProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchFocus: () => void;
    onSearchClear: () => void;
    showResults: boolean;
    debouncedQuery: string;
    onResultClick: (item: SearchResultItem) => void;
    currentConfig: TechColorConfig;
    searchContainerRef: React.RefObject<HTMLDivElement>;
}

export const MegaMenuPanel: React.FC<MegaMenuPanelProps> = ({
    searchQuery, onSearchChange, onSearchFocus, onSearchClear,
    showResults, debouncedQuery, onResultClick, currentConfig,
    searchContainerRef
}) => {
    // Filter state
    const [activeFilter, setActiveFilter] = useState<MegaMenuFilterTag>('all');
    // Recent searches state
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    // Recent pages state
    const [recentPages, setRecentPages] = useState<RecentPage[]>([]);

    // Load recent searches and pages on mount
    useEffect(() => {
        setRecentSearches(getRecentSearches());
        setRecentPages(getRecentPages());
    }, []);

    // Refresh recent searches when dropdown opens
    useEffect(() => {
        if (showResults) {
            setRecentSearches(getRecentSearches());
        }
    }, [showResults]);

    // Handle result click with recent search save
    const handleResultClick = (item: SearchResultItem) => {
        addRecentSearch(searchQuery || item.title);
        onResultClick(item);
    };

    /**
     * Smart fuzzy search with synonym expansion and relevance scoring
     * Matches against: title, category, desc, keywords, and related terms
     * Also expands query using synonyms for intelligent matching
     */
    const filteredResults = useMemo((): (SearchDatabaseItem & { score: number })[] => {
        if (debouncedQuery.length === 0) return [];
        
        const query = debouncedQuery.toLowerCase().trim();
        const queryWords = query.split(/\s+/).filter(w => w.length > 0);
        
        // Expand query with synonyms
        const expandedTerms = new Set<string>([query, ...queryWords]);
        queryWords.forEach(word => {
            const synonyms = SEARCH_SYNONYMS[word];
            if (synonyms) {
                synonyms.forEach(s => expandedTerms.add(s));
            }
        });
        
        // Score and filter items
        const scored = SEARCH_DATABASE.map(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();
            const categoryLower = item.category.toLowerCase();
            const descLower = item.desc.toLowerCase();
            const keywords = item.keywords || [];
            const relatedTerms = item.relatedTerms || [];
            
            // Check each query word and its synonyms
            queryWords.forEach(word => {
                // Exact title match (highest priority)
                if (titleLower === word) score += 100;
                else if (titleLower.startsWith(word)) score += 80;
                else if (titleLower.includes(word)) score += 60;
                
                // Category match
                if (categoryLower.includes(word)) score += 40;
                
                // Description match
                if (descLower.includes(word)) score += 20;
                
                // Keywords match (important for product discovery)
                keywords.forEach(kw => {
                    if (kw === word) score += 50;
                    else if (kw.startsWith(word)) score += 35;
                    else if (kw.includes(word)) score += 25;
                });
                
                // Related terms match
                relatedTerms.forEach(rt => {
                    if (rt.includes(word)) score += 15;
                });
            });
            
            // Check expanded synonyms (lower weight - these are inferred matches)
            expandedTerms.forEach(term => {
                if (!queryWords.includes(term)) {
                    if (keywords.some(kw => kw.includes(term))) score += 10;
                    if (relatedTerms.some(rt => rt.includes(term))) score += 5;
                }
            });
            
            // Prefix matching for partial words (e.g., "hyper" matches "hyperbaric")
            queryWords.forEach(word => {
                if (word.length >= 3) {
                    keywords.forEach(kw => {
                        if (kw.startsWith(word) && !kw.includes(word)) score += 20;
                    });
                }
            });
            
            return { ...item, score };
        });
        
        // Filter items with score > 0 and sort by relevance
        return scored
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
    }, [debouncedQuery]);

    const groupedResults = useMemo(() => {
        if (filteredResults.length === 0) return [];
        const categories = Array.from(new Set(filteredResults.map(i => i.category)));
        return categories.map(cat => ({
            category: cat,
            items: filteredResults.filter(i => i.category === cat),
        }));
    }, [filteredResults]);

    // Result counts per category for filter badges
    const resultCounts = useMemo((): Record<MegaMenuFilterTag, number> => {
        const counts: Record<string, number> = {};
        filteredResults.forEach(item => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return {
            all: filteredResults.length,
            Products: counts['Products'] || 0,
            Protocols: counts['Protocols'] || 0,
            Science: counts['Science'] || 0,
            Resources: counts['Resources'] || 0,
            Tools: counts['Tools'] || 0,
        };
    }, [filteredResults]);

    // Filtered grouped results based on active filter
    const displayResults = useMemo(() => {
        if (activeFilter === 'all') {
            return groupedResults;
        }
        return groupedResults.filter(group => group.category === activeFilter);
    }, [groupedResults, activeFilter]);

    // Reset filter when search changes
    useEffect(() => {
        setActiveFilter('all');
    }, [debouncedQuery]);

    return (
        <div className="col-span-4 p-10 relative flex flex-col overflow-hidden group/panel">
            {/* Quick Search Bar */}
            <div className="relative z-40 mb-12 mt-2" ref={searchContainerRef}>
                <div className="relative group/search">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/search:text-white transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={onSearchChange}
                        onFocus={onSearchFocus}
                        placeholder={'Search Hylono Intelligence\u2026'}
                        aria-label="Search"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-white/20 transition-[background-color,border-color,box-shadow] focus:border-cyan-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                    {searchQuery.length > 0 && (
                        <button
                            onClick={onSearchClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Instant Results Dropdown */}
                <AnimatePresence>
                    {/* Show recent/popular when focused with empty query */}
                    {showResults && searchQuery.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={SEARCH_TRANSITION}
                            className="absolute top-full left-0 right-0 mt-3 bg-[#0d1821] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Recent Pages */}
                            {recentPages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 flex items-center gap-1.5">
                                        <ArrowRight size={10} /> Recent pages
                                    </p>
                                    <div className="space-y-1">
                                        {recentPages.slice(0, 3).map((page) => (
                                            <button
                                                key={page.url}
                                                onClick={() => {
                                                    // Navigate to page - create a mock result item
                                                    handleResultClick({ id: 0, title: page.title, category: '', desc: '', type: '' });
                                                }}
                                                className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                <ArrowRight size={10} className="text-white/30" />
                                                <span className="text-[11px] text-white/70">{page.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recentSearches.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3 flex items-center gap-1.5">
                                        <FileText size={10} /> Recent searches
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((recent) => (
                                            <button
                                                key={recent}
                                                onClick={() => {
                                                    // Set search query - need to call parent handler
                                                    const event = { target: { value: recent } } as React.ChangeEvent<HTMLInputElement>;
                                                    onSearchChange(event);
                                                }}
                                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                                            >
                                                {recent}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 mb-3">Popular searches</p>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                const event = { target: { value: term } } as React.ChangeEvent<HTMLInputElement>;
                                                onSearchChange(event);
                                            }}
                                            className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold text-cyan-400/80 transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/20 hover:text-cyan-300"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Show results when there's a query */}
                    {showResults && searchQuery.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={SEARCH_TRANSITION}
                            className="absolute top-full left-0 right-0 mt-3 bg-[#0d1821] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden max-h-[450px] overflow-y-auto custom-scrollbar"
                        >
                            {/* Filter Tag Bar */}
                            <FilterTagBar
                                activeFilter={activeFilter}
                                onFilterChange={setActiveFilter}
                                resultCounts={resultCounts}
                            />
                            
                            {displayResults.length > 0 ? (
                                <div className="p-2 space-y-6">
                                    {displayResults.map(group => {
                                        const colors = categoryColors[group.category] || { text: 'text-cyan-400', dot: 'bg-cyan-400' };
                                        return (
                                            <div key={group.category}>
                                                <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text} mb-3 px-3 flex items-center gap-2 futuristic-font`}>
                                                    <div className={`w-1 h-1 rounded-full ${colors.dot}`} />
                                                    {group.category}
                                                </div>
                                            <div className="space-y-1">
                                                {group.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => onResultClick(item)}
                                                        className="group/res flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-white/5"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-200 group-hover/res:text-white transition-colors futuristic-font">{item.title}</div>
                                                            <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                                                        </div>
                                                        <ArrowRight size={14} className="text-slate-600 opacity-0 transition-[opacity,transform] group-hover/res:translate-x-1 group-hover/res:opacity-100" />
                                                    </button>
                                                ))}
                                            </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <Pointer size={24} className="opacity-20 mx-auto mb-3" />
                                    <div className="text-sm text-slate-400 mb-4">No intelligence match for "<span className="text-slate-300">{searchQuery}</span>"</div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => onResultClick({ id: 0, title: 'Contact', category: '', desc: '', type: '' })}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 transition-colors hover:bg-cyan-500/20"
                                        >
                                            Contact us <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Context Dynamic View */}
            <div className="flex-1 flex flex-col relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentConfig.featured.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={CONTEXT_TRANSITION}
                        className="flex-1 flex flex-col"
                    >
                        <div className="mb-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 ${currentConfig.featured.badgeColor}`}>
                                {currentConfig.featured.badge}
                            </span>
                        </div>

                        <h2 className="text-4xl font-black text-white leading-tight mb-6 whitespace-pre-line tracking-tight futuristic-font">
                            {currentConfig.featured.title}
                        </h2>

                        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-[90%]">
                            {currentConfig.featured.desc}
                        </p>

                        {currentConfig.featured.points && (
                            <div className="space-y-3 mb-8">
                                {currentConfig.featured.points.map((p: string) => (
                                    <div key={p} className="flex items-center gap-3 group/item">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover/item:bg-cyan-400 transition-colors" />
                                        <span className="text-sm text-slate-400 group-hover/item:text-slate-200 transition-colors">{p}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};


