/**
 * TiltCard — 3D perspective tilt effect on hover
 * 
 * Tracks mouse position within the card bounds and applies
 * rotateX/rotateY using Framer Motion spring physics.
 * Inner elements can receive different parallax depths.
 * 
 * Usage:
 *   <TiltCard className="...">
 *     <TiltCard.Layer depth={10}>icon</TiltCard.Layer>   <- moves most
 *     <TiltCard.Layer depth={2}>text</TiltCard.Layer>    <- moves less
 *   </TiltCard>
 */
import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    maxTilt?: number;       // Max degrees of rotation (default: 10)
    perspective?: number;   // CSS perspective in px (default: 1000)
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const TiltCardLayer: React.FC<{ children: React.ReactNode; depth?: number; className?: string }> = ({
    children,
    depth = 5,
    className = '',
}) => (
    <div
        className={`transform-gpu ${className}`}
        style={{ transform: `translateZ(${depth}px)` }}
    >
        {children}
    </div>
);

const TiltCardComponent: React.FC<TiltCardProps> & { Layer: typeof TiltCardLayer } = ({
    children,
    className = '',
    maxTilt = 8,
    perspective = 1000,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const scale = useMotionValue(1);
    const glareOpacity = useMotionValue(0);

    const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20, mass: 0.5 });
    const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20, mass: 0.5 });
    const springScale = useSpring(scale, { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Center-relative values (-0.5 to 0.5)
        const tiltX = (y - 0.5) * -maxTilt * 2;
        const tiltY = (x - 0.5) * maxTilt * 2;

        rotateX.set(tiltX);
        rotateY.set(tiltY);
        glareOpacity.set((x + y) * 0.15);
    }, [rotateX, rotateY, glareOpacity, maxTilt]);

    const handleMouseEnter = useCallback(() => {
        scale.set(1.02);
        onMouseEnter?.();
    }, [scale, onMouseEnter]);

    const handleMouseLeave = useCallback(() => {
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
        glareOpacity.set(0);
        onMouseLeave?.();
    }, [rotateX, rotateY, scale, glareOpacity, onMouseLeave]);

    return (
        <motion.div
            ref={ref}
            className={`relative transform-gpu ${className}`}
            style={{
                perspective,
                rotateX: springRotateX,
                rotateY: springRotateY,
                scale: springScale,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}

            {/* Subtle glare highlight */}
            <motion.div
                className="absolute inset-0 rounded-[inherit] pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)',
                    opacity: glareOpacity,
                }}
            />
        </motion.div>
    );
};

TiltCardComponent.Layer = TiltCardLayer;
export const TiltCard = TiltCardComponent;

