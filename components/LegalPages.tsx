import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, ToggleLeft, ToggleRight, Info } from 'lucide-react';

interface LegalSection {
    title: string;
    content: React.ReactNode;
    summary: string;
}

const HumanSummaryToggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <div
        onClick={onToggle}
        className={`
            flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 select-none border
            ${enabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }
        `}
    >
        {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        <span className="font-medium text-sm">Human Summary</span>
        {enabled && (
            <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full animate-pulse">
                Active
            </span>
        )}
    </div>
);

const SectionView: React.FC<{ section: LegalSection; showSummary: boolean }> = ({ section, showSummary }) => (
    <div className="mb-10 group">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            {section.title}
        </h2>

        <AnimatePresence>
            {showSummary && (
                <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="bg-emerald-50/50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
                        <div className="flex gap-2 text-emerald-700 font-medium items-start">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-emerald-800 italic">{section.summary}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className={`prose prose-slate max-w-none transition-opacity duration-300 ${showSummary ? 'opacity-60' : 'opacity-100'}`}>
            {section.content}
        </div>
    </div>
);

export const PrivacyPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. Information We Collect",
            content: <p>We collect information you provide directly, including name, email, shipping address, and payment information when making purchases.</p>,
            summary: "We collect your name, email, shipping, and payment details only to fulfill your order."
        },
        {
            title: "2. How We Use Your Information",
            content: <p>Your information is used to process orders, send communications, improve our services, and comply with legal obligations.</p>,
            summary: "We use your data strictly to process orders and improve your experience."
        },
        {
            title: "3. Data Sharing",
            content: <p>We do not sell your personal data. We may share data with payment processors and shipping carriers.</p>,
            summary: "We never sell your data; we only share it with necessary payment and shipping partners."
        },
        {
            title: "4. Your Rights (GDPR)",
            content: <p>EU residents have the right to access, rectify, delete, and port their personal data.</p>,
            summary: "You have full control to access, update, or delete your personal data at any time."
        },
        {
            title: "5. Contact",
            content: <p>For privacy inquiries: <a href="mailto:privacy@hylono.com">privacy@hylono.com</a></p>,
            summary: "Reach out to privacy@hylono.com for any privacy concerns."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <Shield className="text-cyan-500" size={32} />
                            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                        </div>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>
                    <p className="text-sm text-slate-400 mb-12">Last updated: January 2026</p>

                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const TermsPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. Acceptance of Terms",
            content: <p>By using Hylono services, you agree to these Terms of Service.</p>,
            summary: "By using our site, you agree to our standard ground rules."
        },
        {
            title: "2. Products & Services",
            content: <p>Hylono provides bio-optimization technology. All products are for wellness purposes and are not medical devices.</p>,
            summary: "We provide wellness technology, not certified medical devices."
        },
        {
            title: "3. Medical Disclaimer",
            content: <p>Our products are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional.</p>,
            summary: "Our products support wellness but do not replace professional medical advice or treatment."
        },
        {
            title: "4. Limitation of Liability",
            content: <p>Hylono is not liable for indirect damages. Maximum liability is limited to the purchase price.</p>,
            summary: "We are responsible for our products up to their purchase price, but not for indirect issues."
        },
        {
            title: "5. Governing Law",
            content: <p>These terms are governed by Polish law.</p>,
            summary: "Any legal disputes will be handled under Polish law."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <FileText className="text-cyan-500" size={32} />
                            <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
                        </div>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>
                    <p className="text-sm text-slate-400 mb-12">Last updated: January 2026</p>

                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const ShippingPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "Shipping",
            content: (
                <>
                    <ul>
                        <li><strong>Poland:</strong> 2-5 business days</li>
                        <li><strong>EU:</strong> 5-10 business days</li>
                        <li><strong>International:</strong> 10-20 business days</li>
                    </ul>
                    <p>Free shipping on orders over 5,000 PLN within Poland.</p>
                </>
            ),
            summary: "We ship rapidly across Poland (free over 5k), EU, and globally."
        },
        {
            title: "Returns",
            content: <p>30-day return policy for unused products in original packaging. Contact returns@hylono.com.</p>,
            summary: "You have 30 days to return unused products if you change your mind."
        },
        {
            title: "Warranty",
            content: <p>All products include a 2-year manufacturer warranty.</p>,
            summary: "We stand by our quality with a solid 2-year warranty."
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <h1 className="text-4xl font-bold text-slate-900">Shipping & Returns</h1>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>

                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
