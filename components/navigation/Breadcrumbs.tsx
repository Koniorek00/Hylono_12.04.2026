import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbsProps {
    pathParts: string[];
    onNavigate: (page: string) => void;
}

const PAGE_LABELS: Record<string, string> = {
    'home': 'Concept',
    'product': 'Store',
    'builder': 'Configurator',
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

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathParts, onNavigate }) => {
    // Filter out empty parts
    const parts = pathParts.filter(p => p !== '');

    // Don't show on Home only
    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'home')) return null;

    return (
        <nav className="flex items-center space-x-2 text-[13px] uppercase tracking-[0.2em] font-medium text-slate-400 px-6 max-w-7xl mx-auto">
            <button
                onClick={() => onNavigate('home')}
                className="hover:text-cyan-500 transition-colors flex items-center gap-1.5"
            >
                <Home size={13} />
                <span>Concept</span>
            </button>

            {parts.map((part, index) => {
                const label = PAGE_LABELS[part] || part.replace(/-/g, ' ');
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
                            className={`${isLast ? 'text-slate-900 font-bold' : 'hover:text-cyan-500 transition-colors'
                                }`}
                        >
                            {label}
                        </motion.button>
                    </div>
                );
            })}
        </nav>
    );
};
