import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Check, ArrowRight, Scale } from 'lucide-react';

interface ProductForComparison {
    id: string;
    name: string;
    price: number;
    image: string;
    specs: Record<string, string | number>;
}

const sampleProducts: ProductForComparison[] = [
    { id: 'hbot-1', name: 'HBOT Chamber Pro 1.5', price: 45000, image: 'from-cyan-500 to-blue-500', specs: { 'Pressure': '1.5 ATA', 'Capacity': '1 Person', 'Size': 'Compact', 'Warranty': '2 Years', 'Control': 'Digital', 'Certification': 'CE, FDA' } },
    { id: 'hbot-2', name: 'HBOT Chamber Elite 2.0', price: 75000, image: 'from-purple-500 to-indigo-500', specs: { 'Pressure': '2.0 ATA', 'Capacity': '1 Person', 'Size': 'Standard', 'Warranty': '3 Years', 'Control': 'Smart Touch', 'Certification': 'CE, FDA, ISO' } },
    { id: 'pemf-1', name: 'PEMF Mat Advanced', price: 12000, image: 'from-emerald-500 to-teal-500', specs: { 'Frequency': '1-30 Hz', 'Programs': '12', 'Size': 'Full Body', 'Warranty': '2 Years', 'Control': 'Remote', 'Certification': 'CE' } },
    { id: 'rlt-1', name: 'Red Light Panel 600W', price: 8500, image: 'from-red-500 to-orange-500', specs: { 'Power': '600W', 'Wavelength': '630-850nm', 'Coverage': '60cm x 45cm', 'Warranty': '2 Years', 'Control': 'Timer', 'Certification': 'CE, FDA' } },
];

// Compare Button for Product Cards
export const CompareButton: React.FC<{
    productId: string;
    isInCompare: boolean;
    onToggle: (id: string) => void
}> = ({ productId, isInCompare, onToggle }) => (
    <button
        onClick={() => onToggle(productId)}
        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${isInCompare
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
    >
        {isInCompare ? <Check size={12} /> : <Plus size={12} />}
        {isInCompare ? 'In Compare' : 'Compare'}
    </button>
);

// Floating Compare Bar
export const CompareBar: React.FC<{
    selectedIds: string[];
    onRemove: (id: string) => void;
    onCompare: () => void;
    onClear: () => void;
}> = ({ selectedIds, onRemove, onCompare, onClear }) => {
    if (selectedIds.length === 0) return null;

    const selectedProducts = sampleProducts.filter(p => selectedIds.includes(p.id));

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40 p-4"
        >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Scale className="text-slate-400" size={20} />
                    <span className="text-sm font-medium text-slate-700">
                        Compare ({selectedIds.length}/3)
                    </span>
                    <div className="flex gap-2">
                        {selectedProducts.map(p => (
                            <div key={p.id} className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1">
                                <span className="text-sm">{p.name.slice(0, 15)}...</span>
                                <button onClick={() => onRemove(p.id)} className="text-slate-400 hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClear} className="text-sm text-slate-500 hover:text-slate-700">
                        Clear
                    </button>
                    <button
                        onClick={onCompare}
                        disabled={selectedIds.length < 2}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        Compare Now <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Comparison Modal/Page
export const ComparisonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    productIds: string[];
}> = ({ isOpen, onClose, productIds }) => {
    const products = sampleProducts.filter(p => productIds.includes(p.id));

    const primaryProduct = products[0];
    if (!primaryProduct) return null;

    const allSpecs = Object.keys(primaryProduct.specs);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="compare-modal-title"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto bg-white rounded-2xl z-50 overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 id="compare-modal-title" className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Scale size={24} aria-hidden="true" /> Product Comparison
                            </h2>
                            <button onClick={onClose} aria-label="Close comparison" className="text-slate-400 hover:text-slate-600">
                                <X size={24} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left p-3 text-sm font-medium text-slate-500">Feature</th>
                                        {products.map(p => (
                                            <th key={p.id} className="p-3 text-center">
                                                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${p.image} mb-2`} />
                                                <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                                <p className="text-cyan-600 font-bold">{p.price.toLocaleString()} PLN</p>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allSpecs.map((spec, i) => (
                                        <tr key={spec} className={i % 2 === 0 ? 'bg-slate-50' : ''}>
                                            <td className="p-3 text-sm font-medium text-slate-700">{spec}</td>
                                            {products.map(p => (
                                                <td key={p.id} className="p-3 text-center text-sm text-slate-600">
                                                    {p.specs[spec]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Hook for managing comparison state
export const useProductComparison = () => {
    const [compareIds, setCompareIds] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    const toggle = (id: string) => {
        setCompareIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : prev.length < 3 ? [...prev, id] : prev
        );
    };

    const remove = (id: string) => setCompareIds(prev => prev.filter(i => i !== id));
    const clear = () => setCompareIds([]);
    const compare = () => setShowModal(true);

    return { compareIds, toggle, remove, clear, compare, showModal, setShowModal };
};
