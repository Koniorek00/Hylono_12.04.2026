import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ContentBlock } from './ContentBlock';
import { useRouter } from 'next/navigation';

interface BuilderCTAProps {
    goal?: string;
}

export const BuilderCTA: React.FC<BuilderCTAProps> = ({ goal }) => {
    const router = useRouter();
    const path = goal ? `builder?goal=${goal}` : 'builder';

    const navigateTo = (targetPath: string) => {
        router.push(`/${targetPath}`);
        window.scrollTo(0, 0);
    };

    return (
        <ContentBlock highlight>
            <p className="font-semibold text-slate-900 text-sm">Want to put this into practice?</p>
            <p className="text-xs text-slate-600 mt-1">Configure your regeneration stack.</p>
            <button
                onClick={() => navigateTo(path)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:text-cyan-800"
                aria-label="Open wellness configurator"
            >
                Open configurator <ArrowRight size={12} />
            </button>
        </ContentBlock>
    );
};
