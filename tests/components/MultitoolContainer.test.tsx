import React from 'react';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MultitoolContainer } from '../../src/components/ui/Multitool/MultitoolContainer';

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
