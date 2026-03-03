import React from 'react';
import { TechType } from '../types';

const deterministicUnit = (seed: number, salt: number): number => {
    const normalized = Math.abs(Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453) % 1;
    return normalized;
};

export const HbotVisual: React.FC = () => {
    // Concept: The Breath of the Universe (Pearl/Turquoise)
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50"
            role="img"
            aria-label="Hyperbaric Oxygen Therapy visualization showing pressure waves and rising oxygen bubbles representing cellular oxygenation"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/20 to-white mix-blend-overlay" />

            {/* Organic Pressure Waves */}
            {[...Array(4)].map((_, i) => (
                <div
                    key={`pressure-wave-${i}`}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30"
                    aria-hidden="true"
                    style={{
                        width: `${(i + 1) * 25}vh`,
                        height: `${(i + 1) * 25}vh`,
                        animation: `breathe ${5 + i}s ease-in-out infinite`,
                        animationDelay: `${i * 0.8}s`
                    }}
                />
            ))}

            {/* Rising Champagne Bubbles (Life Force) */}
            {[...Array(25)].map((_, i) => (
                <div
                    key={`p-${i}`}
                    className="absolute rounded-full bg-gradient-to-t from-white to-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.4)] animate-float-complex backdrop-blur-md"
                    aria-hidden="true"
                    style={{
                        left: `${deterministicUnit(i, 1) * 100}%`,
                        top: `${deterministicUnit(i, 2) * 120}%`,
                        width: `${deterministicUnit(i, 3) * 12 + 4}px`,
                        height: `${deterministicUnit(i, 4) * 12 + 4}px`,
                        animationDuration: `${deterministicUnit(i, 5) * 15 + 10}s`,
                        opacity: deterministicUnit(i, 6) * 0.6 + 0.2
                    }}
                />
            ))}
        </div>
    );
};

export const PemfVisual: React.FC = () => {
    // Concept: Toroidal Field (Amethyst/Electric)
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50 flex items-center justify-center perspective-1000"
            role="img"
            aria-label="PEMF therapy visualization showing a toroidal electromagnetic field with rotating magnetic field lines"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent" aria-hidden="true" />

            {/* Magnetic Field Lines */}
            <div className="relative w-[100vw] h-[100vw] md:w-[800px] md:h-[800px] flex items-center justify-center opacity-40" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`magnetic-field-${i}`}
                        className="absolute border border-purple-600/20 rounded-full"
                        style={{
                            width: `${100 - (i * 18)}%`,
                            height: `${100 - (i * 18)}%`,
                            transform: `rotateX(${70}deg) rotateY(${i * 15}deg)`,
                            animation: `spin-slow ${15 + i * 2}s linear infinite`,
                            boxShadow: '0 0 40px rgba(147, 51, 234, 0.1)'
                        }}
                    />
                ))}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={`cross-${i}`}
                        className="absolute border border-fuchsia-500/20 rounded-full"
                        style={{
                            width: `${100 - (i * 18)}%`,
                            height: `${100 - (i * 18)}%`,
                            transform: `rotateX(${70}deg) rotateY(${-i * 15}deg)`,
                            animation: `spin-slow ${20 + i * 2}s linear infinite reverse`,
                        }}
                    />
                ))}

                {/* Zero Point Core */}
                <div
                    className="w-4 h-4 bg-white rounded-full shadow-[0_0_50px_rgba(168,85,247,0.8)] animate-pulse z-10"
                    aria-label="Electromagnetic core"
                />
            </div>
        </div>
    );
};

export const RltVisual: React.FC = () => {
    // Concept: Cellular Resonance (Ruby/Gold)
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none bg-black/5"
            role="img"
            aria-label="Red Light Therapy visualization showing healing light spectrum with mitochondria activation particles"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-100/20 to-orange-50/20" aria-hidden="true" />

            {/* Healing Light Grid */}
            <div
                className="absolute inset-0 opacity-20"
                aria-hidden="true"
                style={{
                    backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.2) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                    perspective: '1000px',
                    transform: 'rotateX(20deg) scale(1.2) translateY(-10%)'
                }}
            />

            {/* Deep Penetration Beams */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-red-500/5 via-transparent to-transparent animate-pulse" aria-hidden="true" />

            {/* Mitochondria Activation Particles */}
            {[...Array(40)].map((_, i) => (
                <div
                    key={`mito-particle-${i}`}
                    className="absolute w-1.5 h-1.5 bg-red-500 rounded-full animate-float-complex"
                    aria-hidden="true"
                    style={{
                        left: `${deterministicUnit(i, 7) * 100}%`,
                        top: `${deterministicUnit(i, 8) * 100}%`,
                        boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                        animationDelay: `${deterministicUnit(i, 9) * 3}s`,
                        animationDuration: `${deterministicUnit(i, 10) * 5 + 5}s`
                    }}
                />
            ))}
        </div>
    );
};

export const HydrogenVisual: React.FC = () => {
    // Concept: Pure Elemental Flow (Platinum/Water)
    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none bg-slate-50"
            role="img"
            aria-label="Molecular Hydrogen visualization showing H2 molecular structures with atomic orbitals"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-100/30 via-transparent to-transparent" aria-hidden="true" />

            {/* Atomic Structures */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={`atomic-structure-${i}`}
                    className="absolute flex items-center justify-center animate-float-complex"
                    aria-hidden="true"
                    style={{
                        left: `${deterministicUnit(i, 11) * 80 + 10}%`,
                        top: `${deterministicUnit(i, 12) * 80 + 10}%`,
                        transform: `scale(${deterministicUnit(i, 13) * 0.6 + 0.6})`,
                        animationDuration: `${deterministicUnit(i, 14) * 15 + 15}s`
                    }}
                >
                    {/* H2 */}
                    <div className="relative flex items-center gap-1 group">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-300 shadow-inner border border-white/80 backdrop-blur-xl z-10"
                            aria-label="Hydrogen atom"
                        />
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-300 shadow-inner border border-white/80 backdrop-blur-xl z-10 -ml-2"
                            aria-label="Hydrogen atom"
                        />

                        {/* Orbitals */}
                        <div className="absolute inset-[-20px] border border-sky-300/30 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>
                </div>
            ))}

            {/* Flow Lines */}
            <div
                className="absolute inset-0 opacity-10"
                aria-hidden="true"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #0ea5e9 10px, #0ea5e9 11px)',
                    maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
                }}
            />
        </div>
    );
};