import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';

interface Step {
    number: number;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

interface StepFlowProps {
    steps: Step[];
    currentStep?: number;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'numbered' | 'icons' | 'dots';
}

export const StepFlow: React.FC<StepFlowProps> = ({
    steps,
    currentStep = 0,
    orientation = 'horizontal',
    variant = 'numbered'
}) => {
    if (orientation === 'vertical') {
        return (
            <div className="space-y-8">
                {steps.map((step, i) => (
                    <motion.div
                        key={step.number}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6"
                    >
                        <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${i < currentStep ? 'bg-emerald-500 text-white' :
                                    i === currentStep ? 'bg-cyan-500 text-white' :
                                        'bg-slate-200 text-slate-500'
                                }`}>
                                {i < currentStep ? <Check size={20} /> : step.number}
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-0.5 h-16 ${i < currentStep ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                            )}
                        </div>
                        <div className="flex-1 pb-8">
                            <h3 className={`font-bold text-lg ${i <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                                {step.title}
                            </h3>
                            <p className="text-slate-600 mt-1">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-start justify-between">
            {steps.map((step, i) => (
                <React.Fragment key={step.number}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 text-center"
                    >
                        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center font-bold text-xl mb-4 ${i < currentStep ? 'bg-emerald-500 text-white' :
                                i === currentStep ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' :
                                    'bg-slate-200 text-slate-500'
                            }`}>
                            {variant === 'numbered' && (i < currentStep ? <Check size={24} /> : step.number)}
                            {variant === 'icons' && step.icon}
                            {variant === 'dots' && <div className="w-3 h-3 rounded-full bg-current" />}
                        </div>
                        <h3 className={`font-bold ${i <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-[200px] mx-auto">{step.description}</p>
                    </motion.div>

                    {i < steps.length - 1 && (
                        <div className="flex-shrink-0 mt-6 px-4">
                            <ArrowRight className={`${i < currentStep ? 'text-emerald-500' : 'text-slate-300'}`} size={24} />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Example usage for HBOT Protocol
export const HBOTProtocolFlow: React.FC = () => {
    const protocolSteps: Step[] = [
        { number: 1, title: 'Consultation', description: 'Discuss your health goals with our expert team' },
        { number: 2, title: 'Assessment', description: 'Complete health screening and protocol planning' },
        { number: 3, title: 'Installation', description: 'Professional setup and training at your location' },
        { number: 4, title: 'Protocol Start', description: 'Begin your personalized HBOT journey' },
        { number: 5, title: 'Optimization', description: 'Ongoing support and protocol refinement' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Your Journey to Wellness</h2>
                <StepFlow steps={protocolSteps} currentStep={2} />
            </div>
        </section>
    );
};

