import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface Product360ViewerProps {
    productName: string;
    frameCount?: number;
    baseColor?: string;
}

// 360 Product Viewer (simulated with rotation)
export const Product360Viewer: React.FC<Product360ViewerProps> = ({
    productName,
    frameCount = 36,
    baseColor = 'from-slate-200 to-slate-300'
}) => {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const delta = e.clientX - startX.current;
        setRotation(prev => prev + delta * 0.5);
        startX.current = e.clientX;
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Simulated 3D Object */}
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <motion.div
                        animate={{ rotateY: rotation }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className={`w-3/4 h-3/4 rounded-2xl bg-gradient-to-br ${baseColor} shadow-2xl`}
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        {/* Product representation */}
                        <div className="absolute inset-4 bg-white/30 rounded-xl backdrop-blur-sm flex items-center justify-center">
                            <span className="text-slate-600 font-bold text-center px-4">{productName}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Drag Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-400 text-xs">
                    <RotateCw size={14} />
                    <span>Drag to rotate</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <ZoomOut size={18} className="text-slate-600" />
                </button>
                <button
                    onClick={() => setRotation(0)}
                    className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm text-slate-600"
                >
                    Reset
                </button>
                <button
                    onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                    className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <ZoomIn size={18} className="text-slate-600" />
                </button>
            </div>
        </div>
    );
};

// Product Image Gallery with 360 option
export const ProductImageGallery: React.FC<{ productName: string }> = ({ productName }) => {
    const [activeView, setActiveView] = useState<'images' | '360'>('images');
    const [activeImage, setActiveImage] = useState(0);

    const images = [
        'from-cyan-400 to-blue-500',
        'from-slate-300 to-slate-400',
        'from-purple-400 to-indigo-500',
        'from-emerald-400 to-teal-500',
    ];

    return (
        <div>
            {/* View Toggle */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveView('images')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${activeView === 'images' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                >
                    Photos
                </button>
                <button
                    onClick={() => setActiveView('360')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center gap-2 ${activeView === '360' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                >
                    <RotateCw size={14} /> 360° View
                </button>
            </div>

            {activeView === 'images' ? (
                <div>
                    {/* Main Image */}
                    <div className={`aspect-square rounded-2xl bg-gradient-to-br ${images[activeImage]} mb-4`} />

                    {/* Thumbnails */}
                    <div className="flex gap-2">
                        {images.map((img, i) => (
                            <button
                                key={img}
                                onClick={() => setActiveImage(i)}
                                className={`w-16 h-16 rounded-lg bg-gradient-to-br ${img} transition-all ${activeImage === i ? 'ring-2 ring-cyan-500 ring-offset-2' : 'opacity-70 hover:opacity-100'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <Product360Viewer productName={productName} />
            )}
        </div>
    );
};

