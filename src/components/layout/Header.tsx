'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Hexagon,
  User,
  Accessibility,
  SlidersHorizontal,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { TECH_DETAILS } from '../../../constants';
import { batch3NavigationContent } from '../../../content/batch3';
import { CartIcon } from '../../../components/Cart';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { useMultitoolStore } from '@/src/stores/multitoolStore';
import {
  getCurrentPageFromPathname,
  navigateWithScroll,
  resolveLegacyPagePath,
} from '../../lib/navigation';
import { useFocusTrap } from '../../../hooks/useFocusTrap';

const loadMegaMenu = () =>
  import('../../../components/MegaMenu').then((module) => ({
    default: module.MegaMenu,
  }));
const MegaMenu = dynamic(loadMegaMenu, { loading: () => null });
const GlobalSearch = dynamic(
  () =>
    import('../../../components/GlobalSearch').then((module) => ({
      default: module.GlobalSearch,
    })),
  {
    loading: () => null,
    ssr: false,
  }
);

type NavLinkProps = {
  label: string;
  target: string;
  currentPage: string;
  onClick?: () => void;
};

function NavLink({ label, target, currentPage, onClick }: NavLinkProps) {
  const isCurrent = currentPage === target;
  return (
    <Link
      href={resolveLegacyPagePath(target) ?? '/'}
      prefetch={false}
      onClick={onClick}
      aria-current={isCurrent ? 'page' : undefined}
      className={`group relative inline-flex items-center whitespace-nowrap text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-500 futuristic-font ${
        isCurrent ? 'text-gray-900 font-bold' : 'text-gray-500'
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute -bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-gray-900 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100 ${
          isCurrent ? 'scale-x-100' : ''
        }`}
      />
    </Link>
  );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const navRef = useRef<HTMLElement | null>(null);
  const currentPage = getCurrentPageFromPathname(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const headerSyncFrameRef = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [megaMenuPrimed, setMegaMenuPrimed] = useState(false);
  const handleMegaMenuClose = useCallback(() => setMegaMenuOpen(false), []);
  const handleMobileMenuClose = useCallback(() => setMobileOpen(false), []);
  const primeMegaMenu = useCallback(() => {
    setMegaMenuPrimed(true);
    void loadMegaMenu();
  }, []);
  const [announcementDismissed, setAnnouncementDismissed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      return window.localStorage.getItem('hylono_announcement_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const { isOpen: multitoolOpen, toggle: toggleMultitool, openAtPosition } =
    useMultitoolStore();
  const mobilePanelRef = useFocusTrap<HTMLDivElement>({
    active: mobileOpen,
    initialFocus: '#mobile-nav-close',
    clickOutsideDeactivates: false,
    escapeDeactivates: false,
  });

  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const navGoalsEnabled = isFeatureEnabled('feature_nav_goals');
  const headerTrustEnabled = isFeatureEnabled('feature_header_trust');

  const lowestRental = Math.min(
    ...Object.values(TECH_DETAILS)
      .map((tech) => tech.rentalPrice)
      .filter((value): value is number => typeof value === 'number' && value > 0)
  );
  const trustMarkers = batch3NavigationContent.trustMarkers(lowestRental);

  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const nextIsScrolled = latest > 20;
    const nextCompactHeader = latest > 96 && !mobileOpen && !megaMenuOpen && !multitoolOpen;

    setIsScrolled((previous) => (previous === nextIsScrolled ? previous : nextIsScrolled));
    setCompactHeader((previous) =>
      previous === nextCompactHeader ? previous : nextCompactHeader
    );
  });

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    window.addEventListener('resize', handleMobileMenuClose);
    return () => {
      window.removeEventListener('resize', handleMobileMenuClose);
    };
  }, [handleMobileMenuClose, mobileOpen]);

  useEffect(() => {
    if (mobileOpen || megaMenuOpen || multitoolOpen) {
      setCompactHeader(false);
    }
  }, [megaMenuOpen, mobileOpen, multitoolOpen]);

  useEffect(() => {
    const root = document.documentElement;

    const syncHeaderOffset = () => {
      const navRect = navRef.current?.getBoundingClientRect();
      const measuredHeight = navRect?.height ?? 0;
      const measuredOffset = navRect?.bottom ?? measuredHeight;

      const nextHeight = `${measuredHeight}px`;
      const nextOffset = `${measuredOffset}px`;

      if (root.style.getPropertyValue('--route-header-height') !== nextHeight) {
        root.style.setProperty('--route-header-height', nextHeight);
      }

      if (root.style.getPropertyValue('--route-header-offset') !== nextOffset) {
        root.style.setProperty('--route-header-offset', nextOffset);
      }
    };

    const scheduleHeaderSync = () => {
      if (headerSyncFrameRef.current !== null) {
        window.cancelAnimationFrame(headerSyncFrameRef.current);
      }

      headerSyncFrameRef.current = window.requestAnimationFrame(() => {
        syncHeaderOffset();
        headerSyncFrameRef.current = null;
      });
    };

    scheduleHeaderSync();

    const observer =
      typeof ResizeObserver !== 'undefined' && navRef.current
        ? new ResizeObserver(() => scheduleHeaderSync())
        : null;

    if (observer && navRef.current) {
      observer.observe(navRef.current);
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === navRef.current) {
        scheduleHeaderSync();
      }
    };

    navRef.current?.addEventListener('transitionend', handleTransitionEnd);
    window.addEventListener('resize', scheduleHeaderSync);

    return () => {
      if (headerSyncFrameRef.current !== null) {
        window.cancelAnimationFrame(headerSyncFrameRef.current);
        headerSyncFrameRef.current = null;
      }

      observer?.disconnect();
      navRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      window.removeEventListener('resize', scheduleHeaderSync);
      root.style.setProperty('--route-header-height', '0px');
      root.style.setProperty('--route-header-offset', '0px');
    };
  }, [compactHeader, headerTrustEnabled, mobileOpen]);

  const navigate = (page: string) => {
    const href = resolveLegacyPagePath(page);
    if (!href) {
      return;
    }

    navigateWithScroll(router, href);
  };

  const navClasses = `fixed top-0 left-0 right-0 z-50 isolate border-b bg-white transition-[padding,border-color,box-shadow] duration-300 ${
    compactHeader ? 'py-2 md:py-2.5' : 'py-4'
  } ${
    isScrolled
      ? 'border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
      : 'border-transparent'
  }`;

  const handleExploreToggle = () => {
    primeMegaMenu();
    if (multitoolOpen) {
      toggleMultitool();
    }

    setMegaMenuOpen((open) => !open);
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      handleMobileMenuClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMobileMenuClose, mobileOpen]);

  const handleAccessibilityClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (megaMenuOpen) {
      handleMegaMenuClose();
    }

    if (multitoolOpen) {
      toggleMultitool();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    openAtPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  const controlPanelUrl = process.env.NEXT_PUBLIC_CONTROL_PANEL_URL?.trim();

  return (
    <motion.nav
      ref={navRef}
      aria-label="Main navigation"
      className={navClasses}
      style={{
        backgroundColor: '#ffffff',
        opacity: 1,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 bg-white" />
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        style={{ scaleX }}
      />

      {headerTrustEnabled && !compactHeader && (
        <div className="relative z-20 border-b border-slate-200 bg-white">
          <div className="mx-auto hidden max-w-7xl items-center justify-end gap-4 px-6 py-1 md:flex">
            {trustMarkers.slice(0, 3).map((marker) => (
              <span
                key={marker}
                className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600"
              >
                {marker}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 md:gap-8">
        <Link
          href="/"
          prefetch={false}
          data-testid="logo-link"
          className={`group flex items-center transition-[gap] duration-300 ${
            compactHeader ? 'gap-0 md:min-w-[24px]' : 'gap-3'
          }`}
        >
          <Hexagon
            className="text-gray-900 transition-transform duration-700 group-hover:rotate-180"
            strokeWidth={1.5}
            size={compactHeader ? 18 : 24}
          />
          <div
            className={`flex flex-col items-start overflow-hidden transition-[max-width,opacity] duration-300 ${
              compactHeader ? 'max-w-0 opacity-0' : 'max-w-[160px] opacity-100'
            }`}
          >
            <span className="futuristic-font text-xl leading-none font-bold tracking-[0.1em] text-gray-900 md:text-2xl">
              HYLONO
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400 transition-colors group-hover:text-gold">
              Systems
            </span>
          </div>
        </Link>

        <div
          className={`hidden items-center md:flex md:flex-1 md:justify-center ${
            compactHeader ? 'gap-6 xl:gap-8' : 'gap-8 xl:gap-10'
          }`}
        >
          <NavLink
            label="Concept"
            target="home"
            currentPage={currentPage}
          />

          {navGoalsEnabled && (
            <Link
              href={resolveLegacyPagePath('conditions') ?? '/conditions'}
              prefetch={false}
              className="group flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gray-500 transition-colors duration-300 hover:text-gray-900 md:text-xs futuristic-font"
            >
              {batch3NavigationContent.goalsLabel}
            </Link>
          )}

          <button
            onMouseEnter={primeMegaMenu}
            onClick={handleExploreToggle}
            aria-haspopup="dialog"
            aria-expanded={megaMenuOpen}
            aria-controls={megaMenuOpen ? 'site-mega-menu' : undefined}
            className={`group flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 md:text-xs futuristic-font ${
              megaMenuOpen
                ? 'text-cyan-500 font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Explore{' '}
            <ChevronDown
              size={12}
              className={`transition-transform duration-300 ${
                megaMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <NavLink
            label="Store"
            target="store"
            currentPage={currentPage}
          />
          <NavLink
            label="Wellness Planner"
            target="wellness-planner"
            currentPage={currentPage}
          />
          <NavLink
            label="Contact"
            target="contact"
            currentPage={currentPage}
          />
        </div>

        {megaMenuPrimed ? (
          <MegaMenu
            isOpen={megaMenuOpen}
            onClose={handleMegaMenuClose}
            onNavigate={(page, techId) => {
              handleMegaMenuClose();
              if (techId) {
                navigateWithScroll(router, `/product/${techId.toLowerCase()}`);
                return;
              }
              navigate(page);
            }}
          />
        ) : null}

        <div
          className={`hidden items-center md:ml-auto md:flex ${
            compactHeader ? 'md:gap-6' : 'md:gap-10'
          }`}
        >
          <GlobalSearch onNavigate={navigate} />

          <div className={`flex gap-3 ${compactHeader ? 'items-center' : 'items-start'}`}>
            <div
              className={`flex items-center text-center ${
                compactHeader ? 'w-auto flex-row gap-0' : 'w-14 flex-col gap-1'
              }`}
            >
              <button
                onClick={handleAccessibilityClick}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
                  multitoolOpen
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-600 hover:bg-slate-100'
                }`}
                aria-label="Open accessibility tools"
                aria-haspopup="dialog"
                aria-expanded={multitoolOpen}
                aria-controls={multitoolOpen ? 'multitool-accessibility-tools' : undefined}
              >
                <Accessibility size={20} />
              </button>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 ${
                  compactHeader ? 'hidden' : ''
                }`}
              >
                Access
              </span>
            </div>

            <div
              className={`flex items-center text-center ${
                compactHeader ? 'w-auto flex-row gap-0' : 'w-14 flex-col gap-1'
              }`}
            >
              <button
                onClick={() => {
                  navigateWithScroll(router, '/account');
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                aria-label="Open user account menu"
              >
                <User size={20} className="text-gray-600" />
              </button>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 ${
                  compactHeader ? 'hidden' : ''
                }`}
              >
                Account
              </span>
            </div>

            <div
              className={`flex items-center text-center ${
                compactHeader ? 'w-auto flex-row gap-0' : 'w-14 flex-col gap-1'
              }`}
            >
              <CartIcon
                onClick={() => {
                  navigateWithScroll(router, '/checkout');
                }}
              />
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 ${
                  compactHeader ? 'hidden' : ''
                }`}
              >
                Basket
              </span>
            </div>

            <div
              className={`flex items-center text-center ${
                compactHeader ? 'w-auto flex-row gap-0' : 'w-14 flex-col gap-1'
              }`}
            >
              <Link
                href="/nexus"
                prefetch={false}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                aria-label="Open Nexus workspace"
              >
                <Hexagon size={20} className="text-gray-600" />
              </Link>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 ${
                  compactHeader ? 'hidden' : ''
                }`}
              >
                Nexus
              </span>
            </div>

            {controlPanelUrl && (
              <div
                className={`flex items-center text-center ${
                  compactHeader ? 'w-auto flex-row gap-0' : 'w-14 flex-col gap-1'
                }`}
              >
                <Link
                  href={controlPanelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                  aria-label="Open control panel"
                >
                  <SlidersHorizontal size={20} className="text-gray-600" />
                </Link>
                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500 ${
                    compactHeader ? 'hidden' : ''
                  }`}
                >
                  Panel
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {!mobileOpen && (
            <>
              <Link
                href={resolveLegacyPagePath('store') ?? '/store'}
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors hover:bg-slate-100"
              >
                Store
              </Link>
              <GlobalSearch onNavigate={navigate} />
            </>
          )}
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="min-h-11 min-w-11 rounded-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? 'mobile-nav-panel' : undefined}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div
            ref={mobilePanelRef}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 top-[var(--route-header-height,0px)] z-[55] flex w-full flex-col overflow-y-auto overscroll-contain border-b border-gray-100 bg-white p-8 md:hidden"
            style={{
              backgroundColor: '#ffffff',
              opacity: 1,
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2
                id="mobile-nav-title"
                className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                Navigation
              </h2>
              <button
                id="mobile-nav-close"
                type="button"
                onClick={handleMobileMenuClose}
                className="min-h-11 min-w-11 rounded-lg text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                aria-label="Close navigation menu"
              >
                <X />
              </button>
            </div>

            {headerTrustEnabled && (
              <div className="space-y-2">
                {trustMarkers.slice(0, 2).map((marker) => (
                  <p
                    key={marker}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    {marker}
                  </p>
                ))}
              </div>
            )}

            <NavLink
              label="Concept"
              target="home"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />
            {navGoalsEnabled && (
              <NavLink
                label="Goals"
                target="conditions"
                currentPage={currentPage}
                onClick={handleMobileMenuClose}
              />
            )}
            <NavLink
              label="Store"
              target="store"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />
            <NavLink
              label="Nexus"
              target="nexus"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />
            <NavLink
              label="Ecosystem"
              target="tech"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />
            <NavLink
              label="Wellness Planner"
              target="wellness-planner"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />
            <NavLink
              label="Contact"
              target="contact"
              currentPage={currentPage}
              onClick={handleMobileMenuClose}
            />

            {navGoalsEnabled && (
              <div className="space-y-3 border-t border-slate-200 pt-2">
                {batch3NavigationContent.goals.map((goal) => (
                  <Link
                    key={goal.path}
                    href={resolveLegacyPagePath(goal.path) ?? '/conditions'}
                    prefetch={false}
                    onClick={handleMobileMenuClose}
                    className="block text-left text-xs uppercase tracking-[0.15em] text-slate-500 hover:text-slate-900"
                  >
                    {goal.label}
                  </Link>
                ))}
              </div>
            )}

            {!announcementDismissed && (
              <button
                onClick={() => {
                  setAnnouncementDismissed(true);
                  try {
                    window.localStorage.setItem(
                      'hylono_announcement_dismissed',
                      'true'
                    );
                  } catch {
                    // ignore localStorage failures
                  }
                }}
                className="mt-2 rounded border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 hover:bg-slate-50"
              >
                Dismiss announcement
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
