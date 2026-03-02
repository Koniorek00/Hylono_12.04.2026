"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Hexagon, Users, Target, Heart, Award, Globe } from 'lucide-react';
import { SmartText } from './SmartText';

export const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-24">
            <div className="max-w-5xl mx-auto px-6">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                            <Hexagon className="text-white" size={32} />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">About Hylono</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Where Mind Connects with Matter. We are pioneering the future of non-invasive regeneration technology.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-24"
                >
                    <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Target className="text-cyan-500" /> Our Mission
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Hylono exists to democratize access to elite bio-optimization technology. We believe that the tools
                            for human regeneration should not be locked behind institutional walls or reserved for the privileged few.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            <SmartText>
                                Through rigorous filtration of global innovation, protocol-based wellness design, and transparent
                                education, we empower individuals and businesses to architect their own regeneration journey.
                            </SmartText>
                        </p>
                    </div>
                </motion.section>

                {/* Values */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-24"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Award, title: "Verified Trust", desc: "Every product undergoes rigorous vetting. We only offer what we would use ourselves." },
                            { icon: Heart, title: "Human-First", desc: "Technology is the vessel, but human wellbeing is the destination." },
                            { icon: Globe, title: "Accessibility", desc: "Elite tech democratization. Making advanced regeneration accessible to all." },
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
                                <value.icon className="mx-auto mb-4 text-cyan-500" size={32} />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                <p className="text-slate-500 text-sm"><SmartText>{value.desc}</SmartText></p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center flex items-center justify-center gap-3">
                        <Users className="text-purple-500" /> The Team
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { name: "Founder & CEO", role: "Protocol Architect", bio: "Pioneering the intersection of consciousness and technology." },
                            { name: "CTO", role: "Systems Engineer", bio: "Building the infrastructure for human optimization." },
                        ].map((member, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                    <Users className="text-slate-500" size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                                    <p className="text-cyan-600 text-sm font-medium mb-2">{member.role}</p>
                                    <p className="text-slate-500 text-sm"><SmartText>{member.bio}</SmartText></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

