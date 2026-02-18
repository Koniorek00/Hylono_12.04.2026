import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sun, Wind, Activity } from 'lucide-react';

export const EcosystemSection: React.FC = () => {
    return (
        <section className="py-[120px] bg-[#FAFAF7]">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-6 border border-[#0A6E6E] rounded-full">
                        <span className="text-[12px] uppercase tracking-[0.15em] text-[#0A6E6E] font-semibold">The Ecosystem</span>
                    </div>
                    <h2 className="text-[44px] font-bold text-[#1A1A1A] mb-6">Four Pillars. One Integrated Protocol.</h2>
                    <p className="text-[17px] text-[#6B6B60] max-w-[600px] mx-auto leading-[1.6]">
                        Each modality targets a distinct biological pathway. Combined through Hylono protocols, they create compound regeneration outcomes no single technology can achieve alone.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        title="Oxygen — mHBOT"
                        desc="Hyperbaric oxygen environments that saturate tissues beyond normal respiratory limits."
                        gradient="from-[#E8F4FD] to-white"
                        icon={<Wind className="text-[#0A6E6E]" size={64} />}
                        animation={<OxygenAnimation />}
                    />
                    <Card
                        title="Hydrogen"
                        desc="Direct molecular hydrogen inhalation for powerful selective antioxidant effects."
                        gradient="from-[#F0ECF7] to-white"
                        icon={<span className="text-[#0A6E6E] text-6xl font-bold font-mono">H₂</span>}
                        animation={<HydrogenAnimation />}
                    />
                    <Card
                        title="Light — RLT"
                        desc="Targeted red and near-infrared light wavelengths to stimulate mitochondrial respiration."
                        gradient="from-[#FDF0EC] to-white"
                        icon={<Sun className="text-[#0A6E6E]" size={64} />}
                        animation={<LightAnimation />}
                    />
                    <Card
                        title="Signal — PEMF/VNS"
                        desc="Pulsed electromagnetic fields and vagus nerve stimulation to reset autonomic balance."
                        gradient="from-[#ECF7F2] to-white"
                        icon={<Activity className="text-[#0A6E6E]" size={64} />}
                        animation={<SignalAnimation />}
                    />
                </div>

                {/* Footer Quote */}
                <div className="text-center mt-16">
                    <p className="font-[var(--font-accent)] italic text-[22px] text-[#6B6B60]">
                        "The question is not which technology to use. It is which combination unlocks your specific outcome."
                    </p>
                </div>
            </div>
        </section>
    );
};

const Card = ({ title, desc, gradient, icon, animation }: any) => (
    <motion.div
        className="bg-white rounded-[20px] overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.05)] h-[400px] flex flex-col"
        whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.3 }}
    >
        {/* Visual Top Area */}
        <div className={`h-[60%] relative bg-gradient-to-b ${gradient} flex items-center justify-center overflow-hidden`}>
            <div className="absolute inset-0 z-0">{animation}</div>
            <div className="relative z-10">{icon}</div>
        </div>

        {/* Content Bottom Area */}
        <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
                <h3 className="text-[24px] font-bold text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-[14px] text-[#6B6B60] leading-relaxed">{desc}</p>
            </div>
            <a href="#" className="inline-flex items-center text-[14px] font-semibold text-[#0A6E6E] group">
                Learn Protocol
                <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
        </div>
    </motion.div>
);

// Animations
const OxygenAnimation = () => (
    <div className="absolute inset-0 w-full h-full">
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute bg-white rounded-full opacity-40"
                style={{
                    width: Math.random() * 20 + 5,
                    height: Math.random() * 20 + 5,
                    left: `${Math.random() * 100}%`,
                    bottom: -20
                }}
                animate={{ y: -400, opacity: 0 }}
                transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                }}
            />
        ))}
    </div>
);

const HydrogenAnimation = () => (
    <div className="absolute bottom-0 w-full h-32 opacity-30">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
            <motion.path
                d="M0,10 Q25,20 50,10 T100,10"
                fill="none"
                stroke="#A890D3"
                strokeWidth="0.5"
                animate={{ d: "M0,10 Q25,0 50,10 T100,10" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
        </svg>
    </div>
);

const LightAnimation = () => (
    <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3].map(i => (
            <motion.div
                key={i}
                className="absolute border border-[#FFD0C0] rounded-full opacity-30"
                style={{ width: i * 100, height: i * 100 }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
        ))}
    </div>
);

const SignalAnimation = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg width="100%" height="100">
            <motion.path
                d="M0 50 Q 25 25 50 50 T 100 50"
                fill="none"
                stroke="#0A6E6E"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    </div>
);
