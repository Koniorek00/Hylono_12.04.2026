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
  const displayItems = items;

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center">
      <ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0 text-sm leading-tight">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isHome = index === 0;
          const hideOnMobile = index < displayItems.length - 2;

          return (
            <li
              key={item.label}
              className={`${hideOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'} min-w-0 max-w-full items-center gap-1.5 align-middle`}
            >
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="shrink-0 text-slate-400"
                  aria-hidden="true"
                />
              )}

              {item.isCurrent || isLast ? (
                <span
                  className="inline-flex min-w-0 max-w-full items-center rounded-md px-1 py-0.5 font-medium text-slate-900"
                  aria-current="page"
                  title={item.label}
                >
                  <span className="max-w-full whitespace-normal break-words">{item.label}</span>
                </span>
              ) : (() => {
                const href = item.href ?? '#';
                const commonClasses = `
                  inline-flex min-w-0 max-w-full items-center gap-1
                  rounded-md px-1 py-0.5
                  text-slate-600 hover:text-cyan-700
                  transition-colors duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2
                `;

                const content = (
                  <>
                    {isHome && showHomeIcon ? <Home size={14} aria-hidden="true" /> : null}
                    <span className="max-w-full whitespace-normal break-words" title={item.label}>
                      {item.label}
                    </span>
                  </>
                );

                return isExternalHref(href) ? (
                  <a
                    href={href}
                    className={commonClasses}
                    {...(isHome && showHomeIcon ? { 'aria-label': item.label } : {})}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className={commonClasses}
                    {...(isHome && showHomeIcon ? { 'aria-label': item.label } : {})}
                  >
                    {content}
                  </Link>
                );
              })()}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
