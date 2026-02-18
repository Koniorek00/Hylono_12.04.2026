import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface Hotspot {
    id: string;
    x: number; // percentage
    y: number; // percentage
    title: string;
    description: string;
    icon?: React.ReactNode;
}

interface ImageHotspotProps {
    imageSrc?: string;
    imageGradient?: string;
    hotspots: Hotspot[];
    aspectRatio?: string;
    imageAlt?: string;
}

export const ImageHotspot: React.FC<ImageHotspotProps> = ({
    imageSrc,
    imageGradient = 'from-slate-200 to-slate-300',
    hotspots,
    aspectRatio = 'aspect-video',
    imageAlt = 'Interactive diagram'
}) => {
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

    return (
        <div className={`relative ${aspectRatio} rounded-2xl overflow-hidden`}>
            {/* Background Image */}
            {imageSrc ? (
                <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" width="800" height="450" />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${imageGradient}`} aria-hidden="true" />
            )}

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
                <div
                    key={hotspot.id}
                    className="absolute"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    {/* Pulse Animation */}
                    <motion.div
                        className="absolute inset-0 -m-4 rounded-full bg-cyan-500/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Hotspot Button */}
                    <button
                        onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                        aria-label={`${hotspot.title}: ${hotspot.description}`}
                        aria-expanded={activeHotspot === hotspot.id}
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeHotspot === hotspot.id
                                ? 'bg-cyan-500 text-white scale-110'
                                : 'bg-white text-slate-900 shadow-lg hover:bg-cyan-500 hover:text-white'
                            }`}
                    >
                        {activeHotspot === hotspot.id ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    </button>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {activeHotspot === hotspot.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className={`absolute z-10 w-64 bg-white rounded-xl shadow-2xl p-4 ${hotspot.x > 70 ? 'right-0' : hotspot.x < 30 ? 'left-0' : 'left-1/2 -translate-x-1/2'
                                    } ${hotspot.y > 60 ? 'bottom-full mb-3' : 'top-full mt-3'}`}
                            >
                                <h4 className="font-bold text-slate-900 mb-1">{hotspot.title}</h4>
                                <p className="text-sm text-slate-600">{hotspot.description}</p>
                                <div className={`absolute w-3 h-3 bg-white rotate-45 ${hotspot.y > 60 ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'
                                    } ${hotspot.x > 70 ? 'right-4' : hotspot.x < 30 ? 'left-4' : 'left-1/2 -translate-x-1/2'
                                    }`} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

// Example: HBOT Chamber Hotspots
export const HBOTChamberDiagram: React.FC = () => {
    const chamberHotspots: Hotspot[] = [
        { id: '1', x: 20, y: 30, title: 'Pressure Control', description: 'Digital pressure management system for precise ATA control up to 2.0 atmospheres.' },
        { id: '2', x: 50, y: 50, title: 'Viewing Window', description: 'Large acrylic window for natural light and reduced claustrophobia.' },
        { id: '3', x: 80, y: 40, title: 'Entry Zipper', description: 'Medical-grade zipper system for easy entry and exit.' },
        { id: '4', x: 35, y: 80, title: 'Oxygen Inlet', description: 'Filtered oxygen concentrator connection point.' },
        { id: '5', x: 70, y: 20, title: 'Emergency Valve', description: 'Quick-release safety valve for immediate decompression.' },
    ];

    return (
        <section className="py-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Chamber Features</h2>
                <ImageHotspot
                    imageGradient="from-cyan-100 to-blue-200"
                    hotspots={chamberHotspots}
                />
                <p className="text-center text-sm text-slate-500 mt-4">Click hotspots to explore features</p>
            </div>
        </section>
    );
};
