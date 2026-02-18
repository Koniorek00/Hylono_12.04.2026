import React from 'react';
import { HeroNav } from './Hero46T2/HeroNav';
import { HeroMain } from './Hero46T2/HeroMain';
import { HeroPhilosophy } from './Hero46T2/HeroPhilosophy';
import { HeroEcosystem } from './Hero46T2/HeroEcosystem';
import { HeroAccess } from './Hero46T2/HeroAccess';
import { HeroAudience } from './Hero46T2/HeroAudience';
import { HeroSocial } from './Hero46T2/HeroSocial';
import { HeroFooter } from './Hero46T2/HeroFooter';
import { COLORS } from './Hero46T2/HeroShared';

interface HeroProps {
    onNavigate?: (page: string, tech?: string) => void;
}

export const Hero46T2: React.FC<HeroProps> = ({ onNavigate }) => {
    return (
        <div className={`min-h-screen w-full font-sans text-[${COLORS.text.primary}] bg-[${COLORS.bg.base}] overflow-x-hidden selection:bg-[${COLORS.brand.light}] selection:text-[${COLORS.brand.primary}]`}>
            <HeroNav onNavigate={onNavigate} />
            <HeroMain onNavigate={onNavigate} />
            <HeroPhilosophy />
            <HeroEcosystem onNavigate={onNavigate} />
            <HeroAccess onNavigate={onNavigate} />
            <HeroAudience onNavigate={onNavigate} />
            <HeroSocial />
            <HeroFooter onNavigate={onNavigate} />

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee-reverse {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                .animate-marquee-reverse {
                    animation: marquee-reverse 70s linear infinite;
                }
                .animate-marquee:hover, .animate-marquee-reverse:hover {
                    animation-play-state: paused;
                }
                @keyframes pulse {
                    from { opacity: 0.3; transform: scale(var(--scale-from, 1)); }
                    to { opacity: 0.6; transform: scale(var(--scale-to, 1.05)); }
                }
                .animate-pulse-slow {
                    animation: pulse 4s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default Hero46T2;
