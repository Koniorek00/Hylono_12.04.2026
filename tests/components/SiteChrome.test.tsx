import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteChrome } from '../../src/components/layout/SiteChrome';

const usePathnameMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock('../../src/components/layout/Header', () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock('../../src/components/layout/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

vi.mock('../../src/components/layout/RouteBreadcrumbs', () => ({
  RouteBreadcrumbs: () => <div data-testid="breadcrumbs" />,
}));

vi.mock('../../src/components/layout/GlobalOverlays', () => ({
  GlobalOverlays: () => <div data-testid="global-overlays" />,
}));

vi.mock('../../src/components/layout/MainShell', () => ({
  MainShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="main-shell">{children}</div>
  ),
}));

describe('SiteChrome', () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  it('renders the standard site chrome and global overlays on public routes', () => {
    usePathnameMock.mockReturnValue('/');

    render(
      <SiteChrome>
        <div>Page content</div>
      </SiteChrome>
    );

    expect(screen.getByTestId('header')).toBeDefined();
    expect(screen.getByTestId('breadcrumbs')).toBeDefined();
    expect(screen.getByTestId('main-shell')).toBeDefined();
    expect(screen.getByTestId('footer')).toBeDefined();
    expect(screen.getByTestId('global-overlays')).toBeDefined();
  });

  it('keeps global overlays mounted on app-shell routes', () => {
    usePathnameMock.mockReturnValue('/nexus/dashboard');

    render(
      <SiteChrome>
        <div>App shell content</div>
      </SiteChrome>
    );

    expect(screen.queryByTestId('header')).toBeNull();
    expect(screen.queryByTestId('breadcrumbs')).toBeNull();
    expect(screen.queryByTestId('footer')).toBeNull();
    expect(screen.getByTestId('main-shell')).toBeDefined();
    expect(screen.getByTestId('global-overlays')).toBeDefined();
  });
});
