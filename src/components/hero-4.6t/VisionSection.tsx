import React from 'react';
import { motion } from 'motion/react';

export const VisionSection: React.FC = () => {
    return (
        <section className="py-[160px] relative overflow-hidden">
            {/* Background Gradient Wash */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#E8F7F6] to-[#FAFAF7]" />

            <div className="max-w-[700px] mx-auto px-6 relative z-10 text-center">
                {/* Logo Symbol */}
                <motion.div
                    className="w-10 h-10 mx-auto mb-10 rounded-full border border-[#0A6E6E] flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1], borderColor: ["#0A6E6E", "#3EDFD7", "#0A6E6E"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-2 h-2 rounded-full bg-[#0A6E6E]" />
                </motion.div>

                <h2 className="font-[var(--font-accent)] italic text-[36px] text-[#1A1A1A] leading-[1.4] mb-8">
                    "We believe regeneration is not a luxury. It is a biological right. Hylono exists to verify the tools, design the protocols, and remove every barrier between breakthrough science and the human beings it was meant to serve."
                </h2>

                <div className="text-[13px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold">
                    — The Hylono Founding Principle
                </div>
            </div>
        </section>
    );
};

