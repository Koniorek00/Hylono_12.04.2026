import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout, Brain, Shield,
    ArrowRight, Box, X,
    Hexagon, Globe, Briefcase, Network, Award
} from 'lucide-react';
import { TechType } from '../types';
import {
    MenuContext, TECH_CARDS, CONTEXT_CONFIG_STORE, SEARCH_DATABASE
} from './MegaMenu/MegaMenuData';
import {
    SectionHeader, TechHoloCard, GlassLink, SimpleLink
} from './MegaMenu/MegaMenuSection';
import { MegaMenuPanel } from './MegaMenu/MegaMenuPanel';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string, techId?: TechType, mode?: 'standard' | 'expert') => void;
}

const MENU_SPRING = { type: "spring" as const, damping: 30, stiffness: 400 };

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onNavigate }) => {
    const [activeContext, setActiveContext] = useState<MenuContext>('NEUTRAL');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const showResultsRef = useRef(showResults);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Focus trap for accessibility
    const megaMenuRef = useFocusTrap({ 
        active: isOpen, 
        onDeactivate: onClose,
        escapeDeactivates: true,
        clickOutsideDeactivates: false
    });

    showResultsRef.current = showResults;

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setDebouncedQuery('');
            setShowResults(false);
            setActiveContext('NEUTRAL');
        }
    }, [isOpen]);

    // Handle click outside to close mega menu - works regardless of scroll position
    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            // Close search results if clicking outside search container
            if (
                showResultsRef.current &&
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 0) setShowResults(true);

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedQuery(value);
        }, 80);
    }, []);

    const handleSearchClear = useCallback(() => {
        setSearchQuery('');
        setDebouncedQuery('');
        setShowResults(false);
    }, []);

    const handleSearchFocus = useCallback(() => {
        if (searchQuery.length > 0) setShowResults(true);
    }, [searchQuery.length]);

    const currentConfig = useMemo(
        () => CONTEXT_CONFIG_STORE[activeContext] || CONTEXT_CONFIG_STORE.NEUTRAL,
        [activeContext]
    );

    const handleContextReset = useCallback(() => setActiveContext('NEUTRAL'), []);
    const handleTechClick = useCallback((tech: 'HBOT' | 'PEMF' | 'RLT' | 'HYDROGEN') => {
        onNavigate('product', TechType[tech]);
    }, [onNavigate]);

    const navigateTo = useCallback((page: string) => () => {
        onNavigate(page);
    }, [onNavigate]);

    interface SearchResultItem {
        type: string;
        id: number;
        title: string;
        category: string;
        desc: string;
    }

    const handleSearchResultClick = useCallback((item: SearchResultItem) => {
        if (item.type === 'hbot') onNavigate('product', TechType.HBOT);
        else if (item.type === 'pemf') onNavigate('product', TechType.PEMF);
        else if (item.type === 'rlt') onNavigate('product', TechType.RLT);
        else if (item.type === 'hydrogen') onNavigate('product', TechType.HYDROGEN);
        onClose();
    }, [onNavigate, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70]"
                    />

                    <motion.div
                        role="menu"
                        aria-expanded={isOpen}
                        aria-label="Navigation menu"
                        initial={{ opacity: 0, y: -40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={MENU_SPRING}
                        className="absolute top-full left-0 right-0 mt-4 mx-auto max-w-[1400px] w-[95vw] h-[620px] rounded-3xl z-[80] overflow-hidden ring-1 ring-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0e3c50] to-slate-950" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                        <div
                            className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[180px] -translate-y-1/2 translate-x-1/4 opacity-20 mix-blend-screen ${currentConfig.glow}`}
                            style={{ transition: 'all 800ms cubic-bezier(0.25, 0.1, 0.25, 1)' }}
                        />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-50 backdrop-blur-md border border-white/5"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 grid grid-cols-12 h-full">
                            {/* COLUMN 1: SYSTEMS */}
                            <div className="col-span-3 p-8 border-r border-white/5 flex flex-col backdrop-blur-sm bg-black/20" onMouseLeave={handleContextReset}>
                                <SectionHeader icon={<Hexagon size={14} />} title="Systems" color="text-cyan-400" />
                                <div className="space-y-4 flex-1 mt-6">
                                    {TECH_CARDS.map(tech => (
                                        <TechHoloCard
                                            key={tech.context}
                                            context={tech.context as MenuContext}
                                            title={tech.title}
                                            subtitle={tech.subtitle}
                                            icon={tech.icon}
                                            activeContext={activeContext}
                                            onHover={setActiveContext}
                                            onClick={() => handleTechClick(tech.context as any)}
                                            color={tech.color}
                                            href={`/product/${tech.context}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* COLUMN 2: INTELLIGENCE & NETWORK */}
                            <div className="col-span-3 p-8 border-r border-white/5 flex flex-col backdrop-blur-sm bg-black/5" onMouseLeave={handleContextReset}>
                                <SectionHeader icon={<Layout size={14} />} title="Intelligence" color="text-indigo-400" />
                                <div className="mt-8 space-y-2">
                                    <GlassLink
                                        icon={<Box />} title="Zone Configurator" sub="3D Space Builder"
                                        onClick={navigateTo('builder')}
                                        onHover={() => setActiveContext('BUILDER')}
                                        dimmed={false} color="text-amber-300" bg="bg-amber-300/10"
                                        href="/builder"
                                    />
                                    <GlassLink
                                        icon={<Brain />} title="Protocol Codex" sub="Bio-Stacks"
                                        onClick={navigateTo('protocols')}
                                        onHover={() => setActiveContext('PROTOCOLS')}
                                        dimmed={false} color="text-emerald-400" bg="bg-emerald-400/10"
                                        href="/protocols"
                                    />
                                </div>

                                <div className="mt-12">
                                    <SectionHeader icon={<Network size={14} />} title="Network" color="text-amber-400" />
                                    <div className="mt-6 space-y-2">
                                        <GlassLink
                                            icon={<Award />} title="Partner Portal" sub="For Clinics"
                                            onClick={navigateTo('partners')}
                                            onHover={() => setActiveContext('PARTNERS')}
                                            dimmed={false} color="text-orange-400" bg="bg-orange-400/10"
                                            href="/partners"
                                        />
                                        <GlassLink
                                            icon={<Globe />} title="Find Center" sub="Global Map"
                                            onClick={navigateTo('locator')}
                                            onHover={() => setActiveContext('LOCATOR')}
                                            dimmed={false} color="text-teal-400" bg="bg-teal-400/10"
                                            href="/locator"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 3: COMPANY */}
                            <div className="col-span-2 p-8 border-r border-white/5 flex flex-col backdrop-blur-sm bg-black/0" onMouseLeave={handleContextReset}>
                                <SectionHeader icon={<Shield size={14} />} title="Hylono" color="text-white/40" />
                                <div className="mt-8 space-y-6">
                                    <div className="space-y-4">
                                        <SimpleLink label="Mission" onHover={() => setActiveContext('MISSION')} onClick={navigateTo('about')} href="/about" />
                                        <SimpleLink label="Science" onHover={() => setActiveContext('SCIENCE')} onClick={navigateTo('blog')} href="/blog" />
                                        <SimpleLink label="Careers" onHover={() => setActiveContext('CAREERS')} onClick={navigateTo('careers')} href="/careers" />
                                        <SimpleLink label="Contact" onHover={() => setActiveContext('CONTACT')} onClick={navigateTo('contact')} href="/contact" />
                                    </div>
                                    <div className="h-px w-12 bg-white/10" />
                                    <div className="space-y-4">
                                        <SimpleLink label="Support" onHover={handleContextReset} onClick={navigateTo('support')} href="/support" />
                                        <SimpleLink label="Warranty" onHover={handleContextReset} onClick={navigateTo('warranty')} href="/warranty" />
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 4: PANEL */}
                            <MegaMenuPanel
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                onSearchFocus={handleSearchFocus}
                                onSearchClear={handleSearchClear}
                                showResults={showResults}
                                debouncedQuery={debouncedQuery}
                                onResultClick={handleSearchResultClick}
                                currentConfig={currentConfig}
                                searchContainerRef={searchContainerRef}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
