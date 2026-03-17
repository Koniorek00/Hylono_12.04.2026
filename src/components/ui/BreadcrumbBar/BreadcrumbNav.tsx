/**
 * BreadcrumbNav — Left side breadcrumb navigation
 * 
 * Features:
 * - Displays navigation trail (Home > Products > Page)
 * - Responsive (collapses on mobile to show only current page)
 * - Chevron separators between items
 * - Current page styled differently
 * - WCAG compliant with proper aria-current
 */
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link href (optional for current page) */
  href?: string;
  /** Is this the current page? */
  isCurrent?: boolean;
}

export interface BreadcrumbNavProps {
  /** Breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Show home icon instead of "Home" text */
  showHomeIcon?: boolean;
}

const isExternalHref = (href: string): boolean =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  showHomeIcon = true,
}) => {
  // On mobile, show only last 2 items
  const displayItems = items;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <ol className="flex items-center gap-1 text-sm">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isHome = index === 0;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {/* Chevron separator (except for first item) */}
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* Link or current page */}
              {item.isCurrent || isLast ? (
                <span
                  className="text-slate-900 font-medium truncate max-w-[150px] sm:max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (() => {
                const href = item.href ?? '#';
                const commonClasses = `
                  flex items-center gap-1
                  text-slate-600 hover:text-cyan-700
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 rounded
                  ${isHome && showHomeIcon ? 'hidden sm:flex' : ''}
                `;

                const content = isHome && showHomeIcon ? (
                  <Home size={14} aria-hidden="true" />
                ) : (
                  <span className="truncate max-w-[100px]">{item.label}</span>
                );

                return isExternalHref(href) ? (
                  <a href={href} className={commonClasses} {...(isHome && showHomeIcon ? { 'aria-label': item.label } : {})}>
                    {content}
                  </a>
                ) : (
                  <Link href={href} className={commonClasses} {...(isHome && showHomeIcon ? { 'aria-label': item.label } : {})}>
                    {content}
                  </Link>
                );
              })()}

              {/* Home text on desktop */}
              {isHome && showHomeIcon && !item.isCurrent && (
                <span className="hidden sm:inline text-slate-600 truncate max-w-[100px]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;