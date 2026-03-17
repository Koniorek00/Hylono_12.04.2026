import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, X, Check, ChevronDown, RotateCcw } from 'lucide-react';

export interface FilterState {
    priceRange: [number, number];
    rentalPriceRange: [number, number];
    technologies: string[];
    goals: string[];
    categories: string[];
    pressureRating: string[];
    availability: string;
    sortBy: string;
}

const defaultFilters: FilterState = {
    priceRange: [0, 100000],
    rentalPriceRange: [0, 3000],
    technologies: [],
    goals: [],
    categories: [],
    pressureRating: [],
    availability: 'all',
    sortBy: 'featured'
};

const PRICE_PRESETS: Array<[number, number]> = [
    [0, 10000],
    [10000, 30000],
    [30000, 60000],
    [60000, 100000],
];

const RENTAL_PRICE_PRESETS: Array<[number, number]> = [
    [0, 300],
    [300, 800],
    [800, 1500],
    [1500, 3000],
];

interface ProductFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    productCount?: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, productCount = 0 }) => {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>('technology');

    const technologies = [
        { value: 'mHBOT', label: 'Hyperbaric chambers' },
        { value: 'H2', label: 'Hydrogen' },
        { value: 'RLT', label: 'Red light / NIR' },
        { value: 'PEMF', label: 'PEMF' },
        { value: 'O2', label: 'Oxygen concentrators' },
    ];
    const goals = [
        { value: 'recovery', label: 'Sports recovery' },
        { value: 'sleep', label: 'Sleep' },
        { value: 'stress', label: 'Stress' },
        { value: 'comfort', label: 'Comfort & renewal' },
    ];
    const categories = ['Chambers', 'Mats & Pads', 'Panels', 'Generators', 'Accessories'];
    const pressureRatings = ['1.3 ATA', '1.5 ATA', '2.0 ATA', '2.4 ATA'];
    const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' },
        { value: 'rating', label: 'Best Rated' }
    ];

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.technologies.length) count++;
        if (filters.goals.length) count++;
        if (filters.categories.length) count++;
        if (filters.pressureRating.length) count++;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++;
        if (filters.rentalPriceRange[0] > 0 || filters.rentalPriceRange[1] < 3000) count++;
        if (filters.availability !== 'all') count++;
        return count;
    }, [filters]);

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (key: 'technologies' | 'goals' | 'categories' | 'pressureRating', value: string) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        updateFilter(key, updated);
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const FilterSection: React.FC<{ title: string; id: string; children: React.ReactNode }> = ({ title, id, children }) => (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                className="w-full flex items-center justify-between py-4 text-left"
                aria-expanded={expandedSection === id}
            >
                <span className="font-medium text-slate-900">{title}</span>
                <ChevronDown
                    className={`text-slate-400 ui-transition-fast ${expandedSection === id ? 'rotate-180' : ''}`}
                    size={18}
                />
            </button>
            <div className="ui-accordion-grid" data-open={expandedSection === id}>
                <div className="pb-4">{children}</div>
            </div>
        </div>
    );

    const CheckboxOption: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
        <button
            onClick={onChange}
            className="flex items-center gap-3 py-2 w-full text-left hover:bg-slate-50 rounded-lg px-2 -mx-2"
        >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300'
                }`}>
                {checked && <Check size={12} className="text-white" />}
            </div>
            <span className="text-slate-700">{label}</span>
        </button>
    );

    return (
        <>
            {/* Filter Bar (Desktop) */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <SlidersHorizontal size={18} />
                        <span className="font-medium">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2 flex-1">
                        {technologies.map(tech => (
                            <button
                                key={tech.value}
                                onClick={() => toggleArrayFilter('technologies', tech.value)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.technologies.includes(tech.value)
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {tech.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={filters.sortBy}
                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                        className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:outline-none"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Reset */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                        >
                            <RotateCcw size={14} /> Reset
                        </button>
                    )}
                </div>

                {/* Active Filters */}
                {(filters.technologies.length > 0 || filters.goals.length > 0 || filters.categories.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        {filters.technologies.map(t => (
                            <span key={t} className="flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
                                {technologies.find((tech) => tech.value === t)?.label ?? t}
                                <button onClick={() => toggleArrayFilter('technologies', t)}>
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {filters.goals.map(g => (
                            <span key={g} className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                {goals.find((goal) => goal.value === g)?.label ?? g}
                                <button onClick={() => toggleArrayFilter('goals', g)}>
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {filters.categories.map(c => (
                            <span key={c} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {c}
                                <button onClick={() => toggleArrayFilter('categories', c)}>
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Drawer (Mobile/Full) */}
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
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="product-filters-title"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 id="product-filters-title" className="text-xl font-bold text-slate-900">Filters</h2>
                                    <button onClick={() => setIsOpen(false)} aria-label="Close filters" className="p-2 hover:bg-slate-100 rounded-lg">
                                        <X size={24} aria-hidden="true" />
                                    </button>
                                </div>

                                <FilterSection title="Technology" id="technology">
                                    {technologies.map(tech => (
                                        <CheckboxOption
                                            key={tech.value}
                                            label={tech.label}
                                            checked={filters.technologies.includes(tech.value)}
                                            onChange={() => toggleArrayFilter('technologies', tech.value)}
                                        />
                                    ))}
                                </FilterSection>

                                <FilterSection title="Goal" id="goal">
                                    {goals.map(goal => (
                                        <CheckboxOption
                                            key={goal.value}
                                            label={goal.label}
                                            checked={filters.goals.includes(goal.value)}
                                            onChange={() => toggleArrayFilter('goals', goal.value)}
                                        />
                                    ))}
                                </FilterSection>

                                <FilterSection title="Category" id="category">
                                    {categories.map(cat => (
                                        <CheckboxOption
                                            key={cat}
                                            label={cat}
                                            checked={filters.categories.includes(cat)}
                                            onChange={() => toggleArrayFilter('categories', cat)}
                                        />
                                    ))}
                                </FilterSection>

                                <FilterSection title="Pressure Rating (HBOT)" id="pressure">
                                    {pressureRatings.map(pr => (
                                        <CheckboxOption
                                            key={pr}
                                            label={pr}
                                            checked={filters.pressureRating.includes(pr)}
                                            onChange={() => toggleArrayFilter('pressureRating', pr)}
                                        />
                                    ))}
                                </FilterSection>

                                <FilterSection title="Price Range" id="price">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                value={filters.priceRange[0]}
                                                onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                                placeholder="Min"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="number"
                                                value={filters.priceRange[1]}
                                                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                                placeholder="Max"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            {PRICE_PRESETS.map(([min, max]) => (
                                                <button
                                                    key={`${min}-${max}`}
                                                    onClick={() => updateFilter('priceRange', [min, max])}
                                                    className="flex-1 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg"
                                                >
                                                    {min / 1000}k-{max / 1000}k
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </FilterSection>

                                <FilterSection title="Availability" id="availability">
                                    {['all', 'rental', 'in-stock'].map(opt => (
                                        <CheckboxOption
                                            key={opt}
                                            label={opt === 'all' ? 'All Products' : opt === 'rental' ? 'Available for rental' : 'In stock'}
                                            checked={filters.availability === opt}
                                            onChange={() => updateFilter('availability', opt)}
                                        />
                                    ))}
                                </FilterSection>

                                <FilterSection title="Rental price" id="rental-price">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                value={filters.rentalPriceRange[0]}
                                                onChange={(e) =>
                                                    updateFilter('rentalPriceRange', [Number(e.target.value), filters.rentalPriceRange[1]])
                                                }
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                                placeholder="Min €/mo"
                                            />
                                            <span className="text-slate-400">-</span>
                                            <input
                                                type="number"
                                                value={filters.rentalPriceRange[1]}
                                                onChange={(e) =>
                                                    updateFilter('rentalPriceRange', [filters.rentalPriceRange[0], Number(e.target.value)])
                                                }
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                                                placeholder="Max €/mo"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            {RENTAL_PRICE_PRESETS.map(([min, max]) => (
                                                <button
                                                    key={`${min}-${max}`}
                                                    onClick={() => updateFilter('rentalPriceRange', [min, max])}
                                                    className="flex-1 py-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg"
                                                >
                                                    €{min}-€{max}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </FilterSection>
                            </div>

                            {/* Apply Button */}
                            <div className="sticky bottom-0 p-6 bg-white border-t border-slate-100">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
                                >
                                    Show {productCount} Products
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// Export filter hook for use in store
export const useProductFilters = () => {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    return { filters, setFilters };
};
