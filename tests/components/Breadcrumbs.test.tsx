import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Breadcrumbs } from '../../src/components/navigation/Breadcrumbs';

vi.mock('../../src/components/ui/BreadcrumbBar/PageNavigatorDropdown', () => ({
  PageNavigatorDropdown: () => <div data-testid="page-navigator-dropdown" />,
}));

describe('Breadcrumbs', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
    vi.clearAllMocks();
  });

  it('renders breadcrumb labels in full without truncation classes', () => {
    render(
      <Breadcrumbs
        pathParts={['protocols', 'oxygen-flow-optimization-for-persistent-recovery-support']}
        showPageNavigator={true}
      />
    );

    const breadcrumbNav = screen.getByRole('navigation', {
      name: /page breadcrumb and navigation/i,
    });
    const protocolLink = within(breadcrumbNav).getByRole('link', {
      name: /protocols/i,
    });
    const breadcrumbList = within(breadcrumbNav).getByRole('list');
    const protocolLabel = within(protocolLink).getByText('Protocols');

    expect(breadcrumbList.className).toContain('list-none');
    expect(breadcrumbList.className).toContain('p-0');
    expect(breadcrumbList.className).toContain('m-0');
    expect(protocolLabel.className).not.toContain('truncate');
    expect(protocolLabel.className).not.toMatch(/max-w-\[[^\]]+\]/);

    const currentLabel = within(breadcrumbNav).getByText(
      'Oxygen Flow Optimization For Persistent Recovery Support'
    );
    expect(currentLabel.className).not.toContain('truncate');
    expect(currentLabel.className).not.toMatch(/max-w-\[[^\]]+\]/);
  });

  it('places the back-to-top button before the page sections button and scrolls to top', () => {
    render(
      <Breadcrumbs
        pathParts={['protocols', 'oxygen-flow-optimization']}
        showPageNavigator={true}
      />
    );

    const backToTopButton = screen.getByRole('button', { name: /back to top/i });
    const pageSectionsButton = screen.getByRole('button', {
      name: /page sections navigation/i,
    });

    expect(backToTopButton.parentElement?.firstElementChild).toBe(backToTopButton);
    expect(backToTopButton.parentElement?.children[1]).toBe(pageSectionsButton.parentElement);
    expect(pageSectionsButton.parentElement?.firstElementChild).toBe(pageSectionsButton);

    fireEvent.click(backToTopButton);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });
});
