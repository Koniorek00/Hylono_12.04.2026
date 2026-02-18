import React from 'react';
import { GptNav } from './HeroGPT/GptNav';
import { GptHero } from './HeroGPT/GptHero';
import { GptTrustStack } from './HeroGPT/GptTrustStack';
import { GptLower } from './HeroGPT/GptLower';
import { GptFooter } from './HeroGPT/GptFooter';

interface HeroGptProps {
    onNavigate?: (page: string, tech?: string) => void;
}

export const HeroGpt: React.FC<HeroGptProps> = ({ onNavigate }) => {
    return (
        <div
            className="min-h-screen w-full bg-[#FAFBFC] text-[#1A1A1A] overflow-x-hidden"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
            <GptNav onNavigate={onNavigate} />
            <GptHero onNavigate={onNavigate} />
            <GptTrustStack onNavigate={onNavigate} />
            <GptLower onNavigate={onNavigate} />
            <GptFooter onNavigate={onNavigate} />
        </div>
    );
};

export default HeroGpt;
