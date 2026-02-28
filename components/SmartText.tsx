"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface SmartTextProps {
    children: string;
    onNavigate?: (path: string) => void;
    className?: string;
}

const TERM_MAPPINGS: { [key: string]: string } = {
    'PEMF': '/product/PEMF',
    'HBOT': '/product/HBOT',
    'RLT': '/product/RLT',
    'Hydrogen': '/product/HYDROGEN',
    'Support Hub': '/support',
    'Superhuman Protocol': '/protocols',
    'Zone Builder': '/builder',
    'Bio-Assessment': '/dashboard',
    'Hylono Rewards': '/rewards',
    'Support': '/support'
};

export const SmartText: React.FC<SmartTextProps> = ({ children, onNavigate, className = '' }) => {
    const router = useRouter();

    if (!children) return null;

    const handleNavigate = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            router.push(path);
            window.scrollTo(0, 0);
        }
    };

    // improved regex to capture exact terms but allow punctuation
    // Sort terms by length descending to match longest phrases first ("Support Hub" before "Support")
    const terms = Object.keys(TERM_MAPPINGS).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

    const parts = children.split(pattern);

    return (
        <span className={className}>
            {parts.map((part) => {
                const link = TERM_MAPPINGS[part];
                if (link) {
                    return (
                        <span
                            key={part}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent parent clicks (like accordion toggles)
                                handleNavigate(link);
                            }}
                            className="text-cyan-600 font-bold hover:text-cyan-400 cursor-pointer underline decoration-cyan-500/30 underline-offset-4 transition-colors"
                        >
                            {part}
                        </span>
                    );
                }
                return <span key={part}>{part}</span>;
            })}
        </span>
    );
};
