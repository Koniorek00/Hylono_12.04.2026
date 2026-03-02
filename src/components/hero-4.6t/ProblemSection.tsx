import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ShieldCheck, Microscope } from 'lucide-react'; // Approximated icons

export const ProblemSection: React.FC = () => {
    return (
        <section className="py-[120px] bg-[#F0F0EB]">
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Column: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-block px-3 py-1 mb-6 border border-[#C9A84C] rounded-full">
                        <span className="text-[12px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold">The Paradigm</span>
                    </div>

                    <h2 className="text-[40px] font-bold text-[#1A1A1A] leading-[1.2] mb-8 font-[var(--font-headline)]">
                        Regeneration Technology Is Exploding. Trust and Access Are Not.
                    </h2>

                    <div className="space-y-6 text-[#6B6B60] text-[16px] leading-[1.65] max-w-[500px]">
                        <p>
                            Thousands of non-invasive devices now claim to restore, repair, and regenerate. The science is real. The market chaos is also real — flooded with unverified hardware, exaggerated claims, and price tags that lock out 90% of potential users.
                        </p>
                        <p>
                            Hylono exists to solve both problems simultaneously. We are not a manufacturer. We are the verification layer and the access layer — the bridge between breakthrough innovation and the people who need it.
                        </p>
                        <p>
                            We curate what works. We integrate it into outcome-driven protocols. And we remove the capital barrier entirely through rental and subscription access.
                        </p>
                    </div>
                </motion.div>

                {/* Right Column: Visual Infographic */}
                <motion.div
                    className="relative bg-[#FAFAF7] rounded-[16px] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <div className="flex flex-col gap-12 relative z-10">
                        {/* Top Layer: Trust */}
                        <div className="text-center">
                            <h3 className="text-[14px] font-bold tracking-widest uppercase mb-4 text-[#C9A84C] border-b-2 border-[#C9A84C] inline-block pb-1">
                                Trust Layer
                            </h3>
                            <div className="flex justify-around items-start pt-4">
                                <InfographicItem icon={<ShieldCheck size={28} />} label="Verified Hardware" />
                                <InfographicItem icon={<Microscope size={28} />} label="Standards Compliance" />
                                <InfographicItem icon={<CheckCircle size={28} />} label="Protocol Validation" />
                            </div>
                        </div>

                        {/* Connector Animation */}
                        <div className="absolute top-1/2 left-0 w-full h-12 -mt-6 flex justify-center items-center pointer-events-none opacity-20">
                            <motion.div
                                className="w-40 h-full bg-gradient-to-b from-[#C9A84C] to-[#0A6E6E]"
                                style={{ maskImage: 'linear-gradient(to bottom, transparent, black, transparent)' }}
                            />
                        </div>

                        {/* Bottom Layer: Access */}
                        <div className="text-center mt-4">
                            <h3 className="text-[14px] font-bold tracking-widest uppercase mb-4 text-[#0A6E6E] border-b-2 border-[#0A6E6E] inline-block pb-1">
                                Access Layer
                            </h3>
                            <div className="flex justify-around items-start pt-4">
                                <InfographicItem icon={<KeyIcon />} label="Rental Programs" />
                                <InfographicItem icon={<RefreshIcon />} label="Subscription Protocols" />
                                <InfographicItem icon={<HandshakeIcon />} label="B2B Deployment" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const InfographicItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex flex-col items-center gap-3 w-28">
        <div className="text-[#6B6B60]">{icon}</div>
        <span className="text-[12px] font-medium text-[#1A1A1A] leading-tight text-center">{label}</span>
    </div>
);

// Custom Icons for visual consistency if lucide ones aren't perfect
const KeyIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5"></circle>
        <path d="m21 2-9.6 9.6"></path>
        <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
    </svg>
);

const RefreshIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
        <path d="M16 21h5v-5"></path>
    </svg>
);

const HandshakeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 17 2 2a1 1 0 1 0 3-3"></path>
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 2 0l.28-.28a5.79 5.79 0 0 1 7.06-.87l6 6a2.23 2.23 0 0 1-3.14 3.14l-.5-.5a2.76 2.76 0 0 0-3.92 0c-.43.43-.5.91-.78 1.41"></path>
    </svg>
);

