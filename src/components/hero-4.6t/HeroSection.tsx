import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

export const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Mouse parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        // Calculate offset from center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = (clientX - centerX) / 30; // Max ~15px shift
        const offsetY = (clientY - centerY) / 30;

        mouseX.set(offsetX);
        mouseY.set(offsetY);
    };

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#FAFAF7]"
            onMouseMove={handleMouseMove}
        >
            {/* Background Topographic Lines */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="topo-pattern" x="0" y="0" width="100%" height="100%" patternUnits="userSpaceOnUse">
                        <motion.path
                            d="M0,50 Q200,100 400,50 T800,50 T1200,150 T1600,50"
                            fill="none"
                            stroke="#1A1A1A"
                            strokeWidth="1"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.path
                            d="M0,150 Q200,200 400,150 T800,150 T1200,250 T1600,150"
                            fill="none"
                            stroke="#1A1A1A"
                            strokeWidth="1"
                            animate={{ y: [0, -30, 0] }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                        />
                        <motion.path
                            d="M0,350 Q250,300 500,350 T1000,350 T1500,450"
                            fill="none"
                            stroke="#1A1A1A"
                            strokeWidth="1"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#topo-pattern)" />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1200px]">

                {/* Pre-headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="text-[13px] tracking-[0.25em] font-medium text-[#6B6B60] uppercase mb-12"
                >
                    The Future of Regeneration Access
                </motion.div>

                {/* ORB ANIMATION */}
                <motion.div
                    className="relative w-[320px] h-[320px] mb-10 flex items-center justify-center group"
                    style={{ x: springX, y: springY }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    {/* Core Pulse */}
                    <motion.div
                        className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-[#0A6E6E] to-[#3EDFD7] blur-3xl opacity-40"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#0A6E6E] to-[#3EDFD7] shadow-[0_0_60px_rgba(62,223,215,0.4)]" />

                    {/* Rings */}
                    {[1, 2, 3, 4].map((ring, index) => {
                        const size = 160 + (index * 40);
                        const duration = 30 + (index * 15);
                        const isClockwise = index % 2 === 0 ? 1 : -1;

                        return (
                            <motion.div
                                key={ring}
                                className="absolute border-[1.5px] border-[#0A6E6E]/30 rounded-full flex items-center justify-center transition-all duration-700 ease-out group-hover:border-[#0A6E6E]/50"
                                style={{
                                    width: size,
                                    height: size,
                                }}
                                animate={{ rotate: 360 * isClockwise }}
                                transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Dot on ring */}
                                <div className="absolute top-0 w-2 h-2 rounded-full bg-gradient-to-r from-[#0A6E6E] to-[#3EDFD7] shadow-[0_0_10px_rgba(62,223,215,0.8)]" />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    className="font-[var(--font-accent)] italic text-[36px] md:text-[56px] text-[#1A1A1A] text-center leading-[1.2] mb-5"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                    Where Mind Connects With Matter
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    className="text-[18px] text-[#6B6B60] font-[var(--font-body)] text-center max-w-[580px] leading-[1.6] mb-9"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                    Hylono curates and integrates Europe's most advanced non-invasive regeneration technologies — and makes them accessible to everyone through intelligent protocols, not just products.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                >
                    <motion.button
                        className="px-8 py-[14px] rounded-xl text-white text-[15px] font-semibold bg-gradient-to-r from-[#0A6E6E] to-[#3EDFD7] shadow-lg hover:shadow-[0_4px_25px_rgba(10,110,110,0.4)] transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Discover the Ecosystem
                    </motion.button>
                    <motion.button
                        className="px-8 py-[14px] rounded-xl text-[#0A6E6E] text-[15px] font-semibold border-[2px] border-[#0A6E6E] hover:bg-[#0A6E6E]/5 transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        How Access Works
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
            >
                <div className="w-[1px] h-[40px] bg-[#C9A84C] relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-[-2px] w-[5px] h-[5px] rounded-full bg-[#C9A84C]"
                        animate={{ y: [0, 40] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
                <span className="text-[11px] uppercase tracking-widest text-[#C9A84C]">Explore</span>
            </motion.div>
        </section>
    );
};
