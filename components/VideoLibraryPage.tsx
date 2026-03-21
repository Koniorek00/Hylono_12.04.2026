import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Clock, Filter, Play, X } from 'lucide-react';
import { NavigateFunction, TechType } from '../types';
import { videosContent } from '../content/videos';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface VideoLibraryPageProps {
    onNavigate: NavigateFunction;
}

interface VideoItem {
    id: string;
    title: string;
    description: string;
    category: 'Product demo' | 'Education' | 'Protocols' | 'Customer stories';
    technology: 'HBOT' | 'H2' | 'RLT' | 'PEMF';
    duration: string;
    embedUrl: string;
    relatedProduct?: TechType;
    relatedProtocol?: string;
}

const VIDEO_ITEMS: VideoItem[] = [
    {
        id: 'video-hbot-demo',
        title: 'HBOT setup and first look',
        description: 'Walkthrough of hardware setup and session preparation for first-time users.',
        category: 'Product demo',
        technology: 'HBOT',
        duration: '08:40',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        relatedProduct: TechType.HBOT,
        relatedProtocol: 'starter-hbot',
    },
    {
        id: 'video-h2-education',
        title: 'Hydrogen basics explained',
        description: 'Educational overview of molecular hydrogen usage in recovery-focused routines.',
        category: 'Education',
        technology: 'H2',
        duration: '10:10',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        relatedProduct: TechType.HYDROGEN,
    },
    {
        id: 'video-rlt-protocol',
        title: 'RLT 14-day starter protocol',
        description: 'How to use red light sessions consistently and safely over the first two weeks.',
        category: 'Protocols',
        technology: 'RLT',
        duration: '12:25',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        relatedProduct: TechType.RLT,
        relatedProtocol: 'rlt-starter',
    },
    {
        id: 'video-pemf-story',
        title: 'Customer story: PEMF at home',
        description: 'A practical user story focused on routine consistency and outcomes over 60 days.',
        category: 'Customer stories',
        technology: 'PEMF',
        duration: '07:50',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        relatedProduct: TechType.PEMF,
    },
];

const LegacyVideosFallback: React.FC = () => (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-100 bg-white p-8">
            <h1 className="text-3xl font-black text-slate-900 mb-3 futuristic-font">Video library</h1>
            <p className="text-slate-600">Enhanced video filtering and modal experience are currently disabled.</p>
        </div>
    </div>
);

export const VideoLibraryPage: React.FC<VideoLibraryPageProps> = ({ onNavigate }) => {
    const reduced = useReducedMotion();
    const videosEnabled = useFeatureFlag('feature_videos_page');

    const [categoryFilter, setCategoryFilter] = useState('All');
    const [technologyFilter, setTechnologyFilter] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [videoEnded, setVideoEnded] = useState(false);

    const filteredVideos = useMemo(() => {
        return VIDEO_ITEMS.filter((video) => {
            const categoryMatch = categoryFilter === 'All' || video.category === categoryFilter;
            const technologyMatch = technologyFilter === 'All' || video.technology === technologyFilter;
            return categoryMatch && technologyMatch;
        });
    }, [categoryFilter, technologyFilter]);

    useEffect(() => {
        if (!selectedVideo) return;
        setVideoEnded(false);
        const timer = window.setTimeout(() => setVideoEnded(true), 6000);
        return () => window.clearTimeout(timer);
    }, [selectedVideo]);

    if (!videosEnabled) {
        return <LegacyVideosFallback />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <h1 className="text-4xl md:text-5xl font-black mb-3 futuristic-font">{videosContent.title}</h1>
                        <p className="text-slate-300">Product demos, educational clips, and practical protocols.</p>
                    </motion.div>
                </div>
            </section>

            <section className="py-10 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <label htmlFor="video-category" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                            <Filter size={12} className="inline mr-1" /> Category
                        </label>
                        <select
                            id="video-category"
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            className="w-full min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        >
                            {videosContent.categoryFilters.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <label htmlFor="video-technology" className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                            <Filter size={12} className="inline mr-1" /> Technology
                        </label>
                        <select
                            id="video-technology"
                            value={technologyFilter}
                            onChange={(event) => setTechnologyFilter(event.target.value)}
                            className="w-full min-h-11 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        >
                            {videosContent.technologyFilters.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="pb-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVideos.map((video, index) => (
                        <motion.article
                            key={video.id}
                            initial={reduced ? false : { opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedVideo(video)}
                                className="w-full text-left"
                                aria-label={`Play ${video.title}`}
                            >
                                <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                        <Play size={22} className="text-white ml-0.5" fill="currentColor" />
                                    </div>
                                    <span className="absolute right-2 bottom-2 rounded bg-black/70 text-white text-xs px-2 py-1 inline-flex items-center gap-1">
                                        <Clock size={10} /> {video.duration}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h2 className="font-semibold text-slate-900 mb-1">{video.title}</h2>
                                    <p className="text-xs text-slate-500 mb-2">{video.category} • {video.technology}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{video.description}</p>
                                </div>
                            </button>
                        </motion.article>
                    ))}
                </div>
            </section>

            {selectedVideo && (
                <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 id="video-modal-title" className="font-semibold text-slate-900">{selectedVideo.title}</h3>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="min-h-11 min-w-11 px-3 py-2 rounded-lg border border-slate-200 text-slate-600"
                                aria-label="Close video"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="aspect-video bg-black">
                            <iframe
                                title={selectedVideo.title}
                                src={`${selectedVideo.embedUrl}?autoplay=1`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {videoEnded && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <p className="text-sm font-semibold text-slate-900 mb-3">{videosContent.endCtaTitle}</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedVideo.relatedProduct ? (
                                        <button
                                            onClick={() => {
                                                setSelectedVideo(null);
                                                onNavigate('detail', selectedVideo.relatedProduct);
                                            }}
                                            className="min-h-11 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium"
                                        >
                                            View product
                                        </button>
                                    ) : null}
                                    {selectedVideo.relatedProtocol ? (
                                        <button
                                            onClick={() => {
                                                setSelectedVideo(null);
                                                onNavigate('protocols');
                                            }}
                                            className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
                                        >
                                            View protocol
                                        </button>
                                    ) : null}
                                    <button
                                        onClick={() => {
                                            setSelectedVideo(null);
                                            onNavigate('builder');
                                        }}
                                        className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium inline-flex items-center gap-1"
                                    >
                                        {videosContent.configuratorButton} <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

