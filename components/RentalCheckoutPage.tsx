import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileSignature, CreditCard, CheckCircle, Smartphone, TrendingUp, Activity, Calendar, Lock, BrainCircuit, Users, Sparkles, Sliders, Building2, Zap, Brain } from 'lucide-react';

// Steps Enum
enum CheckoutStep {
    IDENTITY = 0,
    PROTOCOL = 1, // NEW: Intelligence Step
    CONTRACT = 2,
    PAYMENT = 3,
    SUCCESS = 4
}

// Protocol Goals
const PROTOCOL_GOALS = [
    { id: 'recovery', label: 'Rapid Recovery', icon: Activity, desc: 'ACL, Surgery, Acute Injury' },
    { id: 'performance', label: 'Peak Performance', icon: TrendingUp, desc: 'VO2 Max, Endurance, ATP' },
    { id: 'cognitive', label: 'Cognitive Drive', icon: BrainCircuit, desc: 'Focus, Deep Work, Neuro-Plasticity' },
    { id: 'longevity', label: 'Deep Longevity', icon: Sparkles, desc: 'Cellular Repair, Anti-Aging' },
];

export const RentalCheckoutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    // Client-side params parsing
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const itemsParam = params.get('items');
        if (itemsParam) {
            setItems(itemsParam.split(','));
        }
    }, []);

    const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.IDENTITY);
    const [loading, setLoading] = useState(false);

    // Innovation State
    const [shareBioData, setShareBioData] = useState(false);
    const [splitPayment, setSplitPayment] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [generatingProtocol, setGeneratingProtocol] = useState(false);
    const [equity, setEquity] = useState(0);

    // Renting 5.0 States
    const [term, setTerm] = useState(12); // Months
    const [techProtection, setTechProtection] = useState(false);
    const [showPitchModal, setShowPitchModal] = useState(false);

    // Renting 7.0 States (Smart Features)
    const [referralCode] = useState('HYLO-' + Math.random().toString(36).substr(2, 6).toUpperCase());
    const [appliedReferral, setAppliedReferral] = useState('');
    const [referralInput, setReferralInput] = useState('');
    const referralDiscount = 50;

    // MOCK DATA base
    const baseMonthly = 1299;
    const retailValue = 15000;
    const researchDiscount = 50;
    const protectionCost = 29;

    // Logic for Dynamic Pricing based on Term
    const termMultiplier = 1 + (12 - term) * 0.02;
    const monthlySubtotal = Math.round(baseMonthly * termMultiplier);

    // Final Monthly Calculation
    let finalMonthly = monthlySubtotal;
    if (shareBioData) finalMonthly -= researchDiscount;
    if (techProtection) finalMonthly += protectionCost;
    if (appliedReferral) finalMonthly -= referralDiscount;
    if (splitPayment) finalMonthly = finalMonthly / 2;

    // Equity Projection
    const totalLeaseValue = monthlySubtotal * term;
    const equityPercent = Math.round((totalLeaseValue * 0.45) / retailValue * 100);

    // HANDLERS
    const handleNext = (next: CheckoutStep, delay = 1500) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setCurrentStep(next);
        }, delay);
    };

    const handleProtocolGeneration = () => {
        setGeneratingProtocol(true);
        setTimeout(() => {
            setGeneratingProtocol(false);
            handleNext(CheckoutStep.CONTRACT, 500);
        }, 2500); // Fake AI thinking time
    };

    const handlePayment = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setCurrentStep(CheckoutStep.SUCCESS);
            // Animate equity buildup
            let e = 0;
            const interval = setInterval(() => {
                e += 1;
                setEquity(e);
                if (e >= equityPercent) clearInterval(interval);
            }, 20);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row pt-20">

            {/* LEFT: INNOVATIVE SIDEBAR (EQUITY WALLET) */}
            <div className="md:w-1/3 bg-slate-950 border-r border-slate-900 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <TrendingUp size={14} className="text-cyan-400" /> Investment Wallet
                    </h3>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8 backdrop-blur-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-end mb-2 relative z-10">
                            <span className="text-sm text-slate-400">Projected Ownership</span>
                            <span className="text-3xl font-bold text-white tracking-tighter">{equityPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2 relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${currentStep === CheckoutStep.SUCCESS ? equityPercent : 5}%` }}
                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed relative z-10">
                            {term}-Month Lease: 45% of payments accrue as equity.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Monthly Subtotal</span>
                            <span>${monthlySubtotal}/mo</span>
                        </div>
                        {shareBioData && (
                            <div className="flex justify-between text-sm text-emerald-400">
                                <span className="flex items-center gap-2"><Activity size={14} /> Research Grant</span>
                                <span>-${researchDiscount}/mo</span>
                            </div>
                        )}
                        {techProtection && (
                            <div className="flex justify-between text-sm text-yellow-400">
                                <span className="flex items-center gap-2"><Zap size={14} /> Tech Protection</span>
                                <span>+${protectionCost}/mo</span>
                            </div>
                        )}
                        {appliedReferral && (
                            <div className="flex justify-between text-sm text-pink-400">
                                <span className="flex items-center gap-2"><Users size={14} /> Referral Bonus</span>
                                <span>-${referralDiscount}/mo</span>
                            </div>
                        )}
                        {splitPayment && (
                            <div className="flex justify-between text-sm text-purple-400">
                                <span className="flex items-center gap-2"><Users size={14} /> Split-Lease (50%)</span>
                                <span>Active</span>
                            </div>
                        )}
                        <div className="h-px bg-slate-900 my-2" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-white">Your Share</span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">
                                ${finalMonthly.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-right text-[10px] text-slate-500 lowercase">for {term} months</div>
                    </div>
                </div>

                {/* Protocol Status */}
                {selectedGoal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-slate-900 p-4 rounded-xl border border-cyan-500/20"
                    >
                        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Active Protocol</h4>
                        <div className="flex items-center gap-2">
                            <BrainCircuit size={16} className="text-white" />
                            <span className="text-sm font-bold text-white">
                                {PROTOCOL_GOALS.find(g => g.id === selectedGoal)?.label}
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Trust Footer */}
                <div className="mt-auto pt-8 flex gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Shield size={12} /> Bank-Level</span>
                    <span className="flex items-center gap-1"><Lock size={12} /> HIPAA Secure</span>
                </div>
            </div>

            {/* RIGHT: WIZARD CONTENT */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative bg-slate-950">
                <div className="max-w-2xl mx-auto">
                    {/* STEPS PROGRESS */}
                    <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                        {[
                            { icon: Shield, label: 'Identity' },
                            { icon: BrainCircuit, label: 'Protocol' }, // NEW
                            { icon: FileSignature, label: 'Contract' },
                            { icon: CreditCard, label: 'Payment' }
                        ].map((s, idx) => (
                            <div key={idx} className={`flex items-center gap-2 min-w-max ${currentStep >= idx ? 'text-cyan-400' : 'text-slate-600'}`}>
                                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold transition-all
                            ${currentStep >= idx ? 'border-cyan-400 bg-cyan-900/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-slate-800'}`}>
                                    {currentStep > idx ? <CheckCircle size={16} /> : idx + 1}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{s.label}</span>
                                {idx < 3 && <div className="w-12 h-px bg-slate-900 mx-2" />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">

                        {/* STEP 1: IDENTITY */}
                        {currentStep === CheckoutStep.IDENTITY && (
                            <motion.div
                                key="identity"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800"><Smartphone className="text-cyan-400" size={32} /></div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white tracking-tight">Identity Vault</h2>
                                        <p className="text-slate-500">Encrypted verification required for high-tier medical hardware.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-slate-400 leading-relaxed shadow-xl">
                                    <p className="mb-4">Hylono requires a secure identity check to finalize leasing agreements and insurance coverage.</p>
                                    <div className="flex items-center gap-3 text-sm text-cyan-400 font-bold bg-cyan-950/20 w-fit px-4 py-2 rounded-lg">
                                        <Lock size={14} /> GDPR & HIPAA Secure
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleNext(CheckoutStep.PROTOCOL)}
                                    disabled={loading}
                                    className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                                >
                                    {loading ? 'Securing Access...' : 'Verify Identity'}
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 2: PROTOCOL INTELLIGENCE (NEW) */}
                        {currentStep === CheckoutStep.PROTOCOL && (
                            <motion.div
                                key="protocol"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-purple-900/20 p-4 rounded-2xl border border-purple-800/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]"><BrainCircuit className="text-purple-400" size={32} /></div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white tracking-tight">Bio-Calibration</h2>
                                        <p className="text-slate-500">Personalize your hardware usage with AI protocols.</p>
                                    </div>
                                </div>

                                {!generatingProtocol ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {PROTOCOL_GOALS.map((g) => (
                                            <button
                                                key={g.id}
                                                onClick={() => setSelectedGoal(g.id)}
                                                className={`p-6 rounded-2xl border transition-all text-left relative overflow-hidden group ${selectedGoal === g.id
                                                    ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
                                                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
                                            >
                                                <g.icon className={`mb-4 transition-colors ${selectedGoal === g.id ? 'text-purple-400' : 'text-slate-600'}`} size={28} />
                                                <h3 className="font-bold text-white text-lg mb-1">{g.label}</h3>
                                                <p className="text-xs text-slate-500 leading-relaxed">{g.desc}</p>
                                                {selectedGoal === g.id && <div className="absolute top-4 right-4 text-purple-400"><Sparkles size={16} /></div>}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-24 text-center">
                                        <div className="w-20 h-20 border-t-2 border-r-2 border-purple-500 rounded-full animate-spin mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.2)]" />
                                        <h3 className="text-2xl font-black text-white tracking-tight">Calibrating {PROTOCOL_GOALS.find(g => g.id === selectedGoal)?.label}...</h3>
                                        <p className="text-slate-500 mt-2">Integrating biological benchmarks with {term}-month term cycles.</p>
                                    </div>
                                )}

                                {!generatingProtocol && (
                                    <button
                                        onClick={handleProtocolGeneration}
                                        disabled={!selectedGoal}
                                        className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_30px_rgba(147,51,234,0.3)] disabled:opacity-30 disabled:grayscale"
                                    >
                                        Generate Protocol <Sparkles size={16} className="inline ml-2" />
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 3: CONTRACT */}
                        {currentStep === CheckoutStep.CONTRACT && (
                            <motion.div
                                key="contract"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Lease Agreement</h2>
                                <div className="h-72 bg-white rounded-3xl p-10 text-slate-900 overflow-y-auto shadow-2xl border-4 border-slate-200">
                                    <div className="flex justify-between items-start mb-8 border-b pb-6">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Section 1.0</div>
                                        <h3 className="font-black text-xl italic uppercase">The Hylono Lease</h3>
                                    </div>

                                    <div className="space-y-4 text-sm font-medium leading-relaxed">
                                        <p>I hereby agree to a **{term}-month commitment** for the selected bio-optimization technologies.</p>
                                        {selectedGoal && (
                                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-purple-900">
                                                <h4 className="font-black text-xs uppercase mb-2">Protocol Addendum</h4>
                                                <p className="text-xs italic">User has elected for the {PROTOCOL_GOALS.find(g => g.id === selectedGoal)?.label} software suite integration for the duration of the lease.</p>
                                            </div>
                                        )}
                                        <p>45% of all monthly payments are applied to the Final Purchase Option. Damage waiver is included as standard.</p>
                                        <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 italic border-2 border-dashed border-slate-200">
                                            Scroll to end of agreement...
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleNext(CheckoutStep.PAYMENT)}
                                    disabled={loading}
                                    className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)]"
                                >
                                    {loading ? 'Encrypting Signature...' : 'Sign & Accept Terms'} <FileSignature size={18} className="inline ml-2" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 4: PAYMENT (Innovations) */}
                        {currentStep === CheckoutStep.PAYMENT && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Lease Mastery</h2>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                                        <Shield size={12} /> Stripe Verified
                                    </div>
                                </div>

                                {/* 1. DYNAMIC TERM SLIDER (Innovation 5.0) */}
                                <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sliders size={60} /></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                            Lease Term
                                        </h3>
                                        <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ring-1 ring-cyan-500/30">
                                            {term} Months
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="6"
                                        max="36"
                                        step="6"
                                        value={term}
                                        onChange={(e) => setTerm(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                    />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 px-1 uppercase tracking-widest">
                                        <span>Flex (6mo)</span>
                                        <span>Standard (12mo)</span>
                                        <span>Expert (36mo)</span>
                                    </div>
                                </div>

                                {/* 2. CORPORATE SPONSORSHIP (Innovation 5.0) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setShowPitchModal(true)}
                                        className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-cyan-500/50 transition-all flex flex-col gap-2 group"
                                    >
                                        <Building2 size={24} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                        <h4 className="font-bold text-white text-sm">Company Sponsorship</h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">Generate a pitch to get your employer to pay for this rental.</p>
                                    </button>

                                    {/* 3. TECH PROTECTION (Innovation 5.0) */}
                                    <button
                                        onClick={() => setTechProtection(!techProtection)}
                                        className={`p-6 border rounded-3xl text-left transition-all flex flex-col gap-2 relative overflow-hidden group
                                            ${techProtection ? 'bg-yellow-500/5 border-yellow-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <Zap size={24} className={techProtection ? 'text-yellow-400' : 'text-slate-500'} />
                                        <h4 className="font-bold text-white text-sm">Evergreen Upgrade</h4>
                                        <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">Guaranteed model swap for +$29/mo. Never fall behind.</p>
                                        {techProtection && <CheckCircle size={14} className="absolute top-4 right-4 text-yellow-400" />}
                                    </button>
                                </div>

                                {/* 4. OTHER INNOVATIONS (V3/V4) */}
                                <div className="flex flex-wrap gap-4">
                                    <label className={`flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl border cursor-pointer transition-all
                        ${shareBioData ? 'bg-emerald-500/5 border-emerald-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                                        <input type="checkbox" className="hidden" checked={shareBioData} onChange={(e) => setShareBioData(e.target.checked)} />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${shareBioData ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                            {shareBioData && <CheckCircle size={14} className="text-black" />}
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-white uppercase tracking-widest">Research Participant</span>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap">Save ${researchDiscount}/mo with data share</span>
                                        </div>
                                    </label>

                                    <label className={`flex-1 flex items-center gap-4 px-6 py-4 rounded-2xl border cursor-pointer transition-all
                        ${splitPayment ? 'bg-purple-500/5 border-purple-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                                        <input type="checkbox" className="hidden" checked={splitPayment} onChange={(e) => setSplitPayment(e.target.checked)} />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${splitPayment ? 'bg-purple-500 border-purple-500' : 'border-slate-600'}`}>
                                            {splitPayment && <CheckCircle size={14} className="text-black" />}
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-white uppercase tracking-widest">Fractional Lease</span>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap">Invite co-payer to split bill</span>
                                        </div>
                                    </label>
                                </div>

                                {/* REFERRAL CODE INPUT (7.0) */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={referralInput}
                                        onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                                        placeholder="Have a referral code? HYLO-XXXXXX"
                                        className="flex-1 bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 outline-none focus:border-pink-500/50"
                                    />
                                    <button
                                        onClick={() => { if (referralInput.startsWith('HYLO-')) setAppliedReferral(referralInput); }}
                                        disabled={!referralInput.startsWith('HYLO-') || appliedReferral !== ''}
                                        className="px-6 py-3 bg-pink-500/20 text-pink-400 text-xs font-black uppercase rounded-xl border border-pink-500/30 disabled:opacity-30"
                                    >
                                        {appliedReferral ? 'Applied ✓' : 'Apply'}
                                    </button>
                                </div>

                                {/* Totals Summary */}
                                <div className="bg-white rounded-3xl p-8 text-slate-950 shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-t-8 border-cyan-400">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Lease</span>
                                        <span className="text-sm font-bold">${monthlySubtotal}</span>
                                    </div>
                                    {shareBioData && <div className="flex justify-between items-center mb-2 text-emerald-600 text-xs font-bold uppercase tracking-widest"><span>Research Grant</span><span>-${researchDiscount}</span></div>}
                                    {techProtection && <div className="flex justify-between items-center mb-2 text-yellow-600 text-xs font-bold uppercase tracking-widest"><span>Evergreen Surcharge</span><span>+${protectionCost}</span></div>}
                                    {appliedReferral && <div className="flex justify-between items-center mb-2 text-pink-600 text-xs font-bold uppercase tracking-widest"><span>Referral Discount</span><span>-${referralDiscount}</span></div>}
                                    {splitPayment && <div className="flex justify-between items-center mb-2 text-purple-600 text-xs font-bold uppercase tracking-widest"><span>Partner Share (50%)</span><span>÷ 2</span></div>}

                                    <div className="h-px bg-slate-100 my-6" />
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-cyan-600 mb-1">Due Monthly</span>
                                            <span className="text-5xl font-black tracking-tighter italic">${finalMonthly.toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="bg-slate-950 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-cyan-500 hover:text-black transition-all shadow-2xl disabled:opacity-50"
                                        >
                                            {loading ? 'Processing...' : 'Secure Lease'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: SUCCESS & CONCIERGE */}
                        {currentStep === CheckoutStep.SUCCESS && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-32 h-32 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                                    <CheckCircle size={64} className="text-cyan-400" />
                                </div>
                                <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase mb-2">Protocol Active.</h2>
                                <p className="text-slate-500 mb-8 tracking-widest uppercase font-bold text-xs">Your hardware is entering production. Equity accrual started.</p>

                                {/* HEALTH OUTCOME PROJECTION (7.0) */}
                                {selectedGoal && (
                                    <div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 p-6 rounded-2xl border border-emerald-500/20 mb-6 text-left">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Projected Outcome</div>
                                        <p className="text-white font-bold text-lg">
                                            {selectedGoal === 'recovery' && 'Expected 40% faster tissue regeneration in 8 weeks.'}
                                            {selectedGoal === 'performance' && 'Expected 15% VO2 Max improvement in 12 weeks.'}
                                            {selectedGoal === 'cognitive' && 'Expected 25% focus enhancement in 6 weeks.'}
                                            {selectedGoal === 'longevity' && 'Expected cellular age reduction markers in 16 weeks.'}
                                        </p>
                                    </div>
                                )}

                                {/* DELIVERY ESTIMATE */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center">
                                            <Calendar size={18} className="text-cyan-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Estimated Delivery</div>
                                            <div className="text-white font-bold">
                                                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest hover:text-white transition-colors">Track</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    {/* CONCIERGE */}
                                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">
                                        <Zap size={20} className="text-cyan-400 mb-3" />
                                        <h4 className="font-bold text-white text-sm mb-1">VIP Onboarding</h4>
                                        <p className="text-[10px] text-slate-500 mb-4">Schedule your Bio-Engineer call.</p>
                                        <button className="w-full py-3 bg-white text-black text-[10px] font-black uppercase rounded-lg">Book Call</button>
                                    </div>

                                    {/* REFERRAL (7.0) */}
                                    <div className="bg-slate-900 p-6 rounded-2xl border border-pink-500/30 text-left">
                                        <Users size={20} className="text-pink-400 mb-3" />
                                        <h4 className="font-bold text-white text-sm mb-1">Refer & Earn</h4>
                                        <p className="text-[10px] text-slate-500 mb-2">Share your code, both get ${referralDiscount}/mo off.</p>
                                        <div className="bg-slate-950 p-2 rounded-lg text-center font-mono text-cyan-400 text-sm tracking-widest">{referralCode}</div>
                                    </div>

                                    {/* PAUSE (7.0) */}
                                    <div className="bg-slate-900 p-6 rounded-2xl border border-yellow-500/30 text-left">
                                        <Calendar size={20} className="text-yellow-400 mb-3" />
                                        <h4 className="font-bold text-white text-sm mb-1">Lease Pause</h4>
                                        <p className="text-[10px] text-slate-500 mb-4">Freeze for up to 2 months, keep equity.</p>
                                        <button className="w-full py-3 bg-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase rounded-lg border border-yellow-500/30">Request Pause</button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onNavigate('dashboard')}
                                    className="text-slate-600 hover:text-cyan-400 transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
                                >
                                    Initialize Dashboard
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* MODAL: CORPORATE PITCH (MOCK) */}
                <AnimatePresence>
                    {showPitchModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-lg w-full shadow-2xl relative"
                            >
                                <button onClick={() => setShowPitchModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">✕</button>
                                <Building2 size={40} className="text-cyan-400 mb-6" />
                                <h3 className="text-2xl font-black text-white tracking-tight mb-4 uppercase">Employer Wellness Pitch</h3>
                                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Enter your manager's email and we'll send a clinical justification for this rental as a high-performance cognitive aid.</p>

                                <div className="space-y-4 mb-8">
                                    <input
                                        type="email"
                                        placeholder="manager@company.com"
                                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-cyan-500/50 transition-all text-white"
                                    />
                                    <div className="bg-slate-950/50 p-4 rounded-xl text-[10px] text-slate-500 italic border border-slate-800/50">
                                        "Subject: Proposed High-Performance Workflow Enhancement (Bio-Optimization)"
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-cyan-400 transition-all">
                                    Send Sponsorship Pitch
                                </button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
