import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ReadingProgressProps {
    color?: string;
    height?: number;
    position?: 'top' | 'bottom';
    showPercentage?: boolean;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
    color = 'bg-cyan-500',
    height = 3,
    position = 'top',
    showPercentage = false
}) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        return scrollYProgress.on('change', (latest) => {
            setPercentage(Math.round(latest * 100));
        });
    }, [scrollYProgress]);

    return (
        <>
            <motion.div
                className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 ${color} z-50 origin-left`}
                style={{ scaleX, height }}
            />
            {showPercentage && (
                <div className={`fixed ${position === 'top' ? 'top-2' : 'bottom-2'} right-4 z-50 text-xs font-medium text-slate-500`}>
                    {percentage}%
                </div>
            )}
        </>
    );
};

// Section Progress (shows progress within a specific section)
interface SectionProgressProps {
    sections: { id: string; label: string }[];
}

export const SectionProgress: React.FC<SectionProgressProps> = ({ sections }) => {
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (!section) {
                    continue;
                }

                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(i);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <div className="flex flex-col gap-4">
                {sections.map((section, i) => (
                    <button
                        key={section.id}
                        onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                        className="group flex items-center gap-3"
                    >
                        <span className={`text-xs text-right transition-opacity ${i === activeSection ? 'opacity-100 text-cyan-600 font-medium' : 'opacity-0 group-hover:opacity-100 text-slate-500'
                            }`}>
                            {section.label}
                        </span>
                        <div className={`w-2 h-2 rounded-full transition-all ${i === activeSection ? 'bg-cyan-500 scale-150' : 'bg-slate-300 group-hover:bg-slate-400'
                            }`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

// Scroll-to-Top Button
export const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 flex items-center justify-center z-40"
        >
            ↑
        </motion.button>
    );
};

// Circular Progress Indicator
interface CircularProgressProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 60,
    strokeWidth = 4,
    color = '#06b6d4',
    showValue = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    style={{ strokeDasharray: circumference }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
                    {value}%
                </div>
            )}
        </div>
    );
};
