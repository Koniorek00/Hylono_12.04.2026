/**
 * CustomCursor — Premium spring-physics cursor with interactive states
 * 
 * - Outer ring: large, delayed, fades on interactive elements
 * - Inner dot: tight, instant tracking
 * - "hover" state: ring expands + inverts color
 * - "click" state: ring contracts sharply
 * - Hides native cursor via CSS
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'drag';

export const CustomCursor: React.FC = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const ringX = useMotionValue(-100);
    const ringY = useMotionValue(-100);

    // Inner dot — tight tracking
    const dotSpringX = useSpring(cursorX, { stiffness: 900, damping: 40, mass: 0.2 });
    const dotSpringY = useSpring(cursorY, { stiffness: 900, damping: 40, mass: 0.2 });

    // Outer ring — laggy, luxurious
    const ringSpringX = useSpring(ringX, { stiffness: 120, damping: 22, mass: 0.8 });
    const ringSpringY = useSpring(ringY, { stiffness: 120, damping: 22, mass: 0.8 });

    const cursorStateRef = useRef<CursorState>('default');
    const [cursorState, setCursorState] = React.useState<CursorState>('default');

    const moveCursor = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        ringX.set(e.clientX);
        ringY.set(e.clientY);
    }, [cursorX, cursorY, ringX, ringY]);

    const handleMouseDown = useCallback(() => {
        setCursorState('click');
        cursorStateRef.current = 'click';
    }, []);

    const handleMouseUp = useCallback(() => {
        const el = document.elementFromPoint(cursorX.get(), cursorY.get());
        const isInteractive = el?.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]');
        const newState = isInteractive ? 'hover' : 'default';
        setCursorState(newState);
        cursorStateRef.current = newState;
    }, [cursorX]);

    useEffect(() => {
        // Detect interactive elements for hover state
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]');
            const isText = target.closest('p, h1, h2, h3, h4, h5, h6, span, label');
            const isDrag = target.closest('[draggable], [data-cursor="drag"]');

            if (isInteractive) {
                setCursorState('hover');
                cursorStateRef.current = 'hover';
            } else if (isDrag) {
                setCursorState('drag');
                cursorStateRef.current = 'drag';
            } else if (isText) {
                setCursorState('text');
                cursorStateRef.current = 'text';
            } else {
                setCursorState('default');
                cursorStateRef.current = 'default';
            }
        };

        window.addEventListener('mousemove', moveCursor, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        window.addEventListener('mousedown', handleMouseDown, { passive: true });
        window.addEventListener('mouseup', handleMouseUp, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [moveCursor, handleMouseDown, handleMouseUp]);

    // Only render on desktop — avoid mobile interference
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    const ringSize = cursorState === 'hover' ? 48 : cursorState === 'click' ? 20 : cursorState === 'text' ? 4 : 32;
    const ringOpacity = cursorState === 'text' ? 0.3 : 0.7;
    const ringBg = cursorState === 'hover' ? 'rgba(6, 182, 212, 0.15)' : 'transparent';
    const ringBorder = cursorState === 'hover' ? 'rgba(6, 182, 212, 0.8)' : 'rgba(15, 23, 42, 0.5)';

    return (
        <>
            {/* Hide native cursor globally */}
            <style>{`*, *::before, *::after { cursor: none !important; }`}</style>

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-normal"
                style={{
                    x: ringSpringX,
                    y: ringSpringY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: ringSize,
                    height: ringSize,
                    opacity: ringOpacity,
                    backgroundColor: ringBg,
                    border: `1.5px solid ${ringBorder}`,
                    backdropFilter: cursorState === 'hover' ? 'blur(4px)' : 'none',
                }}
                animate={{
                    width: ringSize,
                    height: ringSize,
                    opacity: ringOpacity,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            />

            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
                style={{
                    x: dotSpringX,
                    y: dotSpringY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    width: cursorState === 'click' ? 6 : cursorState === 'hover' ? 6 : 6,
                    height: cursorState === 'click' ? 6 : cursorState === 'hover' ? 6 : 6,
                    backgroundColor: cursorState === 'hover' ? 'rgb(6, 182, 212)' : 'rgb(15, 23, 42)',
                    boxShadow: cursorState === 'hover'
                        ? '0 0 12px rgba(6, 182, 212, 0.8), 0 0 24px rgba(6, 182, 212, 0.3)'
                        : '0 0 0px transparent',
                    scale: cursorState === 'click' ? 0.5 : 1,
                }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
            />
        </>
    );
};
