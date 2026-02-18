import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

interface RecentProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    viewedAt: number;
}

// Hook for managing recently viewed
export const useRecentlyViewed = () => {
    const [items, setItems] = useState<RecentProduct[]>(() => {
        const saved = localStorage.getItem('hylono_recent');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('hylono_recent', JSON.stringify(items));
    }, [items]);

    const addToRecent = (product: Omit<RecentProduct, 'viewedAt'>) => {
        setItems(prev => {
            const filtered = prev.filter(p => p.id !== product.id);
            return [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, 10);
        });
    };

    const clearRecent = () => setItems([]);

    return { items, addToRecent, clearRecent };
};

// Recently Viewed Carousel
export const RecentlyViewedSection: React.FC<{ onProductClick?: (id: string) => void }> = ({ onProductClick }) => {
    const { items, clearRecent } = useRecentlyViewed();

    if (items.length === 0) return null;

    return (
        <section className="py-8 bg-white border-t border-slate-100">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={18} className="text-slate-400" />
                        Recently Viewed
                    </h3>
                    <button onClick={clearRecent} className="text-xs text-slate-400 hover:text-slate-600">
                        Clear
                    </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {items.map((item, i) => (
                        <motion.button
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onProductClick?.(item.id)}
                            className="flex-shrink-0 w-40 text-left group"
                        >
                            <div className={`aspect-square rounded-xl bg-gradient-to-br ${item.image} mb-2 group-hover:shadow-lg transition-shadow`} />
                            <p className="text-sm font-medium text-slate-900 truncate group-hover:text-cyan-600 transition-colors">
                                {item.name}
                            </p>
                            <p className="text-sm text-cyan-600 font-bold">{item.price.toLocaleString()} PLN</p>
                        </motion.button>
                    ))}

                    {/* View More */}
                    <div className="flex-shrink-0 w-40 flex items-center justify-center">
                        <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
                            <ChevronRight size={24} />
                            <span className="text-xs">View All</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
