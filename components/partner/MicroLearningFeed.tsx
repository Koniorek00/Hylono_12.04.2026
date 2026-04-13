import React, { useEffect, useRef, useState } from 'react';
import { Play, ChevronRight, ChevronLeft, Target, Rocket } from 'lucide-react';
import { MicroVideo, MicroLearningPlayer, InteractionOption } from './MicroLearningPlayer';

type Category = 'all' | 'basics' | 'safety' | 'advanced' | 'mastery';

interface ExtendedMicroVideo extends MicroVideo {
    category: Category;
    step?: number; // Recommended path step number
}

const formatDurationFromSeconds = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds <= 0) {
        return '0:00';
    }

    const roundedSeconds = Math.max(1, Math.round(seconds));
    const minutes = Math.floor(roundedSeconds / 60);
    const remainder = roundedSeconds % 60;

    return `${minutes}:${remainder.toString().padStart(2, '0')}`;
};

const getExportStatusLabel = (video: ExtendedMicroVideo): string => {
    const formats = [video.videoSrc ? 'MP4' : null, video.videoWebmSrc ? 'WebM' : null]
        .filter((value): value is string => Boolean(value))
        .join(' + ');

    if (!formats) {
        return 'Interactive lesson';
    }

    if (video.hasAudio === false) {
        return `Silent ${formats} export`;
    }

    return `${formats} export ready`;
};

const CATEGORIES: { id: Category; label: string; icon: string; description: string }[] = [
    { id: 'all', label: 'All', icon: '📚', description: 'Everything' },
    { id: 'basics', label: 'Start Here', icon: '🌱', description: 'Beginner essentials' },
    { id: 'safety', label: 'Safety', icon: '🛡️', description: 'Critical protocols' },
    { id: 'advanced', label: 'Level Up', icon: '⚡', description: 'Intermediate skills' },
    { id: 'mastery', label: 'Pro Mode', icon: '🏆', description: 'Expert simulations' },
];

// Academy micro-learning catalog with real exports wired in where available.
const MICRO_VIDEOS: ExtendedMicroVideo[] = [
    {
        id: 'mv1',
        title: 'Unboxing: Inhalation Machine Arrival',
        description:
            'Follow the full handoff from courier delivery to opening the box, checking accessories, and setting up the inhalation machine for first use.',
        duration: '0:07',
        thumbnailColor: 'bg-gradient-to-br from-sky-500 to-cyan-700',
        likes: 218,
        views: '1.9k',
        videoSrc: '/videos/academy/inhalation-unboxing.mp4',
        videoWebmSrc: '/videos/academy/inhalation-unboxing.webm',
        posterSrc: '/videos/academy/inhalation-unboxing-poster.jpg',
        hasAudio: false,
        category: 'basics',
        step: 1,
    },
    {
        id: 'mv2',
        title: 'Operator Setup: Ready the Station',
        description:
            'Watch the operator stage the inhalation device, align the mask and tubing, and prepare the station before the client arrives.',
        duration: '0:06',
        thumbnailColor: 'bg-gradient-to-br from-rose-400 to-orange-500',
        likes: 143,
        views: '1.1k',
        videoSrc: '/videos/academy/operator-setup.mp4',
        posterSrc: '/videos/academy/operator-setup-poster.jpg?v=20260413b',
        hasAudio: false,
        category: 'basics',
        step: 2,
        interactions: [
            {
                id: 'i2',
                timestamp: 50,
                type: 'quiz',
                question: 'Before the client sits down, the operator should confirm:',
                options: [
                    { label: 'The device, mask, and tubing are staged and within reach', correct: true },
                    { label: 'The pressure cycle has already started', correct: false },
                    { label: 'The room lights are turned fully off', correct: false },
                    { label: 'No prep is needed until the client is seated', correct: false }
                ],
                correctIndex: 0
            }
        ]
    },
    {
        id: 'mv3',
        title: 'Post-Session Sanitization',
        description:
            'See the fast reset workflow for wiping the device, resetting the mask area, and making the station ready for the next booking.',
        duration: '0:06',
        thumbnailColor: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        likes: 256,
        views: '2.5k',
        videoSrc: '/videos/academy/post-session-sanitization.mp4',
        posterSrc: '/videos/academy/post-session-sanitization-poster.jpg?v=20260413b',
        hasAudio: false,
        category: 'basics',
        step: 3
    },
    {
        id: 'mv4',
        title: 'Troubleshooting: Ear Pressure',
        description: 'What to do when a client feels ear discomfort.',
        duration: '4:20',
        thumbnailColor: 'bg-gradient-to-br from-blue-400 to-cyan-500',
        likes: 312,
        views: '3.1k',
        category: 'safety',
        step: 4
    },
    {
        id: 'mv5',
        title: 'Selling the Benefits',
        description:
            'An extended consultation-style clip with spoken portability, active-state, and simplicity cues carried across a full two-stage sales explanation.',
        duration: '0:12',
        thumbnailColor: 'bg-gradient-to-br from-amber-400 to-pink-500',
        likes: 156,
        views: '1.8k',
        videoSrc: '/videos/academy/selling-the-benefits.mp4',
        posterSrc: '/videos/academy/selling-the-benefits-poster.jpg?v=20260413d',
        hasAudio: true,
        category: 'advanced'
    },
    {
        id: 'mv6',
        title: 'Simulator: Manual Pressurization',
        description: 'PRACTICE MODE: Manually operate the control surfaces to reach target pressure.',
        duration: 'SIMULATION',
        thumbnailColor: 'bg-slate-900 border-2 border-cyan-500/50',
        likes: 543,
        views: 'Mastery',
        category: 'mastery',
        step: 5,
        interactions: [
            {
                id: 'i_sim_1',
                timestamp: 10, // Starts almost immediately
                type: 'simulation'
            }
        ]
    },
    {
        id: 'mv7',
        title: 'DRILL: Rapid Depressurization',
        description: 'CRITICAL: Test your reflexes in a simulated emergency scenario.',
        duration: 'DRILL',
        thumbnailColor: 'bg-red-950 border-2 border-red-600',
        likes: 666,
        views: 'Critical',
        category: 'safety',
        interactions: [
            {
                id: 'i_drill_1',
                timestamp: 15,
                type: 'emergency_drill',
                scenario: 'PATIENT SIGNAL: "My ears hurt badly!"',
                options: [
                    { label: 'Increase O2 Flow', correct: false },
                    { label: 'Stop Pressurization Immediately', correct: true },
                    { label: 'Tell patient to swallow', correct: false }
                ]
            }
        ]
    },
    {
        id: 'mv8',
        title: 'EPISODE: The Pressure Pivot',
        description: 'CHOOSE YOUR PATH: A high-stakes clinical narrative where your decisions matter.',
        duration: 'NARRATIVE',
        thumbnailColor: 'bg-gradient-to-tr from-cyan-900 to-purple-900',
        likes: 1240,
        views: 'Story',
        category: 'mastery',
        interactions: [
            {
                id: 'i_branch_1',
                timestamp: 20,
                type: 'branching',
                question: 'The patient reports mild ear discomfort during ascent. What do you do?',
                options: [
                    { label: 'Pause & Equalize', correct: true },
                    { label: 'Advise to swallow only', correct: false },
                    { label: 'Abort Session', correct: false }
                ]
            }
        ]
    }
];

export const MicroLearningFeed: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [showRecommendedPath, setShowRecommendedPath] = useState(false);
    const [resolvedDurations, setResolvedDurations] = useState<Record<string, string>>({});

    const activeVideo = activeVideoIndex === null ? null : MICRO_VIDEOS[activeVideoIndex] ?? null;
    const featuredVideo = MICRO_VIDEOS.find((video) => video.videoSrc || video.videoWebmSrc) ?? null;

    const filteredVideos = activeCategory === 'all'
        ? MICRO_VIDEOS
        : MICRO_VIDEOS.filter(v => v.category === activeCategory);

    const recommendedPath = MICRO_VIDEOS.filter(v => v.step !== undefined).sort((a, b) => (a.step || 0) - (b.step || 0));

    useEffect(() => {
        let isCancelled = false;

        const loadDurations = async () => {
            const realVideos = MICRO_VIDEOS.filter((video) => video.videoSrc || video.videoWebmSrc);
            const entries = await Promise.all(
                realVideos.map(
                    (video) =>
                        new Promise<[string, string]>((resolve) => {
                            const source = video.videoSrc ?? video.videoWebmSrc;

                            if (!source) {
                                resolve([video.id, video.duration]);
                                return;
                            }

                            const media = document.createElement('video');
                            media.preload = 'metadata';

                            const cleanup = () => {
                                media.onloadedmetadata = null;
                                media.onerror = null;
                                media.removeAttribute('src');
                                media.load();
                            };

                            media.onloadedmetadata = () => {
                                const nextDuration = formatDurationFromSeconds(media.duration);
                                cleanup();
                                resolve([video.id, nextDuration]);
                            };

                            media.onerror = () => {
                                cleanup();
                                resolve([video.id, video.duration]);
                            };

                            media.src = source;
                            media.load();
                        }),
                ),
            );

            if (!isCancelled) {
                setResolvedDurations(Object.fromEntries(entries));
            }
        };

        loadDurations();

        return () => {
            isCancelled = true;
        };
    }, []);

    const getDurationLabel = (video: ExtendedMicroVideo): string => resolvedDurations[video.id] ?? video.duration;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleVideoClick = (video: ExtendedMicroVideo) => {
        const globalIndex = MICRO_VIDEOS.findIndex(v => v.id === video.id);
        setActiveVideoIndex(globalIndex >= 0 ? globalIndex : null);
    };

    const handleClose = () => {
        setActiveVideoIndex(null);
    };

    const handleNext = () => {
        if (activeVideoIndex !== null && activeVideoIndex < MICRO_VIDEOS.length - 1) {
            setActiveVideoIndex(activeVideoIndex + 1);
        } else {
            setActiveVideoIndex(null);
        }
    };

    const handlePrev = () => {
        if (activeVideoIndex !== null && activeVideoIndex > 0) {
            setActiveVideoIndex(activeVideoIndex - 1);
        }
    };

    return (
        <div className="relative group">
            {/* Header */}
            <div className="flex justify-between items-end mb-4 px-1">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Micro-Learning
                        <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">
                            <span className="animate-pulse">🔥</span> 3 Day Streak
                        </span>
                    </h2>
                    <p className="text-slate-500 text-sm">Quick tips for busy professionals.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {featuredVideo && (
                <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-center">
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <video
                                className="aspect-[9/16] w-full object-cover"
                                controls
                                playsInline
                                preload="metadata"
                                poster={featuredVideo.posterSrc}
                            >
                                {featuredVideo.videoWebmSrc && (
                                    <source src={featuredVideo.videoWebmSrc} type="video/webm" />
                                )}
                                {featuredVideo.videoSrc && (
                                    <source src={featuredVideo.videoSrc} type="video/mp4" />
                                )}
                            </video>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                                Featured real video
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-white">
                                {featuredVideo.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {featuredVideo.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                <span>{getDurationLabel(featuredVideo)}</span>
                                <span>{featuredVideo.views} views</span>
                                <span>{getExportStatusLabel(featuredVideo)}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Category Tabs + Recommended Path Toggle */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setShowRecommendedPath(false); }}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                            ${activeCategory === cat.id && !showRecommendedPath
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                    onClick={() => setShowRecommendedPath(!showRecommendedPath)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                        ${showRecommendedPath
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                            : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
                        }`}
                >
                    <Rocket className="w-4 h-4" />
                    Start Journey
                </button>
            </div>

            {/* Recommended Path Banner */}
            {showRecommendedPath && (
                <div className="mb-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-200 rounded-xl">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-cyan-500 rounded-lg">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Your Learning Journey</h3>
                            <p className="text-sm text-slate-600">Follow this recommended path to go from beginner to pro operator.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {recommendedPath.map((video, idx) => (
                            <div key={video.id} className="flex items-center shrink-0">
                                <button
                                    onClick={() => handleVideoClick(video)}
                                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all group"
                                >
                                    <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {video.step}
                                    </span>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 whitespace-nowrap">
                                        {video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title}
                                    </span>
                                </button>
                                {idx < recommendedPath.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {filteredVideos.map((video) => {
                    const fallbackHref = video.videoSrc || video.videoWebmSrc;
                    const cardClassName = 'snap-start shrink-0 w-40 h-64 rounded-xl relative overflow-hidden cursor-pointer group/card transition-all hover:scale-[1.02] hover:shadow-lg border-0 bg-transparent p-0 text-left block';

                    if (fallbackHref) {
                        return (
                            <a
                                key={video.id}
                                href={fallbackHref}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleVideoClick(video);
                                }}
                                aria-label={`Open ${video.title}`}
                                className={cardClassName}
                            >
                                {/* Background */}
                                <div className={`absolute inset-0 ${video.posterSrc ? 'bg-slate-950' : video.thumbnailColor}`}>
                                    {video.posterSrc && (
                                        <div
                                            className="h-full w-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${video.posterSrc})` }}
                                        />
                                    )}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

                                {/* Step Badge */}
                                {video.step && (
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                        {video.step}
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                    <div className="text-[10px] bg-black/40 backdrop-blur px-1.5 py-0.5 rounded text-white capitalize">
                                        {CATEGORIES.find(c => c.id === video.category)?.icon} {video.category}
                                    </div>
                                    <div className="rounded-full bg-cyan-400/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                                        Real video
                                    </div>
                                </div>

                                {/* Play Icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-opacity transform group-hover/card:scale-110">
                                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <span className="text-[10px] bg-black/30 backdrop-blur px-1.5 py-0.5 rounded text-white/90 mb-1 inline-block">
                                        {getDurationLabel(video)}
                                    </span>
                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-0.5">{video.title}</h3>
                                    <p className="text-[10px] text-white/70">{video.views} views</p>
                                </div>
                            </a>
                        );
                    }

                    return (
                        <button
                            type="button"
                            key={video.id}
                            onClick={() => handleVideoClick(video)}
                            aria-label={`Open ${video.title}`}
                            className={cardClassName}
                        >
                        {/* Background */}
                        <div className={`absolute inset-0 ${video.posterSrc ? 'bg-slate-950' : video.thumbnailColor}`}>
                            {video.posterSrc && (
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${video.posterSrc})` }}
                                />
                            )}
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

                        {/* Step Badge */}
                        {video.step && (
                            <div className="absolute top-2 left-2 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                {video.step}
                            </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            <div className="text-[10px] bg-black/40 backdrop-blur px-1.5 py-0.5 rounded text-white capitalize">
                                {CATEGORIES.find(c => c.id === video.category)?.icon} {video.category}
                            </div>
                            {(video.videoSrc || video.videoWebmSrc) && (
                                <div className="rounded-full bg-cyan-400/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
                                    Real video
                                </div>
                            )}
                        </div>

                        {/* Play Icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover/card:opacity-100 transition-opacity transform group-hover/card:scale-110">
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <span className="text-[10px] bg-black/30 backdrop-blur px-1.5 py-0.5 rounded text-white/90 mb-1 inline-block">
                                {getDurationLabel(video)}
                            </span>
                            <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-0.5">{video.title}</h3>
                            <p className="text-[10px] text-white/70">{video.views} views</p>
                        </div>
                        </button>
                    );
                })}
            </div>

            {/* Player Overlay */}
            {activeVideo && (
                <div className="relative z-[100]">
                    <MicroLearningPlayer
                        video={activeVideo}
                        onClose={handleClose}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                </div>
            )}
        </div>
    );
};
