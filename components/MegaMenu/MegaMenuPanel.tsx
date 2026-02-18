import React, { useMemo, useCallback } from 'react';
import { Search, X, Pointer, FileText, Sparkles, Files, FlaskConical, FileBarChart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuContext, SEARCH_DATABASE } from './MegaMenuData';

const SEARCH_TRANSITION = { duration: 0.12, ease: "easeOut" as const };
const CONTEXT_TRANSITION = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const };

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

    const filteredResults = useMemo(() => {
        if (debouncedQuery.length === 0) return [];
        const q = debouncedQuery.toLowerCase();
        return SEARCH_DATABASE.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
    }, [debouncedQuery]);

    const groupedResults = useMemo(() => {
        if (filteredResults.length === 0) return [];
        const categories = Array.from(new Set(filteredResults.map(i => i.category)));
        return categories.map(cat => ({
            category: cat,
            items: filteredResults.filter(i => i.category === cat),
        }));
    }, [filteredResults]);

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
                        placeholder="Search Hylono Intelligence..."
                        aria-label="Search"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 focus:border-cyan-500/50 transition-all placeholder:text-white/20"
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
                    {showResults && searchQuery.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={SEARCH_TRANSITION}
                            className="absolute top-full left-0 right-0 mt-3 bg-[#0d1821] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden max-h-[380px] overflow-y-auto custom-scrollbar"
                        >
                            {groupedResults.length > 0 ? (
                                <div className="p-2 space-y-6">
                                    {groupedResults.map(group => (
                                        <div key={group.category}>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-3 px-3 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-cyan-400" />
                                                {group.category}
                                            </div>
                                            <div className="space-y-1">
                                                {group.items.map(item => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => onResultClick(item)}
                                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group/res transition-all text-left"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-slate-200 group-hover/res:text-white transition-colors">{item.title}</div>
                                                            <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                                                        </div>
                                                        <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover/res:opacity-100 group-hover/res:translate-x-1 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                                    <Pointer size={24} className="opacity-20" />
                                    <div className="text-sm">No intelligence match for "<span className="text-slate-300">{searchQuery}</span>"</div>
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

                        <h2 className="text-4xl font-black text-white leading-tight mb-6 whitespace-pre-line tracking-tight">
                            {currentConfig.featured.title}
                        </h2>

                        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-[90%]">
                            {currentConfig.featured.desc}
                        </p>

                        {/* Status/Points Display */}
                        {currentConfig.featured.scienceScore && (
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 group-hover/panel:bg-white/[0.05] transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-cyan-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Clinical Confidence</span>
                                    </div>
                                    <span className="text-xl font-bold text-cyan-400">{currentConfig.featured.scienceScore}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${currentConfig.featured.scienceScore}%` }}
                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                                    />
                                </div>
                            </div>
                        )}

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

                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                                {currentConfig.trendingTags.map((tag: string) => (
                                    <span 
                                        key={tag} 
                                        className="text-[9px] uppercase tracking-widest font-bold text-slate-500 px-2 py-1 rounded-md bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:text-slate-300 hover:border-white/20 transition-all cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <button className="flex items-center gap-3 text-white font-bold text-sm group/btn hover:text-cyan-400 transition-all uppercase tracking-widest">
                                {currentConfig.featured.action}
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-cyan-500 group-hover/btn:text-black transition-all">
                                    <ArrowRight size={16} />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
