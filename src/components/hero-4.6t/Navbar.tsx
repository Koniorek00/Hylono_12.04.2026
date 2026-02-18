import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 h-[72px] z-50 flex items-center transition-all duration-300 ${scrolled ? 'border-b border-[#E0DED6]/80' : 'border-b border-transparent'
                }`}
            style={{
                backgroundColor: 'rgba(250, 250, 247, 0.85)',
                backdropFilter: 'blur(20px)',
            }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-7 h-7 relative flex items-center justify-center">
                        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <circle cx="14" cy="14" r="13" stroke="url(#logo_gradient)" strokeWidth="1.5" />
                            <path d="M4 14C8 14 10 10 14 10C18 10 20 18 24 18" stroke="url(#logo_gradient)" strokeWidth="1.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="logo_gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#0A6E6E" />
                                    <stop offset="1" stopColor="#3EDFD7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="font-[var(--font-headline)] font-semibold text-[20px] tracking-[0.15em] text-[#1A1A1A]">
                        HYLONO
                    </span>
                </div>

                {/* Center: Nav Items */}
                <div className="hidden md:flex items-center gap-8">
                    {["Ecosystem", "How It Works", "Access Models", "For Professionals", "Trust & Standards"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="relative text-[14px] font-medium text-[#6B6B60] hover:text-[#0A6E6E] transition-colors duration-200 group py-2"
                        >
                            {item}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0A6E6E] transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <a href="#learn" className="hidden md:block text-[14px] font-medium text-[#6B6B60] hover:text-[#0A6E6E] transition-colors relative group">
                        Learn
                        <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[#0A6E6E] transition-all duration-300 group-hover:w-full" />
                    </a>
                    <motion.button
                        className="px-6 py-[10px] rounded-xl text-white text-[14px] font-semibold bg-gradient-to-r from-[#0A6E6E] to-[#3EDFD7] shadow-sm hover:shadow-[0_4px_20px_rgba(10,110,110,0.3)] transition-shadow duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Explore Protocols
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};
