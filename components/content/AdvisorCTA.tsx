import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ContentBlock } from './ContentBlock';
import { useRouter } from 'next/navigation';

export const AdvisorCTA: React.FC = () => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(`/${path}`);
        window.scrollTo(0, 0);
    };

    return (
        <ContentBlock>
            <p className="font-semibold text-slate-900 text-sm">Have questions?</p>
            <p className="text-xs text-slate-600 mt-1">Talk to our advisor.</p>
            <button
                onClick={() => navigateTo('advisors')}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                aria-label="Book a free consultation with advisor"
            >
                Book a free consultation <ArrowRight size={12} />
            </button>
        </ContentBlock>
    );
};
