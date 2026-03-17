import React from 'react';
import { motion } from 'motion/react';

interface AccessCardProps {
    title: string;
    subtitle: string;
    body: string;
    features: string[];
    cta: string;
    outline?: boolean;
}

export const AccessSection: React.FC = () => {
    return (
        <section className="py-[120px] bg-[#F0F0EB]">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-6 border border-[#C9A84C] rounded-full">
                        <span className="text-[12px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold">Access Models</span>
                    </div>
                    <h2 className="text-[40px] font-bold text-[#1A1A1A] mb-6">Own the Outcome. Not the Equipment.</h2>
                    <p className="text-[17px] text-[#6B6B60] max-w-[580px] mx-auto leading-[1.6]">
                        Hylono eliminates the capital barrier that keeps regeneration technologies locked inside elite clinics. Choose the access model that fits your path.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Explore */}
                    <AccessCard
                        title="Explore"
                        subtitle="Short-Term Rental"
                        body="Try any technology in our ecosystem with zero commitment. Flexible rental periods from 2 weeks to 3 months."
                        features={["No long-term contract", "Delivered to your door", "Full protocol guidance"]}
                        cta="Start Exploring →"
                        outline
                    />

                    {/* Card 2: Commit (Featured) */}
                    <motion.div
                        className="relative bg-white rounded-[20px] p-10 shadow-xl border-2 border-[#0A6E6E] overflow-hidden"
                        whileHover={{ y: -8 }}
                    >
                        <div className="absolute top-4 right-4 bg-[#C9A84C] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div className="text-[#0A6E6E] mb-6">
                            {/* Refresh Icon */}
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                                <path d="M3 3v5h5"></path>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                                <path d="M16 21h5v-5"></path>
                            </svg>
                        </div>
                        <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-1">Commit</h3>
                        <p className="text-[14px] font-semibold text-[#0A6E6E] mb-4">Protocol Subscription</p>
                        <p className="text-[15px] text-[#6B6B60] mb-8 leading-relaxed">
                            Subscribe to a full regeneration protocol. Receive curated hardware, scheduled updates, and remote monitoring.
                        </p>
                        <hr className="border-[#E0DED6] mb-8" />
                        <ul className="space-y-3 mb-8">
                            {["Hardware included", "Quarterly protocol updates", "Priority access", "Cancel anytime"].map((f, i) => (
                                <li key={i} className="flex items-center text-[14px] text-[#1A1A1A]">
                                    <span className="text-[#0A6E6E] mr-2">✓</span> {f}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0A6E6E] to-[#3EDFD7] text-white font-semibold text-[15px] shadow-lg hover:shadow-xl transition-all">
                            View Protocols →
                        </button>
                    </motion.div>

                    {/* Card 3: Deploy */}
                    <AccessCard
                        title="Deploy"
                        subtitle="Professional Integration"
                        body="For clinics and studios. Deploy Hylono-verified technology stacks with training and compliance docs."
                        features={["Multi-device fleet mgmt", "Staff training", "Compliance pack"]}
                        cta="Partner With Us →"
                        outline
                    />
                </div>
            </div>
        </section>
    );
};

const AccessCard: React.FC<AccessCardProps> = ({
    title,
    subtitle,
    body,
    features,
    cta,
    outline,
}) => (
    <motion.div
        className="bg-white rounded-[20px] p-10 shadow-sm border border-transparent hover:border-[#E0DED6] transition-colors"
        whileHover={{ y: -5 }}
    >
        <div className="text-[#0A6E6E] mb-6">
            {/* Generic Key/Building Icon Placeholder */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" /><path d="M8 12h8" />
            </svg>
        </div>
        <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-1">{title}</h3>
        <p className="text-[14px] font-semibold text-[#0A6E6E] mb-4">{subtitle}</p>
        <p className="text-[15px] text-[#6B6B60] mb-8 leading-relaxed">{body}</p>
        <hr className="border-[#E0DED6] mb-8" />
        <ul className="space-y-3 mb-8">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center text-[14px] text-[#1A1A1A]">
                    <span className="text-[#0A6E6E] mr-2">✓</span> {f}
                </li>
            ))}
        </ul>
        <button className={`w-full py-3 rounded-xl font-semibold text-[15px] transition-all ${outline ? 'border border-[#0A6E6E] text-[#0A6E6E] hover:bg-[#0A6E6E]/5' : ''}`}>
            {cta}
        </button>
    </motion.div>
);

