import React, { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { MenuContext, TECH_COLOR_MAP } from './MegaMenuData';

export const SectionHeader = React.memo(({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
    <div className={`flex items-center gap-3 select-none opacity-70`}>
        <span className={`${color}`}>{icon}</span>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">
            {title}
        </h3>
    </div>
));
SectionHeader.displayName = 'SectionHeader';

export const TechHoloCard = React.memo(({ context, title, subtitle, icon, activeContext, onHover, onClick, color, href }: {
    context: MenuContext;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    activeContext: MenuContext;
    onHover: (ctx: MenuContext) => void;
    onClick: () => void;
    color: string;
    /** SEO: Proper href for crawlability (P0-4 Fix) */
    href?: string;
}) => {
    const isActive = activeContext === context;
    const colors = TECH_COLOR_MAP[color];

    const commonProps = {
        onMouseEnter: () => onHover(context),
        role: "menuitem" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } },
        className: "group relative p-4 rounded-2xl cursor-pointer overflow-hidden border",
        style: {
            transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            backgroundColor: isActive ? colors.activeBg : 'rgba(255,255,255,0.03)',
            borderColor: isActive ? colors.activeBorder : 'rgba(255,255,255,0.05)',
            boxShadow: isActive ? colors.activeShadow : 'none',
            willChange: 'background-color, border-color, box-shadow',
        } as React.CSSProperties
    };

    const content = (
        <>
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                style={{
                    transition: 'opacity 500ms',
                    background: `linear-gradient(to right, transparent, ${colors.shimmer}, transparent)`,
                }}
            />

            <div className="flex items-center gap-4 relative z-10">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                        backgroundColor: isActive ? colors.iconActiveBg : colors.iconDefaultBg,
                        color: isActive ? '#000' : colors.iconDefaultText,
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isActive ? colors.iconActiveShadow : 'none',
                        opacity: isActive ? 1 : 0.8,
                        willChange: 'transform',
                    }}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <div
                        className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                        style={{
                            transition: 'color 200ms',
                            color: isActive ? colors.subtitleActive : colors.subtitleDefault,
                        }}
                    >
                        {subtitle}
                    </div>
                    <div
                        className="text-lg font-bold"
                        style={{
                            transition: 'color 200ms',
                            color: isActive ? '#fff' : '#e2e8f0',
                        }}
                    >
                        {title}
                    </div>
                </div>
            </div>

            <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{
                    transition: 'all 200ms',
                    backgroundColor: isActive ? colors.barActive : 'rgba(255,255,255,0.1)',
                    opacity: isActive ? 1 : 0.5,
                }}
            />

            <ArrowRight
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{
                    transition: 'all 200ms',
                    opacity: isActive ? 1 : 0.2,
                    color: isActive ? colors.arrowActive : '#64748b',
                    transform: `translateY(-50%) translateX(${isActive ? '0' : '-8px'})`,
                }}
            />
        </>
    );

    // Use <a> tag when href is provided for SEO crawlability
    if (href) {
        return (
            <a href={href} onClick={onClick} {...commonProps}>
                {content}
            </a>
        );
    }

    return (
        <div onClick={onClick} {...commonProps}>
            {content}
        </div>
    );
});
TechHoloCard.displayName = 'TechHoloCard';

export const GlassLink = React.memo(({ icon, title, sub, onClick, onHover, dimmed, color = "text-indigo-400", glow = "shadow-[0_0_15px_rgba(99,102,241,0.8)]", bg = "bg-indigo-400/10", href }: {
    icon: React.ReactNode;
    title: string;
    sub: string;
    onClick: () => void;
    onHover: () => void;
    dimmed: boolean;
    color?: string;
    glow?: string;
    bg?: string;
    /** SEO: Proper href for crawlability (P0-4 Fix) */
    href?: string;
}) => {
    const commonProps = {
        onMouseEnter: onHover,
        role: "menuitem" as const,
        className: `w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group text-left border 
            ${dimmed
                ? 'opacity-40 grayscale border-transparent bg-transparent'
                : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.08] opacity-100'
            }
        `
    };

    // Use <a> tag when href is provided for SEO crawlability
    if (href) {
        return (
            <a
                href={href}
                onClick={onClick}
                {...commonProps}
            >
                <div className={`p-2.5 rounded-lg transition-all
                    ${dimmed ? 'bg-white/5 text-slate-500' : `bg-white/5 ${color} ${bg}`}
                `}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{title}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
                </div>

                {!dimmed && (
                    <div className={`text-slate-600 group-hover:${color} transition-colors opacity-50 group-hover:opacity-100`}>
                        <ArrowRight size={14} />
                    </div>
                )}
            </a>
        );
    }

    // Fallback to button for non-navigation actions
    return (
        <button
            onClick={onClick}
            {...commonProps}
        >
            <div className={`p-2.5 rounded-lg transition-all
                ${dimmed ? 'bg-white/5 text-slate-500' : `bg-white/5 ${color} ${bg}`}
            `}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{title}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
            </div>

            {!dimmed && (
                <div className={`text-slate-600 group-hover:${color} transition-colors opacity-50 group-hover:opacity-100`}>
                    <ArrowRight size={14} />
                </div>
            )}
        </button>
    );
});
GlassLink.displayName = 'GlassLink';

export const SimpleLink = React.memo(({ label, onClick, onHover, href }: {
    label: string;
    onClick: () => void;
    onHover: () => void;
    /** SEO: Proper href for crawlability (P0-4 Fix) */
    href?: string;
}) => {
    const commonProps = {
        onMouseEnter: onHover,
        role: "menuitem" as const,
        className: "block text-sm font-medium text-slate-500 hover:text-white transition-all text-left uppercase tracking-widest hover:translate-x-2 duration-300 py-1"
    };

    // Use <a> tag when href is provided for SEO crawlability
    if (href) {
        return (
            <a href={href} onClick={onClick} {...commonProps}>
                {label}
            </a>
        );
    }

    return (
        <button onClick={onClick} {...commonProps}>
            {label}
        </button>
    );
});
SimpleLink.displayName = 'SimpleLink';
