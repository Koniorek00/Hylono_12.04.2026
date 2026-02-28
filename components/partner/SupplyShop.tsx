import React from 'react';
import { PartnerLayout } from './PartnerLayout';
import { ShoppingBag, Clock } from 'lucide-react';

export const SupplyShop: React.FC = () => (
    <PartnerLayout title="Supply Shop">
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Supply Shop — Coming Soon</h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Reorder consumables, accessories, and upgrade components directly from your partner dashboard. Group pricing and priority fulfilment for active partners.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                In development
            </div>
        </div>
    </PartnerLayout>
);

export default SupplyShop;
