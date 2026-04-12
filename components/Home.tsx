import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroConcept1 } from './heroes/HeroConcept1';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';
import { isFeatureEnabled } from '../utils/featureFlags';
import { ArrowRight, CircleDashed } from 'lucide-react';
import { TiltCard } from './shared/TiltCard';
import { HomeTestimonialsSection } from './home/HomeTestimonialsSection';
import { HomeBrandTickerSection } from './home/HomeBrandTickerSection';
import { HomeJumpstartSection } from './home/HomeJumpstartSection';
import { HomeValuePropSection } from './home/HomeValuePropSection';
import { HomeHowItWorksSection } from './home/HomeHowItWorksSection';
import { HomeScienceSection } from './home/HomeScienceSection';
import { HomeFinalCtaSection } from './home/HomeFinalCtaSection';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';

const HomeDemoModal = dynamic(
    () => import('./home/HomeDemoModal').then((module) => ({ default: module.HomeDemoModal })),
    { ssr: false, loading: () => null }
);

interface HomeProps {
    onSelectTech: (type: TechType) => void;
    onLaunchBuilder: () => void;
    onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTech, onLaunchBuilder, onNavigate }) => {
    const [hoveredTech, setHoveredTech] = useState<TechType | null>(null);
    const [activeGoal, setActiveGoal] = useState<string | null>(null);
    const [activeStack, setActiveStack] = useState<TechType[] | null>(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
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
                onNavigate={onNavigate}
                onWatchDemo={() => setShowDemoModal(true)}
            />

            <HomeDemoModal
                isOpen={showDemoModal}
                onClose={() => setShowDemoModal(false)}
                onBookDemo={() => {
                    setShowDemoModal(false);
                    onNavigate('contact');
                }}
            />

            <HomeBrandTickerSection />

            <HomeJumpstartSection
                homepageEnhancementsEnabled={homepageEnhancementsEnabled}
                lowestRental={lowestRental}
                onNavigate={onNavigate}
            />

            <HomeValuePropSection onNavigate={onNavigate} />

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

            <HomeHowItWorksSection />

            {/* --- TESTIMONIALS --- */}
            {/* ⚠️ COMPLIANCE NOTE: Individual testimonials must be real, verified user accounts with written consent.
                The following are illustrative user scenarios pending real review collection.
                Replace with verified testimonials before public launch. AP-002. */}
            <HomeTestimonialsSection />

            <HomeScienceSection />

            {/* --- MEDICAL DISCLAIMER — EU MDR compliance, visible on all health-adjacent pages --- */}
            <section className="py-8 bg-amber-50 border-t border-amber-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <MedicalDisclaimer
                        type="general"
                        variant="warning"
                        showMdrStatement
                    />
                </div>
            </section>

            <HomeFinalCtaSection onLaunchBuilder={onLaunchBuilder} onNavigate={onNavigate} />


        </div>
    );
};

