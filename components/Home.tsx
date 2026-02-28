import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeroConcept1 } from './heroes/HeroConcept1';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';
import { isFeatureEnabled } from '../utils/featureFlags';
import { batch3HomeContent } from '../content/batch3';
import { ArrowRight, Star, Shield, Zap, CircleDashed, User, Play, CheckCircle, Quote, Brain, Activity, Wind, Sun, Droplets, Sparkles, Clock, X } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from './shared/ScrollReveal';
import { AnimatedCounter } from './shared/AnimatedCounter';
import { MarqueeTicker } from './shared/MarqueeTicker';
import { TiltCard } from './shared/TiltCard';
import { MagneticButton } from './shared/MagneticButton';
import { useRouter } from 'next/navigation';

interface HomeProps {
    onSelectTech: (type: TechType) => void;
    onLaunchBuilder: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTech, onLaunchBuilder }) => {
    const router = useRouter();
    const [hoveredTech, setHoveredTech] = useState<TechType | null>(null);
    const [activeGoal, setActiveGoal] = useState<string | null>(null);
    const [activeStack, setActiveStack] = useState<TechType[] | null>(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const navigateTo = (path: string) => {
        router.push(`/${path}`);
        window.scrollTo(0, 0);
    };
    const homepageEnhancementsEnabled = isFeatureEnabled('feature_homepage_enhancements');
    const lowestRental = Math.min(
        ...Object.values(TECH_DETAILS)
            .map((tech) => tech.rentalPrice)
            .filter((price): price is number => typeof price === 'number' && price > 0)
    );

    const handleStackSelect = (stack: TechType[]) => {
        setActiveStack(stack);
        setActiveGoal(null);
        document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            {/* ── HERO ── */}
            <HeroConcept1
                onLaunchBuilder={onLaunchBuilder}
                onNavigate={navigateTo}
                onWatchDemo={() => setShowDemoModal(true)}
            />

            {/* Demo Modal */}
            {showDemoModal && (
                <div
                    className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4"
                    onClick={() => setShowDemoModal(false)}
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-10 text-center"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            aria-label="Close demo modal"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Play className="text-cyan-400" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 futuristic-font">Product Demo</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Our full product video is coming soon. In the meantime, book a free live consultation
                            and we'll walk you through the complete Hylono ecosystem personally.
                        </p>
                        <button
                            onClick={() => { setShowDemoModal(false); navigateTo('contact'); }}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
                        >
                            Book a Free Live Demo
                        </button>
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="mt-3 w-full py-3 text-slate-500 text-xs hover:text-slate-300 transition-colors"
                        >
                            Maybe later
                        </button>
                    </motion.div>
                </div>
            )}

            {/* --- MARQUEE TICKER: Brand Modalities (forward) --- */}
            <div className="py-4 bg-slate-900 overflow-hidden border-t border-slate-800">
                <MarqueeTicker
                    items={[
                        <span key="o" className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">Oxygen</span>,
                        <span key="h" className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400/80">Hydrogen</span>,
                        <span key="l" className="text-xs font-bold uppercase tracking-[0.4em] text-amber-400/80">Light</span>,
                        <span key="s" className="text-xs font-bold uppercase tracking-[0.4em] text-purple-400/80">Signal</span>,
                        <span key="p" className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">Protocol-as-Product</span>,
                        <span key="r" className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400/80">Regeneration</span>,
                    ]}
                    speed="slow"
                    separator={<span className="mx-8 text-white/20 text-lg">·</span>}
                />
            </div>
            {/* Second ticker — reversed direction, certification labels */}
            <div className="py-4 bg-slate-950 overflow-hidden border-b border-slate-800/60">
                <MarqueeTicker
                    direction="right"
                    items={[
                        <span key="c1" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">CE Marked</span>,
                        <span key="c2" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">MDR 2017/745</span>,
                        <span key="c3" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">GDPR Compliant</span>,
                        <span key="c4" className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-600/60">mHBOT · PEMF · RLT · H₂</span>,
                        <span key="c5" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">Medical Grade</span>,
                        <span key="c6" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">EU Data Sovereignty</span>,
                        <span key="c7" className="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">5-Year Warranty</span>,
                    ]}
                    speed="slow"
                    separator={<span className="mx-6 text-slate-700 text-sm">—</span>}
                />
            </div>

            {homepageEnhancementsEnabled && (
                <>
                    <section className="py-20 bg-white border-b border-slate-100">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 futuristic-font">
                                    {batch3HomeContent.jumpstart.title}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {batch3HomeContent.jumpstart.cards.map((card) => (
                                    <button
                                        key={card.title}
                                        onClick={() => navigateTo(card.path)}
                                        className="text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-6 transition-colors"
                                    >
                                        <div className="text-2xl mb-3" aria-hidden>{card.icon}</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-16 bg-slate-50 border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10 futuristic-font">
                                {batch3HomeContent.popularGoals.title}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {batch3HomeContent.popularGoals.tiles.map((goal) => (
                                    <button
                                        key={goal.title}
                                        onClick={() => navigateTo(goal.path)}
                                        className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-colors text-center"
                                    >
                                        <div className="text-xl mb-2" aria-hidden>{goal.icon}</div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-slate-700">{goal.title}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-16 bg-slate-900 text-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-3 futuristic-font">{batch3HomeContent.rentalPromo.title}</h2>
                                    <p className="text-slate-300 text-sm mb-4 max-w-2xl">
                                        {batch3HomeContent.rentalPromo.description} From €{lowestRental}/mo.
                                    </p>
                                    <ul className="space-y-1.5 text-sm text-slate-300">
                                        {batch3HomeContent.rentalPromo.bullets.map((bullet) => (
                                            <li key={bullet} className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-emerald-400" /> {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => navigateTo(batch3HomeContent.rentalPromo.ctaPath)}
                                    className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs uppercase tracking-widest font-bold"
                                >
                                    {batch3HomeContent.rentalPromo.cta}
                                </button>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* --- VALUE PROP: BENTO GRID --- */}
            <section className="py-24 bg-white relative overflow-hidden grain-overlay">
                <div className="max-w-7xl mx-auto px-6">
                    <ScrollReveal direction="up" className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Why Hylono</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 text-gray-900">Built Different</h2>
                    </ScrollReveal>

                    {/* Bento Grid — asymmetric layout */}
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[160px]" staggerDelay={0.08}>
                        {/* Large tile — Verified Trust */}
                        <StaggerItem className="md:col-span-5 md:row-span-2">
                            <div className="bento-tile h-full p-10 flex flex-col justify-between group cursor-default">
                                <Shield className="text-yellow-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500" size={48} strokeWidth={1} />
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 futuristic-font text-gray-900">Verified Trust</h3>
                                    <p className="text-gray-500 font-light leading-relaxed text-sm">We rigorously filter global innovation—only devices with peer-reviewed evidence, medical-grade certifications, and real-world efficacy enter our ecosystem.</p>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                        </StaggerItem>

                        {/* Medium tile — Protocol Based */}
                        <StaggerItem className="md:col-span-4 md:row-span-1">
                            <div className="bento-tile h-full p-8 flex items-center gap-6 group cursor-default">
                                <Zap className="text-purple-500 shrink-0 group-hover:scale-110 transition-transform duration-300" size={36} strokeWidth={1.5} />
                                <div>
                                    <h3 className="text-lg font-bold futuristic-font text-gray-900">Protocol Based</h3>
                                    <p className="text-gray-500 font-light text-sm">Hardware is the vessel. Protocol is the system that may support better outcomes.</p>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Small stat tile */}
                        <StaggerItem className="md:col-span-3 md:row-span-1">
                            <div className="bento-tile h-full p-8 flex flex-col justify-between bg-slate-900 border-slate-900 text-white group cursor-default">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Users</span>
                                <div className="text-4xl font-black text-cyan-400 futuristic-font">
                                    <AnimatedCounter end={2500} suffix="+" />
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Access Layer tile */}
                        <StaggerItem className="md:col-span-4 md:row-span-1">
                            <div className="bento-tile h-full p-8 flex items-center gap-6 group cursor-default bg-gradient-to-br from-cyan-50 to-white">
                                <Star className="text-cyan-500 shrink-0 group-hover:scale-110 transition-transform duration-300" size={36} strokeWidth={1.5} />
                                <div>
                                    <h3 className="text-lg font-bold futuristic-font text-gray-900">Access Layer</h3>
                                    <p className="text-gray-500 font-light text-sm">Elite tech democratization. Rent from €149/mo.</p>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Stat — Studies */}
                        <StaggerItem className="md:col-span-3 md:row-span-1">
                            <div className="bento-tile h-full p-8 flex flex-col justify-between group cursor-default">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Studies Reviewed</span>
                                <div className="text-4xl font-black text-slate-900 futuristic-font">
                                    <AnimatedCounter end={87} suffix="+" />
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Wide bottom tile — Rental CTA */}
                        <StaggerItem className="md:col-span-7 md:row-span-1">
                            <div className="bento-tile h-full p-8 flex items-center justify-between group cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800 border-slate-900" onClick={() => navigateTo('rental')}>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Rental Model</p>
                                    <h3 className="text-xl font-bold text-white">Start renting from €149/month →</h3>
                                </div>
                                <motion.div
                                    className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
                                    whileHover={{ scale: 1.15 }}
                                >
                                    <ArrowRight className="text-white" size={20} />
                                </motion.div>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </section>

            {/* --- ECOSYSTEM: THE MONOLITHS --- */}
            <section id="ecosystem" className="py-40 bg-slate-50 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-24 text-center">
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 futuristic-font tracking-tight">The Ecosystem</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-900 to-transparent mx-auto" />
                    </div>

                    {/* GOAL FILTERING (Clustering) */}
                    <div className="flex justify-center flex-wrap gap-4 mb-16">
                        <button
                            onClick={() => setActiveGoal(null)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all border futuristic-font ${!activeGoal ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
                        >
                            All Systems
                        </button>
                        {['Rest', 'Focus', 'Repair', 'Life'].map(goal => (
                            <button
                                key={goal}
                                onClick={() => setActiveGoal(goal)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all border futuristic-font ${activeGoal === goal ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
                            >
                                {goal}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* --- CONNECTIONS LAYER --- */}
                        {/* Connection visualization removed - placeholder for future implementation */}

                        {Object.values(TECH_DETAILS).map((tech, idx) => {
                            // Check if this card is a synergy partner of the currently hovered card
                            const isSynergy = hoveredTech && TECH_DETAILS[hoveredTech].synergies.some(s => s.targetId === tech.id);
                            const isHovered = hoveredTech === tech.id;

                            // Filter Logic: Hide if goal filter is active and tech doesn't match
                            const isGoalMatch = !activeGoal || tech.goals?.includes(activeGoal);
                            const isStackMatch = !activeStack || activeStack.includes(tech.id);
                            const shouldHide = !isGoalMatch || !isStackMatch;

                            // Dim if hovered elsewhere and not synergy
                            const dim = hoveredTech && !isHovered && !isSynergy;

                            // Skip rendering if filtered out
                            if (shouldHide) return null;

                            return (
                                <TiltCard
                                    key={tech.id}
                                    maxTilt={6}
                                    perspective={1200}
                                    className={`group relative h-[500px] cursor-pointer transition-all duration-500 ease-out animate-resonance
                                        ${idx % 2 !== 0 ? 'md:translate-y-24' : ''}
                                        ${dim ? 'opacity-40 scale-95' : 'opacity-100'}
                                        ${isSynergy ? 'ring-2 ring-cyan-400 ring-offset-4 ring-offset-slate-50' : ''}
                                    `}
                                    onClick={() => onSelectTech(tech.id)}
                                    onMouseEnter={() => setHoveredTech(tech.id)}
                                    onMouseLeave={() => setHoveredTech(null)}
                                >
                                    <div className="absolute inset-0 bg-white shadow-xl border border-gray-100 overflow-hidden">
                                        {/* Inner Glow on hover */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-700 bg-gradient-to-br ${tech.accentColor.replace('bg-', 'from-')} to-transparent`} />

                                        {/* Content Layout */}
                                        <div className="relative h-full p-12 flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <TiltCard.Layer depth={8}>
                                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">
                                                        Modality 0{idx + 1}
                                                    </span>
                                                </TiltCard.Layer>
                                                <TiltCard.Layer depth={12}>
                                                    <CircleDashed className={`animate-spin-slow opacity-0 group-hover:opacity-100 ${tech.themeColor}`} />
                                                </TiltCard.Layer>
                                            </div>

                                            <TiltCard.Layer depth={20} className="space-y-4">
                                                <h3 className="text-4xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 transition-all">
                                                    {tech.name}
                                                </h3>
                                                <p className={`text-xl ${tech.themeColor} font-light italic`}>{tech.tagline}</p>
                                            </TiltCard.Layer>

                                            <TiltCard.Layer depth={6} className="overflow-hidden">
                                                <p className="text-gray-500 font-light translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                    {tech.descriptionStandard.substring(0, 100)}...
                                                </p>

                                                {isHovered && (
                                                    <div className="mt-8 pt-4 border-t border-gray-100 animate-fade-in">
                                                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-2">System Connections</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {tech.synergies.map(s => (
                                                                <span key={s.targetId} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                                                    + {TECH_DETAILS[s.targetId].name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {!isHovered && (
                                                    <div className="mt-8 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                                        <span>Initialize</span>
                                                        <div className="h-px w-8 bg-black" />
                                                    </div>
                                                )}
                                            </TiltCard.Layer>
                                        </div>
                                    </div>
                                </TiltCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* --- CURATED STACKS (Strategic Consumer Psychology) --- */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">System Integration</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">Curated Protocols</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* The Superhuman Stack */}
                        <div
                            onClick={() => handleStackSelect([TechType.HBOT, TechType.PEMF, TechType.RLT])}
                            className="group cursor-pointer p-8 rounded-2xl bg-slate-50 border border-gray-100 hover:border-black transition-all hover:-translate-y-1"
                        >
                            <div className="flex gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">The Superhuman Protocol</h3>
                            <p className="text-sm text-gray-500 mb-6">Magnetism + Oxygen + Light. The ultimate cellular restoration sequence used by elite performers.</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:underline flex items-center gap-1">Visualize Stack <ArrowRight size={10} /></span>
                        </div>

                        {/* Deep Sleep Stack */}
                        <div
                            onClick={() => handleStackSelect([TechType.PEMF, TechType.HYDROGEN])}
                            className="group cursor-pointer p-8 rounded-2xl bg-slate-50 border border-gray-100 hover:border-black transition-all hover:-translate-y-1"
                        >
                            <div className="flex gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <div className="w-2 h-2 rounded-full bg-sky-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Deep Sleep Architecture</h3>
                            <p className="text-sm text-gray-500 mb-6">Entrain brainwaves to Delta states while reducing oxidative stress for maximum regeneration.</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:underline flex items-center gap-1">Visualize Stack <ArrowRight size={10} /></span>
                        </div>

                        {/* Energy Stack */}
                        <div
                            onClick={() => handleStackSelect([TechType.RLT, TechType.HYDROGEN])}
                            className="group cursor-pointer p-8 rounded-2xl bg-slate-50 border border-gray-100 hover:border-black transition-all hover:-translate-y-1"
                        >
                            <div className="flex gap-2 mb-6">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-sky-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Mitochondrial Charge</h3>
                            <p className="text-sm text-gray-500 mb-6">Stimulate ATP production and clear metabolic waste. Pure cellular energy without the crash.</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest group-hover:underline flex items-center gap-1">Visualize Stack <ArrowRight size={10} /></span>
                        </div>
                    </div>

                    {activeStack && (
                        <div className="text-center mt-12 animate-fade-in">
                            <button
                                onClick={() => setActiveStack(null)}
                                className="px-6 py-2 rounded-full bg-gray-200 text-gray-600 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-300"
                            >
                                Clear Selection & Show All
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <ScrollReveal direction="up" className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Simple Process</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">From curiosity to optimization in three simple steps</p>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
                        {[
                            { step: "01", title: "Discover", desc: "Explore our ecosystem of regeneration technologies. Use our goal-based filtering to find the perfect match for your needs.", icon: Brain },
                            { step: "02", title: "Configure", desc: "Build your personalized protocol stack. Our synergy engine recommends optimal combinations and timing based on your goals.", icon: Sparkles },
                            { step: "03", title: "Transform", desc: "Receive your technology with guided onboarding. Track your progress, adjust protocols, and experience the transformation.", icon: Activity },
                        ].map((item) => (
                            <StaggerItem key={item.step}>
                                <div className="relative bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full overflow-hidden group">
                                    <div className="text-8xl font-black text-slate-50 absolute top-2 right-4 futuristic-font select-none group-hover:text-slate-100 transition-colors">{item.step}</div>
                                    <item.icon className="text-cyan-500 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300" size={32} />
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 futuristic-font relative z-10">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed relative z-10">{item.desc}</p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            {/* ⚠️ COMPLIANCE NOTE: Individual testimonials must be real, verified user accounts with written consent.
                The following are illustrative user scenarios pending real review collection.
                Replace with verified testimonials before public launch. AP-002. */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <ScrollReveal direction="up" className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">User Experiences</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">Protocols in Practice</h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto">How our users integrate Hylono technology into their daily lives. Individual results vary — these products are designed to support general wellbeing.</p>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.12}>
                        {[
                            { quote: "The guided HBOT protocol felt immediately different from anything I'd tried before. The structured approach — timing, breathing, recovery intervals — made the experience feel genuinely purposeful. Worth every minute.", name: "Marcus T.", role: "Software Architect", tech: "mHBOT Protocol", tag: "Cognitive Support" },
                            { quote: "I was skeptical about combining PEMF with hydrogen therapy, but the Hylono protocol stack made it easy to follow. The sleep quality improvement I noticed over several weeks was the most noticeable change in my routine.", name: "Sarah K.", role: "Entrepreneur", tech: "PEMF + H₂ Stack", tag: "Sleep Optimization" },
                            { quote: "As a clinic director, I need technology I can trust with my clients. Hylono's full ecosystem gave us a credible, evidence-based platform to build our wellness protocols around. The quality is exceptional.", name: "Dr. P. N.", role: "Clinic Director", tech: "Clinical Ecosystem", tag: "Professional Use" },
                        ].map((testimonial) => (
                            <StaggerItem key={testimonial.name}>
                                <motion.div
                                    className="bg-slate-50 rounded-3xl p-8 border border-slate-100 transition-all group h-full flex flex-col justify-between"
                                    whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.1)' }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <Quote className="text-cyan-500/30" size={32} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">{testimonial.tag}</span>
                                        </div>
                                        <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{testimonial.name}</div>
                                            <div className="text-sm text-slate-500">{testimonial.role}</div>
                                            <div className="text-xs text-cyan-600 font-medium">{testimonial.tech}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                    <p className="text-center text-xs text-slate-400 mt-8">
                        Individual results vary. These products are designed to support general wellbeing and are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any new wellness programme.
                    </p>
                </div>
            </section>

            {/* --- SCIENCE BACKED — with cursor spotlight effect --- */}
            <section
                className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
                    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
                }}
            >
                {/* Spotlight radial gradient that follows cursor */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(6,182,212,0.06) 0%, transparent 70%)',
                    }}
                />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <ScrollReveal direction="right">
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Research-Grade Protocols</span>
                            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 futuristic-font">Science-First Engineering</h2>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                We don't sell wellness trends. Every modality is validated through peer-reviewed clinical research, 
                                with protocols derived directly from published therapeutic outcomes.
                            </p>
                            {/* Animated stat counters */}
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { end: 87, suffix: '+', label: "Peer-Reviewed Studies" },
                                    { end: 12, suffix: '', label: "Medical Advisors" },
                                    { end: 2500, suffix: '+', label: "Active Users" },
                                    { end: 5, suffix: '-yr', label: "Device Warranty" },
                                ].map((stat) => (
                                    <motion.div
                                        key={stat.label}
                                        className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50"
                                        whileHover={{ borderColor: 'rgba(6,182,212,0.5)', scale: 1.02 }}
                                    >
                                        <div className="text-2xl font-bold text-cyan-400 futuristic-font">
                                            <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2200} />
                                        </div>
                                        <div className="text-sm text-slate-400">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollReveal>

                        <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
                            {[
                                { icon: Wind, label: "Hyperbaric Oxygen", studies: "23 Published Trials", focus: "Neuroinflammation • Tissue Repair" },
                                { icon: Activity, label: "PEMF Therapy", studies: "18 Clinical Studies", focus: "Cellular Voltage • Pain Modulation" },
                                { icon: Sun, label: "Red Light Therapy", studies: "31 RCTs Reviewed", focus: "Mitochondrial Function • Skin Health" },
                                { icon: Droplets, label: "Molecular Hydrogen", studies: "15 Human Trials", focus: "Oxidative Stress • Neuroprotection" },
                            ].map((tech) => (
                                <StaggerItem key={tech.label}>
                                    <motion.div
                                        className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 h-full"
                                        whileHover={{ borderColor: 'rgba(6,182,212,0.5)', y: -4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <tech.icon className="text-cyan-400 mb-3" size={28} />
                                        <div className="font-bold text-white mb-1">{tech.label}</div>
                                        <div className="text-xs text-cyan-400 font-medium mb-2">{tech.studies}</div>
                                        <div className="text-[10px] text-slate-500 leading-relaxed">{tech.focus}</div>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </div>
            </section>

            {/* --- MEDICAL DISCLAIMER — EU MDR compliance, visible on all health-adjacent pages --- */}
            <section className="py-8 bg-amber-50 border-t border-amber-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Important Notice:</strong> Hylono products are designed to support general wellbeing and are not intended to diagnose, treat, cure, or prevent any disease. They are not medical devices under MDR 2017/745 Class IIa or higher classification. Individual results may vary. Always consult a qualified healthcare professional before beginning any new wellness programme, particularly if you have a pre-existing medical condition, are pregnant, or are taking prescription medication.
                    </p>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 bg-slate-50 relative overflow-hidden grain-overlay">
                {/* Subtle background orb */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-100/40 to-purple-100/30 blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <ScrollReveal direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 futuristic-font">Your Regeneration Architecture</h2>
                        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                            Stop guessing. Start measuring. Our protocol engineers will design a personalized 
                            regeneration stack based on your biology, goals, and lifestyle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <MagneticButton
                                onClick={onLaunchBuilder}
                                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
                                strength={0.3}
                            >
                                <User size={18} /> Design Your Protocol
                            </MagneticButton>
                            <MagneticButton
                                onClick={() => navigateTo('contact')}
                                className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-slate-400 transition-colors"
                                strength={0.25}
                            >
                                <Clock size={18} /> Book Free Consultation
                            </MagneticButton>
                        </div>
                        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-slate-400">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> No commitment</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Flexible monthly plans</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Free shipping</span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>


        </div>
    );
};
