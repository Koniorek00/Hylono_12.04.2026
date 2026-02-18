import React, { useState } from 'react';
import { TechData, SafetyStatus, Contraindication } from '../types';
import { AlertCircle, CheckCircle, ShieldAlert, ChevronDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContraindicationCheckerProps {
    techData: TechData;
}

export const ContraindicationChecker: React.FC<ContraindicationCheckerProps> = ({ techData }) => {
    const [checkMode, setCheckMode] = useState<'condition' | 'drug'>('condition');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const conditions = techData.contraindications || [];
    const drugs = techData.drugInteractions || [];

    // Filter items based on mode and search
    const getFilteredItems = () => {
        if (checkMode === 'condition') {
            return conditions.map(c => c.condition);
        }
        return drugs.map(d => d.drugName).filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleSelect = (item: string) => {
        setSelectedItem(item);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    const activeItem = checkMode === 'condition'
        ? conditions.find(c => c.condition === selectedItem)
        : drugs.find(d => d.drugName === selectedItem);

    // Helper to get status color
    const getStatusColor = (status: SafetyStatus) => {
        switch (status) {
            case 'safe': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            case 'caution': return 'text-amber-500 bg-amber-50 border-amber-200';
            case 'unsafe': return 'text-rose-500 bg-rose-50 border-rose-200';
            default: return 'text-slate-500 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status: SafetyStatus) => {
        switch (status) {
            case 'safe': return <CheckCircle size={20} />;
            case 'caution': return <AlertCircle size={20} />;
            case 'unsafe': return <ShieldAlert size={20} />;
            default: return <Activity size={20} />;
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="text-cyan-500" size={20} /> Safety & Interaction Check
                </h3>

                {/* Mode Toggles */}
                <div className="flex bg-slate-50 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => { setCheckMode('condition'); setSelectedItem(''); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${checkMode === 'condition' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Medical Conditions
                    </button>
                    <button
                        onClick={() => { setCheckMode('drug'); setSelectedItem(''); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${checkMode === 'drug' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Medications
                    </button>
                </div>

                <p className="text-sm text-slate-500 mb-4">
                    {checkMode === 'condition'
                        ? `Select a condition to check safety for ${techData.name}.`
                        : `Check if your medications interact with ${techData.name}.`
                    }
                </p>

                {/* Input / Dropdown */}
                <div className="relative mb-6">
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-cyan-400 transition-colors"
                    >
                        {checkMode === 'drug' && isDropdownOpen ? (
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search medication..."
                                className="bg-transparent w-full outline-none text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className={`font-medium ${selectedItem ? 'text-slate-900' : 'text-slate-400'}`}>
                                {selectedItem || (checkMode === 'condition' ? "Select condition..." : "Select or search medication...")}
                            </span>
                        )}
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto"
                            >
                                {getFilteredItems().length > 0 ? (
                                    getFilteredItems().map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => handleSelect(item)}
                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 text-slate-700 text-sm border-b border-slate-50 last:border-0 block"
                                        >
                                            {item}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-xs text-slate-400 italic">No matches found.</div>
                                )}
                                <button
                                    onClick={() => handleSelect('Other / Not Listed')}
                                    className="w-full px-4 py-3 text-left hover:bg-slate-50 text-slate-700 text-sm font-medium"
                                >
                                    Other / Not Listed
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Status Result */}
                <AnimatePresence mode="wait">
                    {selectedItem && (
                        <motion.div
                            key={selectedItem}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`rounded-xl p-4 border ${getStatusColor(activeItem?.status || 'caution')}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${getStatusColor(activeItem?.status || 'caution').split(' ')[0]}`}>
                                    {getStatusIcon(activeItem?.status || 'caution')}
                                </div>
                                <div>
                                    <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${getStatusColor(activeItem?.status || 'caution').split(' ')[0]}`}>
                                        {activeItem?.status === 'safe' ? 'Likely Compatible' :
                                            activeItem?.status === 'unsafe' ? 'Not Recommended' :
                                                'Caution Advised'}
                                    </span>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                        {activeItem?.reason || "Please consult your primary care physician. Interaction data for this specific item is not in our database."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Disclaimer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 leading-tight">
                    *This tool provides general guidance based on common safety profiles. It is NOT a substitute for professional medical advice. Always consult your physician regarding your specific medications and conditions.
                </p>
            </div>
        </div>
    );
};
