import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '0px';
    readonly thresholds: ReadonlyArray<number> = [];

    disconnect(): void {
        // noop
    }

    observe(): void {
        // noop
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    unobserve(): void {
        // noop
    }
}

// ─── Global test lifecycle ────────────────────────────────────────────────────

if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver,
    });
    Object.defineProperty(globalThis, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: MockIntersectionObserver,
    });
}

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'scrollTo', {
        writable: true,
        configurable: true,
        value: vi.fn(),
    });
}

beforeEach(() => {
    // Silence console.warn in tests (re-enable per-test via vi.spyOn if needed)
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    // Isolate browser storage between every test
    sessionStorage.clear();
    localStorage.clear();
});

// ─── Framer-motion stub ───────────────────────────────────────────────────────
// Renders children only — no animations — so component tests stay fast and
// deterministic. Component test files can override locally with vi.mock().
vi.mock('motion/react', async () => {
    const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
    return {
        ...actual,
        // Replace AnimatePresence with a simple passthrough (no animation logic)
        AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
        useReducedMotion: () => true, // always prefer reduced motion in tests
    };
});

