import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// Lottie-like JSON animation player
// Uses CSS animations to simulate Lottie effects without external dependencies

interface LottieAnimationProps {
    type: 'loading' | 'success' | 'error' | 'dna' | 'pulse' | 'oxygen' | 'energy' | 'heart';
    size?: number;
    color?: string;
    loop?: boolean;
    autoplay?: boolean;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
    type,
    size = 100,
    color = '#06b6d4',
    loop = true,
    autoplay = true
}) => {
    const animations: Record<string, React.ReactNode> = {
        loading: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    animate={{ strokeDashoffset: [200, 0], rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: loop ? Infinity : 0, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                />
            </svg>
        ),
        success: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <motion.path
                    d="M 30 50 L 45 65 L 70 35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            </svg>
        ),
        error: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <motion.path
                    d="M 35 35 L 65 65 M 65 35 L 35 65"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            </svg>
        ),
        dna: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                {[0, 1, 2, 3, 4].map((i) => (
                    <React.Fragment key={`dna-strand-${i}`}>
                        <motion.circle
                            cx={30 + Math.sin(i * 0.8) * 20}
                            cy={10 + i * 20}
                            r="6"
                            fill={color}
                            animate={{ cx: [30 + Math.sin(i * 0.8) * 20, 70 - Math.sin(i * 0.8) * 20, 30 + Math.sin(i * 0.8) * 20] }}
                            transition={{ duration: 2, repeat: loop ? Infinity : 0, delay: i * 0.1 }}
                        />
                        <motion.circle
                            cx={70 - Math.sin(i * 0.8) * 20}
                            cy={10 + i * 20}
                            r="6"
                            fill={color}
                            opacity={0.5}
                            animate={{ cx: [70 - Math.sin(i * 0.8) * 20, 30 + Math.sin(i * 0.8) * 20, 70 - Math.sin(i * 0.8) * 20] }}
                            transition={{ duration: 2, repeat: loop ? Infinity : 0, delay: i * 0.1 }}
                        />
                    </React.Fragment>
                ))}
            </svg>
        ),
        pulse: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                {[0, 1, 2].map((i) => (
                    <motion.circle
                        key={`pulse-ring-${i}`}
                        cx="50" cy="50"
                        r="20"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        animate={{ r: [20, 45], opacity: [0.8, 0] }}
                        transition={{ duration: 1.5, repeat: loop ? Infinity : 0, delay: i * 0.5 }}
                    />
                ))}
                <circle cx="50" cy="50" r="15" fill={color} />
            </svg>
        ),
        oxygen: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: loop ? Infinity : 0 }}>
                    <circle cx="50" cy="50" r="30" fill={color} opacity="0.3" />
                    <circle cx="50" cy="50" r="20" fill={color} opacity="0.5" />
                    <circle cx="50" cy="50" r="10" fill={color} />
                </motion.g>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.circle
                        key={`oxygen-particle-${angle}`}
                        cx={50 + 40 * Math.cos(angle * Math.PI / 180)}
                        cy={50 + 40 * Math.sin(angle * Math.PI / 180)}
                        r="5"
                        fill={color}
                        opacity={0.6}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: loop ? Infinity : 0, delay: i * 0.15 }}
                    />
                ))}
            </svg>
        ),
        energy: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.path
                    d="M 50 10 L 60 45 L 75 45 L 45 90 L 55 55 L 40 55 Z"
                    fill={color}
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 0.8, repeat: loop ? Infinity : 0 }}
                    style={{ transformOrigin: 'center' }}
                />
            </svg>
        ),
        heart: (
            <svg width={size} height={size} viewBox="0 0 100 100">
                <motion.path
                    d="M 50 85 C 20 55 10 30 30 20 C 45 12 50 30 50 30 C 50 30 55 12 70 20 C 90 30 80 55 50 85"
                    fill="#ef4444"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: loop ? Infinity : 0 }}
                    style={{ transformOrigin: 'center' }}
                />
            </svg>
        ),
    };

    return <div className="inline-flex">{animations[type]}</div>;
};

// Animated Icon wrapper
interface AnimatedIconProps {
    children: React.ReactNode;
    animation?: 'bounce' | 'pulse' | 'spin' | 'shake';
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    children,
    animation = 'pulse'
}) => {
    const animations = {
        bounce: { y: [0, -10, 0] },
        pulse: { scale: [1, 1.1, 1] },
        spin: { rotate: [0, 360] },
        shake: { x: [-2, 2, -2, 2, 0] }
    };

    return (
        <motion.div
            animate={animations[animation]}
            transition={{ duration: animation === 'spin' ? 2 : 1, repeat: Infinity }}
            className="inline-flex"
        >
            {children}
        </motion.div>
    );
};

// SVG Path Draw Animation
interface SVGDrawProps {
    path: string;
    width?: number;
    height?: number;
    strokeColor?: string;
    strokeWidth?: number;
    duration?: number;
}

export const SVGDraw: React.FC<SVGDrawProps> = ({
    path,
    width = 100,
    height = 100,
    strokeColor = '#06b6d4',
    strokeWidth = 2,
    duration = 2
}) => (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <motion.path
            d={path}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration, ease: 'easeInOut' }}
        />
    </svg>
);

