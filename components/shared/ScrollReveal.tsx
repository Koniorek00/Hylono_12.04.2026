import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
    once?: boolean;
    amount?: number;
}

/**
 * ScrollReveal — wraps children with a whileInView Framer Motion animation.
 * Drop-in upgrade for any section that needs scroll-triggered entry.
 *
 * Usage:
 *   <ScrollReveal direction="up" delay={0.1}>
 *     <YourContent />
 *   </ScrollReveal>
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    className = '',
    delay = 0,
    duration = 0.7,
    direction = 'up',
    once = true,
    amount = 0.15,
}) => {
    const variants: Record<string, Variants> = {
        up: {
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
        },
        down: {
            hidden: { opacity: 0, y: -40 },
            visible: { opacity: 1, y: 0 },
        },
        left: {
            hidden: { opacity: 0, x: 48 },
            visible: { opacity: 1, x: 0 },
        },
        right: {
            hidden: { opacity: 0, x: -48 },
            visible: { opacity: 1, x: 0 },
        },
        scale: {
            hidden: { opacity: 0, scale: 0.88 },
            visible: { opacity: 1, scale: 1 },
        },
        none: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
    };

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants[direction]}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // expo out — premium feel
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * StaggerContainer — wraps a list of children and staggers their entrance.
 * Children use StaggerItem.
 *
 * Usage:
 *   <StaggerContainer>
 *     {items.map(i => <StaggerItem key={i.id}><Card /></StaggerItem>)}
 *   </StaggerContainer>
 */
interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    once?: boolean;
    amount?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
    once = true,
    amount = 0.1,
}) => {
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.1,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

/**
 * StaggerItem — used inside StaggerContainer. Each child animates in sequence.
 */
interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};
