import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TypingEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    cursor?: boolean;
    className?: string;
    onComplete?: () => void;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
    text,
    speed = 50,
    delay = 0,
    cursor = true,
    className = '',
    onComplete
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let charIndex = 0;

        const startTyping = () => {
            setIsTyping(true);
            const type = () => {
                if (charIndex < text.length) {
                    setDisplayedText(text.slice(0, charIndex + 1));
                    charIndex++;
                    timeout = setTimeout(type, speed);
                } else {
                    setIsTyping(false);
                    onComplete?.();
                }
            };
            type();
        };

        timeout = setTimeout(startTyping, delay);

        return () => clearTimeout(timeout);
    }, [text, speed, delay, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
                />
            )}
        </span>
    );
};

// Multi-line typing with sequential lines
interface TypingSequenceProps {
    lines: string[];
    lineDelay?: number;
    speed?: number;
    className?: string;
}

export const TypingSequence: React.FC<TypingSequenceProps> = ({
    lines,
    lineDelay = 1000,
    speed = 40,
    className = ''
}) => {
    const [currentLine, setCurrentLine] = useState(0);
    const [completedLines, setCompletedLines] = useState<string[]>([]);
    const currentLineText = lines[currentLine];

    const handleLineComplete = useCallback(() => {
        const completedLine = lines[currentLine];
        if (completedLine === undefined) return;

        setCompletedLines(prev => [...prev, completedLine]);

        if (currentLine < lines.length - 1) {
            setTimeout(() => setCurrentLine(prev => prev + 1), lineDelay);
        }
    }, [currentLine, lines, lineDelay]);

    return (
        <div className={className}>
            {completedLines.map((line) => (
                <div key={line}>{line}</div>
            ))}
            {currentLine < lines.length && currentLineText !== undefined && (
                <TypingEffect
                    text={currentLineText}
                    speed={speed}
                    onComplete={handleLineComplete}
                />
            )}
        </div>
    );
};

// Text Rotator - cycles through different words/phrases
interface TextRotatorProps {
    prefix?: string;
    words: string[];
    suffix?: string;
    interval?: number;
    className?: string;
    wordClassName?: string;
}

export const TextRotator: React.FC<TextRotatorProps> = ({
    prefix = '',
    words,
    suffix = '',
    interval = 3000,
    className = '',
    wordClassName = 'text-cyan-500'
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasWords = words.length > 0;
    const currentWord = hasWords ? words[currentIndex % words.length] : undefined;

    useEffect(() => {
        if (!hasWords) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % words.length);
        }, interval);

        return () => clearInterval(timer);
    }, [hasWords, words.length, interval]);

    return (
        <span className={className}>
            {prefix}
            <AnimatePresence mode="wait">
                {currentWord !== undefined && (
                    <motion.span
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`inline-block ${wordClassName}`}
                    >
                        {currentWord}
                    </motion.span>
                )}
            </AnimatePresence>
            {suffix}
        </span>
    );
};

// Shuffle Letters Effect
interface ShuffleTextProps {
    text: string;
    duration?: number;
    className?: string;
}

export const ShuffleText: React.FC<ShuffleTextProps> = ({
    text,
    duration = 1000,
    className = ''
}) => {
    const [displayText, setDisplayText] = useState(text);
    const [isShuffling, setIsShuffling] = useState(true);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    useEffect(() => {
        if (!isShuffling) return;

        const iterations = 10;
        const intervalTime = duration / iterations;
        let count = 0;

        const interval = setInterval(() => {
            setDisplayText(
                text.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    if (count > i) return text[i] ?? char;
                    return chars[Math.floor(Math.random() * chars.length)] ?? char;
                }).join('')
            );

            count += text.length / iterations;

            if (count >= text.length) {
                setDisplayText(text);
                setIsShuffling(false);
                clearInterval(interval);
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [text, duration, isShuffling]);

    return <span className={className}>{displayText}</span>;
};
