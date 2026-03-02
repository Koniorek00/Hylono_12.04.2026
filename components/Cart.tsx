import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, CreditCard } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return removeItem(id);
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

// Cart Icon with Badge
export const CartIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { itemCount } = useCart();

    return (
        <button
            onClick={onClick}
            className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Open shopping cart"
            data-testid="cart-button"
        >
            <ShoppingCart size={20} className="text-slate-600" />
            {itemCount > 0 && (
                <span
                    className="cart-count absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    data-testid="cart-count"
                    aria-label={`${itemCount} items in cart`}
                >
                    {itemCount}
                </span>
            )}
        </button>
    );
};

// Cart Sidebar
export const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void; onCheckout?: () => void }> = ({ isOpen, onClose, onCheckout }) => {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();

    // Focus trap for accessibility - clickOutsideDeactivates is handled by the backdrop
    const trapRef = useFocusTrap({ 
        active: isOpen, 
        onDeactivate: onClose,
        escapeDeactivates: true,
        clickOutsideDeactivates: true
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-[55]"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    <motion.div
                        ref={trapRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 id="cart-title" className="text-xl font-bold text-slate-900">Your Cart</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close cart">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                                            <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.image}`} />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-slate-900 text-sm">{item.name}</h3>
                                                <p className="text-cyan-600 font-bold">{item.price.toLocaleString()} PLN</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-white rounded border flex items-center justify-center">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-white rounded border flex items-center justify-center">
                                                        <Plus size={14} />
                                                    </button>
                                                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-600">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-cyan-600">{total.toLocaleString()} PLN</span>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={16} /> Proceed to Checkout
                                </button>
                                <button onClick={clearCart} className="w-full text-sm text-slate-400 hover:text-red-500">
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

