import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X, Clock, Calendar, Tag, User, Share2, Bookmark, BookmarkCheck,
    ArrowLeft, ArrowRight, Volume2, VolumeX, ChevronUp,
    MessageCircle, ThumbsUp, Link2, Copy, CheckCircle2, Shield,
    Eye, Sparkles, Microscope, Zap, ExternalLink
} from 'lucide-react';
import { SmartText } from '../SmartText';
import { BlogPost, BLOG_POSTS, RESEARCH_STUDIES } from '../../constants/content';

// === ARTICLE READER TYPES ===
interface ArticleReaderProps {
    post: BlogPost;
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
    canNavigate: { prev: boolean; next: boolean };
}

// === INLINE MENTION CARD ===
interface MentionCardProps {
    type: 'machine' | 'research' | 'knowledge';
    id: string;
    position: { x: number; y: number };
}

const MentionCard: React.FC<MentionCardProps> = ({ type, id, position }) => {
    // Mock data lookup - in production this would query the actual databases
    const cardData = {
        machine: {
            HBOT: { title: 'HBOT Chamber', desc: 'Hyperbaric Oxygen Therapy', color: 'from-cyan-500 to-blue-600', link: '/tech/HBOT' },
            PEMF: { title: 'PEMF Mat', desc: 'Pulsed Electromagnetic Field', color: 'from-purple-500 to-pink-600', link: '/tech/PEMF' },
            RLT: { title: 'Red Light Panel', desc: 'Red Light Therapy', color: 'from-red-500 to-orange-600', link: '/tech/RLT' },
            HYDROGEN: { title: 'Hydrogen Generator', desc: 'Molecular Hydrogen', color: 'from-sky-500 to-teal-600', link: '/tech/HYDROGEN' }
        }
    };

    const source = cardData[type as keyof typeof cardData] as
        | Record<string, { title: string; desc: string; color: string; link: string }>
        | undefined;

    const data = source?.[id] || {
        title: id,
        desc: 'Unknown reference',
        color: 'from-slate-500 to-gray-600',
        link: '#',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{ left: position.x, top: position.y }}
            className="absolute z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        >
            <div className={`h-1.5 bg-gradient-to-r ${data.color}`} />
            <div className="p-4">
                <h4 className="font-bold text-slate-900 mb-1">{data.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{data.desc}</p>
                <a
                    href={data.link}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 transition-colors"
                >
                    Learn More <ExternalLink size={12} />
                </a>
            </div>
        </motion.div>
    );
};

// === ARTICLE READER COMPONENT ===
export const ArticleReader: React.FC<ArticleReaderProps> = ({
    post,
    onClose,
    onNavigate,
    canNavigate
}) => {
    // State
    const [readingProgress, setReadingProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [hoveredMention, setHoveredMention] = useState<{ type: string; id: string; pos: { x: number; y: number } } | null>(null);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10);
    const [hasLiked, setHasLiked] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
                setReadingProgress(Math.min(100, Math.max(0, progress)));
            }
        };

        const container = contentRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    // Text-to-speech
    const toggleReading = () => {
        if (isReading) {
            speechSynthesis.cancel();
            setIsReading(false);
        } else {
            speechRef.current = new SpeechSynthesisUtterance(
                `${post.title}. ${getFullContent(post)}`
            );
            speechRef.current.rate = 0.9;
            speechRef.current.onend = () => setIsReading(false);
            speechSynthesis.speak(speechRef.current);
            setIsReading(true);
        }
    };

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    // Copy link
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.origin + `/blog/${post.id}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // === RENDER ===
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
        >
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back to Hub</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Read Progress */}
                        <span className="text-xs font-mono text-slate-400">
                            {Math.round(readingProgress)}% read
                        </span>

                        {/* Audio Toggle */}
                        <button
                            onClick={toggleReading}
                            className={`p-2 rounded-lg transition-all ${isReading
                                    ? 'bg-cyan-100 text-cyan-700'
                                    : 'hover:bg-slate-100 text-slate-500'
                                }`}
                            title={isReading ? 'Stop reading' : 'Read aloud'}
                        >
                            {isReading ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>

                        {/* Bookmark */}
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-lg transition-all ${isBookmarked
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'hover:bg-slate-100 text-slate-500'
                                }`}
                        >
                            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>

                        {/* Share */}
                        <div className="relative">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all"
                            >
                                <Share2 size={18} />
                            </button>

                            <AnimatePresence>
                                {showShareMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={copyLink}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700 transition-colors"
                                        >
                                            {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                            {copied ? 'Copied!' : 'Copy Link'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div
                ref={contentRef}
                className="flex-1 overflow-y-auto pt-20 pb-24 custom-scrollbar"
            >
                <article className="max-w-3xl mx-auto px-6 py-12">
                    {/* Hero */}
                    <header className="mb-12">
                        {/* Category & Meta */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${post.category === 'HBOT' ? 'bg-cyan-100 text-cyan-700' :
                                    post.category === 'PEMF' ? 'bg-purple-100 text-purple-700' :
                                        post.category === 'RLT' ? 'bg-red-100 text-red-700' :
                                            post.category === 'Hydrogen' ? 'bg-sky-100 text-sky-700' :
                                                'bg-slate-100 text-slate-700'
                                }`}>
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-slate-400">
                                <Clock size={14} /> {post.readTime}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-slate-400">
                                <Calendar size={14} /> {post.date}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-slate-500 leading-relaxed">
                            <SmartText>{post.excerpt}</SmartText>
                        </p>

                        {/* Trace Badge */}
                        {post.trace_id && (
                            <div className="flex items-center gap-3 mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <Shield size={20} className="text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                        Evidence Verified
                                    </span>
                                    <p className="text-sm text-emerald-600 font-mono">
                                        Trace ID: {post.trace_id}
                                    </p>
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Feature Image */}
                    <div className={`h-64 md:h-80 rounded-2xl bg-gradient-to-br ${post.image} mb-12 flex items-center justify-center`}>
                        <Sparkles size={64} className="text-white/50" />
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg prose-slate max-w-none">
                        <SmartText>
                            {getFullContent(post)}
                        </SmartText>
                    </div>

                    {/* Related Research */}
                    {post.trace_id && (
                        <section className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                                <Microscope size={20} className="text-cyan-500" />
                                Related Research
                            </h3>
                            <div className="grid gap-4">
                                {RESEARCH_STUDIES.filter(s =>
                                    s.category === (post.category === 'HBOT' ? 'Recovery' :
                                        post.category === 'PEMF' ? 'Sleep' :
                                            post.category === 'RLT' ? 'Cellular' : 'Cognitive')
                                ).slice(0, 2).map(study => (
                                    <div key={study.id} className="p-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{study.title}</h4>
                                            <p className="text-xs text-slate-500">{study.metric}: {study.value}</p>
                                        </div>
                                        <span className="text-2xl font-black text-cyan-600">{study.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Engagement Bar */}
                    <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setHasLiked(!hasLiked);
                                    setLikeCount(c => hasLiked ? c - 1 : c + 1);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${hasLiked
                                        ? 'bg-cyan-100 text-cyan-700'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <ThumbsUp size={16} fill={hasLiked ? 'currentColor' : 'none'} />
                                <span className="text-sm font-bold">{likeCount}</span>
                            </button>

                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all">
                                <MessageCircle size={16} />
                                <span className="text-sm font-bold">Comments</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Eye size={14} className="text-slate-400" />
                            <span className="text-xs text-slate-400">{Math.floor(Math.random() * 500) + 100} views</span>
                        </div>
                    </div>
                </article>
            </div>

            {/* Navigation Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('prev')}
                        disabled={!canNavigate.prev}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${canNavigate.prev
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'opacity-30 cursor-not-allowed text-slate-400'
                            }`}
                    >
                        <ArrowLeft size={16} />
                        Previous Article
                    </button>

                    {/* Scroll to top */}
                    <button
                        onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-all"
                    >
                        <ChevronUp size={18} />
                    </button>

                    <button
                        onClick={() => onNavigate('next')}
                        disabled={!canNavigate.next}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${canNavigate.next
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'opacity-30 cursor-not-allowed text-slate-400'
                            }`}
                    >
                        Next Article
                        <ArrowRight size={16} />
                    </button>
                </div>
            </footer>
        </motion.div>
    );
};

// === HELPER: Generate full article content ===
function getFullContent(post: BlogPost): string {
    // In a real app, this would come from a CMS or database
    const contentTemplates: Record<string, string> = {
        'HBOT': `
The science of hyperbaric oxygen therapy represents one of the most exciting frontiers in regenerative medicine and bio-optimization.

## How HBOT Works

When you enter a hyperbaric chamber, atmospheric pressure increases to 1.3-2.0 ATA (atmospheres absolute). Under this pressure, your lungs can gather significantly more oxygen than at normal pressure. This oxygen-rich blood travels throughout your body, supporting cellular repair and regeneration processes.

## Key Mechanisms

**Cellular Oxygenation**: Every cell in your body requires oxygen to produce ATP (adenosine triphosphate), the energy currency of life. HBOT floods your tissues with oxygen, supporting optimal cellular function.

**Stem Cell Mobilization**: Research suggests that HBOT may support the body's natural stem cell production, potentially enhancing regenerative capacity.

**Inflammation Modulation**: The increased oxygen availability may help modulate inflammatory responses, supporting the body's natural healing processes.

## Practical Applications

Many wellness-focused individuals incorporate HBOT into their routines for:
- Post-workout recovery optimization
- Cognitive clarity and focus enhancement
- General wellness maintenance
- Travel recovery (jet lag support)

*Note: Hylono technology is designed for wellness and bio-optimization. It is not intended to diagnose, treat, cure, or prevent any disease.*
        `,
        'PEMF': `
Pulsed Electromagnetic Field therapy works by delivering electromagnetic pulses that interact with your body's natural electrical systems.

## The Science of PEMF

Your cells operate like tiny batteries, maintaining an electrical charge across their membranes. This charge is essential for nutrient transport, waste removal, and cellular communication. PEMF devices generate magnetic fields that pulse at specific frequencies, helping to support optimal cellular function.

## Frequency Matters

Different frequencies produce different effects:
- **1-3 Hz**: Associated with deep relaxation and sleep support (delta waves)
- **7.83 Hz**: The Schumann resonance - Earth's natural electromagnetic frequency
- **10-15 Hz**: Associated with calm alertness (alpha waves)

## Integration with Daily Life

PEMF sessions can be seamlessly integrated into your routine:
- Morning sessions may help energize and prepare for the day
- Evening sessions may support relaxation and sleep quality
- Pre/post-workout sessions may enhance recovery

*Note: Hylono technology is designed for wellness and bio-optimization. It is not intended to diagnose, treat, cure, or prevent any disease.*
        `,
        'RLT': `
Red light therapy (photobiomodulation) harnesses specific wavelengths of light to support cellular health at the mitochondrial level.

## The Power of Light

Not all light is created equal. Red (660nm) and near-infrared (850nm) wavelengths have unique properties that allow them to penetrate tissues and interact with cellular components.

## Mitochondrial Magic

At the heart of RLT's mechanism is the mitochondria - your cellular powerhouses. A protein called cytochrome c oxidase absorbs these specific wavelengths, potentially enhancing the electron transport chain and ATP production.

## Wavelength Specifics

**660nm (Red)**: Primarily absorbed by skin cells, supporting:
- Skin health and radiance
- Surface-level tissue support

**850nm (Near-Infrared)**: Penetrates deeper into tissues:
- Supports muscle recovery
- May reach deeper anatomical structures

## Practical Tips

- Consistency matters more than session length
- Morning light exposure may help circadian rhythm
- Post-workout application may support recovery

*Note: Hylono technology is designed for wellness and bio-optimization. It is not intended to diagnose, treat, cure, or prevent any disease.*
        `,
        'Hydrogen': `
Molecular hydrogen (H2) represents a unique approach to antioxidant support, with properties that set it apart from traditional antioxidants.

## The Smallest Molecule

Hydrogen is the smallest molecule in existence, giving it unique advantages:
- Can penetrate virtually any tissue barrier
- May cross the blood-brain barrier
- Reaches the mitochondria directly

## Selective Antioxidant Action

Unlike broad-spectrum antioxidants, molecular hydrogen appears to be selective in its action. Research suggests it may specifically target harmful reactive oxygen species while preserving beneficial signaling molecules.

## Methods of Delivery

Molecular hydrogen can be delivered through:
- **Hydrogen-rich water**: Dissolved H2 in drinking water
- **Inhalation**: Direct breathing of H2-enriched air
- **Bathing**: Transdermal absorption

## Integration Strategies

Many bio-optimizers pair hydrogen with other modalities:
- Before HBOT (for oxidative balance)
- Post-workout (for recovery support)
- During high-stress periods

*Note: Hylono technology is designed for wellness and bio-optimization. It is not intended to diagnose, treat, cure, or prevent any disease.*
        `,
        'Protocols': `
The art of protocol stacking lies in understanding how different modalities can work together synergistically.

## The Superhuman Protocol

Originally popularized by Gary Brecka, this protocol combines three powerful modalities in a specific sequence:

1. **PEMF First**: Prepares cells by optimizing membrane potential
2. **HBOT Second**: Floods optimized cells with oxygen
3. **RLT Third**: Activates photoreceptors in primed mitochondria

## Why Sequence Matters

The order isn't arbitrary - each step prepares your cells for the next:

**PEMF → HBOT**: PEMF may help increase cell membrane permeability, potentially allowing more efficient oxygen uptake during the subsequent HBOT session.

**HBOT → RLT**: With cells now saturated in oxygen, the mitochondrial machinery is primed. RLT activates photoreceptors, potentially maximizing ATP production.

## Customizing Your Stack

Not everyone needs the full protocol every day. Consider:
- **Recovery focus**: PEMF + RLT
- **Cognitive focus**: HBOT + Hydrogen
- **Deep regeneration**: Full stack

*Note: Hylono technology is designed for wellness and bio-optimization. It is not intended to diagnose, treat, cure, or prevent any disease.*
        `
    };

    return contentTemplates[post.category] || post.excerpt;
}

export default ArticleReader;

