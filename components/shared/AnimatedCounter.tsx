import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}

/**
 * AnimatedCounter — counts up from 0 to `end` when element enters viewport.
 * Uses easeOutExpo curve for a premium feel.
 *
 * Usage:
 *   <AnimatedCounter end={2500} suffix="+" className="text-4xl font-bold text-cyan-500" />
 *   <AnimatedCounter end={87} prefix="" suffix="+" className="text-5xl font-black" />
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    end,
    duration = 2000,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = '',
}) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!isInView || hasAnimated) return;
        setHasAnimated(true);

        const startTime = performance.now();

        const easeOutExpo = (t: number): number => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentCount = easedProgress * end;

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration, hasAnimated]);

    const displayValue = decimals > 0
        ? count.toFixed(decimals)
        : Math.round(count).toLocaleString();

    return (
        <span ref={ref} className={className}>
            {prefix}{displayValue}{suffix}
        </span>
    );
};

