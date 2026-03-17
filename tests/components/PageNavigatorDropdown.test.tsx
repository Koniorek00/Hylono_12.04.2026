import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PageNavigatorDropdown } from '../../src/components/ui/BreadcrumbBar/PageNavigatorDropdown';

vi.mock('../../src/components/ui/Multitool/hooks/usePageStructure', () => ({
  usePageStructure: () => ({
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'overview',
        isKeySection: true,
        metric: null,
      },
      {
        id: 'pricing',
        title: 'Pricing',
        type: 'pricing',
        isKeySection: true,
        metric: { value: '€299/mo' },
      },
    ],
    keySections: [
      {
        id: 'overview',
        title: 'Overview',
        type: 'overview',
        isKeySection: true,
        metric: null,
      },
    ],
    activeSectionId: 'overview',
    isLoading: false,
    scrollToSection: vi.fn(),
  }),
}));

describe('PageNavigatorDropdown', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main><article>Example content for reader</article></main>';
  });

  it('renders section navigation menu with active state', () => {
    render(<PageNavigatorDropdown />);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const activeMenuButton = within(menu).getByRole('button', {
      name: /overview/i,
    });
    expect(activeMenuButton).toHaveAttribute('aria-current', 'location');
  });

  it('renders back-to-top action with menuitem semantics', () => {
    render(<PageNavigatorDropdown />);

    const backToTop = screen.getByRole('menuitem', { name: /back to top/i });
    expect(backToTop.tagName.toLowerCase()).toBe('button');

    fireEvent.click(backToTop);
  });
});