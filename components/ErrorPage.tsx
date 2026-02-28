import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Home, Mail, Phone, HelpCircle, ShoppingBag,
    ArrowLeft, RefreshCw, AlertTriangle, Hexagon,
    MessageCircle, BookOpen, MapPin, Zap
} from 'lucide-react';

interface ErrorPageProps {
    type?: '404' | 'error' | 'loading';
    message?: string;
    onNavigate?: (page: string) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    type = '404',
    message,
    onNavigate
}) => {
    const router = useRouter();
    const navigate = (page: string) => {
        if (onNavigate) {
            onNavigate(page);
        } else {
            router.push(page === 'home' ? '/' : `/${page}`);
            window.scrollTo(0, 0);
        }
    };

    const errorConfig = {
        '404': {
            title: "Page Not Found",
            subtitle: "The page you're looking for doesn't exist or has been moved.",
            icon: <AlertTriangle className="text-amber-500" size={48} strokeWidth={1.5} />
        },
        'error': {
            title: "Something Went Wrong",
            subtitle: message || "We encountered an unexpected error. Please try again.",
            icon: <Zap className="text-red-500" size={48} strokeWidth={1.5} />
        },
        'loading': {
            title: "Loading Failed",
            subtitle: "The content couldn't be loaded. Check your connection and try again.",
            icon: <RefreshCw className="text-cyan-500" size={48} strokeWidth={1.5} />
        }
    };

    const config = errorConfig[type];

    const quickLinks = [
        { icon: Home, label: "Homepage", page: "home", desc: "Return to the main page" },
        { icon: ShoppingBag, label: "Store", page: "store", desc: "Browse our products" },
        { icon: HelpCircle, label: "FAQ", page: "faq", desc: "Find answers" },
        { icon: BookOpen, label: "Knowledge Hub", page: "blog", desc: "Read our articles" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full"
            >
                {/* Error Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                                {config.icon}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 futuristic-font">
                                {config.title}
                            </h1>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-8">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                            Quick Actions
                        </h2>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {quickLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => navigate(link.page)}
                                    className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center transition-colors">
                                        <link.icon size={18} className="text-slate-500 group-hover:text-cyan-600" />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-semibold text-slate-800">{link.label}</span>
                                        <span className="block text-[10px] text-slate-400">{link.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Try Again Button */}
                        {type !== '404' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mb-8"
                            >
                                <RefreshCw size={14} />
                                Try Again
                            </button>
                        )}

                        {/* Divider */}
                        <div className="border-t border-slate-100 pt-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                Need Help?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Live Chat */}
                                <button
                                    onClick={() => navigate('support')}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <MessageCircle size={16} className="text-cyan-500" />
                                    <div className="text-left">
                                        <span className="block text-xs font-semibold text-slate-700">Live Chat</span>
                                        <span className="block text-[9px] text-slate-400">Available 24/7</span>
                                    </div>
                                </button>

                                {/* Email */}
                                <a
                                    href="mailto:support@hylono.com"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Mail size={16} className="text-purple-500" />
                                    <div className="text-left">
                                        <span className="block text-xs font-semibold text-slate-700">Email Us</span>
                                        <span className="block text-[9px] text-slate-400">support@hylono.com</span>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a
                                    href="tel:+48123456789"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Phone size={16} className="text-emerald-500" />
                                    <div className="text-left">
                                        <span className="block text-xs font-semibold text-slate-700">Call Us</span>
                                        <span className="block text-[9px] text-slate-400">+48 123 456 789</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ArrowLeft size={12} />
                            Go Back
                        </button>

                        <div className="flex items-center gap-2 text-slate-400">
                            <Hexagon size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Hylono</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Error Boundary Component
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; onNavigate?: (page: string) => void },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode; onNavigate?: (page: string) => void }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    type="error"
                    message={this.state.error?.message}
                    onNavigate={this.props.onNavigate}
                />
            );
        }

        return this.props.children;
    }
}

// 404 Page Export
export const NotFoundPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => (
    <ErrorPage type="404" onNavigate={onNavigate} />
);

// Loading Failed Export
export const LoadingFailedPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => (
    <ErrorPage type="loading" onNavigate={onNavigate} />
);
