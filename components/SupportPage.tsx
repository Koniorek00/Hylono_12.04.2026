import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Phone, Mail, HelpCircle, Shield, FileText, Search, ArrowRight, Clock, Users, Wrench, BookOpen } from 'lucide-react';
import { DeviceScanner } from './support/DeviceScanner';

export const SupportPage: React.FC = () => {
    const [showChat, setShowChat] = useState(false);
    
    const handleCardAction = (actionType: string) => {
        switch (actionType) {
            case 'chat':
                setShowChat(true);
                break;
            case 'phone':
                window.location.assign('tel:+48123456789');
                break;
            case 'email':
                window.location.assign('mailto:support@hylono.com');
                break;
        }
    };

    const contactCards = [
        { icon: <MessageSquare size={24} />, title: 'Live Chat', desc: 'Average response under 5 mins', action: 'Start Chat', color: 'bg-cyan-500', available: true, actionType: 'chat' },
        { icon: <Phone size={24} />, title: 'Priority Phone', desc: 'Mon-Fri, 9am - 6pm CET', action: 'Call Now', color: 'bg-emerald-500', available: true, actionType: 'phone' },
        { icon: <Mail size={24} />, title: 'Email Support', desc: 'Detailed technical queries', action: 'Send Email', color: 'bg-slate-900', available: true, actionType: 'email' },
    ];

    const helpCategories = [
        { title: 'Protocol Setup', desc: 'Initial configuration & optimization guides', icon: BookOpen },
        { title: 'Technical Support', desc: 'Hardware diagnostics & maintenance', icon: Wrench },
        { title: 'Order Management', desc: 'Tracking, returns & modifications', icon: Shield },
        { title: 'Clinical Guidance', desc: 'Contraindications & safety protocols', icon: HelpCircle },
    ];

    const responseMetrics = [
        { label: 'Average Response Time', value: '<4 hours', icon: Clock },
        { label: 'Support Satisfaction', value: '98.7%', icon: Users },
        { label: 'Issues Resolved First Contact', value: '89%', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                {/* Hero Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6"
                    >
                        <Shield size={12} /> Premium Support Included
                    </motion.div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 futuristic-font">
                        Technical Support
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Your regeneration systems require precision support. Our technical team includes 
                        biomedical engineers, protocol specialists, and clinical advisors available around the clock.
                    </p>
                </div>

                {/* Response Metrics */}
                <div className="grid grid-cols-3 gap-6 mb-16">
                    {responseMetrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 text-center"
                        >
                            <metric.icon className="mx-auto mb-3 text-cyan-500" size={20} />
                            <div className="text-2xl font-bold text-slate-900 futuristic-font">{metric.value}</div>
                            <div className="text-xs text-slate-500">{metric.label}</div>
                        </motion.div>
                    ))}
                </div>

                <DeviceScanner />

                {/* Main Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {contactCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${card.color} shadow-lg`}>
                                    {card.icon}
                                </div>
                                {card.available && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Available</span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                            <p className="text-slate-500 text-sm mb-6">{card.desc}</p>
                            <button className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                {card.action}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Resource Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Self-Service Resources</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {helpCategories.map((cat) => (
                                <button key={cat.title} className="p-6 bg-white rounded-2xl border border-slate-100 text-left hover:border-cyan-500 transition-colors group">
                                    <cat.icon className="text-cyan-500 mb-3" size={20} />
                                    <h3 className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                                        {cat.title} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-xs text-slate-400">{cat.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                        <h2 className="text-2xl font-bold mb-6">Enterprise & Clinic Support</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            Operating a clinical facility or wellness center? Our enterprise support tier includes 
                            dedicated account managers, priority response SLAs, and scheduled maintenance programs.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <Phone className="text-cyan-400" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Enterprise Line</p>
                                    <p className="font-mono text-lg">+48 22 000 00 00</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <Mail className="text-emerald-400" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Enterprise Email</p>
                                    <p className="font-sans text-sm underline cursor-pointer">enterprise@hylono.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Quick Links */}
                <div className="mt-20 pt-10 border-t border-slate-200 flex flex-wrap justify-center gap-12 text-sm text-slate-400 uppercase tracking-widest font-bold">
                    <a href="#faq" className="hover:text-cyan-500 flex items-center gap-2">FAQ</a>
                    <a href="#warranty" className="hover:text-cyan-500 flex items-center gap-2">Warranty</a>
                    <a href="#shipping" className="hover:text-cyan-500 flex items-center gap-2">Shipping</a>
                    <a href="#terms" className="hover:text-cyan-500 flex items-center gap-2">Terms</a>
                </div>
            </div>
        </div>
    );
};

