import React from 'react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MultitoolContainer } from '../../src/components/ui/Multitool/MultitoolContainer';
import { useMultitoolStore } from '../../src/stores/multitoolStore';

vi.mock('motion/react', async () => {
  const React = await import('react');
  const omitMotionProps = (props: Record<string, unknown>) => {
    const {
      animate,
      custom,
      exit,
      initial,
      transition,
      variants,
      whileTap,
      whileHover,
      whileInView,
      layout,
      layoutId,
      ...rest
    } = props;

    void animate;
    void custom;
    void exit;
    void initial;
    void transition;
    void variants;
    void whileTap;
    void whileHover;
    void whileInView;
    void layout;
    void layoutId;

    return rest;
  };

  const createPassthrough = (tag: keyof React.JSX.IntrinsicElements) =>
    React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function Passthrough(
      props,
      ref
    ) {
      return React.createElement(tag, { ...omitMotionProps(props), ref }, props.children);
    });

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      button: createPassthrough('button'),
      div: createPassthrough('div'),
      span: createPassthrough('span'),
    },
    useReducedMotion: () => true,
  };
});

vi.mock('../../src/components/ui/Multitool/hooks/useScrollSpy', () => ({
  useScrollSpy: () => ({
    sections: [{ id: 'benefits', title: 'Benefits', level: 2, element: document.getElementById('benefits') }],
    activeSectionId: 'benefits',
    scrollToSection: vi.fn(),
    refreshSections: vi.fn(),
  }),
}));

vi.mock('../../src/stores/multitoolStore', async () => {
  const { create } = await import('zustand');

  type ToolId = 'navigator' | 'reading' | 'support' | 'focus';

  const useMultitoolStore = create<{
    isOpen: boolean;
    activeTool: ToolId | null;
    dropdownPosition: { top: number; right: number };
    toggle: () => void;
    open: () => void;
    openAtPosition: (position: { top: number; right: number }) => void;
    close: () => void;
    setActiveTool: (tool: ToolId | null) => void;
    reset: () => void;
  }>((set) => ({
    isOpen: false,
    activeTool: null,
    dropdownPosition: { top: 72, right: 16 },
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    open: () => set({ isOpen: true }),
    openAtPosition: (position) => set({ isOpen: true, dropdownPosition: position }),
    close: () => set({ isOpen: false, activeTool: null }),
    setActiveTool: (tool) => set({ activeTool: tool }),
    reset: () =>
      set({
        isOpen: false,
        activeTool: null,
        dropdownPosition: { top: 72, right: 16 },
      }),
  }));

  return { useMultitoolStore };
});

const setupPageSection = (): void => {
  document.body.innerHTML = `
    <main>
      <section id="benefits" data-focus-section="true">
        <h2>Benefits</h2>
      </section>
    </main>
  `;
};

const flushEffects = async (): Promise<void> => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('MultitoolContainer', () => {
  beforeEach(() => {
    setupPageSection();
    window.localStorage.clear();
    useMultitoolStore.getState().reset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('opens with keyboard shortcut and closes with Escape', async () => {
    render(<MultitoolContainer />);
    await flushEffects();

    await act(async () => {
      fireEvent.keyDown(window, { key: '?', shiftKey: true });
    });
    await flushEffects();

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /accessibility tools/i })).not.toBeNull();
    });

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    await flushEffects();

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /accessibility tools/i })).toBeNull();
    });
  });

  it('does not open with shortcut while typing in an input', async () => {
    render(
      <div>
        <input aria-label="Test input" />
        <MultitoolContainer />
      </div>
    );
    await flushEffects();

    const input = screen.getByRole('textbox', { name: /test input/i });
    input.focus();

    await act(async () => {
      fireEvent.keyDown(window, { key: '?', shiftKey: true });
    });
    await flushEffects();

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /accessibility tools/i })).toBeNull();
    });
  });
});
