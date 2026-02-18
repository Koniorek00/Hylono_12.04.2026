import React, { useState, useCallback } from 'react';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';
import { ArrowRight, Star, Shield, Zap, CircleDashed, User, Play, CheckCircle, Quote, Brain, Activity, Wind, Sun, Droplets, Sparkles, Clock, Award, X } from 'lucide-react';

interface HomeProps {
    onSelectTech: (type: TechType) => void;
    onLaunchBuilder: () => void;
}

/**
 * SPA-safe navigation helper — triggers the AppRouter's popstate listener
 * without causing a full page reload.
 */
const navigateTo = (path: string) => {
    window.history.pushState({}, '', `/${path}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
};

export const Home: React.FC<HomeProps> = ({ onSelectTech, onLaunchBuilder }) => {
    const [hoveredTech, setHoveredTech] = useState<TechType | null>(null);
    const [activeGoal, setActiveGoal] = useState<string | null>(null);
    const [activeStack, setActiveStack] = useState<TechType[] | null>(null);
    const [showDemoModal, setShowDemoModal] = useState(false);

    const handleStackSelect = React.useCallback((stack: TechType[]) => {
        setActiveStack(stack);
        setActiveGoal(null); // Reset goal filter to avoid conflict
        document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const colorMap: Record<string, string> = {
        'yellow': 'via-yellow-400',
        'purple': 'via-purple-400',
        'cyan': 'via-cyan-400',
    };

    return (
        <div className="w-full">
            {/* --- HERO SECTION: THE CORE --- */}
            <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50">
                {/* The Consciousness Core (Animated Gradient Orb) */}
                <div className="absolute w-[80vh] h-[80vh] rounded-full bg-gradient-to-tr from-purple-200 via-yellow-100 to-cyan-100 blur-3xl opacity-60 animate-spin-slow mix-blend-multiply" />
                <div className="absolute w-[60vh] h-[60vh] rounded-full bg-gradient-to-bl from-white via-transparent to-transparent blur-2xl opacity-80" />

                {/* Foreground Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-7xl md:text-9xl font-bold mb-8 leading-none tracking-tighter futuristic-font mix-blend-darken text-transparent bg-clip-text bg-gradient-to-b from-gray-800 to-gray-400">
                        HYLONO
                    </h1>

                    <div className="flex flex-col items-center space-y-2 mb-8">
                        <p className="text-2xl md:text-3xl font-light text-gray-600 tracking-wide">
                            Where <span className="font-semibold text-cyan-600">Mind</span> connects with <span className="font-semibold text-purple-600">Matter</span>
                        </p>
                        <div className="w-px h-16 bg-gradient-to-b from-gray-300 to-transparent my-4" />
                        <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                            Architect Your Regeneration
                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span>FDA Cleared Devices</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-emerald-500" />
                            <span>5-Year Warranty</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award size={16} className="text-emerald-500" />
                            <span>2,500+ Users</span>
                        </div>
                    </div>

                    {/* Rental Pricing Highlight */}
                    <div className="mb-8">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-sm font-medium">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            From €149/mo — Rent instead of buying
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onLaunchBuilder}
                            className="group relative px-10 py-5 bg-slate-900 text-white overflow-hidden rounded-2xl transition-all hover:bg-slate-800 shadow-xl shadow-slate-900/20"
                        >
                            <span className="relative uppercase tracking-widest text-xs font-bold flex items-center gap-3">
                                <User size={14} /> Start Your Journey
                            </span>
                        </button>
                        <button
                            onClick={() => navigateTo('rental')}
                            className="group relative px-8 py-5 bg-white border-2 border-emerald-500 text-emerald-700 overflow-hidden rounded-2xl transition-all hover:bg-emerald-50 shadow-lg flex items-center gap-3"
                        >
                            <span className="uppercase tracking-widest text-xs font-bold">Rent from €149/mo</span>
                        </button>
                        <button
                            onClick={() => setShowDemoModal(true)}
                            className="group relative px-10 py-5 bg-white border border-gray-200 text-gray-900 overflow-hidden rounded-2xl transition-all hover:bg-gray-50 shadow-lg flex items-center gap-3"
                        >
                            <Play size={14} className="text-cyan-500" />
                            <span className="uppercase tracking-widest text-xs font-bold">Watch Demo</span>
                        </button>
                    </div>

                    {/* Demo Video Modal */}
                    {showDemoModal && (
                        <div
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                            onClick={() => setShowDemoModal(false)}
                        >
                            <div
                                className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                                    aria-label="Close demo video"
                                >
                                    <X size={20} />
                                </button>
                                <div className="aspect-video w-full">
                                    <iframe
                                        src="https://www.youtube.com/embed/?list=PLhylono"
                                        title="Hylono Product Demo"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <p className="text-white/60 text-sm">
                                        Want to see a live demonstration?{' '}
                                        <button
                                            onClick={() => { setShowDemoModal(false); navigateTo('contact'); }}
                                            className="text-cyan-400 hover:text-cyan-300 underline"
                                        >
                                            Book a free consultation
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-1">
                        <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* --- VALUE PROP: THE TRINITY --- */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Verified Trust", desc: "Rigorous filtration of global innovation.", color: "text-yellow-600" },
                            { icon: Zap, title: "Protocol Based", desc: "Hardware is the vessel. Protocol is the cure.", color: "text-purple-600" },
                            { icon: Star, title: "Access Layer", desc: "Elite tech democratization for the masses.", color: "text-cyan-600" }
                        ].map((item) => (
                            <div key={item.title} className="group relative p-10 bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:-translate-y-2 animate-resonance">
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${colorMap[item.color.split('-')[1]] || 'via-slate-400'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <item.icon className={`${item.color} mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500`} size={40} strokeWidth={1} />
                                <h3 className="text-2xl font-bold mb-4 futuristic-font text-gray-800">{item.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
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
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all border ${!activeGoal ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
                        >
                            All Systems
                        </button>
                        {['Rest', 'Focus', 'Repair', 'Life'].map(goal => (
                            <button
                                key={goal}
                                onClick={() => setActiveGoal(goal)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all border ${activeGoal === goal ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-400 border-gray-200 hover:border-gray-900 hover:text-gray-900'}`}
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
                                <div
                                    key={tech.id}
                                    onMouseEnter={() => setHoveredTech(tech.id)}
                                    onMouseLeave={() => setHoveredTech(null)}
                                    onClick={() => onSelectTech(tech.id)}
                                    className={`group relative h-[500px] cursor-pointer perspective-1000 transition-all duration-500 ease-out animate-resonance
                                        ${idx % 2 !== 0 ? 'md:translate-y-24' : ''}
                                        ${dim ? 'opacity-40 scale-95' : 'opacity-100'}
                                        ${isSynergy ? 'ring-2 ring-cyan-400 ring-offset-4 ring-offset-slate-50 scale-[1.02]' : ''}
                                    `}
                                >
                                    {/* Synergy Connector Line (Visualizes Data Flow) */}


                                    <div className="absolute inset-0 bg-white shadow-xl transition-all duration-700 transform style-preserve-3d group-hover:rotate-y-12 group-hover:scale-[1.02] border border-gray-100 overflow-hidden">
                                        {/* Inner Glow */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${tech.accentColor.replace('bg-', 'from-')} to-transparent`} />

                                        {/* Content Layout */}
                                        <div className="relative h-full p-12 flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">
                                                    Modality 0{idx + 1}
                                                </span>
                                                <CircleDashed className={`animate-spin-slow opacity-0 group-hover:opacity-100 ${tech.themeColor}`} />
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-4xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 transition-all">
                                                    {tech.name}
                                                </h3>
                                                <p className={`text-xl ${tech.themeColor} font-light italic`}>{tech.tagline}</p>
                                            </div>

                                            <div className="overflow-hidden">
                                                <p className="text-gray-500 font-light translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                    {tech.descriptionStandard.substring(0, 100)}...
                                                </p>

                                                {/* Law of Connectivity: Visualization of Synergies */}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Simple Process</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">How It Works</h2>
                        <p className="text-gray-500 mt-4 max-w-xl mx-auto">From curiosity to optimization in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Discover", desc: "Explore our ecosystem of regeneration technologies. Use our goal-based filtering to find the perfect match for your needs—whether it's recovery, focus, sleep, or longevity.", icon: Brain },
                            { step: "02", title: "Configure", desc: "Build your personalized protocol stack. Our synergy engine recommends optimal combinations and timing based on your goals and lifestyle.", icon: Sparkles },
                            { step: "03", title: "Transform", desc: "Receive your technology with guided onboarding. Track your progress, adjust protocols, and experience the transformation.", icon: Activity },
                        ].map((item, idx) => (
                            <div key={item.step}>
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all h-full">
                                    <div className="text-6xl font-black text-slate-100 absolute top-4 right-6 futuristic-font">{item.step}</div>
                                    <item.icon className="text-cyan-500 mb-6" size={32} />
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 futuristic-font">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                                {idx < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                                        <ArrowRight className="text-slate-300" size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Verified Outcomes</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-4 futuristic-font text-gray-900">Engineered Transformation</h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto">Real protocols. Measurable results. No placebo effects—just cellular optimization backed by data.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { quote: "Six weeks into the HBOT protocol, my cognitive assessment scores improved by 34%. This isn't wellness theater—these are measurable neurological changes. The protocol precision Hylono provides is unmatched.", name: "Marcus T.", role: "Senior Software Architect", location: "Berlin", tech: "mHBOT Protocol", metric: "34% cognitive improvement" },
                            { quote: "I was skeptical. But after implementing the PEMF + Hydrogen stack with Hylono's timing protocols, my Oura data showed deep sleep increase from 45 minutes to 2+ hours nightly. The science is real.", name: "Sarah K.", role: "Serial Entrepreneur", location: "London", tech: "PEMF + H2 Stack", metric: "3x deep sleep increase" },
                            { quote: "We've integrated Hylono's full ecosystem into our clinic. Patient outcomes have improved 40% compared to our previous equipment. The protocol support and education infrastructure is what sets them apart.", name: "Dr. Pavel N.", role: "Clinical Director, ReGen Institute", location: "Warsaw", tech: "Full Clinical Stack", metric: "40% better outcomes" },
                        ].map((testimonial) => (
                            <div key={testimonial.name} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <Quote className="text-cyan-500/30" size={32} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{testimonial.metric}</span>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                        <div className="text-xs text-cyan-600 font-medium">{testimonial.tech}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SCIENCE BACKED --- */}
            <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Research-Grade Protocols</span>
                            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6 futuristic-font">Science-First Engineering</h2>
                            <p className="text-slate-300 mb-8 leading-relaxed">
                                We don't sell wellness trends. Every modality in our ecosystem is validated through peer-reviewed clinical research, 
                                with protocols derived directly from published therapeutic outcomes. Our medical advisory board continuously 
                                monitors emerging research to refine and optimize treatment parameters.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: "87+", label: "Peer-Reviewed Studies" },
                                    { value: "12", label: "Medical Advisors" },
                                    { value: "100%", label: "FDA Cleared Devices" },
                                    { value: "24/7", label: "Clinical Support" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                                        <div className="text-2xl font-bold text-cyan-400 futuristic-font">{stat.value}</div>
                                        <div className="text-sm text-slate-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Wind, label: "Hyperbaric Oxygen", studies: "23 Published Trials", focus: "Neuroinflammation • Tissue Repair" },
                                { icon: Activity, label: "PEMF Therapy", studies: "18 Clinical Studies", focus: "Cellular Voltage • Pain Modulation" },
                                { icon: Sun, label: "Red Light Therapy", studies: "31 RCTs Reviewed", focus: "Mitochondrial Function • Skin Health" },
                                { icon: Droplets, label: "Molecular Hydrogen", studies: "15 Human Trials", focus: "Oxidative Stress • Neuroprotection" },
                            ].map((tech) => (
                                <div key={tech.label} className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all group">
                                    <tech.icon className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
                                    <div className="font-bold text-white mb-1">{tech.label}</div>
                                    <div className="text-xs text-cyan-400 font-medium mb-2">{tech.studies}</div>
                                    <div className="text-[10px] text-slate-500 leading-relaxed">{tech.focus}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 futuristic-font">Your Regeneration Architecture</h2>
                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                        Stop guessing. Start measuring. Our protocol engineers will design a personalized 
                        regeneration stack based on your biology, goals, and lifestyle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onLaunchBuilder}
                            className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
                        >
                            <User size={18} /> Design Your Protocol
                        </button>
                        <button
                            onClick={() => navigateTo('contact')}
                            className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold uppercase tracking-widest text-sm hover:border-slate-400 transition-all flex items-center justify-center gap-3"
                        >
                            <Clock size={18} /> Book Free Consultation
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-8 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> No commitment</span>
                        <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> HSA/FSA eligible</span>
                        <span className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Free shipping</span>
                    </div>
                </div>
            </section>


        </div>
    );
};
