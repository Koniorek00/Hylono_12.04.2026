import React from 'react';

export const TrustSection: React.FC = () => {
    return (
        <section className="bg-[#FAFAF7] pt-[120px]">
            <div className="max-w-[1200px] mx-auto px-6 mb-20 text-center">
                <div className="inline-block px-3 py-1 mb-6 border border-[#C9A84C] rounded-full">
                    <span className="text-[12px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold">Trust & Standards</span>
                </div>
                <h2 className="text-[40px] font-bold text-[#1A1A1A] mb-6">The Standard Others Will Follow.</h2>
                <p className="text-[17px] text-[#6B6B60] max-w-[560px] mx-auto leading-[1.6]">
                    Every device in the Hylono ecosystem passes a rigorous multi-stage verification process. We do not sell hope. We provide validated, deployable regeneration pathways.
                </p>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                <TrustPillar num="01" title="Hardware Verification" desc="Every device is tested against clinical performance benchmarks." />
                <TrustPillar num="02" title="Protocol Validation" desc="Usage protocols are designed around published research." />
                <TrustPillar num="03" title="Safety Compliance" desc="Full CE marking, EMC testing, and user safety documentation." />
                <TrustPillar num="04" title="Ongoing Monitoring" desc="Post-deployment performance tracking ensures sustained quality." />
            </div>

            {/* Compliance Band */}
            <div className="bg-[#F5F4EF] py-12">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <p className="text-[14px] text-[#6B6B60] mb-8">Compliance frameworks we align with:</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {["CE", "ISO 13485", "Safety Verified", "Hylono Certified"].map((badge, i) => (
                            <div key={i} className="h-10 px-6 bg-[#E0DED6] rounded flex items-center justify-center text-[#6B6B60] font-bold text-sm">
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const TrustPillar = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
    <div className="flex flex-col items-center text-center">
        <div className="text-[72px] font-[var(--font-headline)] font-light text-transparent mb-4"
            style={{ WebkitTextStroke: "1px #C9A84C" }}>
            {num}
        </div>
        <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-3">{title}</h3>
        <p className="text-[14px] text-[#6B6B60] leading-relaxed">{desc}</p>
    </div>
);
