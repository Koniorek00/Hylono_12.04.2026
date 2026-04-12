
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { signIn as authSignIn, signOut as authSignOut } from 'next-auth/react';
import { User, Mail, Lock, Eye, EyeOff, X, UserCircle, Package, Settings, LogOut, ArrowRight, Check, AlertCircle, Loader2, Github, Globe, Sun, Zap, CheckCircle, RotateCcw } from 'lucide-react';
import { TechType } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { OptimizedImage } from './shared/OptimizedImage';

// --- Password Strength Component ---
const PasswordStrengthMeter: React.FC<{ password: string }> = ({ password }) => {
    const getStrength = (pass: string) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length > 6) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strength = getStrength(password);

    const getLabel = () => {
        switch (strength) {
            case 0: return 'Enter Password';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            case 5: return 'Elite';
            default: return '';
        }
    };

    const getColor = () => {
        switch (strength) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-orange-500';
            case 3: return 'bg-yellow-500';
            case 4: return 'bg-emerald-500';
            case 5: return 'bg-cyan-500';
            default: return 'bg-slate-200';
        }
    };

    return (
        <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Password Strength</span>
                <span className={strength >= 4 ? 'text-emerald-600' : ''}>{getLabel()}</span>
            </div>
            <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-300 ${level <= strength ? getColor() : 'bg-slate-100'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Main Login Modal ---
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignupSuccess?: () => void;
    redirectTo?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onSignupSuccess,
    redirectTo,
}) => {
    const signIn = async ({ email, password }: { email: string; password: string }) => {
        const result = await authSignIn('credentials', {
            email,
            password,
            redirect: false,
            ...(redirectTo ? { redirectTo } : {}),
        });
        if (result?.error) {
            return {
                error: {
                    message:
                        result.code === 'rate_limited'
                            ? 'Too many sign-in attempts. Please wait a few minutes and try again.'
                            : 'Invalid email or password.',
                },
            };
        }
        return { error: null, url: result?.url ?? null };
    };

    const signUp = async (_credentials: { email: string; password: string; name?: string }) => {
        return { error: { message: 'Registration is not implemented yet.' } };
    };

    const resetPassword = async (_email: string) => {
        return { error: { message: 'Password reset is not implemented yet.' } };
    };

    const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Focus trap for accessibility
    const trapRef = useFocusTrap({ 
        active: isOpen, 
        onDeactivate: onClose,
        escapeDeactivates: true,
        clickOutsideDeactivates: false
    });

    const resetState = React.useCallback(() => {
        setFormData({ email: '', password: '', name: '' });
        setStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
    }, []);

    useEffect(() => {
        if (!isOpen) resetState();
    }, [isOpen, resetState]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            if (view === 'signup') {
                const { error } = await signUp({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name
                });
                if (error) throw error;
                onClose();
                if (onSignupSuccess) onSignupSuccess();
            } else if (view === 'signin') {
                const { error, url } = await signIn({
                    email: formData.email,
                    password: formData.password
                });
                if (error) throw error;
                if (url && redirectTo) {
                    window.location.assign(url);
                    return;
                }
                onClose();
            } else if (view === 'forgot') {
                const { error } = await resetPassword(formData.email);
                if (error) throw error;
                setStatus('success');
                setSuccessMessage('Check your email for reset instructions.');
            }
        } catch (err: unknown) {
            setStatus('error');
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setErrorMessage(errorMessage);
        } finally {
            if (view !== 'forgot' && view !== 'signup') setStatus('idle'); // Keep success/loading state for others
        }
    };

    const handleSocialLogin = (provider: string) => {
        // Mock social login
        setStatus('loading');
        setTimeout(() => {
            setStatus('error');
            setErrorMessage(`${provider} login is not configured in this demo.`);
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

                    <motion.div
                        ref={trapRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="login-modal-title"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10" aria-label="Close login dialog">
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            >
                                <User className="text-white" size={28} />
                            </motion.div>
                            <h2 id="login-modal-title" className="text-2xl font-bold text-slate-900">
                                {view === 'signin' && 'Welcome Back'}
                                {view === 'signup' && 'Create Account'}
                                {view === 'forgot' && 'Reset Password'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {view === 'signin' && 'Sign in to access your dashboard'}
                                {view === 'signup' && 'Join the regeneration revolution'}
                                {view === 'forgot' && 'Enter your email to recover access'}
                            </p>
                        </div>

                        {status === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-3" role="alert" aria-live="polite">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                <span id="auth-error-message">{errorMessage}</span>
                            </div>
                        )}

                        {status === 'success' && view === 'forgot' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Email Sent!</h3>
                                <p className="text-slate-500 text-sm mb-6">{successMessage}</p>
                                <button
                                    onClick={() => { setView('signin'); resetState(); }}
                                    className="text-cyan-600 font-bold hover:underline"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {view === 'signup' && (
                                    <div>
                                        <label htmlFor="auth-name" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                id="auth-name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="auth-email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                id="auth-email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                                placeholder="your@email.com"
                                                aria-describedby={status === 'error' ? 'auth-error-message' : undefined}
                                                aria-invalid={status === 'error'}
                                            />
                                    </div>
                                </div>

                                {view !== 'forgot' && (
                                    <div>
                                        <label htmlFor="auth-password" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                id="auth-password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                                                placeholder="••••••••"
                                                aria-describedby={status === 'error' ? 'auth-error-message' : undefined}
                                                aria-invalid={status === 'error'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {view === 'signup' && <PasswordStrengthMeter password={formData.password} />}
                                    </div>
                                )}

                                {view === 'signin' && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot')}
                                            className="text-xs text-slate-500 hover:text-cyan-600"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
                                    {view === 'signin' && 'Sign In'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'forgot' && 'Send Reset Link'}
                                </button>
                            </form>
                        )}

                        {view !== 'forgot' && (
                            <>
                                <div className="mt-6 relative flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                    <div className="relative bg-white px-4 text-xs text-slate-400">OR CONTINUE WITH</div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                        <Globe size={18} className="text-slate-600" />
                                        <span className="text-sm font-medium text-slate-600">Google</span>
                                    </button>
                                    <button onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div className="text-slate-900"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" /></svg></div>
                                        <span className="text-sm font-medium text-slate-600">Apple</span>
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => {
                                    setView(view === 'signin' ? 'signup' : 'signin');
                                    resetState();
                                }}
                                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                            >
                                {view === 'signin' ? "Don't have an account? Sign up" : view === 'signup' ? 'Already have an account? Sign in' : 'Back to Sign in'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Account Dashboard Component ---
export const AccountPage: React.FC<{
    onNavigate: (page: string, tech?: TechType, mode?: string) => void;
    ownedTech?: TechType[];
    sessionUser?: {
        email?: string | null;
        name?: string | null;
    } | null;
}> = ({ onNavigate, ownedTech = [], sessionUser = null }) => {
    const user = sessionUser;
    const isPreviewMode = !user?.email;
    const displayName = user?.name ?? user?.email ?? 'Guest Preview';
    const signOut = () => {
        void authSignOut({ callbackUrl: '/' });
    };
    const [activeTab, setActiveTab] = useState('profile');
    const accountRentalsEnabled = useFeatureFlag('feature_account_rentals');

    const activeRentals = [
        {
            id: 'rental-001',
            productTitle: 'Hylono HBOT Starter System',
            image: '/images/tech/hbot.jpg',
            status: 'active' as const,
            statusLabel: 'Active',
            startDate: '2026-01-12',
            endDate: '2026-07-12',
            nextPaymentDate: '2026-03-12',
            monthlyPrice: 109,
            totalPaid: 218,
            purchasePriceWithCredit: 3772,
            fullPrice: 4990,
        },
    ];

    const tabs = [
        { id: 'orders', label: 'Orders', icon: Package },
        ...(accountRentalsEnabled ? [{ id: 'rentals', label: 'My Rentals', icon: RotateCcw }] : []),
        { id: 'profile', label: 'Profile', icon: UserCircle },
        { id: 'circadian', label: 'Circadian Settings', icon: Sun },
        { id: 'settings', label: 'General', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
                        <p className="text-slate-500">Welcome back, {displayName}</p>
                    </div>
                    {isPreviewMode ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-800">
                            Preview Mode
                        </span>
                    ) : (
                        <button
                            onClick={signOut}
                            className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    )}
                </div>

                {isPreviewMode && (
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                        Authentication is not active in this environment, so you are seeing the account dashboard in preview mode.
                        Interactive member actions remain non-transactional until login is configured.
                    </div>
                )}

                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                        {accountRentalsEnabled && activeTab === 'rentals' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">My rentals</h2>

                                {activeRentals.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <RotateCcw size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>You don't have any active rentals.</p>
                                        <button onClick={() => onNavigate('rental')} className="mt-4 text-cyan-600 text-sm font-bold hover:underline">
                                            See available devices →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {activeRentals.map((rental) => (
                                            <article key={rental.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <OptimizedImage
                                                        src={rental.image}
                                                        alt={rental.productTitle}
                                                        width={160}
                                                        height={112}
                                                        sizes="(max-width: 768px) 100vw, 160px"
                                                        className="w-full md:w-40 h-28 object-cover rounded-xl bg-slate-100"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3 className="font-bold text-slate-900">{rental.productTitle}</h3>
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                                {rental.statusLabel}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-2">Period: {rental.startDate} — {rental.endDate}</p>
                                                        <p className="text-sm text-slate-600">Next payment: {rental.nextPaymentDate} — €{rental.monthlyPrice}</p>

                                                        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-white">
                                                            <p className="text-sm text-slate-700">
                                                                Paid so far: €{rental.totalPaid}. Buy with credit: €{rental.purchasePriceWithCredit} (instead of €{rental.fullPrice}).
                                                            </p>
                                                            <button onClick={() => onNavigate('store')} className="mt-2 text-sm font-semibold text-cyan-700 hover:underline">
                                                                Buy this device →
                                                            </button>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <button className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700">Extend</button>
                                                            <button className="min-h-11 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700">Schedule return</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Order History</h2>
                                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No orders yet</p>
                                    <button onClick={() => onNavigate('store')} className="mt-4 text-cyan-600 text-sm font-bold hover:underline">
                                        Browse Products →
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                                <div className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Name</label>
                                        <input type="text" readOnly value={user?.name || ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email</label>
                                        <input type="email" readOnly value={user?.email ?? ''} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                                    </div>
                                    <div className="pt-2">
                                        <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'circadian' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Circadian Preferences</h2>
                                <p className="text-sm text-slate-500 mb-4">Optimize your device interactions based on your natural rhythm.</p>
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                                    <span className="text-amber-500 mt-0.5">🚧</span>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Coming Soon</p>
                                        <p className="text-xs text-amber-700 mt-0.5">
                                            Circadian rhythm scheduling — morning light protocols, evening wind-down sequences, and sleep-phase optimised PEMF — is being developed. Check back in the next release.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                                    <Sun size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">Light Temperature Override</h3>
                                                    <p className="text-xs text-slate-500">Auto-adjust device display and panel warmth</p>
                                                </div>
                                            </div>
                                            <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
                                                <button className="px-4 py-1.5 bg-slate-100 text-slate-900 text-[10px] font-bold uppercase rounded-md shadow-sm">Warm</button>
                                                <button className="px-4 py-1.5 text-slate-400 text-[10px] font-bold uppercase hover:text-slate-600">Cool</button>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-300 to-blue-200 rounded-full w-full" />
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
                                                    <Zap size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">Default Intensity Level</h3>
                                                    <p className="text-xs text-slate-500">Starting power for PEMF and RLT sessions</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-cyan-600">75%</span>
                                        </div>
                                        <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                            <span>Gentle</span>
                                            <span>Balanced</span>
                                            <span>Max Vibe</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={18} className="text-emerald-500" />
                                            <div>
                                                <span className="text-sm font-bold text-emerald-900">Smart Protocol Timing</span>
                                                <p className="text-[10px] text-emerald-700">Optimize session durations based on sleep quality data</p>
                                            </div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-none shadow-sm" />
                                    </div>

                                    <div className="pt-2">
                                        <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                                            Synchronize to Devices
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-4">Settings</h2>
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200 mb-6">
                                    <span className="text-slate-400 mt-0.5">🚧</span>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Coming Soon</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Account settings — notification preferences, language, data export, and connected device management — are under active development.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Mail size={18} className="text-slate-400" />
                                            <span className="font-medium text-slate-700">Email notifications</span>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Globe size={18} className="text-slate-400" />
                                            <span className="font-medium text-slate-700">Newsletter subscription</span>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
