/**
 * ProductProtocolBrowser
 * Searchable dropdown for browsing products, protocols, and goals
 * Integrates with smart messaging interface
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Package, BookOpen, Target, X, Check, ChevronRight,
  DollarSign, Calendar, Star
} from 'lucide-react';
import { OptimizedImage } from './shared/OptimizedImage';
import { products } from '../content/products';
import { protocols } from '../content/protocols';
import { goals } from '../content/goals';

type BrowseCategory = 'products' | 'protocols' | 'goals';

export interface SelectedItem {
  id: string;
  type: BrowseCategory;
  title: string;
}

interface ProductProtocolBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SelectedItem) => void;
  selectedItems?: SelectedItem[];
  multiSelect?: boolean;
}

const categoryConfig = {
  products: {
    label: 'Products',
    icon: Package,
    color: 'cyan',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-200',
  },
  protocols: {
    label: 'Protocols',
    icon: BookOpen,
    color: 'violet',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
  },
  goals: {
    label: 'Goals',
    icon: Target,
    color: 'emerald',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
};

export const ProductProtocolBrowser: React.FC<ProductProtocolBrowserProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedItems = [],
  multiSelect = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<BrowseCategory | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prepare searchable items
  const searchableItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: BrowseCategory;
      title: string;
      description: string;
      image?: string;
      badge?: string;
      rating?: number;
    }> = [];

    // Add products
    products.forEach(product => {
      items.push({
        id: product.id,
        type: 'products',
        title: product.title,
        description: product.shortDescription,
        image: product.images[0],
        badge: product.rentalPlans?.[0] ? `€${product.rentalPlans[0].monthlyPrice}/mo` : `€${product.purchasePrice}`,
        rating: product.rating,
      });
    });

    // Add protocols
    protocols.forEach(protocol => {
      items.push({
        id: protocol.slug,
        type: 'protocols',
        title: protocol.title,
        description: protocol.shortDescription,
        badge: protocol.targetAudience,
      });
    });

    // Add goals
    goals.forEach(goal => {
      items.push({
        id: goal.slug,
        type: 'goals',
        title: goal.title,
        description: goal.subtitle,
      });
    });

    return items;
  }, []);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = searchableItems;

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter(item => item.type === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return items;
  }, [searchableItems, activeCategory, searchQuery]);

  // Group items by type for display
  const groupedItems = useMemo(() => {
    const groups: Record<BrowseCategory, typeof filteredItems> = {
      products: [],
      protocols: [],
      goals: [],
    };

    filteredItems.forEach(item => {
      groups[item.type].push(item);
    });

    return groups;
  }, [filteredItems]);

  const isSelected = (item: typeof searchableItems[0]) => {
    return selectedItems.some(si => si.id === item.id && si.type === item.type);
  };

  const handleItemClick = (item: typeof searchableItems[0]) => {
    onSelect({
      id: item.id,
      type: item.type,
      title: item.title,
    });
    
    if (!multiSelect) {
      onClose();
    }
  };

  const renderCategoryTabs = () => (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setActiveCategory('all')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          activeCategory === 'all'
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        All
      </button>
      {(['products', 'protocols', 'goals'] as const).map(cat => {
        const config = categoryConfig[cat];
        const Icon = config.icon;
        const count = groupedItems[cat].length;
        
        return (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat
                ? `${config.bgClass} ${config.textClass} ${config.borderClass} border`
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon size={12} />
            {config.label}
            {count > 0 && (
              <span className="text-[10px] opacity-60">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderItem = (item: typeof searchableItems[0]) => {
    const config = categoryConfig[item.type];
    const Icon = config.icon;
    const selected = isSelected(item);

    return (
      <motion.button
        key={`${item.type}-${item.id}`}
        type="button"
        onClick={() => handleItemClick(item)}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
          selected ? 'bg-cyan-50 ring-1 ring-cyan-200' : ''
        }`}
      >
        {/* Image or Icon */}
        {item.image ? (
          <OptimizedImage
            src={item.image}
            alt={item.title}
            width={48}
            height={48}
            sizes="48px"
            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
          />
        ) : (
          <div className={`w-12 h-12 rounded-lg ${config.bgClass} flex items-center justify-center`}>
            <Icon size={20} className={config.textClass} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
            {item.rating && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                <Star size={10} fill="currentColor" />
                {item.rating}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">{item.description}</p>
        </div>

        {/* Badge */}
        {item.badge && (
          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${config.bgClass} ${config.textClass}`}>
            {item.badge}
          </span>
        )}

        {/* Selected indicator */}
        {selected && (
          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
            <Check size={12} className="text-white" />
          </div>
        )}
      </motion.button>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[400px] flex flex-col"
      >
        {/* Search Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <Search size={16} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, protocols, goals..."
            className="flex-1 text-sm outline-none placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        {renderCategoryTabs()}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Package size={32} className="mx-auto mb-2 opacity-30" />
              <p>No items found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {activeCategory === 'all' ? (
                <>
                  {groupedItems.products.length > 0 && (
                    <div className="mb-3">
                      <h4 className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1">
                        <Package size={10} /> Products
                      </h4>
                      {groupedItems.products.slice(0, 3).map(renderItem)}
                      {groupedItems.products.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory('products')}
                          className="w-full text-center py-2 text-xs text-cyan-600 font-semibold hover:bg-cyan-50 rounded-lg"
                        >
                          View all {groupedItems.products.length} products
                        </button>
                      )}
                    </div>
                  )}
                  {groupedItems.protocols.length > 0 && (
                    <div className="mb-3">
                      <h4 className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1">
                        <BookOpen size={10} /> Protocols
                      </h4>
                      {groupedItems.protocols.slice(0, 2).map(renderItem)}
                      {groupedItems.protocols.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory('protocols')}
                          className="w-full text-center py-2 text-xs text-violet-600 font-semibold hover:bg-violet-50 rounded-lg"
                        >
                          View all {groupedItems.protocols.length} protocols
                        </button>
                      )}
                    </div>
                  )}
                  {groupedItems.goals.length > 0 && (
                    <div>
                      <h4 className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1">
                        <Target size={10} /> Goals
                      </h4>
                      {groupedItems.goals.slice(0, 2).map(renderItem)}
                      {groupedItems.goals.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory('goals')}
                          className="w-full text-center py-2 text-xs text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg"
                        >
                          View all {groupedItems.goals.length} goals
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                groupedItems[activeCategory].map(renderItem)
              )}
            </div>
          )}
        </div>

        {/* Selected Items Footer */}
        {selectedItems.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-semibold hover:bg-cyan-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductProtocolBrowser;
