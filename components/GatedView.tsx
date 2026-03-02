import React from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, ArrowRight, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface GatedViewProps {
    children: React.ReactNode;
    title: string;
    description: string;
    onRequestLogin?: () => void;
}

export const GatedView: React.FC<GatedViewProps> = ({
    children,
    title,
    description,
    onRequestLogin,
}) => {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (session) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-16 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center"
            >
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {title} Access Restricted
                </h2>
                <p className="text-slate-500 mb-8">
                    {description}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={onRequestLogin}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        Member Sign In <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={onRequestLogin}
                        className="w-full py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-xl font-bold uppercase tracking-widest text-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        Apply for Access <UserPlus size={16} />
                    </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldAlert size={12} />
                    Hylono Governance Secured
                </div>
            </motion.div>
        </div>
    );
};

