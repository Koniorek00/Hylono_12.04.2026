import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-bold text-[20px] tracking-widest">HYLONO</span>
                        </div>
                        <p className="font-[var(--font-accent)] italic text-[14px] text-white/50 mb-4">
                            Where Mind Connects With Matter
                        </p>
                        <p className="text-[13px] text-white/40 leading-relaxed">
                            Europe's trusted access layer for non-invasive regeneration technology.
                        </p>
                    </div>

                    {[
                        { title: "Ecosystem", links: ["Oxygen (mHBOT)", "Hydrogen", "Light (RLT)", "Signal (PEMF)", "Protocol Builder"] },
                        { title: "Access", links: ["Rental Programs", "Subscriptions", "Professional Deployment", "Pricing"] },
                        { title: "Company", links: ["About Hylono", "Trust & Standards", "Research", "Journal", "Contact"] }
                    ].map((col, idx) => (
                        <div key={idx} className="col-span-1">
                            <h4 className="text-[13px] uppercase tracking-widest font-semibold text-white/50 mb-6">{col.title}</h4>
                            <ul className="space-y-2">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-[14px] text-white/70 hover:text-white transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Connect */}
                    <div className="col-span-1">
                        <h4 className="text-[13px] uppercase tracking-widest font-semibold text-white/50 mb-6">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="text-white/70 hover:text-white">LinkedIn</a>
                            <a href="#" className="text-white/70 hover:text-white">Instagram</a>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#2A2A2A] rounded-md py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#0A6E6E]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3EDFD7] text-xl">→</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#333333] pt-8 flex flex-col md:flex-row justify-between items-center text-[12px] text-white/30">
                    <p>© 2025 Hylono. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white/60">Privacy Policy</a>
                        <a href="#" className="hover:text-white/60">Terms of Service</a>
                        <a href="#" className="hover:text-white/60">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
