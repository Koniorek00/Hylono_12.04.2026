import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Zap, Globe, Users, MapPin, Clock, ArrowRight } from 'lucide-react';

export const CareersPage: React.FC = () => {
    const perks = [
        { icon: <Heart />, title: 'Health First', desc: 'Free access to all Hylono technologies' },
        { icon: <Globe />, title: 'Remote-Friendly', desc: 'Work from anywhere in the EU' },
        { icon: <Zap />, title: 'Fast-Growing', desc: 'Join a rapidly scaling startup' },
        { icon: <Users />, title: 'Amazing Team', desc: 'Passionate, mission-driven people' },
    ];

    const openPositions = [
        { title: 'Senior React Developer', dept: 'Engineering', location: 'Remote / Warsaw', type: 'Full-time' },
        { title: 'Customer Success Manager', dept: 'Support', location: 'Warsaw', type: 'Full-time' },
        { title: 'Technical Sales Specialist', dept: 'Sales', location: 'Remote', type: 'Full-time' },
        { title: 'Content Marketing Manager', dept: 'Marketing', location: 'Remote', type: 'Full-time' },
        { title: 'Biomedical Engineer', dept: 'R&D', location: 'Warsaw', type: 'Full-time' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <Briefcase className="mx-auto text-cyan-500 mb-4" size={48} />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Join Our Team</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Help us democratize access to bio-optimization technology.
                        We're building the future of wellness.
                    </p>
                </div>

                {/* Culture Section */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 text-white mb-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-white/90 leading-relaxed">
                            At Hylono, we believe everyone deserves access to technology that enhances
                            human potential. We're not just selling equipment—we're reshaping how people
                            approach their health and performance.
                        </p>
                    </div>
                </div>

                {/* Perks */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why Hylono</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {perks.map((perk, i) => (
                        <motion.div
                            key={perk.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl p-6 text-center shadow-sm"
                        >
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-600">
                                {perk.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{perk.title}</h3>
                            <p className="text-xs text-slate-500">{perk.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions</h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
                    {openPositions.map((job, i) => (
                        <div
                            key={job.title}
                            className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${i < openPositions.length - 1 ? 'border-b border-slate-100' : ''
                                }`}
                        >
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <span>{job.dept}</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {job.type}
                                    </span>
                                </div>
                            </div>
                            <ArrowRight className="text-cyan-500" size={20} />
                        </div>
                    ))}
                </div>

                {/* No Fit? */}
                <div className="bg-slate-100 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Don't see your role?</h2>
                    <p className="text-slate-600 mb-6">
                        We're always looking for talented people. Send us your CV and tell us how you can contribute.
                    </p>
                    <a
                        href="mailto:careers@hylono.com"
                        className="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        careers@hylono.com
                    </a>
                </div>
            </div>
        </div>
    );
};
