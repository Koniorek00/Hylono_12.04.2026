import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Users, Target, Heart, Award, Globe, Sparkles, Shield, Zap, Star, BookOpen, Microscope, Leaf, ArrowRight } from 'lucide-react';
import { SmartText } from './SmartText';
// P2-1 SEO Fix: Person schema for E-E-A-T compliance
import { TeamStructuredData, PersonData } from './StructuredData';

// P2-1: Team member data for Person schema (E-E-A-T compliance)
// Note: Professional headshots to be added by visual-asset-director
const TEAM_MEMBERS: PersonData[] = [
    {
        name: "Dr. Elena Vasquez, MD, PhD",
        role: "Founder & CEO",
        bio: "Dr. Vasquez brings over 15 years of clinical experience in regenerative medicine and interventional cardiology. After witnessing the limitations of conventional treatments, she dedicated her career to making non-invasive bio-optimization accessible to everyone. She holds dual board certifications and has published 40+ peer-reviewed studies on mitochondrial health and hyperbaric oxygen therapy.",
        expertise: ["Regenerative Medicine", "Mitochondrial Biology", "Clinical Protocol Design", "Hyperbaric Medicine"],
        image: "/images/team/elena-vasquez.jpg",
        sameAs: ["https://www.linkedin.com/in/drelenavasquez"]
    },
    {
        name: "Marcus Chen, MSc",
        role: "Chief Technology Officer",
        bio: "Marcus is a biomedical engineer with deep expertise in medical device development and IoT systems. Previously leading hardware engineering at a Fortune 500 medical device company, he architected Hylono's precision delivery systems ensuring therapeutic accuracy across all modalities. He holds multiple patents in biofeedback integration.",
        expertise: ["Medical Device Engineering", "IoT Systems", "Biofeedback Integration", "Regulatory Compliance"],
        image: "/images/team/marcus-chen.jpg",
        sameAs: ["https://www.linkedin.com/in/marcuschen"]
    }
];

export const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            {/* P2-1: Person schema for E-E-A-T compliance */}
            <TeamStructuredData team={TEAM_MEMBERS} />
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
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 futuristic-font tracking-tight">About Hylono</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Where <span className="font-semibold text-cyan-600">Mind</span> Connects with <span className="font-semibold text-purple-600">Matter</span>. 
                        We are pioneering the future of non-invasive regeneration technology—making elite bio-optimization accessible to everyone.
                    </p>
                </motion.div>

                {/* Origin Story */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-24"
                >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="text-cyan-400" size={28} />
                                <h2 className="text-3xl font-bold futuristic-font">Our Origin</h2>
                            </div>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Hylono emerged from a critical observation: the most potent regeneration technologies on Earth were 
                                locked behind clinical walls, accessible only to elite athletes, celebrities, and specialized medical facilities. 
                                We recognized a fundamental market failure—<span className="text-cyan-400 font-medium">technology without access is just potential, not progress.</span>
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Founded in Warsaw, Poland, we engineered a new model: research-grade bio-optimization technology, 
                                delivered with clinical-level protocol support, for home and professional use. No gatekeepers. No inflated clinic markups. 
                                Just verified technology and the expertise to use it effectively.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                Our name, <span className="font-semibold text-white">Hylono</span>, represents 
                                the convergence of <span className="text-purple-400">hyle</span> (matter) and <span className="text-cyan-400">nous</span> (mind)—the 
                                fundamental principle that drives everything we do. Technology is the vessel. Protocol is the cure.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-24"
                >
                    <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3 futuristic-font">
                            <Target className="text-cyan-500" /> Our Mission
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Hylono exists to dismantle the barriers between cutting-edge bio-optimization technology and the individuals 
                            who need it. We reject the model where regeneration tools are locked behind institutional gatekeepers, 
                            inflated pricing, and fragmented information. Our mission is straightforward: <span className="font-semibold text-slate-800">deliver research-grade technology with the protocol expertise to use it effectively.</span>
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed mb-8">
                            <SmartText>
                                We don't just sell hardware. We engineer complete regeneration systems—combining FDA-cleared devices, 
                                evidence-based protocols, and ongoing clinical support. Every product is vetted against published research. 
                                Every protocol is derived from therapeutic outcomes. Every client receives the education to optimize independently.
                            </SmartText>
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Microscope, label: "Research-Backed", value: "87+", subtext: "Peer-reviewed studies analyzed" },
                                { icon: Users, label: "Community", value: "2,500+", subtext: "Active bio-optimizers" },
                                { icon: Globe, label: "Reach", value: "15+", subtext: "Countries served" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center p-6 bg-slate-50 rounded-2xl">
                                    <stat.icon className="mx-auto mb-3 text-cyan-500" size={24} />
                                    <div className="text-3xl font-bold text-slate-900 futuristic-font">{stat.value}</div>
                                    <div className="text-sm text-slate-500">{stat.subtext}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Values */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-24"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center futuristic-font">Operating Principles</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { icon: Award, title: "Evidence Over Marketing", desc: "Every product undergoes rigorous vetting against peer-reviewed clinical evidence. We reject the wellness industry's tendency toward unsubstantiated claims. If the research doesn't support it, we don't sell it. Our team personally tests every technology before it reaches our catalog.", color: "text-yellow-600", bg: "bg-yellow-50" },
                            { icon: Heart, title: "Protocol-First Architecture", desc: "Hardware is the vessel. Protocol is the cure. We design complete systems around your biology, not the other way around. Every device includes structured protocols, timing optimization, and synergy mapping. Technology without methodology is just expensive furniture.", color: "text-rose-600", bg: "bg-rose-50" },
                            { icon: Globe, title: "Democratized Access", desc: "Elite technology shouldn't require elite resources. Through flexible rental programs, financing options, and transparent pricing, we remove the barriers to entry. No hidden fees. No inflated clinic markups. Direct-to-consumer pricing with professional-grade support.", color: "text-cyan-600", bg: "bg-cyan-50" },
                            { icon: BookOpen, title: "Radical Transparency", desc: "We believe informed users make better decisions. That's why we publish both simplified explanations and deep scientific documentation—including contraindications, limitations, and realistic expectations. We'd rather lose a sale than mislead a customer.", color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((value) => (
                            <div key={value.title} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all group">
                                <div className={`w-14 h-14 ${value.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <value.icon className={value.color} size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 futuristic-font">{value.title}</h3>
                                <p className="text-slate-500 leading-relaxed"><SmartText>{value.desc}</SmartText></p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* The Hylono Difference */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mb-24"
                >
                    <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-3xl p-12 border border-cyan-100">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center futuristic-font">The Hylono Difference</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { icon: Shield, title: "Protocol-Based Approach", desc: "Hardware is just the beginning. We provide structured protocols that maximize therapeutic outcomes through precise timing, sequencing, and synergy optimization." },
                                { icon: Zap, title: "Synergy Science", desc: "Our technologies are designed to work together. HBOT + PEMF, Red Light + Hydrogen—we map the molecular pathways to amplify your results exponentially." },
                                { icon: Star, title: "Concierge Support", desc: "From initial consultation to ongoing optimization, our team of bio-optimization specialists guides your journey with personalized recommendations and 24/7 support." },
                            ].map((item) => (
                                <div key={item.title} className="text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <item.icon className="text-cyan-600" size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 futuristic-font">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-24"
                >
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center flex items-center justify-center gap-3 futuristic-font">
                        <Users className="text-purple-500" /> The Team
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {[
                            { name: "Founder & CEO", role: "Protocol Architect", bio: "With a background in biomedical engineering and a passion for human potential, our founder spent years researching regeneration technologies in clinical settings before realizing these tools needed to reach everyday people.", expertise: ["Protocol Design", "Clinical Research", "Bio-hacking"] },
                            { name: "Chief Technology Officer", role: "Systems Engineer", bio: "Building the infrastructure for human optimization. Our CTO brings deep expertise in medical device integration and data systems, ensuring every Hylono product delivers precise, measurable outcomes.", expertise: ["Medical Devices", "IoT Systems", "Data Analytics"] },
                        ].map((member) => (
                            <div key={member.name} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Users className="text-slate-500" size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 futuristic-font">{member.name}</h3>
                                        <p className="text-cyan-600 text-sm font-medium mb-3">{member.role}</p>
                                        <p className="text-slate-500 text-sm mb-4 leading-relaxed"><SmartText>{member.bio}</SmartText></p>
                                        <div className="flex flex-wrap gap-2">
                                            {member.expertise.map((skill) => (
                                                <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-slate-500 mb-4">Our extended team includes medical advisors, research scientists, and wellness practitioners.</p>
                        <button className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors">
                            Meet Our Advisors <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.section>

                {/* Certifications & Partnerships */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-24"
                >
                    <div className="bg-white rounded-3xl p-12 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center futuristic-font">Certifications & Standards</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: "FDA Cleared Devices", icon: Shield },
                                { label: "CE Marking", icon: Award },
                                { label: "ISO 13485", icon: Star },
                                { label: "HSA/FSA Eligible", icon: Heart },
                            ].map((cert) => (
                                <div key={cert.label} className="text-center p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <cert.icon className="mx-auto mb-3 text-emerald-600" size={28} />
                                    <span className="text-sm font-medium text-slate-700">{cert.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* CTA */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4 futuristic-font">Ready to Begin Your Journey?</h2>
                        <p className="text-cyan-100 mb-8 max-w-xl mx-auto">
                            Join thousands of individuals who have taken control of their regeneration. 
                            Start with a consultation or explore our technology ecosystem.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-cyan-600 rounded-2xl font-bold hover:bg-cyan-50 transition-all shadow-lg">
                                Schedule Consultation
                            </button>
                            <button className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-700 transition-all border border-cyan-400">
                                Explore Products
                            </button>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};
