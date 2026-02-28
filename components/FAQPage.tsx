import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, MessageCircle } from 'lucide-react';
import { SmartText } from './SmartText';
import { FAQStructuredData } from './StructuredData';

const FAQ_DATA = [
    {
        category: "About Hylono",
        items: [
            { q: "What is Hylono?", a: "Hylono is a bio-optimization technology platform that democratizes access to elite regeneration devices. We provide hyperbaric oxygen chambers, PEMF therapy systems, red light therapy panels, and molecular hydrogen generators all designed for safe, effective home use. Our mission is to make cutting-edge wellness technology accessible to everyone." },
            { q: "Where Mind Connects with Matter what does that mean?", a: "Our philosophy bridges the gap between intention (Mind) and physical transformation (Matter). We believe that true regeneration requires both the right technology and the right protocol. Our systems are designed to help you architect your own regeneration journey with precision and purpose." },
            { q: "Are these medical devices?", a: "Our products are wellness devices designed to support health optimization and regeneration routines. They are not intended to diagnose, treat, cure, or prevent any disease. Depending on product model and market, specific compliance documents may apply and can be shared on request. Always consult a qualified healthcare professional for medical concerns." },
            { q: "Do you ship internationally?", a: "Yes, we ship to all EU countries and select international destinations. Shipping costs and delivery times vary by location. Large items like hyperbaric chambers require freight shipping. Contact our team for specific international shipping quotes." },
        ]
    },
    {
        category: "Science & Protocols",
        items: [
            { q: "What is the Superhuman Protocol?", a: "The Superhuman Protocol is a specific sequence of Magnetism (PEMF), Oxygen (HBOT), and Light (RLT) designed to optimize cellular voltage, oxygen saturation, and energy production. The sequence matters: PEMF primes cell membranes, HBOT saturates with oxygen, and RLT stimulates ATP production. We provide detailed implementation guides with every purchase." },
            { q: "What are contraindications and safety considerations?", a: "Each modality has specific safety guidelines. PEMF should not be used with pacemakers. HBOT requires ear equalization and has specific contraindications for certain conditions. Red light therapy requires eye protection. Detailed safety manifests are provided in our Support Hub, and our team reviews your health profile before purchase." },
            { q: "How often should I use the systems?", a: "Usage frequency depends on your goals and Bio-Assessment results. For baseline optimization, 3-5 sessions per week are recommended. For targeted recovery or performance enhancement, daily sessions may be appropriate. Our protocol guides provide specific recommendations for each technology." },
            { q: "Can I combine multiple technologies?", a: "Absolutely! In fact, we encourage it. Our Synergy Engine maps how different technologies work together for enhanced results. For example, HBOT and Hydrogen create the ultimate oxidative balance, while PEMF and Red Light accelerate tissue repair. Our Zone Builder tool helps you design optimal protocol stacks." },
        ]
    },
    {
        category: "Products & Purchasing",
        items: [
            { q: "How do I choose the right product?", a: "Use our Zone Builder tool for personalized recommendations based on your wellness goals, health profile, and lifestyle constraints. Our AI assistant can guide initial selection. For complex needs or multiple conditions, schedule a free consultation with our bio-optimization specialists. We don't upsell. We match technology to your specific requirements." },
            { q: "Can I try before buying?", a: "We offer flexible rental programs for most devices, allowing you to validate therapeutic outcomes before committing to ownership. Rental periods start at 2-3 months minimum depending on the device. Rental equity can be applied toward purchase. This approach eliminates buyer's remorse and ensures the technology works for your specific physiology." },
            { q: "What warranty coverage do you provide?", a: "All products include comprehensive warranties: HBOT chambers have 5-year chassis and 2-year electronics coverage; PEMF devices carry 3-year warranties; Red Light panels have 2-year warranties; Hydrogen generators include 2-year coverage. Extended protection plans are available. Our support team handles claims directly, no third-party runarounds." },
            { q: "Is financing available?", a: "Yes. We offer flexible financing and rental plans starting from €149/month for Red Light panels up to €599/month for HBOT chambers. Our rental model means no large upfront investment—just a monthly subscription that includes full support and maintenance. Early termination and upgrade options are available with transparent terms and no hidden fees." },
        ]
    },
    {
        category: "Shipping & Support",
        items: [
            { q: "How long does delivery take?", a: "Poland: 2-5 business days. EU: 5-10 business days. Large items like hyperbaric chambers require freight shipping and typically arrive within 7-14 days. You receive tracking information and delivery coordination calls for all orders. International shipping outside EU available on request." },
            { q: "Do you provide installation and setup?", a: "White-glove delivery and professional installation are included with all HBOT chamber purchases and rental bundles. For other devices, we provide detailed setup guides, video tutorials, and remote configuration support. Our technical team is available for virtual setup assistance if needed." },
            { q: "How do I track my order?", a: "You receive a tracking number via email once your order ships. Check your account dashboard for real-time updates. For large items, our logistics team contacts you directly to schedule delivery windows that work with your schedule." },
            { q: "What is your return policy?", a: "We offer a 30-day satisfaction guarantee on most products. Items must be returned in original condition with all packaging. Restocking fees may apply for certain large items (detailed in product specifications). Rental agreements have their own terms. We don't trap customers in purchases that don't serve them." },
        ]
    },
    {
        category: "Technical & Maintenance",
        items: [
            { q: "Do I need special electrical work?", a: "Most Hylono devices use standard 230V plugs suitable for home outlets. High-pressure HBOT chambers may require a dedicated 16A circuit. Our technical team provides complimentary pre-installation audits to ensure your space is ready before delivery, avoiding surprises on installation day." },
            { q: "What maintenance is required?", a: "Maintenance requirements vary by device: HBOT seals should be inspected monthly; Hydrogen generators require distilled water and periodic membrane checks; Red Light panels need occasional cleaning; PEMF devices are virtually maintenance-free. We offer annual maintenance packages for professional facilities and provide detailed maintenance documentation for all products." },
            { q: "What happens if something breaks?", a: "All devices are covered by warranty for manufacturing defects. Our 24/7 support team can troubleshoot most issues remotely. For hardware problems, we coordinate repair or replacement through our network of certified technicians. Loaner units may be available during extended repairs for critical applications." },
        ]
    },
    {
        category: "For Clinics & Professionals",
        items: [
            { q: "Do you work with clinics and wellness centers?", a: "Yes. We partner with clinics, wellness centers, and healthcare practitioners across Europe. We offer volume pricing, professional installation, staff training protocols, and ongoing technical support. Our clinical partnerships include outcome tracking systems to demonstrate patient results." },
            { q: "What ROI can clinics expect?", a: "ROI varies by utilization and pricing model. Our HBOT chambers typically generate 150-200 EUR per session, with potential monthly revenue of 9,000-18,000 EUR at moderate utilization (60 sessions/month). We provide ROI calculators, business planning support, and marketing materials for professional clients." },
            { q: "Do you offer white-label solutions?", a: "We offer partnership programs for qualified wellness facilities, including co-branded materials, referral programs, and in some cases, white-label device options. Contact our Partnerships team to discuss your specific requirements. We're selective about partnerships to maintain quality standards." },
        ]
    }
];

export const FAQPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openItem, setOpenItem] = useState<string | null>(null);

    const filteredFAQ = FAQ_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            {/* FAQPage Schema for Rich Snippets - P0-3 SEO Fix */}
            <FAQStructuredData faqData={FAQ_DATA} />
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <HelpCircle className="mx-auto mb-4 text-cyan-500" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 futuristic-font">Frequently Asked Questions</h1>
                    <p className="text-slate-500 max-w-xl mx-auto">Find answers to common questions about our bio-optimization technologies, protocols, and services</p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                </div>

                {/* FAQ Accordion */}
                {filteredFAQ.map((category, ci) => (
                    <motion.div
                        key={ci}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: ci * 0.1 }}
                        className="mb-8"
                    >
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{category.category}</h2>
                        <div className="space-y-3">
                            {category.items.map((item, i) => {
                                const itemId = `${ci}-${i}`;
                                const isOpen = openItem === itemId;
                                return (
                                    <div key={item.q} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:border-slate-200 transition-colors">
                                        <button
                                            onClick={() => setOpenItem(isOpen ? null : itemId)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="font-medium text-slate-900">{item.q}</span>
                                            <ChevronDown className={`text-slate-400 ui-transition-fast ${isOpen ? 'rotate-180' : ''}`} size={20} />
                                        </button>
                                        <div className="ui-accordion-grid" data-open={isOpen}>
                                            <div className="px-6 pb-4">
                                                <p className="text-slate-600 text-sm leading-relaxed">
                                                    <SmartText>{item.a}</SmartText>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Still have questions CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white">
                        <MessageCircle className="mx-auto mb-4 opacity-80" size={32} />
                        <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
                        <p className="text-cyan-100 mb-6 text-sm">Our bio-optimization specialists are available 24/7 to help you find the answers you need.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-6 py-3 bg-white text-cyan-600 rounded-xl font-bold text-sm hover:bg-cyan-50 transition-all">
                                Schedule Consultation
                            </button>
                            <button className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold text-sm hover:bg-cyan-700 transition-all border border-cyan-400">
                                Start Live Chat
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
