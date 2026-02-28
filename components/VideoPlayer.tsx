import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import Image from 'next/image';

interface VideoPlayerProps {
    videoUrl?: string;
    thumbnailUrl?: string;
    title?: string;
}

// Video Player Component
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl,
    title = 'Product Video'
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden group">
            {!isPlaying ? (
                <>
                    {/* Thumbnail */}
                    <div className={`absolute inset-0 ${thumbnailUrl ? '' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
                        {thumbnailUrl && (
                            <Image
                                src={thumbnailUrl}
                                alt={title}
                                fill
                                sizes="(max-width: 768px) 100vw, 720px"
                                className="object-cover"
                            />
                        )}
                    </div>

                    {/* Play Button Overlay */}
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                    >
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="text-slate-900 ml-1" size={32} fill="currentColor" />
                        </div>
                    </button>

                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-medium">{title}</p>
                    </div>
                </>
            ) : (
                <iframe
                    src={`${videoUrl}?autoplay=1`}
                    title={title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
};

// Video Gallery Section
export const VideoGallery: React.FC = () => {
    const videos = [
        { id: 1, title: 'HBOT Chamber Overview', thumbnail: 'from-cyan-500 to-blue-600' },
        { id: 2, title: 'Installation Guide', thumbnail: 'from-emerald-500 to-teal-600' },
        { id: 3, title: 'Customer Testimonial', thumbnail: 'from-purple-500 to-pink-600' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Watch & Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="relative aspect-video bg-gradient-to-br rounded-xl overflow-hidden group cursor-pointer">
                            <div className={`absolute inset-0 bg-gradient-to-br ${video.thumbnail}`} />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="text-slate-900 ml-0.5" size={24} fill="currentColor" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm font-medium">{video.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Embedded Video Section for Tech Detail Pages
export const TechVideoSection: React.FC<{ techName: string }> = ({ techName }) => (
    <div className="bg-slate-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">See {techName} in Action</h3>
        <VideoPlayer title={`${techName} Demo`} />
        <p className="text-sm text-slate-500 mt-4 text-center">
            Watch our comprehensive overview of {techName} technology
        </p>
    </div>
);
