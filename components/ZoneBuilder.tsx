
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    ChevronLeft,
    Check,
    Activity,
    Shield,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Moon,
    Brain,
    Battery,
    Heart,
    Target,
    Home,
    Building2,
    DollarSign,
    Lightbulb,
    Plus,
    Star,
    Info,
    Play,
    BookOpen,
    Clock,
    Users,
    Calendar,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    ShieldCheck,
    Truck,
    RotateCcw,
    Headphones,
    Quote,
    TrendingUp
} from 'lucide-react';
import { TechType } from '../types';
import { TECH_DETAILS } from '../constants';

// ============================================================
// TYPES
// ============================================================
type UserType = 'home' | 'clinic' | null;
type HomeStep = 'WHO' | 'ASSESS' | 'GOALS' | 'BUDGET' | 'PRESCRIPTION' | 'LEARN' | 'PROTOCOL' | 'CHECKOUT';
type ClinicStep = 'WHO' | 'PRACTICE' | 'CAPACITY' | 'PRESCRIPTION' | 'LEARN' | 'CHECKOUT';

interface Recommendation {
    techId: TechType;
    reason: string;
    isPrimary: boolean;
}

interface ConfigState {
    userType: UserType;
    challenges: string[];
    goal: string | null;
    budget: string | null;
    clinicType: string | null;
    clientNeeds: string[];
    capacity: string | null;
    recommendations: Recommendation[];
    selectedDevices: TechType[];
    expandedDevice: TechType | null;
}

// ============================================================
// CONSTANTS
// ============================================================
const CHALLENGES = [
    { id: 'fatigue', label: 'Low Energy', icon: <Battery size={18} /> },
    { id: 'sleep', label: 'Poor Sleep', icon: <Moon size={18} /> },
    { id: 'pain', label: 'Chronic Pain', icon: <Activity size={18} /> },
    { id: 'brain_fog', label: 'Brain Fog', icon: <Brain size={18} /> },
    { id: 'stress', label: 'High Stress', icon: <Heart size={18} /> },
    { id: 'aging', label: 'Aging Concerns', icon: <Sparkles size={18} /> }
];

const GOALS = [
    { id: 'energy', label: 'More Energy', desc: 'Feel vibrant all day', icon: <Battery className="text-amber-500" size={22} />, devices: ['PEMF', 'RLT'] },
    { id: 'sleep', label: 'Better Sleep', desc: 'Deep restorative rest', icon: <Moon className="text-indigo-500" size={22} />, devices: ['PEMF', 'Hydrogen'] },
    { id: 'recovery', label: 'Faster Recovery', desc: 'Heal muscles & joints', icon: <Activity className="text-emerald-500" size={22} />, devices: ['HBOT', 'PEMF'] },
    { id: 'focus', label: 'Sharper Mind', desc: 'Clarity & concentration', icon: <Brain className="text-cyan-500" size={22} />, devices: ['Hydrogen', 'PEMF'] },
    { id: 'longevity', label: 'Slow Aging', desc: 'Cellular rejuvenation', icon: <Sparkles className="text-rose-500" size={22} />, devices: ['RLT', 'HBOT', 'Hydrogen'] },
    { id: 'immunity', label: 'Stronger Immunity', desc: 'Resilience & defense', icon: <Shield className="text-violet-500" size={22} />, devices: ['HBOT', 'Hydrogen'] }
];

const BUDGET_OPTIONS = [
    { id: 'starter', label: '$200-400/mo', desc: 'Single device', maxDevices: 1 },
    { id: 'standard', label: '$400-800/mo', desc: '1-2 devices', maxDevices: 2 },
    { id: 'premium', label: '$800-1500/mo', desc: '2-3 devices', maxDevices: 3 },
    { id: 'unlimited', label: '$1500+/mo', desc: 'Full protocol', maxDevices: 4 }
];

const CLINIC_TYPES = [
    { id: 'medspa', label: 'Med Spa / Aesthetics' },
    { id: 'wellness', label: 'Wellness Center' },
    { id: 'chiro', label: 'Chiropractic / PT' },
    { id: 'gym', label: 'Gym / Fitness' },
    { id: 'naturopath', label: 'Integrative Medicine' },
    { id: 'other', label: 'Other' }
];

const CAPACITY_OPTIONS = [
    { id: 'small', label: '1-10 clients/day', devices: 2 },
    { id: 'medium', label: '10-30 clients/day', devices: 3 },
    { id: 'large', label: '30+ clients/day', devices: 4 }
];

// Device education + testimonials
const DEVICE_EDUCATION: Record<TechType, {
    fullName: string;
    tagline: string;
    whatItIs: string;
    howItWorks: string;
    expectations: { time: string; result: string }[];
    videoPlaceholder: string;
    testimonial: { name: string; location: string; quote: string; rating: number };
    stats: { users: string; satisfaction: string };
}> = {
    [TechType.HBOT]: {
        fullName: 'Hyperbaric Oxygen Therapy',
        tagline: 'Flood your cells with healing oxygen',
        whatItIs: 'A pressurized chamber that lets you breathe pure oxygen at higher-than-normal atmospheric pressure, allowing oxygen to dissolve directly into your blood plasma.',
        howItWorks: 'You relax inside a comfortable chamber while the pressure gently increases. This pushes more oxygen into every cell, accelerating healing and reducing inflammation.',
        expectations: [
            { time: 'Session 1-3', result: 'Deep relaxation, improved sleep' },
            { time: 'Week 2-4', result: 'Reduced inflammation, faster healing' },
            { time: 'Month 2+', result: 'Enhanced energy, cognitive clarity' }
        ],
        videoPlaceholder: '🎬 Watch: How HBOT Works (2 min)',
        testimonial: { name: 'Michael R.', location: 'Austin, TX', quote: 'After 3 weeks, my chronic knee pain is 80% gone. I can hike again!', rating: 5 },
        stats: { users: '8,400+', satisfaction: '94%' }
    },
    [TechType.PEMF]: {
        fullName: 'Pulsed Electromagnetic Field Therapy',
        tagline: 'Recharge your cells like batteries',
        whatItIs: 'A mat that sends gentle magnetic pulses through your body, stimulating cellular repair and boosting natural healing processes.',
        howItWorks: 'You lie on a comfortable mat while electromagnetic pulses penetrate deep into tissues, mimicking Earth\'s natural frequencies to help cells regenerate.',
        expectations: [
            { time: 'Day 1-7', result: 'Better sleep, reduced stress' },
            { time: 'Week 2-4', result: 'Less pain, more energy' },
            { time: 'Month 2+', result: 'Cumulative cellular benefits' }
        ],
        videoPlaceholder: '🎬 Watch: How PEMF Works (2 min)',
        testimonial: { name: 'Sarah K.', location: 'Denver, CO', quote: 'My sleep went from 5 hours to 7+ hours. Life-changing for my productivity.', rating: 5 },
        stats: { users: '12,000+', satisfaction: '96%' }
    },
    [TechType.RLT]: {
        fullName: 'Red Light Therapy',
        tagline: 'Light that heals from the inside out',
        whatItIs: 'Panels that emit specific wavelengths of red and near-infrared light, penetrating your skin to energize cells and stimulate collagen.',
        howItWorks: 'You stand or sit near light panels for 10-20 minutes. The wavelengths are absorbed by mitochondria, boosting ATP production and accelerating repair.',
        expectations: [
            { time: 'Week 1-2', result: 'Improved skin tone, less soreness' },
            { time: 'Month 1', result: 'Visible skin improvements, faster recovery' },
            { time: 'Month 3+', result: 'Reduced wrinkles, joint relief' }
        ],
        videoPlaceholder: '🎬 Watch: How Red Light Works (2 min)',
        testimonial: { name: 'Jennifer M.', location: 'Miami, FL', quote: 'My skin looks 10 years younger. Friends keep asking what I\'m doing differently.', rating: 5 },
        stats: { users: '15,000+', satisfaction: '97%' }
    },
    [TechType.HYDROGEN]: {
        fullName: 'Molecular Hydrogen Therapy',
        tagline: 'The smallest, most powerful antioxidant',
        whatItIs: 'A device that infuses water with molecular hydrogen (H2), creating a powerful antioxidant drink that neutralizes harmful free radicals.',
        howItWorks: 'You drink hydrogen-enriched water daily. The tiny H2 molecules easily cross cell membranes, reaching your brain and mitochondria to reduce oxidative stress.',
        expectations: [
            { time: 'Day 1-7', result: 'Increased hydration, mental clarity' },
            { time: 'Week 2-4', result: 'Reduced brain fog, more energy' },
            { time: 'Month 2+', result: 'Systemic antioxidant benefits' }
        ],
        videoPlaceholder: '🎬 Watch: How Hydrogen Works (2 min)',
        testimonial: { name: 'David L.', location: 'Seattle, WA', quote: 'Brain fog lifted after just one week. I can focus for hours now.', rating: 5 },
        stats: { users: '6,800+', satisfaction: '93%' }
    }
};

// Protocol schedules
const PROTOCOL_SCHEDULES: Record<string, { day: string; activity: string; duration: string }[]> = {
    default: [
        { day: 'Mon/Wed/Fri', activity: 'PEMF Session', duration: '20 min' },
        { day: 'Tue/Thu', activity: 'Red Light Therapy', duration: '15 min' },
        { day: 'Daily', activity: 'Hydrogen Water', duration: '2-3 glasses' },
        { day: 'Weekend', activity: 'HBOT Session', duration: '60 min' }
    ]
};

// Synergy explanations
const SYNERGY_INFO = {
    title: 'Why These Work Together',
    description: 'Each technology targets different cellular pathways. When combined, they create a synergistic effect that amplifies results.',
    pairs: [
        { a: 'PEMF', b: 'RLT', benefit: 'PEMF opens cellular channels, RLT floods them with healing light' },
        { a: 'HBOT', b: 'Hydrogen', benefit: 'HBOT saturates with oxygen, Hydrogen neutralizes oxidative byproducts' },
        { a: 'PEMF', b: 'HBOT', benefit: 'Both enhance mitochondrial function from different angles' }
    ]
};

const DEVICE_BENEFITS: Record<TechType, { targets: string[] }> = {
    [TechType.HBOT]: { targets: ['pain', 'recovery', 'immunity', 'longevity'] },
    [TechType.PEMF]: { targets: ['fatigue', 'sleep', 'stress', 'energy', 'recovery'] },
    [TechType.RLT]: { targets: ['aging', 'recovery', 'longevity', 'energy'] },
    [TechType.HYDROGEN]: { targets: ['brain_fog', 'focus', 'immunity', 'longevity'] }
};

// ============================================================
// RECOMMENDATION ENGINE
// ============================================================
function generateRecommendations(
    challenges: string[],
    goal: string | null,
    budget: string | null,
    isClinic: boolean,
    capacity?: string
): Recommendation[] {
    const scores: Record<TechType, number> = {
        [TechType.HBOT]: 0,
        [TechType.PEMF]: 0,
        [TechType.RLT]: 0,
        [TechType.HYDROGEN]: 0
    };

    challenges.forEach(challenge => {
        Object.entries(DEVICE_BENEFITS).forEach(([techId, data]) => {
            if (data.targets.includes(challenge)) scores[techId as TechType] += 2;
        });
    });

    if (goal) {
        Object.entries(DEVICE_BENEFITS).forEach(([techId, data]) => {
            if (data.targets.includes(goal)) scores[techId as TechType] += 5;
        });
    }

    const sorted = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id as TechType);

    let maxDevices = 2;
    if (isClinic) {
        maxDevices = capacity === 'large' ? 4 : capacity === 'medium' ? 3 : 2;
    } else {
        const budgetOption = BUDGET_OPTIONS.find(b => b.id === budget);
        maxDevices = budgetOption?.maxDevices || 2;
    }

    return sorted.slice(0, maxDevices).map((techId, index) => ({
        techId,
        reason: DEVICE_EDUCATION[techId].tagline,
        isPrimary: index === 0
    }));
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export const ZoneBuilder: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [config, setConfig] = useState<ConfigState>({
        userType: null,
        challenges: [],
        goal: null,
        budget: null,
        clinicType: null,
        clientNeeds: [],
        capacity: null,
        recommendations: [],
        selectedDevices: [],
        expandedDevice: null
    });

    const homeSteps: HomeStep[] = ['WHO', 'ASSESS', 'GOALS', 'BUDGET', 'PRESCRIPTION', 'LEARN', 'PROTOCOL', 'CHECKOUT'];
    const clinicSteps: ClinicStep[] = ['WHO', 'PRACTICE', 'CAPACITY', 'PRESCRIPTION', 'LEARN', 'CHECKOUT'];

    const [currentStep, setCurrentStep] = useState<string>('WHO');

    const steps = config.userType === 'clinic' ? clinicSteps : homeSteps;
    const currentIndex = steps.indexOf(currentStep as any);

    // Auto-expand primary device on LEARN step
    useEffect(() => {
        if (currentStep === 'LEARN' && config.recommendations.length > 0 && !config.expandedDevice) {
            setConfig(prev => ({ ...prev, expandedDevice: prev.recommendations[0]?.techId || null }));
        }
    }, [currentStep]);

    const nextStep = () => {
        if (currentIndex < steps.length - 1) {
            if (steps[currentIndex + 1] === 'PRESCRIPTION') {
                const recs = generateRecommendations(
                    config.userType === 'clinic' ? config.clientNeeds : config.challenges,
                    config.goal,
                    config.budget,
                    config.userType === 'clinic',
                    config.capacity || undefined
                );
                setConfig(prev => ({
                    ...prev,
                    recommendations: recs,
                    selectedDevices: recs.map(r => r.techId)
                }));
            }
            setCurrentStep(steps[currentIndex + 1]);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
            window.scrollTo(0, 0);
        }
    };

    const selectUserType = (type: UserType) => {
        setConfig({ ...config, userType: type });
        setCurrentStep(type === 'clinic' ? 'PRACTICE' : 'ASSESS');
    };

    const toggleChallenge = (id: string) => {
        const field = config.userType === 'clinic' ? 'clientNeeds' : 'challenges';
        const current = config[field];
        const updated = current.includes(id) ? current.filter(c => c !== id) : [...current, id];
        setConfig({ ...config, [field]: updated });
    };

    const totalPrice = useMemo(() => {
        return config.selectedDevices.reduce((sum, techId) => sum + (TECH_DETAILS[techId]?.rentalPrice || 0), 0);
    }, [config.selectedDevices]);

    const selectedGoal = GOALS.find(g => g.id === config.goal);

    // ============================================================
    // STEP RENDERERS
    // ============================================================

    const renderWho = () => (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Who Is This For?</h2>
            <p className="text-gray-500 mb-10">We'll customize your experience based on your needs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => selectUserType('home')}
                    className="p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-cyan-500 hover:shadow-xl transition-all text-left group">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Home size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">For Home</h3>
                    <p className="text-gray-500 mb-4">Personal wellness for you or family</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check size={14} className="text-cyan-500" /> Simple setup</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-cyan-500" /> 1-3 devices</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-cyan-500" /> Monthly rental</li>
                    </ul>
                </motion.button>

                <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => selectUserType('clinic')}
                    className="p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-indigo-500 hover:shadow-xl transition-all text-left group">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Building2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">For Clinic</h3>
                    <p className="text-gray-500 mb-4">Professional use for your business</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check size={14} className="text-indigo-500" /> Multi-device setup</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-indigo-500" /> Training included</li>
                        <li className="flex items-center gap-2"><Check size={14} className="text-indigo-500" /> Volume pricing</li>
                    </ul>
                </motion.button>
            </div>
        </div>
    );

    const renderAssess = () => (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What's Your Biggest Challenge?</h2>
                <p className="text-gray-500">Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                {CHALLENGES.map((c) => {
                    const isSelected = config.challenges.includes(c.id);
                    return (
                        <button key={c.id} onClick={() => toggleChallenge(c.id)}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all
                                ${isSelected ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                {c.icon}
                            </div>
                            <span className={`font-medium ${isSelected ? 'text-cyan-700' : 'text-gray-700'}`}>{c.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep} disabled={config.challenges.length === 0}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 transition-all
                        ${config.challenges.length > 0 ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderGoals = () => (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What's Your #1 Goal?</h2>
                <p className="text-gray-500">We'll optimize your protocol for this outcome</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {GOALS.map((g) => {
                    const isSelected = config.goal === g.id;
                    return (
                        <button key={g.id} onClick={() => setConfig({ ...config, goal: g.id })}
                            className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
                                ${isSelected ? 'border-cyan-500 bg-cyan-50 shadow-lg' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            {g.icon}
                            <span className={`font-semibold text-sm ${isSelected ? 'text-cyan-700' : 'text-gray-700'}`}>{g.label}</span>
                            <span className="text-xs text-gray-400">{g.desc}</span>
                        </button>
                    );
                })}
            </div>

            {/* Goal Preview */}
            {config.goal && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-cyan-50 to-indigo-50 p-4 rounded-2xl mb-8 text-center">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">For {selectedGoal?.label}</span>, we typically recommend: {' '}
                        <span className="font-medium text-cyan-700">{selectedGoal?.devices.join(' + ')}</span>
                    </p>
                </motion.div>
            )}

            <div className="flex justify-center">
                <button onClick={nextStep} disabled={!config.goal}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 transition-all
                        ${config.goal ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderBudget = () => (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What's Your Investment Range?</h2>
                <p className="text-gray-500">This helps us recommend the right number of devices</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
                {BUDGET_OPTIONS.map((b) => {
                    const isSelected = config.budget === b.id;
                    return (
                        <button key={b.id} onClick={() => setConfig({ ...config, budget: b.id })}
                            className={`p-5 rounded-2xl border-2 text-left transition-all
                                ${isSelected ? 'border-cyan-500 bg-cyan-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign size={16} className={isSelected ? 'text-cyan-500' : 'text-gray-400'} />
                                <span className={`font-bold ${isSelected ? 'text-cyan-700' : 'text-gray-900'}`}>{b.label}</span>
                            </div>
                            <span className="text-sm text-gray-500">{b.desc}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep} disabled={!config.budget}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 transition-all
                        ${config.budget ? 'bg-cyan-500 text-white hover:bg-cyan-400' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    <Lightbulb size={18} /> Get My Recommendation <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    // Combined Clinic Practice + Needs step
    const renderPractice = () => (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Tell Us About Your Practice</h2>
                <p className="text-gray-500">We'll tailor recommendations to your clients</p>
            </div>

            {/* Clinic Type */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">What type of practice?</h3>
                <div className="grid grid-cols-3 gap-2">
                    {CLINIC_TYPES.map((t) => {
                        const isSelected = config.clinicType === t.id;
                        return (
                            <button key={t.id} onClick={() => setConfig({ ...config, clinicType: t.id })}
                                className={`p-3 rounded-xl border-2 text-sm font-medium transition-all
                                    ${isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Client Needs */}
            <div className="mb-10">
                <h3 className="font-semibold text-gray-900 mb-3">Common client concerns?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CHALLENGES.map((c) => {
                        const isSelected = config.clientNeeds.includes(c.id);
                        return (
                            <button key={c.id} onClick={() => toggleChallenge(c.id)}
                                className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all
                                    ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                    {c.icon}
                                </div>
                                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>{c.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep} disabled={!config.clinicType || config.clientNeeds.length === 0}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 transition-all
                        ${config.clinicType && config.clientNeeds.length > 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderCapacity = () => (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How Many Clients Per Day?</h2>
                <p className="text-gray-500">This helps us recommend the right device capacity</p>
            </div>

            <div className="space-y-4 mb-10">
                {CAPACITY_OPTIONS.map((c) => {
                    const isSelected = config.capacity === c.id;
                    return (
                        <button key={c.id} onClick={() => setConfig({ ...config, capacity: c.id })}
                            className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all
                                ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                            <div className="flex items-center gap-4">
                                <Users className={isSelected ? 'text-indigo-500' : 'text-gray-400'} size={24} />
                                <span className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>{c.label}</span>
                            </div>
                            <span className="text-sm text-gray-400">{c.devices}+ devices</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep} disabled={!config.capacity}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 transition-all
                        ${config.capacity ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    <Lightbulb size={18} /> Get Recommendation <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderPrescription = () => {
        const isClinic = config.userType === 'clinic';
        const accentColor = isClinic ? 'indigo' : 'cyan';

        return (
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                        <Sparkles size={28} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Your Recommended Protocol</h2>
                    <p className="text-gray-500">Based on your {isClinic ? "clients' needs" : "goals and challenges"}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                    <div className={`bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-500 text-white p-5`}>
                        <div className="flex items-center gap-3">
                            <Target size={20} />
                            <span className="font-semibold">Your Personalized Stack</span>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {config.recommendations.map((rec, index) => {
                            const tech = TECH_DETAILS[rec.techId];
                            const edu = DEVICE_EDUCATION[rec.techId];

                            return (
                                <motion.div key={rec.techId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl ${tech.accentColor} text-white flex items-center justify-center flex-shrink-0`}>
                                        <Zap size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 truncate">{edu.fullName}</h4>
                                            {rec.isPrimary && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex items-center gap-1 flex-shrink-0">
                                                    <Star size={8} /> Primary
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{edu.tagline}</p>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">${tech.rentalPrice}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Synergy Section */}
                    {config.recommendations.length >= 2 && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 border-t border-amber-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="text-amber-600" size={16} />
                                <span className="font-semibold text-amber-800">{SYNERGY_INFO.title}</span>
                            </div>
                            <p className="text-sm text-amber-700 mb-3">{SYNERGY_INFO.description}</p>
                            <div className="space-y-2">
                                {SYNERGY_INFO.pairs.slice(0, 2).map((pair) => (
                                    <div key={`${pair.a}-${pair.b}`} className="text-xs bg-white/60 p-2 rounded-lg text-amber-800">
                                        <span className="font-semibold">{pair.a} + {pair.b}:</span> {pair.benefit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 p-5 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <span className="text-sm text-gray-500">Monthly Investment</span>
                            <div className="text-2xl font-bold text-gray-900">${totalPrice.toLocaleString()}</div>
                        </div>
                        <button onClick={nextStep}
                            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 bg-${accentColor}-500 text-white hover:bg-${accentColor}-400`}>
                            <BookOpen size={16} /> Learn More <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderLearn = () => (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                    <BookOpen size={16} /> Education
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Understand Your Devices</h2>
                <p className="text-gray-500">Learn what each device does before you commit</p>
            </div>

            <div className="space-y-4 mb-8">
                {config.selectedDevices.map((techId) => {
                    const edu = DEVICE_EDUCATION[techId];
                    const tech = TECH_DETAILS[techId];
                    const isExpanded = config.expandedDevice === techId;

                    return (
                        <motion.div key={techId} layout className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <button onClick={() => setConfig({ ...config, expandedDevice: isExpanded ? null : techId })}
                                className="w-full p-5 flex items-center justify-between text-left">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${tech.accentColor} text-white flex items-center justify-center`}>
                                        <Zap size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.fullName}</h3>
                                        <p className="text-sm text-gray-500">{edu.tagline}</p>
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100">
                                        <div className="p-5 space-y-5">
                                            {/* What It Is */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Info size={14} className="text-cyan-500" /> What It Is
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">{edu.whatItIs}</p>
                                            </div>

                                            {/* Video */}
                                            <button className="w-full p-3 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 text-sm">
                                                <Play size={16} /> {edu.videoPlaceholder}
                                            </button>

                                            {/* How It Works */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Zap size={14} className="text-amber-500" /> How It Works
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">{edu.howItWorks}</p>
                                            </div>

                                            {/* Timeline */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Calendar size={14} className="text-emerald-500" /> What to Expect
                                                </h4>
                                                <div className="space-y-2">
                                                    {edu.expectations.map((exp) => (
                                                        <div key={exp.time} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm">
                                                            <span className="text-xs font-bold text-gray-400 w-20">{exp.time}</span>
                                                            <span className="text-gray-700">{exp.result}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Testimonial */}
                                            <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 p-4 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <Quote size={20} className="text-cyan-500 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-gray-700 text-sm italic mb-2">"{edu.testimonial.quote}"</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900 text-sm">{edu.testimonial.name}</span>
                                                            <span className="text-gray-400 text-xs">• {edu.testimonial.location}</span>
                                                            <div className="flex gap-0.5 ml-2">
                                                                {[...Array(edu.testimonial.rating)].map((_, starIndex) => (
                                                                    <Star key={`star-${starIndex}`} size={12} className="text-amber-400 fill-amber-400" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-3 pt-3 border-t border-cyan-100">
                                                    <span className="text-xs text-cyan-700"><span className="font-bold">{edu.stats.users}</span> users</span>
                                                    <span className="text-xs text-cyan-700"><span className="font-bold">{edu.stats.satisfaction}</span> satisfaction</span>
                                                </div>
                                            </div>

                                            <button className="text-cyan-600 font-medium text-sm flex items-center gap-1 hover:underline">
                                                Read full research <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep}
                    className={`px-10 py-4 rounded-full font-semibold flex items-center gap-2 shadow-lg
                        ${config.userType === 'clinic' ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-cyan-500 hover:bg-cyan-400'} text-white`}>
                    I Understand — Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderProtocol = () => (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
                    <Calendar size={16} /> Your Schedule
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Your Weekly Protocol</h2>
                <p className="text-gray-500">Here's how to use your devices for best results</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="p-6">
                    <div className="space-y-3">
                        {PROTOCOL_SCHEDULES.default.filter(s => {
                            const devName = s.activity.toLowerCase();
                            return config.selectedDevices.some(d => devName.includes(d.toLowerCase().split(' ')[0]));
                        }).length > 0 ? (
                            PROTOCOL_SCHEDULES.default.filter(s => {
                                const devName = s.activity.toLowerCase();
                                return config.selectedDevices.some(d => {
                                    const techName = DEVICE_EDUCATION[d]?.fullName.toLowerCase() || '';
                                    return devName.includes('pemf') && d === TechType.PEMF ||
                                        devName.includes('red light') && d === TechType.RLT ||
                                        devName.includes('hbot') && d === TechType.HBOT ||
                                        devName.includes('hydrogen') && d === TechType.HYDROGEN;
                                });
                            }).map((schedule) => (
                                <div key={schedule.day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-24 text-sm font-bold text-gray-900">{schedule.day}</div>
                                    <div className="flex-1 text-gray-700">{schedule.activity}</div>
                                    <div className="text-sm text-gray-400 flex items-center gap-1">
                                        <Clock size={14} /> {schedule.duration}
                                    </div>
                                </div>
                            ))
                        ) : (
                            PROTOCOL_SCHEDULES.default.slice(0, 2).map((schedule) => (
                                <div key={schedule.day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-24 text-sm font-bold text-gray-900">{schedule.day}</div>
                                    <div className="flex-1 text-gray-700">{schedule.activity}</div>
                                    <div className="text-sm text-gray-400 flex items-center gap-1">
                                        <Clock size={14} /> {schedule.duration}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-emerald-50 p-5 border-t border-emerald-100">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-emerald-600" size={20} />
                        <div>
                            <span className="font-semibold text-emerald-800">Best Practice Tip</span>
                            <p className="text-sm text-emerald-700">Consistency beats intensity. Start slow and build up over 2-3 weeks.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button onClick={nextStep}
                    className="px-10 py-4 rounded-full font-semibold flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 shadow-lg">
                    Continue to Checkout <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderCheckout = () => {
        const isClinic = config.userType === 'clinic';

        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className={`p-8 text-center ${isClinic ? 'bg-gradient-to-br from-indigo-600 to-indigo-500' : 'bg-gradient-to-br from-cyan-600 to-cyan-500'} text-white`}>
                        <CheckCircle2 size={40} className="mx-auto mb-3" />
                        <h2 className="text-2xl font-bold mb-1">Ready to Transform</h2>
                        <p className="text-white/80 text-sm">Your personalized protocol is ready</p>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Journey Recap */}
                        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Your Challenge:</span>
                                <span className="font-medium text-gray-900">{config.challenges.map(c => CHALLENGES.find(ch => ch.id === c)?.label).join(', ') || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Your Goal:</span>
                                <span className="font-medium text-gray-900">{selectedGoal?.label || 'Not specified'}</span>
                            </div>
                        </div>

                        {/* Devices */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Your Protocol</h3>
                            <div className="space-y-2">
                                {config.selectedDevices.map(techId => {
                                    const edu = DEVICE_EDUCATION[techId];
                                    const tech = TECH_DETAILS[techId];
                                    return (
                                        <div key={techId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium text-gray-900 text-sm">{edu.fullName}</span>
                                            <span className="font-bold text-gray-900">${tech.rentalPrice}/mo</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Total */}
                        <div className={`p-5 rounded-2xl text-white ${isClinic ? 'bg-indigo-500' : 'bg-cyan-500'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-white/80">Monthly Total</span>
                                <span className="text-3xl font-bold">${totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Trust Signals */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span>30-Day Guarantee</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Truck size={16} className="text-emerald-500" />
                                <span>Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <RotateCcw size={16} className="text-emerald-500" />
                                <span>Easy Returns</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Headphones size={16} className="text-emerald-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <button onClick={onComplete}
                            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl
                                ${isClinic ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-900 hover:bg-gray-800'} text-white`}>
                            {isClinic ? 'Schedule Consultation' : 'Start My Rental'}
                        </button>

                        {/* Talk to Expert */}
                        <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium flex items-center justify-center gap-2 hover:border-gray-300 text-sm">
                            <MessageCircle size={16} /> Not sure? Talk to an expert
                        </button>

                        <p className="text-center text-xs text-gray-400">
                            {isClinic ? 'Our team will contact you within 24 hours' : 'Cancel anytime • No long-term commitment'}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Step Indicator
    const getStepLabel = (step: string) => {
        const labels: Record<string, string> = {
            WHO: 'Start', ASSESS: 'Assess', GOALS: 'Goal', BUDGET: 'Budget',
            PRACTICE: 'Practice', CAPACITY: 'Size', PRESCRIPTION: 'Protocol',
            LEARN: 'Learn', PROTOCOL: 'Schedule', CHECKOUT: 'Finish'
        };
        return labels[step] || step;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Progress */}
                {config.userType && (
                    <div className="mb-10">
                        <div className="flex justify-center items-center gap-1 md:gap-3 mb-3 overflow-x-auto pb-2">
                            {steps.map((s, i) => (
                                <React.Fragment key={s}>
                                    <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                                        ${currentIndex === i ? `${config.userType === 'clinic' ? 'bg-indigo-500' : 'bg-cyan-500'} text-white shadow-lg` :
                                            currentIndex > i ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {currentIndex > i ? <Check size={12} strokeWidth={3} /> : i + 1}
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-6 md:w-12 h-0.5 rounded-full flex-shrink-0 ${currentIndex > i ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-400">
                            Step {currentIndex + 1}: <span className="text-gray-900 font-medium">{getStepLabel(currentStep)}</span>
                        </p>
                    </div>
                )}

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {currentStep === 'WHO' && renderWho()}
                        {currentStep === 'ASSESS' && renderAssess()}
                        {currentStep === 'GOALS' && renderGoals()}
                        {currentStep === 'BUDGET' && renderBudget()}
                        {currentStep === 'PRACTICE' && renderPractice()}
                        {currentStep === 'CAPACITY' && renderCapacity()}
                        {currentStep === 'PRESCRIPTION' && renderPrescription()}
                        {currentStep === 'LEARN' && renderLearn()}
                        {currentStep === 'PROTOCOL' && renderProtocol()}
                        {currentStep === 'CHECKOUT' && renderCheckout()}
                    </motion.div>
                </AnimatePresence>

                {/* Back Button */}
                {currentIndex > 0 && currentStep !== 'CHECKOUT' && (
                    <button onClick={prevStep}
                        className="fixed bottom-6 left-6 p-3 bg-white shadow-lg rounded-full border border-gray-100 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all">
                        <ChevronLeft size={18} />
                        <span className="hidden md:inline text-sm font-medium">Back</span>
                    </button>
                )}
            </div>
        </div>
    );
};