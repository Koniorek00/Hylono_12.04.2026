import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { PageNavigatorDropdown } from '../../src/components/ui/BreadcrumbBar/PageNavigatorDropdown';

interface BreadcrumbsProps {
    pathParts: string[];
    onNavigate: (page: string) => void;
}

// Helper to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const PAGE_LABELS: Record<string, string> = {
    'home': 'Concept',
    'product': 'Store',
    'wellness-planner': 'Wellness Planner',
    'dashboard': 'Portal',
    'store': 'Store',
    'blog': 'Science & Research',
    'evidence': 'Clinical Library',
    'advisory-board': 'Medical Advisory',
    'outcomes': 'Bio-Tracking',
    'checkout': 'Checkout',
    'privacy': 'Privacy',
    'terms': 'Terms',
    'shipping': 'Shipping',
    'HBOT': 'Hyperbaric',
    'PEMF': 'PEMF',
    'RLT': 'Red Light',
    'HYDROGEN': 'Hydrogen'
};

const dropdownEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Dropdown animation variants
const dropdownVariants: Variants = {
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.95,
        transition: { duration: 0.15, ease: dropdownEase },
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.15, ease: dropdownEase },
    },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathParts, onNavigate }) => {
    // Filter out empty parts
    const parts = pathParts.filter(p => p !== '');
    const reduced = useReducedMotion();
    
    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Close dropdown on Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isDropdownOpen) {
                setIsDropdownOpen(false);
                buttonRef.current?.focus();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isDropdownOpen]);

    // Don't show on Home only
    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'home')) return null;

    return (
        <nav className="flex items-center justify-between text-[13px] uppercase tracking-[0.2em] font-medium text-slate-400 px-6 max-w-7xl mx-auto futuristic-font">
            {/* Left: Breadcrumb navigation */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onNavigate('home')}
                    className="hover:text-cyan-500 transition-colors flex items-center gap-1.5 futuristic-font"
                >
                    <Home size={13} />
                    <span>Concept</span>
                </button>

                {parts.map((part, index) => {
                    const label = PAGE_LABELS[part] || capitalizeWords(part);
                    const isLast = index === parts.length - 1;

                    // Construct path for click (simplified for this app structure)
                    // Map 'product' to 'store' since 'product' alone isn't a valid page
                    const getNavigationTarget = () => {
                        const pathPart = parts.slice(0, index + 1).join('/');
                        // 'product' breadcrumb should navigate to store page
                        if (pathPart === 'product') return 'store';
                        return pathPart;
                    };
                    const target = getNavigationTarget();

                    return (
                        <div key={part} className="flex items-center space-x-2">
                            <ChevronRight size={13} className="text-slate-300" />
                            <motion.button
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => !isLast && onNavigate(target)}
                                disabled={isLast}
                                className={`futuristic-font ${isLast ? 'text-slate-900 font-bold' : 'hover:text-cyan-500 transition-colors'
                                    }`}
                            >
                                {label}
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Right: Page Navigator dropdown */}
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5
                        text-[11px] uppercase tracking-[0.15em] font-medium
                        rounded-lg transition-all duration-200
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2
                        ${isDropdownOpen
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                        }
                    `}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    aria-label="Page sections navigation"
                >
                    <List size={12} aria-hidden="true" />
                    <span className="hidden sm:inline">On This Page</span>
                    <span className="sm:hidden">Navigate</span>
                    <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                    >
                        <ChevronDown size={12} aria-hidden="true" />
                    </motion.span>
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            ref={dropdownRef}
                            variants={reduced ? undefined : dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={`
                                absolute right-0 mt-2
                                w-[280px] max-w-[calc(100vw-48px)]
                                bg-white/95 backdrop-blur-md
                                border border-slate-200
                                rounded-xl shadow-xl shadow-slate-900/15
                                overflow-hidden
                            `}
                            role="menu"
                            aria-label="Page sections"
                        >
                            <PageNavigatorDropdown
                                onSectionClick={() => setIsDropdownOpen(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
