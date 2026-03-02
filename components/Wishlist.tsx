import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<WishlistItem[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('hylono_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('hylono_wishlist', JSON.stringify(items));
    }, [items]);

    const addItem = (item: WishlistItem) => {
        setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);
    };

    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
    const isInWishlist = (id: string) => items.some(i => i.id === id);
    const clearWishlist = () => setItems([]);

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Heart Button for Product Cards
export const WishlistButton: React.FC<{ product: WishlistItem }> = ({ product }) => {
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    return (
        <button
            onClick={() => inWishlist ? removeItem(product.id) : addItem(product)}
            className={`p-2 rounded-full transition-all ${inWishlist
                    ? 'bg-red-50 text-red-500'
                    : 'bg-slate-100 text-slate-400 hover:text-red-500'
                }`}
        >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
    );
};

// Wishlist Page
export const WishlistPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { items, removeItem, clearWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                    {items.length > 0 && (
                        <button onClick={clearWishlist} className="text-sm text-red-500 hover:text-red-600">
                            Clear All
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="mx-auto text-slate-300 mb-4" size={64} />
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 mb-6">Save products you love for later</p>
                        <button
                            onClick={() => onNavigate('store')}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-xl p-4 shadow-sm"
                            >
                                <div className={`aspect-square rounded-lg bg-gradient-to-br ${item.image} mb-4`} />
                                <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                                <p className="text-cyan-600 font-bold mb-4">{item.price.toLocaleString()} PLN</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 flex items-center justify-center gap-2">
                                        <ShoppingCart size={14} /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

