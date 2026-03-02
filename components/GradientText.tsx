import React from 'react';
import { motion } from 'motion/react';

interface AnimatedGradientTextProps {
    children: React.ReactNode;
    className?: string;
    gradient?: string;
    duration?: number;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
    children,
    className = 'text-4xl font-bold',
    gradient = 'from-cyan-400 via-purple-500 to-pink-500',
    duration = 3
}) => {
    return (
        <motion.span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
        >
            {children}
        </motion.span>
    );
};

// Preset gradients
export const GradientPresets = {
    ocean: 'from-cyan-400 via-blue-500 to-cyan-400',
    sunset: 'from-orange-400 via-pink-500 to-purple-600',
    aurora: 'from-green-400 via-cyan-500 to-blue-600',
    gold: 'from-amber-300 via-yellow-500 to-amber-600',
    neon: 'from-pink-500 via-purple-500 to-indigo-500',
    health: 'from-emerald-400 via-cyan-500 to-blue-500'
};

// Static gradient text (no animation)
interface GradientTextProps {
    children: React.ReactNode;
    gradient?: string;
    className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
    children,
    gradient = 'from-cyan-500 to-blue-600',
    className = ''
}) => (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
        {children}
    </span>
);

// Dual Heading - two-part headline styling
interface DualHeadingProps {
    primary: string;
    secondary: string;
    primaryClass?: string;
    secondaryClass?: string;
    separator?: string;
}

export const DualHeading: React.FC<DualHeadingProps> = ({
    primary,
    secondary,
    primaryClass = 'text-slate-900',
    secondaryClass = 'text-cyan-500',
    separator = ' '
}) => (
    <h2 className="text-3xl md:text-4xl font-bold">
        <span className={primaryClass}>{primary}</span>
        {separator}
        <span className={secondaryClass}>{secondary}</span>
    </h2>
);

// Glowing Text Effect
interface GlowTextProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

export const GlowText: React.FC<GlowTextProps> = ({
    children,
    color = 'cyan',
    className = ''
}) => (
    <span
        className={`text-${color}-500 ${className}`}
        style={{
            textShadow: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor`,
        }}
    >
        {children}
    </span>
);

// Underline reveal animation
interface UnderlineTextProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

export const UnderlineReveal: React.FC<UnderlineTextProps> = ({
    children,
    color = 'bg-cyan-500',
    className = ''
}) => (
    <span className={`relative inline-block group ${className}`}>
        {children}
        <motion.span
            className={`absolute bottom-0 left-0 h-0.5 ${color}`}
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 0.5, delay: 0.2 }}
        />
    </span>
);

// Highlight (marker) effect
interface HighlightTextProps {
    children: React.ReactNode;
    color?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
    children,
    color = 'bg-yellow-200'
}) => (
    <span className="relative inline-block">
        <motion.span
            className={`absolute inset-0 ${color} -z-10`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.4 }}
        />
        {children}
    </span>
);

