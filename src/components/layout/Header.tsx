'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Hexagon,
  User,
  Accessibility,
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
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { TECH_DETAILS } from '../../../constants';
import { batch3NavigationContent } from '../../../content/batch3';
import { CartIcon } from '../../../components/Cart';
import { GlobalSearch } from '../../../components/GlobalSearch';
import { isFeatureEnabled } from '../../../utils/featureFlags';
import { useMultitoolStore } from '@/src/stores/multitoolStore';
import {
  getCurrentPageFromPathname,
  resolveLegacyPagePath,
} from '../../lib/navigation';

const loadMegaMenu = () =>
  import('../../../components/MegaMenu').then((module) => ({
    default: module.MegaMenu,
  }));
const MegaMenu = dynamic(loadMegaMenu, { loading: () => null });

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
      onClick={onClick}
      aria-current={isCurrent ? 'page' : undefined}
      className={`group relative inline-flex items-center whitespace-nowrap text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all duration-500 futuristic-font ${
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
  const pathname = usePathname();
  const currentPage = getCurrentPageFromPathname(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
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
  const [hidden, setHidden] = useState(false);
  const { isOpen: multitoolOpen, toggle: toggleMultitool, openAtPosition } =
    useMultitoolStore();

  const lastScrollY = useRef(0);
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
    const previous = lastScrollY.current;
    setIsScrolled(latest > 20);

    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleClose = () => {
      setMobileOpen(false);
    };

    window.addEventListener('resize', handleClose);
    return () => {
      window.removeEventListener('resize', handleClose);
    };
  }, [mobileOpen]);

  const navigate = (page: string) => {
    const href = resolveLegacyPagePath(page);
    if (!href) {
      return;
    }

    router.push(href);
    window.scrollTo(0, 0);
  };

  const navClasses = `fixed top-0 left-0 right-0 z-50 border-b py-4 ${
    isScrolled
      ? 'bg-white/60 backdrop-blur-xl border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
      : 'bg-transparent border-transparent'
  }`;

  const handleAccessibilityClick = (event: MouseEvent<HTMLButtonElement>) => {
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

  return (
    <motion.nav
      aria-label="Main navigation"
      className={`${navClasses} animate-resonance`}
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
        style={{ scaleX }}
      />

      {headerTrustEnabled && (
        <div className="border-b border-white/20 bg-white/60 backdrop-blur-xl">
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

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:justify-center md:gap-16">
        <Link
          href="/"
          data-testid="logo-link"
          className="group flex items-center gap-3"
        >
          <Hexagon
            className="text-gray-900 transition-transform duration-700 group-hover:rotate-180"
            strokeWidth={1.5}
            size={24}
          />
          <div className="flex flex-col items-start">
            <span className="futuristic-font text-xl leading-none font-bold tracking-[0.1em] text-gray-900 md:text-2xl">
              HYLONO
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400 transition-colors group-hover:text-gold">
              Systems
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex xl:gap-10">
          <NavLink
            label="Concept"
            target="home"
            currentPage={currentPage}
          />

          {navGoalsEnabled && (
            <Link
              href={resolveLegacyPagePath('conditions') ?? '/conditions'}
              className="group flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gray-500 transition-all duration-300 hover:text-gray-900 md:text-xs futuristic-font"
            >
              {batch3NavigationContent.goalsLabel}
            </Link>
          )}

          <button
            onMouseEnter={() => loadMegaMenu()}
            onClick={() => setMegaMenuOpen((open) => !open)}
            aria-haspopup="true"
            aria-expanded={megaMenuOpen}
            className={`group flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 md:text-xs futuristic-font ${
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

        <MegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          onNavigate={(page, techId) => {
            setMegaMenuOpen(false);
            if (techId) {
              router.push(`/product/${techId.toLowerCase()}`);
              window.scrollTo(0, 0);
              return;
            }
            navigate(page);
          }}
        />

        <CartIcon
          onClick={() => {
            router.push('/checkout');
            window.scrollTo(0, 0);
          }}
        />

        <div className="hidden items-center gap-2 md:flex">
          <GlobalSearch onNavigate={navigate} />
          <button
            onClick={handleAccessibilityClick}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              multitoolOpen
                ? 'bg-cyan-500 text-white'
                : 'text-gray-600 hover:bg-slate-100'
            }`}
            aria-label="Open accessibility tools"
            aria-expanded={multitoolOpen}
          >
            <Accessibility size={20} />
          </button>
          <button
            onClick={() => {
              router.push('/account');
              window.scrollTo(0, 0);
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            aria-label="Open user account menu"
          >
            <User size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={resolveLegacyPagePath('store') ?? '/store'}
            onClick={() => setMobileOpen(false)}
            className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors hover:bg-slate-100"
          >
            Store
          </Link>
          <GlobalSearch onNavigate={navigate} />
          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="min-h-11 min-w-11 rounded-lg transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div id="mobile-nav-panel" className="absolute top-full left-0 flex h-screen w-full flex-col space-y-8 border-b border-gray-100 bg-white/95 p-8 backdrop-blur-3xl md:hidden">
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
              onClick={() => setMobileOpen(false)}
            />
            {navGoalsEnabled && (
              <NavLink
                label="Goals"
                target="conditions"
                currentPage={currentPage}
                onClick={() => setMobileOpen(false)}
              />
            )}
            <NavLink
              label="Store"
              target="store"
              currentPage={currentPage}
              onClick={() => setMobileOpen(false)}
            />
            <NavLink
              label="Ecosystem"
              target="tech"
              currentPage={currentPage}
              onClick={() => setMobileOpen(false)}
            />
            <NavLink
              label="Wellness Planner"
              target="wellness-planner"
              currentPage={currentPage}
              onClick={() => setMobileOpen(false)}
            />
            <NavLink
              label="Contact"
              target="contact"
              currentPage={currentPage}
              onClick={() => setMobileOpen(false)}
            />

            {navGoalsEnabled && (
              <div className="space-y-3 border-t border-slate-200 pt-2">
                {batch3NavigationContent.goals.map((goal) => (
                  <Link
                    key={goal.path}
                    href={resolveLegacyPagePath(goal.path) ?? '/conditions'}
                    onClick={() => setMobileOpen(false)}
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
