import React, { useState } from 'react';
import { Layout } from '@/src/components/hero-4.6t/Layout';
import { Navbar } from '@/src/components/hero-4.6t/Navbar';
import { HeroSection } from '@/src/components/hero-4.6t/HeroSection';
import { ProblemSection } from '@/src/components/hero-4.6t/ProblemSection';
import { EcosystemSection } from '@/src/components/hero-4.6t/EcosystemSection';
import { AccessSection } from '@/src/components/hero-4.6t/AccessSection';
import { TrustSection } from '@/src/components/hero-4.6t/TrustSection';
import { VisionSection } from '@/src/components/hero-4.6t/VisionSection';
import { CTASection } from '@/src/components/hero-4.6t/CTASection';
import { Footer } from '@/src/components/hero-4.6t/Footer';
import { VersionSelector } from '@/src/components/hero-4.6t/VersionSelector';

export default function Hero46TPage() {
    const [version, setVersion] = useState('v1');

    return (
        <Layout>
            <VersionSelector currentVersion={version} onVersionChange={setVersion} />
            <Navbar />
            <main>
                <HeroSection />
                <ProblemSection />
                <EcosystemSection />
                <AccessSection />
                <TrustSection />
                <VisionSection />
                <CTASection />
            </main>
            <Footer />
        </Layout>
    );
}
