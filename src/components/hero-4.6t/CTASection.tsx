import React from 'react';

export const CTASection: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-[#0A6E6E] to-[#3EDFD7] py-[100px] text-center">
            <div className="max-w-[1200px] mx-auto px-6">
                <h2 className="text-[40px] font-bold text-white mb-6">Begin Your Regeneration Protocol.</h2>
                <p className="text-[17px] text-white/80 max-w-[500px] mx-auto mb-10 leading-relaxed">
                    Whether you are an individual optimizing your biology or a professional expanding your practice — your access point starts here.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-8 py-4 rounded-xl bg-white text-[#0A6E6E] font-semibold text-[15px] shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        Explore for Individuals
                    </button>
                    <button className="px-8 py-4 rounded-xl border-2 border-white text-white font-semibold text-[15px] hover:bg-white/10 transition-all">
                        Solutions for Professionals
                    </button>
                </div>
            </div>
        </section>
    );
};
