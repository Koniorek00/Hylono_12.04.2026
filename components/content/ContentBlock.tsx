import React from 'react';

interface ContentBlockProps {
    children: React.ReactNode;
    highlight?: boolean;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ children, highlight = false }) => {
    return (
        <div className={`rounded-2xl border p-4 ${highlight ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-slate-200'}`}>
            {children}
        </div>
    );
};
