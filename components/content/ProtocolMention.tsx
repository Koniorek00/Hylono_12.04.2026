import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROTOCOL_REGISTRY } from '../../constants/protocols';
import { ContentBlock } from './ContentBlock';
import { useRouter } from 'next/navigation';

interface ProtocolMentionProps {
    protocolSlug: string;
}

export const ProtocolMention: React.FC<ProtocolMentionProps> = ({ protocolSlug }) => {
    const router = useRouter();
    const protocol = PROTOCOL_REGISTRY[protocolSlug];
    if (!protocol) return null;

    const navigateTo = (path: string) => {
        router.push(`/${path}`);
        window.scrollTo(0, 0);
    };

    return (
        <ContentBlock>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Related protocol:</p>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-bold text-slate-900 text-sm">{protocol.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{protocol.goals[0]}</span>
                        <span>{protocol.estimatedTotalTime} min/day</span>
                        <span>{protocol.stackCoherence >= 95 ? 'Advanced' : 'Intermediate'}</span>
                    </div>
                </div>
                <button
                    onClick={() => navigateTo('protocols')}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
                    aria-label={`View protocol ${protocol.name}`}
                >
                    View protocol <ArrowRight size={12} />
                </button>
            </div>
        </ContentBlock>
    );
};
