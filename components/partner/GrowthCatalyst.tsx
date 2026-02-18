import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode,
    Share2,
    Link,
    Printer,
    Copy,
    Check,
    Users,
    Sparkles
} from 'lucide-react';

const OFFERS = [
    {
        id: 'free-session',
        title: 'First Session Free',
        description: 'Perfect for new client acquisition',
        code: 'HYLO-FREE-26'
    },
    {
        id: 'half-off',
        title: '50% Off Intro Pack',
        description: 'High conversion for committed leads',
        code: 'INTRO-50'
    },
    {
        id: 'bring-friend',
        title: 'Bring a Friend',
        description: 'Double the traffic, same time slot',
        code: 'FRIEND-PASS'
    }
];

export const GrowthCatalyst: React.FC = () => {
    const [selectedOffer, setSelectedOffer] = useState(OFFERS[0]);
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                {/* Left Side: Campaign Builder */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        <Sparkles className="w-4 h-4" /> Growth Catalyst
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Get More Clients Now</h2>
                    <p className="text-slate-300 mb-6 text-sm">
                        Turn empty slots into committed clients. Select an offer and instantly generate a shareable pass.
                    </p>

                    <div className="space-y-3 mb-6">
                        {OFFERS.map((offer) => (
                            <button
                                key={offer.id}
                                onClick={() => {
                                    setSelectedOffer(offer);
                                    setShowQR(false);
                                }}
                                className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group ${selectedOffer.id === offer.id
                                        ? 'bg-white/10 border-cyan-500 shadow-lg shadow-cyan-900/20'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div>
                                    <div className={`font-bold ${selectedOffer.id === offer.id ? 'text-white' : 'text-slate-300'}`}>
                                        {offer.title}
                                    </div>
                                    <div className="text-xs text-slate-400">{offer.description}</div>
                                </div>
                                {selectedOffer.id === offer.id && (
                                    <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowQR(true)}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <QrCode className="w-5 h-5" />
                        Generate Referral Pass
                    </button>
                </div>

                {/* Right Side: Preview / Action */}
                <div className="flex-1 bg-white rounded-xl p-1 text-slate-900 shadow-2xl relative">
                    <AnimatePresence mode="wait">
                        {!showQR ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center text-center border border-dashed border-slate-200"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <Users className="w-8 h-8 text-cyan-500" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-1">Voucher Preview</h3>
                                <p className="text-sm text-slate-500">
                                    Select an offer to see what your clients will share.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full bg-slate-50 rounded-lg p-6 flex flex-col"
                            >
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 flex flex-col items-center justify-center text-center mb-4">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Scan to Redeem</div>
                                    <div className="w-48 h-48 bg-slate-900 rounded-lg mb-4 flex items-center justify-center text-white/50 relative overflow-hidden">
                                        {/* Simulated QR Code Pattern */}
                                        <div className="absolute inset-4 border-4 border-white rounded flex items-center justify-center">
                                            <QrCode className="w-24 h-24 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="font-extrabold text-xl text-slate-900 mb-1">{selectedOffer.title}</h3>
                                    <div className="px-3 py-1 bg-cyan-100 text-cyan-700 font-mono font-bold rounded text-sm">
                                        {selectedOffer.code}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                                        <Printer className="w-4 h-4" /> Print
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center justify-center gap-2 py-2 bg-slate-900 border border-slate-900 rounded-lg text-sm font-bold text-white hover:bg-slate-800"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied' : 'Copy Link'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
