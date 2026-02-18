import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, ShoppingBag, FileText, HelpCircle, Zap, Clock } from 'lucide-react';

interface SearchResult {
    id: string;
    type: 'product' | 'blog' | 'faq' | 'tech' | 'page';
    title: string;
    description: string;
    url: string;
    price?: number;
    category?: string;
}

// Sample searchable content
const searchableContent: SearchResult[] = [
    // Products
    { id: 'p1', type: 'product', title: 'HBOT Chamber Pro 1.5 ATA', description: 'Professional hyperbaric chamber for home and clinic use', url: 'store', price: 45000, category: 'HBOT' },
    { id: 'p2', type: 'product', title: 'HBOT Chamber Elite 2.0 ATA', description: 'Medical-grade hyperbaric oxygen therapy chamber', url: 'store', price: 75000, category: 'HBOT' },
    { id: 'p3', type: 'product', title: 'PEMF Mat Advanced', description: 'Full-body pulsed electromagnetic field therapy mat', url: 'store', price: 12000, category: 'PEMF' },
    { id: 'p4', type: 'product', title: 'Red Light Panel 600W', description: 'High-power photobiomodulation panel', url: 'store', price: 8500, category: 'RLT' },
    { id: 'p5', type: 'product', title: 'Hydrogen Generator Pro', description: 'Medical-grade hydrogen water generator', url: 'store', price: 15000, category: 'Hydrogen' },
    // Blog
    { id: 'b1', type: 'blog', title: 'The Science of Hyperbaric Oxygen Therapy', description: 'Understanding how HBOT accelerates healing at the cellular level', url: 'blog' },
    { id: 'b2', type: 'blog', title: 'PEMF Therapy for Athletes', description: 'How professional athletes use PEMF for faster recovery', url: 'blog' },
    { id: 'b3', type: 'blog', title: 'Red Light Therapy Benefits', description: 'Complete guide to photobiomodulation and skin health', url: 'blog' },
    // FAQ
    { id: 'f1', type: 'faq', title: 'How does HBOT work?', description: 'Hyperbaric oxygen therapy increases oxygen saturation in blood and tissues', url: 'faq' },
    { id: 'f2', type: 'faq', title: 'Is PEMF therapy safe?', description: 'PEMF is FDA-approved and has been used safely for decades', url: 'faq' },
    { id: 'f3', type: 'faq', title: 'What warranty do you offer?', description: 'All products include 2-year comprehensive warranty', url: 'warranty' },
    { id: 'f4', type: 'faq', title: 'Do you ship internationally?', description: 'We ship to all EU countries with free shipping over 5000 PLN', url: 'shipping' },
    // Tech Pages
    { id: 't1', type: 'tech', title: 'HBOT Technology', description: 'Hyperbaric Oxygen Therapy - Cellular regeneration through pressurized oxygen', url: 'tech-hbot' },
    { id: 't2', type: 'tech', title: 'PEMF Technology', description: 'Pulsed Electromagnetic Field therapy for cellular activation', url: 'tech-pemf' },
    { id: 't3', type: 'tech', title: 'Red Light Therapy', description: 'Photobiomodulation for skin, muscle, and mitochondrial health', url: 'tech-rlt' },
    { id: 't4', type: 'tech', title: 'Hydrogen Therapy', description: 'Molecular hydrogen for antioxidant and anti-inflammatory benefits', url: 'tech-hydrogen' },
    // Pages
    { id: 'pg1', type: 'page', title: 'About Us', description: 'Learn about Hylono mission and team', url: 'about' },
    { id: 'pg2', type: 'page', title: 'Contact', description: 'Get in touch with our team', url: 'contact' },
    { id: 'pg3', type: 'page', title: 'Partner Program', description: 'Become a Hylono partner or distributor', url: 'partners' },
    { id: 'pg4', type: 'page', title: 'Careers', description: 'Join our growing team', url: 'careers' },
];

const typeIcons = {
    product: <ShoppingBag size={14} />,
    blog: <FileText size={14} />,
    faq: <HelpCircle size={14} />,
    tech: <Zap size={14} />,
    page: <ArrowRight size={14} />
};

const typeLabels = {
    product: 'Product',
    blog: 'Blog',
    faq: 'FAQ',
    tech: 'Technology',
    page: 'Page'
};

interface GlobalSearchProps {
    onNavigate: (page: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('hylono_recent_searches');
        if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
    }, []);

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return searchableContent
            .filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.category?.toLowerCase().includes(q)
            )
            .slice(0, 8);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        // Save to recent searches
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('hylono_recent_searches', JSON.stringify(updated));

        setIsOpen(false);
        setQuery('');
        onNavigate(result.url);
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 text-sm"
            >
                <Search size={16} />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden md:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-[15%] inset-x-4 max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-4 p-4 border-b border-slate-100">
                                <Search className="text-slate-400" size={20} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search products, articles, FAQ..."
                                    className="flex-1 text-lg outline-none placeholder-slate-400"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {query.trim() ? (
                                    results.length > 0 ? (
                                        <div className="p-2">
                                            {results.map((result, i) => (
                                                <button
                                                    key={result.id}
                                                    onClick={() => handleSelect(result)}
                                                    className="w-full flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl text-left transition-colors"
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.type === 'product' ? 'bg-cyan-100 text-cyan-600' :
                                                            result.type === 'blog' ? 'bg-purple-100 text-purple-600' :
                                                                result.type === 'faq' ? 'bg-amber-100 text-amber-600' :
                                                                    result.type === 'tech' ? 'bg-emerald-100 text-emerald-600' :
                                                                        'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {typeIcons[result.type]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-slate-900">{result.title}</span>
                                                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                                                                {typeLabels[result.type]}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 truncate">{result.description}</p>
                                                        {result.price && (
                                                            <p className="text-sm font-bold text-cyan-600 mt-1">{result.price.toLocaleString()} PLN</p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-400">
                                            <Search size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>No results for "{query}"</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="p-4">
                                        {recentSearches.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <Clock size={12} /> Recent Searches
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {recentSearches.map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => setQuery(s)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600"
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Popular</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['HBOT', 'PEMF', 'Red Light', 'Warranty', 'Financing'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 rounded-full text-sm text-cyan-700"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                                <span>Press <kbd className="px-1 py-0.5 bg-white rounded border">↵</kbd> to select</span>
                                <span>Press <kbd className="px-1 py-0.5 bg-white rounded border">Esc</kbd> to close</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
