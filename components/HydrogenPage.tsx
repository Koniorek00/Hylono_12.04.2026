import React from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

/**
 * HydrogenPage — standalone hydrogen therapy product page
 * Status: Draft / not yet wired into AppRouter
 * TODO: Build full page when content is ready
 */
export const HydrogenPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-24">
            <div className="max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                            <Droplets className="text-white" size={32} />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-6">Hydrogen Therapy</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Molecular hydrogen inhalation and hydrogen-rich water for cellular optimization.
                        Full page coming soon.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
