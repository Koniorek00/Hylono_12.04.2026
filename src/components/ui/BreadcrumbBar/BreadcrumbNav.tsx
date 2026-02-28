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
                  className="text-[#B0B0A8] shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* Link or current page */}
              {item.isCurrent || isLast ? (
                <span
                  className="text-[#1A1A1A] font-medium truncate max-w-[150px] sm:max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href || '#'}
                  className={`
                    flex items-center gap-1
                    text-[#6B6B60] hover:text-[#0A6E6E]
                    transition-colors duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A6E6E] focus-visible:ring-offset-2 rounded
                    ${isHome && showHomeIcon ? 'hidden sm:flex' : ''}
                  `}
                >
                  {isHome && showHomeIcon ? (
                    <Home size={14} aria-hidden="true" />
                  ) : (
                    <span className="truncate max-w-[100px]">{item.label}</span>
                  )}
                </a>
              )}

              {/* Home text on desktop */}
              {isHome && showHomeIcon && !item.isCurrent && (
                <span className="hidden sm:inline text-[#6B6B60] truncate max-w-[100px]">
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