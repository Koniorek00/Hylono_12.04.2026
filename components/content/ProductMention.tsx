import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TechType } from '../../types';
import { TECH_DETAILS } from '../../constants';
import { useRouter } from 'next/navigation';

type MentionContext = 'article' | 'protocol' | 'recommended';

interface ProductMentionProps {
    productId: TechType;
    context?: MentionContext;
}

const contextLabel: Record<MentionContext, string> = {
    article: 'Device mentioned in this article:',
    protocol: 'Required device:',
    recommended: 'Recommended product:',
};

export const ProductMention: React.FC<ProductMentionProps> = ({ productId, context = 'recommended' }) => {
    const router = useRouter();
    const product = TECH_DETAILS[productId];

    const navigateTo = (path: string) => {
        router.push(`/${path}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-3">{contextLabel[context]}</p>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                    <p className="text-xs text-slate-600 mt-1">
                        Buy: {product.price}
                        {product.rentalPrice ? ` | Rent: from €${product.rentalPrice}/mo` : ''}
                    </p>
                </div>
                <button
                    onClick={() => navigateTo(`product/${product.id}`)}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1"
                    aria-label={`View product ${product.name}`}
                >
                    View product <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};
