
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './HeroGlm.css';
import { ArrowRight, CheckCircle, Smartphone, Activity, Zap, Wind, Sun, Database, Hexagon, ChevronRight } from 'lucide-react';

interface HeroGlmProps {
    onNavigate: (page: string) => void;
}

// Minimalist Navbar Component (Local to this page)
const MinimalNavbar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => (
    <nav className="fixed top-0 left-0 right-0 z-40 py-6 px-12 flex justify-between items-center mix-blend-difference text-slate-800">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <Hexagon className="text-slate-900 group-hover:rotate-180 transition-transform duration-700" size={28} strokeWidth={1.5} />
            <span className="text-xl font-bold tracking-[0.15em] font-sans">HYLONO</span>
        </button>
        <div className="hidden md:flex gap-8">
            <button onClick={() => onNavigate('store')} className="text-xs uppercase tracking-widest hover:text-cyan-600 transition-colors">Store</button>
            <button onClick={() => onNavigate('technology')} className="text-xs uppercase tracking-widest hover:text-cyan-600 transition-colors">Technology</button>
        </div>
    </nav>
);

// Section 1: Vitality Interface
const VitalityInterface = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    return (
        <section className="vitality-hero">
            {/* Abstract Background Animation */}
            <div className="orb-container">
                <div className="orb orb-oxygen"></div>
                <div className="orb orb-hydrogen"></div>
                <div className="orb orb-light"></div>
            </div>

            <div className="hero-content">
                <motion.h1
                    className="hero-h1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    Architects of<br />Human Potential.
                </motion.h1>
                <motion.h2
                    className="hero-h2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                    Europe's First Trust & Access Layer for Non-Invasive Regeneration.<br />
                    <span className="font-medium text-slate-500">Oxygen. Hydrogen. Light. Signal.</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <button onClick={() => onNavigate('store')} className="cta-pill">
                        Enter the Ecosystem
                    </button>
                </motion.div>
            </div>

            <div className="trust-marquee">
                <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400"><CheckCircle size={14} /> ISO 13485</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400"><CheckCircle size={14} /> CE MEDICAL</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400"><CheckCircle size={14} /> FDA CLEARED</span>
            </div>
        </section>
    );
};

// Section 2: Protocol Stack
const ProtocolStack = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

    return (
        <section className="protocol-stack-section">
            <div className="stack-graphic-col">
                <motion.div style={{ scale, y }} className="relative w-[340px] h-[500px] border border-slate-200/60 bg-white/50 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-between p-12 overflow-hidden">
                    {/* Decorative blurred blobs behind icons */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-violet-400/20 blur-3xl rounded-full"></div>

                    <div className="w-full flex justify-center py-4 border-b border-slate-100 relative z-10"><Wind className="text-cyan-500 drop-shadow-sm" size={48} strokeWidth={1.5} /></div>
                    <div className="w-full flex justify-center py-4 border-b border-slate-100 relative z-10"><Activity className="text-blue-500 drop-shadow-sm" size={48} strokeWidth={1.5} /></div>
                    <div className="w-full flex justify-center py-4 border-b border-slate-100 relative z-10"><Sun className="text-amber-500 drop-shadow-sm" size={48} strokeWidth={1.5} /></div>
                    <div className="w-full flex justify-center py-4 relative z-10"><Zap className="text-violet-500 drop-shadow-sm" size={48} strokeWidth={1.5} /></div>

                    <div className="absolute bottom-4 text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">The Stack</div>
                </motion.div>
            </div>
            <div className="stack-content-col">
                <h3 className="text-5xl font-bold text-slate-800 mb-8 tracking-tight">Synergy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">Visualized.</span></h3>
                <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-md">
                    We don't sell hardware. We deliver outcomes. By layering Oxygen, Hydrogen, Light, and Signal, we activate cellular regeneration pathways that single-modality treatments cannot touch.
                </p>
                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Wind size={18} className="text-cyan-500" /> mHBOT</h4>
                        <p className="text-sm text-slate-500 leading-snug">Systemic Oxygenation driving cellular ATP production.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Activity size={18} className="text-blue-500" /> Hydrogen</h4>
                        <p className="text-sm text-slate-500 leading-snug">Selective Antioxidant neutralizing oxidative stress.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Sun size={18} className="text-amber-500" /> PBM / RLT</h4>
                        <p className="text-sm text-slate-500 leading-snug">Mitochondrial Charging via multiple wavelengths.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2"><Zap size={18} className="text-violet-500" /> PEMF</h4>
                        <p className="text-sm text-slate-500 leading-snug">Electromagnetic Field rebalancing at the cellular level.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Section 3: Access Layer
const AccessLayer = () => {
    return (
        <section className="access-layer-section">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Democratizing Regeneration</h3>
                <p className="text-slate-500">Select your entry point into the ecosystem. Scalable solutions for every need.</p>
            </div>

            <div className="glass-cards-container">
                <motion.div className="glass-card group" whileHover={{ y: -5 }}>
                    <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-8 mx-auto text-cyan-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Activity size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-800">The Explorer</h4>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">Rental & Subscription models designed to remove capital barriers.</p>
                    <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest border border-cyan-100 rounded-full py-2 px-4 inline-block">Biohacker / Consumer</div>
                </motion.div>

                <motion.div className="glass-card group" whileHover={{ y: -5 }}>
                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-8 mx-auto text-violet-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Database size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-800">The Architect</h4>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">Full Protocol Integration and B2B Deployment for clinics.</p>
                    <div className="text-[10px] font-bold text-violet-600 uppercase tracking-widest border border-violet-100 rounded-full py-2 px-4 inline-block">Professional / Clinic</div>
                </motion.div>

                <motion.div className="glass-card group" whileHover={{ y: -5 }}>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 mx-auto text-slate-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Smartphone size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-slate-800">The Pioneer</h4>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">Data-Driven Validation and research partnership tiers.</p>
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border border-slate-200 rounded-full py-2 px-4 inline-block">Research</div>
                </motion.div>
            </div>
        </section>
    )
}

// Section 4: Trust Standard
const TrustStandard = () => {
    return (
        <section className="trust-standard-section">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '30px 30px'
            }}></div>

            <div className="relative z-10 text-center max-w-5xl mx-auto">
                <h3 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Radical Transparency.</h3>
                <div className="w-24 h-1 bg-slate-200 mx-auto mb-10"></div>
                <p className="text-2xl text-slate-500 font-light mb-16 italic">"Curated. Verified. Deployable."</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                            <CheckCircle size={32} strokeWidth={1.5} />
                        </div>
                        <h5 className="font-bold text-lg mb-2 text-slate-800">Safety First</h5>
                        <p className="text-sm text-slate-500">ISO 13485 Certified Factories ensuring medical-grade precision.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                            <CheckCircle size={32} strokeWidth={1.5} />
                        </div>
                        <h5 className="font-bold text-lg mb-2 text-slate-800">Verified Output</h5>
                        <p className="text-sm text-slate-500">3rd Party Lab Tested for consistent therapeutic delivery.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
                            <CheckCircle size={32} strokeWidth={1.5} />
                        </div>
                        <h5 className="font-bold text-lg mb-2 text-slate-800">Zero Jargon</h5>
                        <p className="text-sm text-slate-500">Clear Clinical Claims backed by peer-reviewed research.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Section 5: Minimal Footer
const MinimalFooter: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    return (
        <footer className="minimal-footer">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Hexagon className="mx-auto text-slate-300 mb-6" size={40} strokeWidth={1} />
                    <h4 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Hylono — The Interface of Trust.</h4>
                    <p className="text-slate-400 font-light">Join the Regeneration Network.</p>
                </div>

                <div className="max-w-md mx-auto relative mb-16">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-white border-b-2 border-slate-200 py-3 pl-4 pr-12 text-center focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="absolute right-0 top-0 h-full px-4 text-slate-400 hover:text-cyan-600 transition-colors">
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-medium tracking-wider uppercase text-slate-500">
                    <button onClick={() => onNavigate('about')} className="hover:text-cyan-600 transition-colors">About</button>
                    <button onClick={() => onNavigate('contact')} className="hover:text-cyan-600 transition-colors">Connect</button>
                    <button onClick={() => onNavigate('legal')} className="hover:text-cyan-600 transition-colors">Legal</button>
                    <button onClick={() => onNavigate('partners')} className="hover:text-cyan-600 transition-colors">Partners</button>
                </div>

                <div className="mt-16 text-[10px] text-slate-300 uppercase tracking-widest text-center">
                    © 2026 Hylono Systems Inc. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
}

export const HeroGlm: React.FC<HeroGlmProps> = ({ onNavigate }) => {
    return (
        <div className="hero-sections font-sans text-slate-800">
            {/* Version Selector */}
            <div className="fixed top-24 right-4 z-50">
                <select className="bg-white/80 backdrop-blur border border-slate-200 text-xs px-3 py-2 rounded-lg shadow-sm opacity-30 hover:opacity-100 transition-opacity cursor-pointer outline-none">
                    <option>Version 1: Luminous (Active)</option>
                    <option disabled>Version 2: Dark Mode</option>
                    <option disabled>Version 3: High Contrast</option>
                </select>
            </div>

            <MinimalNavbar onNavigate={onNavigate} />

            <div className="bg-white">
                <VitalityInterface onNavigate={onNavigate} />
                <ProtocolStack />
                <AccessLayer />
                <TrustStandard />
            </div>

            <MinimalFooter onNavigate={onNavigate} />
        </div>
    );
};
