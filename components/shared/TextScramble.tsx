/**
 * TextScramble — Animated text that scrambles through random characters
 * then resolves to the final string.
 * 
 * Characters reveal left→right with a trailing scramble zone.
 * Premium effect used by studios like Active Theory, Resn, etc.
 */
import React, { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

interface TextScrambleProps {
    text: string;
    className?: string;
    duration?: number; // ms to complete full reveal
    delay?: number;    // ms before starting
    as?: keyof React.JSX.IntrinsicElements;
}

export const TextScramble: React.FC<TextScrambleProps> = ({
    text,
    className = '',
    duration = 1200,
    delay = 0,
    as: Tag = 'span',
}) => {
    const [displayed, setDisplayed] = useState('');
    const frameRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const hasStarted = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            hasStarted.current = true;

            const animate = (timestamp: number) => {
                if (!startRef.current) startRef.current = timestamp;
                const elapsed = timestamp - startRef.current;
                const progress = Math.min(elapsed / duration, 1);

                // How many characters are "locked in"
                const lockedCount = Math.floor(progress * text.length);

                let result = '';
                for (let i = 0; i < text.length; i++) {
                    if (i < lockedCount) {
                        // Locked — show real character
                        result += text[i];
                    } else if (i < lockedCount + 4) {
                        // In the scramble zone
                        if (text[i] === ' ') {
                            result += ' ';
                        } else {
                            result += CHARS[Math.floor(Math.random() * CHARS.length)];
                        }
                    } else {
                        // Not yet reached — show nothing or space
                        result += text[i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                }

                setDisplayed(result);

                if (progress < 1) {
                    frameRef.current = requestAnimationFrame(animate);
                } else {
                    setDisplayed(text);
                }
            };

            frameRef.current = requestAnimationFrame(animate);
        }, delay);

        return () => {
            clearTimeout(timer);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [text, duration, delay]);

    // Before animation starts, show nothing visible (or placeholder)
    const content = displayed || text.replace(/./g, '\u00A0');

    return (
        <Tag className={`font-mono ${className}`}>
            {displayed ? displayed.split('').map((char, i) => (
                <span
                    key={i}
                    className={char === text[i] ? 'text-inherit' : 'text-gray-300/60'}
                >
                    {char}
                </span>
            )) : content}
        </Tag>
    );
};
