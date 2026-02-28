import React from 'react';

interface MarqueeTickerProps {
    items: React.ReactNode[];
    speed?: 'slow' | 'normal' | 'fast';
    direction?: 'left' | 'right';
    separator?: React.ReactNode;
    className?: string;
    itemClassName?: string;
}

/**
 * MarqueeTicker — infinite horizontal scrolling ticker.
 * Items duplicate automatically for seamless loop.
 * Pure CSS animation (no JS scroll event), respects prefers-reduced-motion.
 *
 * Usage:
 *   <MarqueeTicker
 *     items={['OXYGEN', 'HYDROGEN', 'LIGHT', 'SIGNAL']}
 *     speed="slow"
 *   />
 */
export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
    items,
    speed = 'normal',
    direction = 'left',
    separator,
    className = '',
    itemClassName = '',
}) => {
    const speedClass = {
        slow: 'animate-marquee-slow',
        normal: 'animate-marquee',
        fast: 'animate-marquee',
    }[speed];

    const animationDirection = direction === 'right' ? 'reverse' : 'normal';

    // Duplicate items for seamless loop (need at least 2x content to fill)
    const allItems = [...items, ...items];

    const defaultSeparator = (
        <span className="mx-6 w-1 h-1 rounded-full bg-current opacity-30 inline-block align-middle" />
    );

    const sep = separator ?? defaultSeparator;

    return (
        <div
            className={`overflow-hidden whitespace-nowrap ${className}`}
            aria-hidden="true"
        >
            <div
                className={`inline-flex ${speedClass}`}
                style={{ willChange: 'transform', animationDirection }}
            >
                {allItems.map((item, i) => (
                    <span key={i} className={`inline-flex items-center ${itemClassName}`}>
                        {item}
                        {sep}
                    </span>
                ))}
            </div>
        </div>
    );
};
