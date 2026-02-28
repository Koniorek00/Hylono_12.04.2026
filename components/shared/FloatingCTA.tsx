/**
 * FloatingCTA — Sticky rental CTA pill that appears after scrolling past hero
 * 
 * Slides in from the right edge after user scrolls 600px.
 * Pulsing emerald dot indicates live availability.
 * Vanishes 200px before footer to avoid overlap.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FloatingCTAProps {
    onNavigate: (page: string) => void;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ onNavigate }) => {
    const [visible, setVisible] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const nearBottom = latest > docHeight - windowHeight - 300;

        if (latest > 600 && !nearBottom) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed right-6 bottom-8 z-40"
                    initial={{ opacity: 0, x: 80, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.button
                        onClick={() => onNavigate('rental')}
                        className="group flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/30 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        aria-label="Rent Hylono from €149 per month"
                    >
                        {/* Live indicator */}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>

                        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                            Rent from{' '}
                            <span className="text-emerald-400">€149/mo</span>
                        </span>

                        <motion.span
                            className="text-slate-400"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <ArrowRight size={14} />
                        </motion.span>
                    </motion.button>

                    {/* Tooltip on first appearance */}
                    <motion.p
                        className="text-[9px] text-center text-slate-400 mt-1.5 uppercase tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        No commitment
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
