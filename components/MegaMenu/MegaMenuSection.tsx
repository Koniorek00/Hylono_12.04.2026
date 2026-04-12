import React from 'react';
import Link from 'next/link';
import { MenuContext, TECH_COLOR_MAP } from './MegaMenuData';

const isInternalHref = (href: string): boolean => href.startsWith('/') && !href.startsWith('//');

export const SectionHeader = React.memo(({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) => (
    <div className={`flex items-center gap-3 select-none opacity-70`}>
        <span className={`${color}`}>{icon}</span>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 futuristic-font">
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
        className: "group relative p-4 rounded-2xl cursor-pointer border whitespace-nowrap",
        style: {
            transition: 'border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1), background-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            borderColor: isActive ? colors.activeBorder : 'rgba(255,255,255,0.08)',
        } as React.CSSProperties
    };

    const content = (
        <>
            <div className="flex items-center gap-4 flex-nowrap">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105"
                    style={{
                        transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1), background-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1), color 200ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                        backgroundColor: colors.iconDefaultBg,
                        color: colors.iconDefaultText,
                        boxShadow: isActive ? `inset 0 0 20px ${colors.iconDefaultText}40` : 'none',
                    }}
                >
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
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
                        className="text-lg font-bold futuristic-font"
                        style={{
                            transition: 'color 200ms',
                            color: isActive ? '#fff' : '#e2e8f0',
                        }}
                    >
                        {title}
                    </div>
                </div>
            </div>

        </>
    );

    // Internal routes use Next.js Link. External/hash/mailto/tel keep anchor semantics.
    if (href) {
        if (isInternalHref(href)) {
            return (
                <Link href={href} onClick={onClick} {...commonProps}>
                    {content}
                </Link>
            );
        }

        return (
            <a href={href} onClick={onClick} {...commonProps}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} {...commonProps}>
            {content}
        </button>
    );
});
TechHoloCard.displayName = 'TechHoloCard';

export const GlassLink = React.memo(({ icon, title, sub, onClick, onHover, dimmed, color = "text-indigo-400", bg = "bg-indigo-400/10", href }: {
    icon: React.ReactNode;
    title: string;
    sub: string;
    onClick: () => void;
    onHover: () => void;
    dimmed: boolean;
    color?: string;
    bg?: string;
    /** SEO: Proper href for crawlability (P0-4 Fix) */
    href?: string;
}) => {
    const commonProps = {
        onMouseEnter: onHover,
        className: `w-full flex items-center gap-4 rounded-xl border p-3.5 text-left transition-[background-color,border-color,opacity,filter] duration-200 group 
            ${dimmed
                ? 'opacity-40 grayscale border-transparent bg-transparent'
                : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.08] opacity-100'
            }
        `
    };

    // Internal routes use Next.js Link. External/hash/mailto/tel keep anchor semantics.
    if (href) {
        if (isInternalHref(href)) {
            return (
                <Link
                    href={href}
                    onClick={onClick}
                    {...commonProps}
                >
                    <div className={`rounded-lg bg-white/5 p-2.5 transition-[background-color,color,box-shadow] duration-200
                        ${dimmed ? 'text-slate-500' : `${color} ${bg}`}
                    `}>
                        {icon}
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors futuristic-font">{title}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
                    </div>

                </Link>
            );
        }

        return (
            <a
                href={href}
                onClick={onClick}
                {...commonProps}
            >
                <div className={`rounded-lg bg-white/5 p-2.5 transition-[background-color,color,box-shadow] duration-200
                    ${dimmed ? 'text-slate-500' : `${color} ${bg}`}
                `}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors futuristic-font">{title}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
                </div>

            </a>
        );
    }

    // Fallback to button for non-navigation actions
    return (
        <button
            type="button"
            onClick={onClick}
            {...commonProps}
        >
            <div className={`rounded-lg bg-white/5 p-2.5 transition-[background-color,color,box-shadow] duration-200
                ${dimmed ? 'text-slate-500' : `${color} ${bg}`}
            `}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors futuristic-font">{title}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-slate-400 transition-colors">{sub}</div>
            </div>

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
        className: "block py-1 text-left text-sm font-medium uppercase tracking-widest text-slate-500 transition-[color,transform] duration-300 hover:translate-x-2 hover:text-white futuristic-font"
    };

    // Internal routes use Next.js Link. External/hash/mailto/tel keep anchor semantics.
    if (href) {
        if (isInternalHref(href)) {
            return (
                <Link href={href} onClick={onClick} {...commonProps}>
                    {label}
                </Link>
            );
        }

        return (
            <a href={href} onClick={onClick} {...commonProps}>
                {label}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} {...commonProps}>
            {label}
        </button>
    );
});
SimpleLink.displayName = 'SimpleLink';
