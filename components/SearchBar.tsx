import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Hexagon } from 'lucide-react';
import { TECH_DETAILS } from '../constants';
import { TechType } from '../types';

interface SearchBarProps {
    onSelectTech: (tech: TechType) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectTech }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // Simple search through tech details
    const searchResults = query.length > 1
        ? Object.values(TECH_DETAILS).filter(tech =>
            tech.name.toLowerCase().includes(query.toLowerCase()) ||
            tech.tagline.toLowerCase().includes(query.toLowerCase()) ||
            tech.descriptionStandard.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleSelect = (techId: TechType) => {
        onSelectTech(techId);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
                <Search size={20} className="text-slate-600" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />

                        <div className="relative max-w-2xl mx-auto mt-32 px-4">
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-label="Search"
                                initial={{ scale: 0.95, y: -20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: -20 }}
                                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                                    <Search size={20} className="text-slate-400" aria-hidden="true" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search technologies, protocols..."
                                        aria-label="Search technologies, protocols"
                                        className="flex-1 text-lg outline-none"
                                    />
                                    <button onClick={() => setIsOpen(false)} aria-label="Close search" className="text-slate-400 hover:text-slate-600">
                                        <X size={20} aria-hidden="true" />
                                    </button>
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.map((tech) => (
                                            <button
                                                key={tech.id}
                                                onClick={() => handleSelect(tech.id)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <Hexagon size={20} className="text-slate-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">{tech.name}</h3>
                                                    <p className="text-sm text-slate-500">{tech.tagline}</p>
                                                </div>
                                                <ArrowRight size={16} className="text-slate-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {query.length > 1 && searchResults.length === 0 && (
                                    <div className="p-8 text-center text-slate-400">
                                        No results found for "{query}"
                                    </div>
                                )}

                                {query.length <= 1 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        Start typing to search...
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

