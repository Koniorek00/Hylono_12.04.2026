import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, Share2, Play, Pause, ChevronDown, CheckCircle, Zap, Headphones } from 'lucide-react';
import { BookmarkNotes } from './BookmarkNotes';

import { ControlPanelSimulator } from './ControlPanelSimulator';
import { EmergencyDrill } from './EmergencyDrill';

export interface InteractionOption {
    label: string;
    correct: boolean;
}

export interface Interaction {
    id: string;
    timestamp: number; // Percentage 0-100
    type: 'quiz' | 'tip' | 'simulation' | 'emergency_drill' | 'branching';
    question?: string;
    options?: InteractionOption[];
    correctIndex?: number;
    tipContent?: string;
    scenario?: string; // For drill
}

export interface MicroVideo {
    id: string;
    title: string;
    description: string;
    duration: string;
    thumbnailColor: string;
    likes: number;
    views: string;
    videoSrc?: string;
    videoWebmSrc?: string;
    posterSrc?: string;
    hasAudio?: boolean;
    interactions?: Interaction[];
}

interface MicroLearningPlayerProps {
    video: MicroVideo;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

const Confetti: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-3 h-3 rounded-full ${['bg-cyan-400', 'bg-purple-500', 'bg-amber-400'][i % 3]}`}
                    initial={{
                        x: '50%',
                        y: '50%',
                        opacity: 1,
                        scale: 0
                    }}
                    animate={{
                        x: `${50 + (Math.random() - 0.5) * 100}%`,
                        y: `${50 + (Math.random() - 0.5) * 100}%`,
                        opacity: 0,
                        scale: 1
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
};

export const MicroLearningPlayer: React.FC<MicroLearningPlayerProps> = ({ video, onClose, onNext, onPrev }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [activeInteraction, setActiveInteraction] = useState<Interaction | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [showXPToast, setShowXPToast] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const interactionIdsRef = useRef<Set<string>>(new Set());
    const hasRealVideo = Boolean(video.videoSrc || video.videoWebmSrc);
    const isSilentVideo = hasRealVideo && video.hasAudio === false;

    const maybeTriggerInteraction = (nextProgress: number): boolean => {
        if (!video.interactions || activeInteraction) {
            return false;
        }

        const hit = video.interactions.find((interaction) =>
            nextProgress >= interaction.timestamp
            && !interactionIdsRef.current.has(interaction.id)
        );

        if (!hit) {
            return false;
        }

        interactionIdsRef.current.add(hit.id);
        setActiveInteraction(hit);
        setIsPlaying(false);
        videoRef.current?.pause();
        return true;
    };

    // Simulate video progress and check for interactions
    useEffect(() => {
        if (hasRealVideo) {
            return;
        }

        let interval: NodeJS.Timeout;
        if (isPlaying && !activeInteraction) {
            interval = setInterval(() => {
                setProgress(prev => {
                    const nextProgress = prev + 0.5;

                    if (maybeTriggerInteraction(nextProgress)) {
                        return nextProgress;
                    }

                    if (nextProgress >= 100) {
                        setIsPlaying(false);
                        triggerVictory();
                        return 100;
                    }
                    return nextProgress;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, activeInteraction, video, hasRealVideo]);

    const triggerVictory = () => {
        setShowConfetti(true);
        setXpEarned(50);
        setShowXPToast(true);
        setTimeout(() => setShowXPToast(false), 3000);
        setTimeout(() => setShowConfetti(false), 4000);
    };

    const handleInteractionComplete = (success: boolean, path?: number) => {
        if (success) {
            setActiveInteraction(null);
            setIsPlaying(true);

            // For branching, we could adjust XP based on "Clinical Wisdom"
            const xp = path !== undefined ? 25 : 10;
            setXpEarned(xp);
            setShowXPToast(true);
            setTimeout(() => setShowXPToast(false), 2000);
        } else {
            // Handle failure for drills (which already have their own retry logic, 
            // but this keeps the state consistent)
            setIsPlaying(false);
        }
    };

    // Reset on video change
    useEffect(() => {
        setProgress(0);
        setIsPlaying(true);
        setActiveInteraction(null);
        setShowConfetti(false);
        interactionIdsRef.current = new Set();
    }, [video]);

    useEffect(() => {
        if (!hasRealVideo) {
            return;
        }

        const currentVideo = videoRef.current;
        if (!currentVideo) {
            return;
        }

        if (activeInteraction) {
            currentVideo.pause();
            return;
        }

        if (isPlaying) {
            const playAttempt = currentVideo.play();
            if (playAttempt && typeof playAttempt.catch === 'function') {
                playAttempt.catch(() => {
                    setIsPlaying(false);
                });
            }
            return;
        }

        currentVideo.pause();
    }, [activeInteraction, hasRealVideo, isPlaying, video]);

    const togglePlay = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!activeInteraction) {
            if (hasRealVideo) {
                const currentVideo = videoRef.current;
                if (!currentVideo) {
                    setIsPlaying((prev) => !prev);
                    return;
                }

                if (currentVideo.paused) {
                    const playAttempt = currentVideo.play();
                    if (playAttempt && typeof playAttempt.catch === 'function') {
                        playAttempt.catch(() => {
                            setIsPlaying(false);
                        });
                    }
                    setIsPlaying(true);
                    return;
                }

                currentVideo.pause();
                setIsPlaying(false);
                return;
            }

            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={video.title}
                initial={{ y: 100, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 100, scale: 0.9 }}
                className="relative w-full max-w-md h-[85vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {showConfetti && <Confetti />}

                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                    {/* Left: Source metadata + bookmarks */}
                    <div className="flex items-center gap-2">
                        {isSilentVideo && (
                            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white">
                                <Headphones className="w-4 h-4" />
                                Silent demo
                            </div>
                        )}
                        <BookmarkNotes videoId={video.id} currentProgress={progress} />
                    </div>

                    {/* Right: Close */}
                    <button
                        onClick={onClose}
                        aria-label="Close video player"
                        className="w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Main Video Area (Visual Placeholder) */}
                <div
                    className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-500 ${activeInteraction ? 'blur-md scale-105 brightness-50' : ''}`}
                    onClick={togglePlay}
                >
                    {hasRealVideo ? (
                        <>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 h-full w-full object-cover"
                                playsInline
                                preload="auto"
                                poster={video.posterSrc}
                                onLoadedMetadata={() => {
                                    setProgress(0);
                                }}
                                onTimeUpdate={(event) => {
                                    const duration = event.currentTarget.duration;
                                    if (!Number.isFinite(duration) || duration <= 0) {
                                        return;
                                    }

                                    const nextProgress = (event.currentTarget.currentTime / duration) * 100;
                                    setProgress(nextProgress);
                                    maybeTriggerInteraction(nextProgress);
                                }}
                                onEnded={() => {
                                    setIsPlaying(false);
                                    setProgress(100);
                                    triggerVictory();
                                }}
                            >
                                {video.videoWebmSrc && <source src={video.videoWebmSrc} type="video/webm" />}
                                {video.videoSrc && <source src={video.videoSrc} type="video/mp4" />}
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30" />
                        </>
                    ) : (
                        <div
                            className={`absolute inset-0 ${video.thumbnailColor} flex items-center justify-center`}
                        >
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-white/5 select-none animate-pulse">
                                {Math.floor(progress)}%
                            </span>
                        </div>
                    )}

                    {!isPlaying && !activeInteraction && (
                        <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white animate-pulse">
                            <Play className="w-8 h-8 ml-1" fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Interactive Overlay */}
                <AnimatePresence>
                    {activeInteraction && activeInteraction.type === 'simulation' && (
                        <ControlPanelSimulator onComplete={() => handleInteractionComplete(true)} />
                    )}
                    {activeInteraction && activeInteraction.type === 'emergency_drill' && (
                        <EmergencyDrill
                            scenario={activeInteraction.scenario || "Critical Failure"}
                            options={activeInteraction.options || []}
                            onComplete={(success) => handleInteractionComplete(success)}
                        />
                    )}
                    {activeInteraction && activeInteraction.type === 'branching' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                        >
                            <div className="w-full max-w-sm text-center">
                                <motion.div
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="text-cyan-400 font-mono text-xs mb-2 tracking-widest uppercase"
                                >
                                    Decision Point
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-8">
                                    {activeInteraction.question}
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {activeInteraction.options?.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleInteractionComplete(true, idx)}
                                            className="group relative p-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            <span className="relative z-10 text-white font-bold text-lg">
                                                {typeof option === 'string' ? option : option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-8 text-slate-500 text-xs italic">
                                    "Your choice will determine the patient's outcome..."
                                </p>
                            </div>
                        </motion.div>
                    )}
                    {activeInteraction && activeInteraction.type === 'quiz' && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 bg-gradient-to-t from-black/90 to-transparent"
                        >
                            <div className="w-full max-w-sm">
                                <span className="inline-block bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                    Quick Check
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                                    {activeInteraction.question}
                                </h3>
                                <div className="space-y-3">
                                    {activeInteraction.options?.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleInteractionComplete(idx === activeInteraction.correctIndex)}
                                            className={`w-full p-4 rounded-xl text-left font-medium transition-all transform active:scale-95 flex justify-between items-center group
                                                ${idx === activeInteraction.correctIndex
                                                    ? 'bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 border border-white/20 text-white'
                                                    : 'bg-white/5 hover:bg-white/10 border border-transparent text-slate-300'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* XP Toast */}
                <AnimatePresence>
                    {showXPToast && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center gap-2"
                        >
                            <Zap className="w-5 h-5 fill-current" />
                            <span>+{xpEarned} XP</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-10">
                    <div
                        className="h-full bg-cyan-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                    {/* Interaction Markers */}
                    {video.interactions?.map(i => (
                        <div
                            key={i.id}
                            className="absolute top-0 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_5px_#f59e0b]"
                            style={{ left: `${i.timestamp}%` }}
                        />
                    ))}
                </div>

                {/* Video Info Overlay */}
                {!activeInteraction && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent pt-32 transition-opacity duration-300">
                        <div className="flex items-end justify-between">
                            <div className="flex-1 mr-4">
                                <h2 className="text-white text-xl font-bold leading-tight mb-2">{video.title}</h2>
                                <p className="text-slate-300 text-sm line-clamp-2">{video.description}</p>
                            </div>

                            {/* Actions Sidebar */}
                            <div className="flex flex-col gap-4 items-center">
                                <ActionButton icon={Heart} label={video.likes.toString()} />
                                <ActionButton icon={MessageCircle} label="Comments" />
                                <ActionButton icon={Share2} label="Share" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Touch Zones (Invisible) */}
                {!activeInteraction && (
                    <div className="absolute inset-0 z-0 flex">
                        <div className="w-1/3 h-full" onClick={onPrev} />
                        <div className="w-1/3 h-full" onClick={togglePlay} />
                        <div className="w-1/3 h-full" onClick={onNext} />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const ActionButton: React.FC<{ icon: React.FC<{ className?: string }>; label: string }> = ({ icon: Icon, label }) => (
    <button className="flex flex-col items-center gap-1 group">
        <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-all group-hover:scale-110 active:scale-95 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium text-white/80">{label}</span>
    </button>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
)

