import React from 'react';
import { motion } from 'motion/react';
import { Map, ArrowRight } from 'lucide-react';
import { NavigateFunction } from '../types';

interface SitemapPageProps { onNavigate: NavigateFunction; }

const SECTIONS = [
    {
        title: 'Technology & Products',
        links: [
            { label: 'Home', route: 'home' }, { label: 'Store', route: 'store' },
            { label: 'HBOT Chambers Catalog', route: 'chambers' }, { label: 'Hyperbaric Oxygen (HBOT)', route: 'product/HBOT' },
            { label: 'Pulsed EMF (PEMF)', route: 'product/PEMF' }, { label: 'Red Light Therapy (RLT)', route: 'product/RLT' },
            { label: 'Hydrogen Inhalation (H2)', route: 'product/HYDROGEN' }, { label: 'Vagus Nerve Stimulation (VNS)', route: 'product/VNS' },
            { label: 'EWOT Training', route: 'product/EWOT' }, { label: 'Cryotherapy', route: 'product/CRYO' },
            { label: 'Wellness Planner', route: 'builder' }, { label: 'Compare Products', route: 'compare' },
        ]
    },
    {
        title: 'Rental & Financing',
        links: [
            { label: 'Monthly Rental Programme', route: 'rental' },
            { label: 'Rental Checkout', route: 'rental/checkout' },
            { label: 'Financing & Payment Plans', route: 'financing' },
            { label: '30-Day Guarantee', route: 'guarantee' },
        ]
    },
    {
        title: 'Education & Research',
        links: [
            { label: 'Research Hub', route: 'research' }, { label: 'Protocol Explorer', route: 'protocols' },
            { label: 'Learning Center', route: 'learning' }, { label: 'Blog', route: 'blog' },
            { label: 'Health Conditions Library', route: 'conditions' }, { label: 'Video Library', route: 'videos' },
        ]
    },
    {
        title: 'Account & Services',
        links: [
            { label: 'My Account', route: 'account' }, { label: 'Wishlist', route: 'wishlist' },
            { label: 'Warranty Registration', route: 'warranty' }, { label: 'Loyalty Rewards', route: 'rewards' },
            { label: 'Trade-In Programme', route: 'trade-in' }, { label: 'Support', route: 'support' },
        ]
    },
    {
        title: 'Company',
        links: [
            { label: 'About Hylono', route: 'about' }, { label: 'Medical Advisors', route: 'advisors' },
            { label: 'Testimonials', route: 'testimonials' }, { label: 'Press & Media', route: 'press' },
            { label: 'Press Kit', route: 'press-kit' }, { label: 'Careers', route: 'careers' },
            { label: 'Contact', route: 'contact' }, { label: 'FAQ', route: 'faq' },
        ]
    },
    {
        title: 'Partnerships',
        links: [
            { label: 'Partner Portal', route: 'partners' }, { label: 'Find a Centre', route: 'locator' },
            { label: 'Affiliate Program', route: 'affiliate' }, { label: 'Wholesale & B2B', route: 'wholesale' },
            { label: 'Referral Program', route: 'refer' },
        ]
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', route: 'privacy' }, { label: 'Terms of Service', route: 'terms' },
            { label: 'Shipping Policy', route: 'shipping' }, { label: 'Returns & Refunds', route: 'returns' },
            { label: 'Cookie Policy', route: 'cookie-policy' }, { label: 'Health Disclaimer', route: 'disclaimer' },
            { label: 'Accessibility Statement', route: 'accessibility' },
        ]
    },
];

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => (
    <div className="min-h-screen bg-white pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-4">
                    <Map className="text-cyan-500" size={32} />
                    <h1 className="text-4xl font-bold text-slate-900">Sitemap</h1>
                </div>
                <p className="text-slate-500 mb-12 text-sm">A complete directory of all pages on hylono.com.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SECTIONS.map((section, i) => (
                        <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-100 pb-3">{section.title}</h2>
                            <ul className="space-y-2.5">
                                {section.links.map(link => (
                                    <li key={link.route}>
                                        <button
                                            onClick={() => onNavigate(link.route)}
                                            className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-cyan-600 transition-colors group"
                                        >
                                            <ArrowRight size={11} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
);

