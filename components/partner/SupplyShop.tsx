import React, { useState, useEffect } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    ShoppingBag,
    Package,
    Plus,
    Search,
    ShoppingCart,
    MapPin,
    Truck,
    X,
    RefreshCw,
    CreditCard,
    Check,
    Activity,
    Layers,
    Lightbulb,
    ArrowRight,
    Zap,
    Users,
    Recycle,
    Bot,
    Handshake,
    Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces & Types ---

interface ShopItem {
    id: string;
    name: string;
    category: string;
    price: number;
    inStock: boolean;
    image: string;
    recommended: boolean;
    subscriptionAvailable: boolean;
}

interface CartItem extends ShopItem {
    cartId: string;
    quantity: number;
    isSubscription: boolean;
    deliveryLocationId: string;
    discountType?: 'none' | 'subscription' | 'group-buy' | 'bulk' | 'negotiated';
    negotiatedPrice?: number;
}

interface Location {
    id: string;
    name: string;
    address: string;
}

interface InventoryStatus {
    id: string;
    itemName: string;
    remaining: number; // Percentage
    daysLeft: number;
    relatedProductId: string;
}

interface ProtocolKit {
    id: string;
    name: string;
    description: string;
    price: number;
    items: string[];
    savings: number;
}

interface GroupBuyEvent {
    id: string;
    itemId: string;
    itemName: string;
    currentParticipants: number;
    targetParticipants: number;
    currentDiscount: number;
    nextDiscount: number;
    endsAt: number; // Timestamp
}

interface TradeInOffer {
    id: string;
    deviceName: string;
    condition: 'Excellent' | 'Good' | 'Fair';
    creditValue: number;
}

// --- Mock Data ---

const LOCATIONS: Location[] = [
    { id: 'loc-1', name: 'Main Clinic (Downtown)', address: '123 Wellness Blvd, NY' },
    { id: 'loc-2', name: 'Satellite Center (West)', address: '450 Westside Hwy, NY' },
    { id: 'loc-3', name: 'Home Office', address: '15 Residence Ln, NJ' },
];

const SHOP_ITEMS: ShopItem[] = [
    {
        id: '1',
        name: 'O2 Concentrator Filters (Pack of 6)',
        category: 'Consumables',
        price: 89.00,
        inStock: true,
        image: '/images/filter-pack.jpg',
        recommended: true,
        subscriptionAvailable: true
    },
    {
        id: '2',
        name: 'PEMF Applicator Set - Full Body',
        category: 'Accessories',
        price: 299.00,
        inStock: true,
        image: '/images/pemf-applicator.jpg',
        recommended: false,
        subscriptionAvailable: false
    },
    {
        id: '3',
        name: 'RLT Panel - Medical Grade Lens Cover',
        category: 'Replacement Parts',
        price: 149.00,
        inStock: false,
        image: '/images/rlt-cover.jpg',
        recommended: false,
        subscriptionAvailable: true
    },
    {
        id: '4',
        name: 'Chamber Seal Ring (Pinnacle 360)',
        category: 'Replacement Parts',
        price: 59.00,
        inStock: true,
        image: '/images/seal-ring.jpg',
        recommended: true,
        subscriptionAvailable: true
    },
    {
        id: '5',
        name: 'Disposable Cannulas (50 Pack)',
        category: 'Consumables',
        price: 45.00,
        inStock: true,
        image: '/images/cannulas.jpg',
        recommended: false,
        subscriptionAvailable: true
    },
    {
        id: '6',
        name: 'Hydrogen Water Tabs (Bottle)',
        category: 'Consumables',
        price: 35.00,
        inStock: true,
        image: '/images/h2-tabs.jpg',
        recommended: true,
        subscriptionAvailable: true
    },
    {
        id: '7',
        name: 'Anti-Static Mat',
        category: 'Accessories',
        price: 120.00,
        inStock: true,
        image: '/images/mat.jpg',
        recommended: false,
        subscriptionAvailable: false
    }
];

const INVENTORY_PULSE: InventoryStatus[] = [
    { id: 'inv-1', itemName: 'O2 Concentrator Filters', remaining: 12, daysLeft: 3, relatedProductId: '1' },
    { id: 'inv-2', itemName: 'Hydrogen Tabs Stock', remaining: 28, daysLeft: 14, relatedProductId: '6' },
];

const PROTOCOL_KITS: ProtocolKit[] = [
    {
        id: 'kit-1',
        name: 'Post-Surgery Recovery Kit',
        description: 'Complete set for maximized HBOT & Hydrogen recovery.',
        price: 155.00,
        items: ['1', '5', '6'],
        savings: 24.00
    },
    {
        id: 'kit-2',
        name: 'Clinic Maintenance Essentials',
        description: 'Monthly upkeep pack for 2 chambers.',
        price: 130.00,
        items: ['1', '4'],
        savings: 18.00
    }
];

const ACTIVE_GROUP_BUY: GroupBuyEvent = {
    id: 'gb-1',
    itemId: '5', // Cannulas
    itemName: 'Disposable Cannulas (50 Pack)',
    currentParticipants: 42,
    targetParticipants: 56,
    currentDiscount: 25,
    nextDiscount: 30,
    endsAt: Date.now() + 1000 * 60 * 60 * 2.5 // 2.5 hours from now
};

const OWNED_ASSETS = [
    { id: 'asset-1', name: 'PEMF Mat 2.0 (2023)', estimatedValue: 450 },
    { id: 'asset-2', name: 'O2 Concentrator Gen 1', estimatedValue: 300 },
];

// --- Components ---

export const SupplyShop: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tradeInCredit, setTradeInCredit] = useState(0);
    const [negotiationActive, setNegotiationActive] = useState(false);
    const [negotiationAccepted, setNegotiationAccepted] = useState(false);

    const addToCart = (item: ShopItem, isSubscription: boolean = false, qty: number = 1, discountType: CartItem['discountType'] = 'none') => {
        const newItem: CartItem = {
            ...item,
            cartId: Math.random().toString(36).substr(2, 9),
            quantity: qty,
            isSubscription,
            deliveryLocationId: LOCATIONS[0].id,
            discountType
        };
        setCart(prev => [...prev, newItem]);
        setIsCartOpen(true);
    };

    const addKitToCart = (kit: ProtocolKit) => {
        kit.items.forEach(itemId => {
            const item = SHOP_ITEMS.find(i => i.id === itemId);
            if (item) addToCart(item, false, 1, 'none');
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const updateItemQuantity = (cartId: string, qty: number) => {
        setCart(cart.map(item =>
            item.cartId === cartId ? { ...item, quantity: qty } : item
        ));
    };

    const updateItemLocation = (cartId: string, locationId: string) => {
        setCart(cart.map(item =>
            item.cartId === cartId ? { ...item, deliveryLocationId: locationId } : item
        ));
    };

    const updateItemSubscription = (cartId: string, isSubscription: boolean) => {
        setCart(cart.map(item =>
            item.cartId === cartId ? { ...item, isSubscription } : item
        ));
    };

    const cartTotalRaw = cart.reduce((sum, item) => {
        let price = item.price;
        if (item.negotiatedPrice) {
            price = item.negotiatedPrice;
        } else if (item.isSubscription) {
            price = item.price * 0.9;
        } else if (item.discountType === 'group-buy') {
            price = item.price * (1 - ACTIVE_GROUP_BUY.currentDiscount / 100);
        } else if (item.quantity >= 5) {
            price = item.price * 0.85; // Bulk
        }
        return sum + price * item.quantity;
    }, 0);

    const cartTotal = Math.max(0, cartTotalRaw - tradeInCredit);

    const itemsByLocation = LOCATIONS.reduce((acc, loc) => {
        const items = cart.filter(item => item.deliveryLocationId === loc.id);
        if (items.length > 0) acc[loc.id] = items;
        return acc;
    }, {} as Record<string, CartItem[]>);

    // Group Buy Timer Logic
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const diff = ACTIVE_GROUP_BUY.endsAt - Date.now();
            if (diff <= 0) return setTimeLeft('Ended');
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${h}h ${m}m`);
        }, 60000);
        return () => clearInterval(interval);
    }, []);


    return (
        <PartnerLayout title="Supply & Shop">
            <div className="space-y-8 relative">

                {/* --- 0. Live Group Buy Ticker (Innovation Phase 3) --- */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-1 shadow-lg overflow-hidden"
                >
                    <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-4 flex flex-col md:flex-row items-center justify-between text-white gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-500/20 p-2 rounded-lg animate-pulse">
                                <Flame className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">LIVE GROUP BUY</h3>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                        Ends in {timeLeft || '2h 15m'}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm">
                                    <span className="text-white font-bold">{ACTIVE_GROUP_BUY.currentParticipants} Clinics</span> joined for
                                    <span className="text-white font-bold"> {ACTIVE_GROUP_BUY.itemName}</span>.
                                    Need <span className="text-orange-400 font-bold">{ACTIVE_GROUP_BUY.targetParticipants - ACTIVE_GROUP_BUY.currentParticipants} more</span> for {ACTIVE_GROUP_BUY.nextDiscount}% OFF!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center px-4 border-l border-white/10">
                                <div className="text-xs text-slate-400 uppercase tracking-wide">Current Deal</div>
                                <div className="text-2xl font-bold text-white">{ACTIVE_GROUP_BUY.currentDiscount}% OFF</div>
                            </div>
                            <button
                                onClick={() => {
                                    const item = SHOP_ITEMS.find(i => i.id === ACTIVE_GROUP_BUY.itemId);
                                    if (item) addToCart(item, false, 1, 'group-buy');
                                }}
                                className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-bold hover:bg-orange-50 transition-colors shadow-lg active:scale-95 flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Join Buy
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* --- 1. AI Inventory Pulse --- */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-cyan-600" />
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Inventory Intelligence</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {INVENTORY_PULSE.map((pulse) => (
                            <motion.div
                                key={pulse.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-slate-900 rounded-xl p-6 text-white flex items-center justify-between overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-2 h-2 rounded-full ${pulse.remaining < 20 ? 'animate-pulse bg-red-500' : 'bg-green-400'}`} />
                                        <h4 className="font-bold text-lg">{pulse.itemName}</h4>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Estimated depletion in <span className="text-white font-bold">{pulse.daysLeft} days</span> based on usage.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${pulse.remaining < 20 ? 'bg-red-500' : 'bg-cyan-400'}`}
                                                style={{ width: `${pulse.remaining}%` }}
                                            />
                                        </div>
                                        {pulse.remaining}% Left
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            const item = SHOP_ITEMS.find(i => i.id === pulse.relatedProductId);
                                            if (item) addToCart(item, true);
                                        }}
                                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-cyan-50 transition-colors flex items-center gap-2 shadow-lg"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Auto-Refill
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* --- 2. Protocol-Based Shopping --- */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Layers className="w-5 h-5 text-cyan-600" />
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Shop by Protocol</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {PROTOCOL_KITS.map(kit => (
                                    <motion.div
                                        key={kit.id}
                                        whileHover={{ y: -4 }}
                                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-cyan-200 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="bg-cyan-50 p-2 rounded-lg text-cyan-700">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
                                                Save ${kit.savings}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">{kit.name}</h4>
                                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">{kit.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-lg font-bold text-slate-900">${kit.price}</span>
                                            <button
                                                onClick={() => addKitToCart(kit)}
                                                className="text-sm font-bold text-cyan-600 flex items-center gap-1 group-hover:gap-2 transition-all"
                                            >
                                                Add Kit <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* --- 3. Main Catalog --- */}
                        <section>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                                <h3 className="text-lg md:text-xl font-bold text-slate-900">Catalog</h3>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-auto">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 w-full sm:w-64 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {SHOP_ITEMS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                    <ProductCard key={item.id} item={item} onAdd={addToCart} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- Sidebar: Circular Economy (Innovation Phase 3) --- */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-4 text-emerald-600">
                                <Recycle className="w-5 h-5" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">Trade-In & Upgrade</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">
                                Unlock instant liquidity by trading in your old equipment.
                            </p>

                            <div className="space-y-3">
                                {OWNED_ASSETS.map(asset => (
                                    <div key={asset.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-bold text-slate-700">{asset.name}</div>
                                            <span className="text-emerald-600 font-bold text-xs">${asset.estimatedValue}</span>
                                        </div>
                                        <button
                                            onClick={() => setTradeInCredit(prev => prev + asset.estimatedValue)}
                                            disabled={tradeInCredit > 0}
                                            className="w-full py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-colors disabled:opacity-50"
                                        >
                                            {tradeInCredit > 0 ? 'Applied' : 'Apply Credit'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Cart Drawer with AI Procurement Agent (Innovation Phase 3) --- */}
                <AnimatePresence>
                    {isCartOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCartOpen(false)}
                                className="fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
                            >
                                <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                                        <h2 className="text-base md:text-lg font-bold text-slate-900">Cart</h2>
                                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                            {cart.length} items
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">

                                    {/* AI Negotiation Prompt */}
                                    {cartTotalRaw > 500 && !negotiationAccepted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 relative overflow-hidden"
                                        >
                                            <div className="flex items-start gap-3 relative z-10">
                                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 h-fit">
                                                    <Bot className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-indigo-900 text-sm mb-1">Procurement Concierge</h4>
                                                    <p className="text-xs text-indigo-700 mb-3">
                                                        I see you're placing a larger order. I can authorize a flat contract rate of
                                                        <span className="font-bold"> ${(cartTotalRaw * 0.9).toFixed(0)} </span>
                                                        if we lock this in today.
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setNegotiationAccepted(true)}
                                                            className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <Handshake className="w-3 h-3" />
                                                            Accept Deal
                                                        </button>
                                                        <button className="text-xs font-bold text-indigo-500 px-3 py-1.5 hover:bg-indigo-100 rounded-lg">
                                                            No thanks
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Negotiation Success State */}
                                    {negotiationAccepted && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                            <div className="p-1.5 bg-green-100 rounded text-green-600">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <div className="text-xs text-green-800">
                                                <span className="font-bold">Contract Active:</span> 10% Negotiation Discount applied.
                                            </div>
                                        </div>
                                    )}

                                    {/* Cart Content */}
                                    {cart.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShoppingBag className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">Your cart is empty</p>
                                        </div>
                                    ) : (
                                        Object.entries(itemsByLocation).map(([locId, items]) => {
                                            const location = LOCATIONS.find(l => l.id === locId);
                                            return (
                                                <div key={locId} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-slate-500" />
                                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                                            Ship to: {location?.name}
                                                        </span>
                                                    </div>
                                                    <div className="divide-y divide-slate-100">
                                                        {items.map(item => (
                                                            <div key={item.cartId} className="p-4 bg-white">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                            {item.category}
                                                                            {item.discountType === 'group-buy' && (
                                                                                <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[10px] font-bold">GROUP BUY CHECKED</span>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeFromCart(item.cartId)}
                                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="flex flex-col gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex items-center border border-slate-200 rounded-lg">
                                                                            <button
                                                                                onClick={() => updateItemQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                                                                className="px-2 py-1 text-slate-500 hover:bg-slate-50"
                                                                            >-</button>
                                                                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                                                            <button
                                                                                onClick={() => updateItemQuantity(item.cartId, item.quantity + 1)}
                                                                                className="px-2 py-1 text-slate-500 hover:bg-slate-50"
                                                                            >+</button>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                                        <select
                                                                            value={item.deliveryLocationId}
                                                                            onChange={(e) => updateItemLocation(item.cartId, e.target.value)}
                                                                            className="text-xs border-none bg-transparent font-medium text-slate-600 focus:ring-0 p-0 cursor-pointer hover:text-cyan-600 transition-colors w-full"
                                                                        >
                                                                            {LOCATIONS.map(loc => (
                                                                                <option key={loc.id} value={loc.id}>
                                                                                    {loc.name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 flex justify-between items-end">
                                                                    <div className="text-xs text-slate-400">
                                                                        Qty: {item.quantity}
                                                                    </div>
                                                                    <div className="text-sm font-bold text-slate-900">
                                                                        ${(
                                                                            negotiationAccepted ? item.price * 0.9 * item.quantity :
                                                                                item.discountType === 'group-buy' ? item.price * (1 - ACTIVE_GROUP_BUY.currentDiscount / 100) * item.quantity :
                                                                                    item.quantity >= 5 ? item.price * 0.85 * item.quantity :
                                                                                        item.isSubscription ? item.price * 0.9 * item.quantity :
                                                                                            item.price * item.quantity
                                                                        ).toFixed(2)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="p-6 border-t border-slate-100 bg-white space-y-3">
                                    {tradeInCredit > 0 && (
                                        <div className="flex justify-between items-center text-emerald-600">
                                            <span className="text-sm font-bold flex items-center gap-2">
                                                <Recycle className="w-4 h-4" /> Trade-In Credit
                                            </span>
                                            <span className="text-sm font-bold">-${tradeInCredit.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500 font-medium">Net Total</span>
                                        <div className="text-right">
                                            {tradeInCredit > 0 && (
                                                <div className="text-xs text-slate-400 line-through">${cartTotalRaw.toFixed(2)}</div>
                                            )}
                                            <span className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <CreditCard className="w-5 h-5" />
                                        Confirm Procurement
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </PartnerLayout>
    );
};

const ProductCard: React.FC<{ item: ShopItem, onAdd: (item: ShopItem, sub: boolean) => void }> = ({ item, onAdd }) => {
    const [subEnabled, setSubEnabled] = useState(false);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full"
        >
            <div className="aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
                <Package className="w-12 h-12 text-slate-300" />

                {item.recommended && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded shadow-sm">
                        RECOMMENDED
                    </span>
                )}
                {!item.inStock && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider mb-1">{item.category}</p>
                <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{item.name}</h4>

                <div className="flex-1" />

                {item.subscriptionAvailable && (
                    <div className="mb-4">
                        <label className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${subEnabled ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 hover:border-slate-200'}`}>
                            <span className="text-xs font-bold text-slate-700">Auto-Refill</span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${subEnabled ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${subEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={subEnabled}
                                onChange={(e) => setSubEnabled(e.target.checked)}
                            />
                        </label>
                        {subEnabled && <div className="text-[10px] text-cyan-600 font-bold mt-1 text-center">Save 10% on this order</div>}
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="text-lg font-bold text-slate-900">
                        ${(subEnabled ? item.price * 0.9 : item.price).toFixed(2)}
                    </span>
                    <button
                        disabled={!item.inStock}
                        onClick={() => onAdd(item, subEnabled)}
                        className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs font-bold">Add</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SupplyShop;
