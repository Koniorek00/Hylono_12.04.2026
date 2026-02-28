/**
 * MagneticButton — Buttons that magnetically pull toward the cursor
 * 
 * On hover, the button tracks the mouse position and pulls
 * slightly in that direction using spring physics. On mouse leave,
 * it snaps back with momentum. Premium Awwwards-tier interaction.
 */
import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number; // How strong the pull is (0-1), default 0.4
    'aria-label'?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    style?: React.CSSProperties;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    strength = 0.4,
    'aria-label': ariaLabel,
    type = 'button',
    disabled = false,
    style,
}) => {
    const ref = useRef<HTMLButtonElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current || disabled) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        x.set(deltaX);
        y.set(deltaY);
    }, [x, y, strength, disabled]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
    }, [x, y]);

    return (
        <motion.button
            ref={ref}
            type={type}
            className={className}
            style={{ x: springX, y: springY, ...style }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            whileTap={{ scale: 0.96 }}
            aria-label={ariaLabel}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};
