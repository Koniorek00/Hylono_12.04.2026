'use client';

import React, { useMemo, useRef, useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronRight, ChevronLeft, Upload, Download, Palette,
    AlertTriangle, CheckCircle, Share2, Megaphone, GraduationCap, Calendar,
    Smartphone, FileText, Image as ImageIcon, Wand2, Activity, Zap, Droplets,
    Sun, Sparkles, Box, LayoutTemplate, Copy, Share, Brain
} from 'lucide-react';
import { usePartnerStore, COPY_LIBRARY } from '../../hooks/usePartnerStore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { A4PosterTemplate, SocialSquareTemplate, SocialStoryTemplate } from './PDFTemplates';
import { validateCompliance } from '../../utils/compliance';
import { disclaimers } from '../../content/disclaimers';
import { PartnerLayout } from './PartnerLayout';

// --- Static Data (moved outside components to prevent recreation) ---

const OUTPUT_FORMATS: { id: 'social-square' | 'social-story' | 'print-poster'; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'social-square', label: 'Feed Post', icon: ImageIcon },
    { id: 'social-story', label: 'Story', icon: Smartphone },
    { id: 'print-poster', label: 'Poster', icon: FileText },
];

const VISUAL_THEMES: { id: 'modern' | 'luxury' | 'bold'; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'modern', label: 'Modern', icon: LayoutTemplate },
    { id: 'luxury', label: 'Luxury', icon: Sparkles },
    { id: 'bold', label: 'Bold', icon: Box },
];

const LAYOUT_ICONS = [
    { id: 0, label: 'Overlay', desc: 'Text over image' },
    { id: 1, label: 'Split', desc: 'Image + Text' },
    { id: 2, label: 'Frame', desc: 'Bordered image' },
] as const;

const STOCK_IMAGES = [
    { id: 'hbot-1', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400', label: 'HBOT Chamber', modality: 'HBOT' },
    { id: 'hbot-2', url: 'https://images.unsplash.com/photo-1531956656798-29a8a7065969?auto=format&fit=crop&q=80&w=400', label: 'Relaxing HBOT', modality: 'HBOT' },
    { id: 'pemf-1', url: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400', label: 'PEMF Mat', modality: 'PEMF' },
    { id: 'pemf-2', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400', label: 'Tech PEMF', modality: 'PEMF' },
    { id: 'rlt-1', url: 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?auto=format&fit=crop&q=80&w=400', label: 'Red Light', modality: 'RLT' },
    { id: 'rlt-2', url: 'https://images.unsplash.com/photo-1516205651411-a886c021505b?auto=format&fit=crop&q=80&w=400', label: 'Skin Health', modality: 'RLT' },
    { id: 'hydro-1', url: 'https://images.unsplash.com/photo-1564415051543-cb73a746b292?auto=format&fit=crop&q=80&w=400', label: 'Hydrogen Water', modality: 'Hydrogen' },
    { id: 'clinic-1', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400', label: 'Wellness Space', modality: 'ALL' },
];

const FALLBACK_COPY = {
    title: 'Your Wellness Journey',
    body: 'Explore technology-supported wellness routines built for consistency, comfort, and measurable progress. Book a consultation to find the right setup.',
    caption: 'Ready to optimize your routine? Explore evidence-informed wellness technology designed to support recovery, focus, and daily performance.\n\nBook a consultation today.',
    hashtags: '#Wellness #HealthOptimization #Biohacking #SelfCare'
};

// --- Components ---

const LivePreviewHTML: React.FC<{ scale?: number }> = memo(({ scale = 1 }) => {
    const { profile, customTitle, customBody, format, backgroundImage, showQrCode, showLogo, theme, showHeatmap, showVerifiedBadge, modality, layoutVariation } = usePartnerStore();

    // Determine dimensions based on format
    const isStory = format === 'social-story';
    const isSquare = format === 'social-square';

    let width = '210mm';
    let height = '297mm';

    if (isSquare) {
        width = '200mm';
        height = '200mm';
    } else if (isStory) {
        width = '160mm';
        height = '284mm';
    }

    // Theme Styles
    const getThemeFont = () => {
        if (theme === 'luxury') return 'font-serif';
        if (theme === 'bold') return 'font-sans tracking-tight';
        return 'font-sans';
    };
    const themeFontClass = getThemeFont();

    // Dynamic Badge Glow Color based on Modality
    const getBadgeGlow = () => {
        if (modality === 'HBOT') return 'shadow-cyan-500/50 border-cyan-400';
        if (modality === 'PEMF') return 'shadow-amber-500/50 border-amber-400';
        if (modality === 'RLT') return 'shadow-red-500/50 border-red-400';
        if (modality === 'Hydrogen') return 'shadow-blue-500/50 border-blue-400';
        return 'shadow-cyan-500/50 border-cyan-400';
    };

    const getDisclaimer = () => {
        if (modality === 'HBOT') return 'Disclaimer: HBOT sessions are designed to support guided wellness routines and recovery-focused programs. Individual response varies; consult your licensed clinician before use.';
        if (modality === 'PEMF') return 'Disclaimer: PEMF sessions are used within structured wellness programs and do not replace licensed clinical guidance. Consult your clinician before use.';
        if (modality === 'RLT') return 'Disclaimer: Red light sessions are designed to support everyday wellbeing routines. Individual response varies; review suitability with a licensed clinician.';
        if (modality === 'Hydrogen') return 'Disclaimer: Hydrogen routines are complementary wellness strategies intended to support daily wellbeing. Consult your licensed clinician before starting a new protocol.';
        return `Disclaimer: ${disclaimers.short}`;
    };

    // Layout Logic
    const isOverlay = layoutVariation === 0;
    const isSplit = layoutVariation === 1;
    const isFrame = layoutVariation === 2;

    return (
        <div
            className={`bg-white shadow-2xl mx-auto overflow-hidden relative flex flex-col ${themeFontClass}`}
            style={{
                width,
                height,
                transform: `scale(${scale})`,
                transformOrigin: 'top center'
            }}
        >
            {/* 1. LAYER: Background (For Overlay and Frame) */}
            {(isOverlay || isFrame) && backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover"
                    />
                    <div className={`absolute inset-0 ${isOverlay ? (isStory ? 'bg-gradient-to-b from-black/60 via-transparent to-black/80' : 'bg-white/80') : 'blur-sm bg-black/20'}`} />
                </div>
            )}

            {/* Neural Attention Heatmap Overlay */}
            {showHeatmap && (
                <div className="absolute inset-0 z-50 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
                    <div
                        className="absolute w-[300px] h-[150px] rounded-full bg-gradient-radial from-red-500/60 via-orange-400/30 to-transparent blur-3xl"
                        style={{ top: '35%', left: '50%', transform: 'translateX(-50%)' }}
                    />
                    <div
                        className="absolute w-[120px] h-[120px] rounded-full bg-gradient-radial from-yellow-400/50 via-orange-300/20 to-transparent blur-2xl"
                        style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)' }}
                    />
                </div>
            )}

            {/* Layout Wrappers */}
            <div className={`relative z-10 flex-1 flex flex-col ${isFrame ? 'p-8' : ''}`}>
                <div className={`flex flex-col flex-1 ${isFrame ? 'bg-white/95 shadow-2xl rounded-lg border border-white' : ''} ${isSplit ? 'bg-white' : ''}`}>

                    {/* Header */}
                    <div className={`flex items-center justify-between p-6 ${isOverlay && (isSquare || isStory) ? 'absolute top-0 left-0 w-full z-20' : 'relative'}`}>
                        {showVerifiedBadge ? (
                            <div className={`flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-full shadow-lg ${getBadgeGlow()} border animate-pulse`}>
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Hylono Verified</span>
                            </div>
                        ) : (
                            <span className={`text-[10px] tracking-[0.3em] uppercase font-bold ${isOverlay && (isSquare || isStory) ? 'text-white/80' : 'text-cyan-400'}`}>Verified Technology</span>
                        )}
                        {!isSquare && !isStory && <span className="text-sm font-bold tracking-widest text-slate-800">HYLONO</span>}
                    </div>

                    {/* Split Layout Image Portion */}
                    {isSplit && backgroundImage && (
                        <div className="h-1/2 overflow-hidden relative">
                            <Image
                                src={backgroundImage}
                                alt="Hero"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-cover"
                            />
                        </div>
                    )}

                    {/* Content Section */}
                    <div className={`flex-1 flex flex-col justify-center p-12 ${isOverlay && isStory ? 'text-white items-center text-center mt-20' : 'text-slate-900'} ${isSplit ? 'items-center text-center' : ''}`}>
                        {showLogo && profile.logoUrl && (
                            <Image
                                src={profile.logoUrl}
                                alt="Clinic Logo"
                                width={192}
                                height={64}
                                sizes="192px"
                                className={`h-16 w-auto object-contain mb-6 ${isOverlay && isStory ? 'mx-auto brightness-0 invert' : ''} ${theme === 'luxury' && !isStory ? 'brightness-0' : ''}`}
                            />
                        )}

                        {!showLogo && (
                            <p
                                className={`text-sm font-bold mb-4 uppercase tracking-wide ${isOverlay && isStory ? 'text-cyan-300' : ''} ${theme === 'luxury' ? 'text-slate-700 font-serif' : ''}`}
                                style={{ color: !(isOverlay && isStory) ? profile.brandColor : undefined }}
                            >
                                {profile.clinicName || 'YOUR CLINIC NAME'}
                            </p>
                        )}

                        <h1 className={`${theme === 'bold' ? 'uppercase tracking-tighter' : ''} font-bold leading-tight mb-6 ${isOverlay && isStory ? 'text-4xl' : 'text-5xl text-slate-900'} ${theme === 'luxury' ? 'text-slate-800 font-serif italic' : ''}`}>
                            {customTitle || 'Your Headline Here'}
                        </h1>
                        <p className={`text-lg leading-relaxed whitespace-pre-wrap ${isOverlay && isStory ? 'text-slate-200 text-sm' : 'text-slate-600'} ${theme === 'luxury' ? 'text-slate-600 font-light' : ''}`}>
                            {customBody || 'Describe your offer or educational content here...'}
                        </p>
                    </div>

                    {/* Footer / QR */}
                    <div className={`shrink-0 flex items-center p-10 ${isOverlay && (isSquare || isStory) ? 'absolute bottom-8 left-0 w-full justify-center flex-col gap-4 bg-transparent' : 'bg-slate-50 justify-between'} ${theme === 'luxury' ? 'bg-slate-50/50' : ''} ${isFrame ? 'rounded-b-lg' : ''}`}>
                        {showQrCode && profile.bookingUrl && (
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profile.bookingUrl)}`}
                                    alt="QR Code"
                                    width={80}
                                    height={80}
                                    sizes="80px"
                                    className="w-20 h-20"
                                />
                            </div>
                        )}

                        <p className={`text-[9px] leading-relaxed max-w-xs ${isOverlay && (isSquare || isStory) ? 'text-white/60 text-center px-8' : 'text-slate-400'} ${theme === 'luxury' ? 'text-slate-500 italic' : ''}`}>
                            *{getDisclaimer()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

// --- Step 1: Campaign Intent (Simplified) ---
const StepIntent: React.FC = memo(() => {
    const { profile, setProfile, campaignGoal, setCampaignGoal, modality, setModality } = usePartnerStore();
    const [showBrandEdit, setShowBrandEdit] = useState(false);

    // Static data moved to component level
    const goals = useMemo(() => [
        { id: 'promotion' as const, label: 'Promotion', icon: Megaphone, desc: 'Special offers & limited time deals' },
        { id: 'education' as const, label: 'Education', icon: GraduationCap, desc: 'Explain benefits & science' },
        { id: 'launch' as const, label: 'New Device', icon: Share2, desc: 'Announce new equipment arrival' },
        { id: 'event' as const, label: 'Event', icon: Calendar, desc: 'Open house or workshop invites' },
    ], []);

    const modalities = useMemo(() => [
        { id: 'HBOT' as const, label: 'Hyperbaric (HBOT)', icon: Activity },
        { id: 'PEMF' as const, label: 'PEMF Therapy', icon: Zap },
        { id: 'RLT' as const, label: 'Red Light (RLT)', icon: Sun },
        { id: 'Hydrogen' as const, label: 'Hydrogen', icon: Droplets },
    ], []);

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setProfile({ logoUrl: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setProfile]);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Compact Brand Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                        {/* Mini Logo */}
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden relative group shrink-0">
                            {profile.logoUrl ? (
                                <Image
                                    src={profile.logoUrl}
                                    alt="Logo"
                                    fill
                                    sizes="(max-width: 768px) 40px, 48px"
                                    className="object-contain p-1"
                                />
                            ) : (
                                <Upload className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                            )}
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload logo" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <input
                                type="text"
                                value={profile.clinicName}
                                onChange={(e) => setProfile({ clinicName: e.target.value })}
                                placeholder="Your Clinic Name"
                                className="text-base md:text-lg font-bold text-slate-900 bg-transparent border-none outline-none p-0 placeholder:text-slate-300 w-full"
                            />
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: profile.brandColor }} />
                                <input
                                    type="text"
                                    value={profile.bookingUrl}
                                    onChange={(e) => setProfile({ bookingUrl: e.target.value })}
                                    placeholder="Booking URL for QR Code"
                                    className="text-xs text-slate-400 bg-transparent border-none outline-none p-0 placeholder:text-slate-300 w-48"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowBrandEdit(!showBrandEdit)}
                        className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {showBrandEdit ? 'Close' : 'Edit Brand'}
                    </button>
                </div>

                {/* Expandable Brand Editor */}
                <AnimatePresence>
                    {showBrandEdit && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">Brand Color</label>
                                    <div className="flex gap-2">
                                        <input type="color" value={profile.brandColor} onChange={(e) => setProfile({ brandColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                                        <input type="text" value={profile.brandColor} onChange={(e) => setProfile({ brandColor: e.target.value })} className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 font-mono uppercase" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 block">Instagram</label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">@</span>
                                        <input type="text" value={profile.socialInstagram} onChange={(e) => setProfile({ socialInstagram: e.target.value })} className="w-full text-sm bg-white border border-slate-200 rounded p-2 pl-6" placeholder="handle" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Campaign Goal */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-light text-slate-800 mb-1">What's the Goal?</h3>
                    <p className="text-sm text-slate-500">Select the primary objective for this campaign.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {goals.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setCampaignGoal(g.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${campaignGoal === g.id
                                ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/20'
                                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <g.icon className={`w-6 h-6 mb-2 ${campaignGoal === g.id ? 'text-cyan-600' : 'text-slate-400'}`} />
                            <span className={`font-bold text-sm block ${campaignGoal === g.id ? 'text-slate-900' : 'text-slate-700'}`}>{g.label}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{g.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Technology Focus */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-light text-slate-800 mb-1">Which Technology?</h3>
                    <p className="text-sm text-slate-500">This will tailor images, copy, and disclaimers.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {modalities.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setModality(m.id)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${modality === m.id
                                ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/20'
                                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            <m.icon className={`w-6 h-6 md:w-8 md:h-8 ${modality === m.id ? 'text-cyan-600' : 'text-slate-400'}`} />
                            <span className={`font-bold text-xs ${modality === m.id ? 'text-slate-900' : 'text-slate-700'}`}>{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

// --- Step 2: Design Editor ---
const StepEditor: React.FC = memo(() => {
    const { customTitle, setCustomTitle, customBody, setCustomBody, backgroundImage, setBackgroundImage, showQrCode, setShowQrCode, showLogo, setShowLogo, modality, campaignGoal, layoutVariation, setLayoutVariation, showHeatmap, setShowHeatmap, showVerifiedBadge, setShowVerifiedBadge, format, setFormat, theme, setTheme } = usePartnerStore();
    const compliance = useMemo(() => validateCompliance(customTitle + ' ' + customBody), [customTitle, customBody]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setBackgroundImage(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setBackgroundImage]);

    const applyMagicCopy = useCallback(() => {
        const key = `${campaignGoal}-${modality}`;
        const copy = COPY_LIBRARY[key] ?? COPY_LIBRARY.default ?? FALLBACK_COPY;
        setCustomTitle(copy.title);
        setCustomBody(copy.body);
    }, [campaignGoal, modality, setCustomTitle, setCustomBody]);

    const filteredImages = useMemo(() =>
        STOCK_IMAGES.filter(img => img.modality === modality || img.modality === 'ALL'),
        [modality]
    );

    return (
        <div className="flex xl:flex-row flex-col h-[800px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Editor Sidebar */}
            <div className="xl:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2">
                {/* FORMAT & THEME PICKER (Combined Row) */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex gap-4">
                        {/* Format Picker */}
                        <div className="flex-1">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Output</label>
                            <div className="flex gap-2">
                                {OUTPUT_FORMATS.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFormat(f.id)}
                                        className={`flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${format === f.id ? 'border-cyan-500 bg-white shadow-sm' : 'border-transparent hover:bg-slate-100'}`}
                                    >
                                        <f.icon className={`w-4 h-4 ${format === f.id ? 'text-cyan-600' : 'text-slate-400'}`} />
                                        <span className={`text-[10px] font-bold ${format === f.id ? 'text-slate-900' : 'text-slate-500'}`}>{f.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Theme Picker */}
                        <div className="flex-1">
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Theme</label>
                            <div className="flex gap-2">
                                {VISUAL_THEMES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={`flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${theme === t.id ? 'border-purple-500 bg-white shadow-sm' : 'border-transparent hover:bg-slate-100'}`}
                                    >
                                        <t.icon className={`w-4 h-4 ${theme === t.id ? 'text-purple-600' : 'text-slate-400'}`} />
                                        <span className={`text-[10px] font-bold ${theme === t.id ? 'text-slate-900' : 'text-slate-500'}`}>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* LAYOUT PICKER (Visual Icons) */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Layout Style</label>
                    <div className="flex gap-2">
                        {LAYOUT_ICONS.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLayoutVariation(l.id as 0 | 1 | 2)}
                                className={`flex-1 p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${layoutVariation === l.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <span className={`text-xs font-bold ${layoutVariation === l.id ? 'text-slate-900' : 'text-slate-500'}`}>{l.label}</span>
                                <span className="text-[9px] text-slate-400">{l.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* IMAGE PICKER */}
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Hero Image ({modality})</label>
                    <div className="grid grid-cols-5 gap-2">
                        {filteredImages.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setBackgroundImage(img.url)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${backgroundImage === img.url ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-transparent hover:border-slate-300'}`}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.label}
                                    fill
                                    sizes="(max-width: 768px) 18vw, 80px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                        <label className={`relative aspect-square rounded-lg overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${!filteredImages.some(i => i.url === backgroundImage) && backgroundImage ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                            <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase">Upload</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* SMART TOGGLES (QR, Logo, Badge) */}
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">Elements</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowQrCode(!showQrCode)}
                            className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${showQrCode ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${showQrCode ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300'}`}>
                                {showQrCode && <CheckCircle className="w-2 h-2 text-white" />}
                            </div>
                            <span className="text-xs font-bold">QR</span>
                        </button>
                        <button
                            onClick={() => setShowLogo(!showLogo)}
                            className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${showLogo ? 'bg-cyan-50 border-cyan-200 text-cyan-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${showLogo ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300'}`}>
                                {showLogo && <CheckCircle className="w-2 h-2 text-white" />}
                            </div>
                            <span className="text-xs font-bold">Logo</span>
                        </button>
                        <button
                            onClick={() => setShowVerifiedBadge(!showVerifiedBadge)}
                            className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${showVerifiedBadge ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                            <div className={`w-3 h-3 rounded border flex items-center justify-center ${showVerifiedBadge ? 'bg-purple-500 border-purple-500' : 'border-slate-300'}`}>
                                {showVerifiedBadge && <CheckCircle className="w-2 h-2 text-white" />}
                            </div>
                            <span className="text-xs font-bold">Badge</span>
                        </button>
                    </div>
                </div>

                {/* 3. Text Content */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs uppercase tracking-widest text-slate-400 font-bold">3. Copywriting</label>
                        <button
                            onClick={applyMagicCopy}
                            className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold flex items-center gap-1.5 hover:bg-purple-200 transition-colors"
                        >
                            <Wand2 className="w-3 h-3" />
                            Magic Copy
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 font-bold text-lg focus:outline-none focus:border-cyan-500 transition-shadow shadow-sm pr-10"
                                placeholder={`Headline for ${modality}...`}
                            />
                        </div>
                        <textarea
                            value={customBody}
                            onChange={(e) => setCustomBody(e.target.value)}
                            className="w-full h-24 bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 resize-none focus:outline-none focus:border-cyan-500 transition-shadow shadow-sm text-sm leading-relaxed"
                            placeholder="Body text..."
                        />
                    </div>
                </div>

                {/* Social Caption Preview (Social Brain) */}
                <div className="p-4 bg-slate-900 rounded-xl text-white shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Social Brain Preview</span>
                        </div>
                        <span className="text-[10px] text-slate-400 italic">Auto-generated</span>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            {COPY_LIBRARY[`${campaignGoal}-${modality}`]?.caption || "Select a goal to generate a caption..."}
                        </p>
                    </div>
                </div>

                {/* Campaign Strength (ROI Predictor) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Campaign ROI Score</label>
                        <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-black text-slate-900">
                                {Math.min(100, (showQrCode ? 30 : 0) + (showVerifiedBadge ? 20 : 0) + (customTitle ? 20 : 0) + (customBody ? 30 : 0))}%
                            </span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (showQrCode ? 30 : 0) + (showVerifiedBadge ? 20 : 0) + (customTitle ? 20 : 0) + (customBody ? 30 : 0))}%` }}
                            className="h-full bg-gradient-to-r from-amber-400 to-emerald-500"
                        />
                    </div>
                    <p className="text-[9px] text-slate-500 mt-2">
                        Conversion: {showQrCode ? "QR code detected." : "Add a QR code for a stronger booking handoff."} {showVerifiedBadge ? "Trust badge active." : "Add the trust badge for a stronger credibility signal."}
                    </p>
                </div>

                {/* Compliance Check (Compact) */}
                <div className={`p-3 rounded-lg border text-xs transition-colors ${compliance.isValid ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                    <div className="flex gap-2 items-center font-bold">
                        {compliance.isValid ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{compliance.isValid ? 'Compliance Verified' : 'Compliance Warning'}</span>
                    </div>
                </div>
            </div>

            {/* Live Preview Pane */}
            <div className="xl:w-1/2 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200 shadow-inner">
                {/* Preview Label */}
                <div className="absolute top-4 left-4 z-10 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg backdrop-blur-sm">
                    Live Preview
                </div>
                {/* Heatmap Toggle (Eye Icon) */}
                <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${showHeatmap ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-500 hover:bg-white'}`}
                    title={showHeatmap ? 'Hide Attention Map' : 'Show Attention Map'}
                >
                    <Activity className="w-4 h-4" />
                </button>
                <div className="transform scale-[0.45] origin-center">
                    <LivePreviewHTML />
                </div>
            </div>
        </div>
    );
});

// --- Step 3: Download ---
const StepDownload: React.FC = memo(() => {
    const { profile, customTitle, customBody, format, setFormat, backgroundImage, showQrCode, showLogo, modality, theme, campaignGoal } = usePartnerStore();
    const captionRef = useRef<HTMLTextAreaElement>(null);

    // Get social content
    const socialContent = useMemo(() => {
        const key = `${campaignGoal}-${modality}`;
        return COPY_LIBRARY[key] ?? COPY_LIBRARY.default ?? FALLBACK_COPY;
    }, [campaignGoal, modality]);

    const handleCopyCaption = useCallback(() => {
        if (captionRef.current) {
            captionRef.current.select();
            document.execCommand('copy');
            // Toast or feedback could go here
        }
    }, []);

    // Select Template Renderer
    const TemplateRenderer = useCallback(() => {
        const qrUrl = showQrCode && profile.bookingUrl
            ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profile.bookingUrl)}`
            : undefined;

        const props = {
            clinicName: profile.clinicName || 'Your Clinic',
            brandColor: profile.brandColor,
            title: customTitle || 'Headline',
            body: customBody,
            modality: modality,
            logoUrl: showLogo ? profile.logoUrl : undefined,
            backgroundImage: backgroundImage,
            qrCodeUrl: qrUrl,
            theme: theme
        };

        if (format === 'social-square') return <SocialSquareTemplate {...props} />;
        if (format === 'social-story') return <SocialStoryTemplate {...props} />;
        return <A4PosterTemplate {...props} />;
    }, [showQrCode, profile.bookingUrl, profile.clinicName, profile.brandColor, profile.logoUrl, customTitle, customBody, modality, showLogo, backgroundImage, theme, format]);

    return (
        <div className="flex xl:flex-row flex-col h-auto min-h-[600px] xl:h-[800px] gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Left: Final Asset & Kit */}
            <div className="xl:w-1/2 flex flex-col gap-6 md:gap-8">
                <div>
                    <h3 className="text-lg md:text-xl font-light text-slate-800 mb-2">Campaign Ready</h3>
                    <p className="text-sm text-slate-500">Download your assets and copy your caption.</p>
                </div>

                {/* Preview Box */}
                <div className="bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200 shadow-inner h-[300px] md:h-[400px]">
                    <div className="transform scale-[0.35] origin-center shadow-2xl">
                        <LivePreviewHTML />
                    </div>
                </div>

                {/* Download Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <PDFDownloadLink
                        document={<TemplateRenderer />}
                        fileName={`hylono_${format}_${modality}.pdf`}
                        className="col-span-2 bg-slate-900 text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {({ loading }) => (
                            <>
                                {loading ? 'Generating...' : <><Download className="w-5 h-5" /> Download Selected Asset</>}
                            </>
                        )}
                    </PDFDownloadLink>

                    {/* Simulated Campaign Kit (Future: Generate all 3) */}
                    <button
                        onClick={() => setFormat('social-story')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${format === 'social-story' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Smartphone className="w-5 h-5" />
                        <span className="text-xs font-bold">Story Version</span>
                    </button>
                    <button
                        onClick={() => setFormat('print-poster')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors ${format === 'print-poster' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="text-xs font-bold">Print Flyer</span>
                    </button>
                </div>
            </div>

            {/* Right: Social Brain */}
            <div className="xl:w-1/2 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col h-[800px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Social Brain</h3>
                        <p className="text-xs text-slate-500">AI-Generated Caption & Tags</p>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm relative group">
                    <button
                        onClick={handleCopyCaption}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                        title="Copy to Clipboard"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                    <textarea
                        ref={captionRef}
                        readOnly
                        className="w-full h-full resize-none text-sm text-slate-600 leading-relaxed outline-none"
                        value={`${socialContent.caption}\n\n${socialContent.hashtags}`}
                    />
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-2">
                        <Share className="w-4 h-4" />
                        Campaign Tips
                    </h4>
                    <ul className="text-xs text-purple-800 space-y-2 list-disc pl-4">
                        <li>Post the <b>Square</b> image to your feed with the caption above.</li>
                        <li>Share the <b>Story</b> version and use a "Link Sticker" to your booking URL.</li>
                        <li>Print the <b>Flyer</b> (A4) and display it at your front desk.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

// --- Main Layout ---

interface PartnerStudioProps {
    startFresh?: boolean;
}

export const PartnerStudio: React.FC<PartnerStudioProps> = ({
    startFresh = false,
}) => {
    const router = useRouter();
    const pathname = usePathname() ?? '/nexus/studio';
    const { currentStep, nextStep, prevStep, setStep, resetCampaign } = usePartnerStore();

    useEffect(() => {
        if (!startFresh) {
            return;
        }

        resetCampaign();
        router.replace(pathname, { scroll: false });
    }, [pathname, resetCampaign, router, startFresh]);

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <StepIntent />;
            case 2: return <StepEditor />;
            case 3: return <StepDownload />;
            default: return <StepIntent />;
        }
    };

    const navSteps = [
        { id: 1, label: 'Campaign Intent', icon: Megaphone },
        { id: 2, label: 'Design Studio', icon: Palette },
        { id: 3, label: 'Export & Promote', icon: Download },
    ];

    return (
        <PartnerLayout title="Studio">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Marketing Studio</h1>
                    <p className="max-w-3xl text-sm text-slate-500">
                        Build clinic-ready social posts and print assets inside Nexus, then export branded PDFs with booking-ready QR codes and wellness-safe copy.
                    </p>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Sidebar / Wizard Nav */}
                    <div className="w-full lg:w-1/4 space-y-2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Studio Workflow</h2>
                            <p className="text-xs text-slate-400 mb-6 uppercase tracking-wider">Campaign Creator</p>

                            <nav className="space-y-1">
                                {navSteps.map((step) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setStep(step.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${currentStep === step.id ? 'bg-cyan-50 text-cyan-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <step.icon className="w-4 h-4" />
                                        {step.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[750px] flex flex-col">

                            {/* Toolbar */}
                            <div className="h-14 border-b border-slate-100 flex items-center px-6 justify-between bg-white">
                                <span className="text-xs font-mono text-slate-400">
                                    STEP {currentStep} / 3
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={prevStep} disabled={currentStep === 1} className="p-2 hover:bg-slate-50 rounded text-slate-400 disabled:opacity-30">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={nextStep} disabled={currentStep === 3} className="p-2 hover:bg-slate-50 rounded text-slate-400 disabled:opacity-30">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Canvas / Form Area */}
                            <div className="p-8 flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full"
                                    >
                                        {renderStep()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Action Bar */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                                {currentStep < 3 ? (
                                    <button
                                        onClick={nextStep}
                                        className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
                                    >
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetCampaign}
                                        className="px-6 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                                    >
                                        Create Another
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};
