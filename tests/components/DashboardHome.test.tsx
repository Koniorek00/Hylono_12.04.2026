import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardHome } from '../../components/partner/DashboardHome';

vi.mock('../../components/partner/PartnerLayout', () => ({
  PartnerLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DashboardHome', () => {
  it('surfaces the public Nexus entry points and module links', () => {
    render(<DashboardHome />);

    expect(
      screen.getByRole('heading', {
        name: /run clinic operations, staff enablement, and content workflows/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in to account/i })).toHaveAttribute(
      'href',
      '/login?auth=required&next=%2Faccount'
    );
    expect(screen.getByRole('link', { name: /contact hylono/i })).toHaveAttribute('href', '/contact');
    expect(screen.getByRole('link', { name: /clients/i })).toHaveAttribute('href', '/nexus/clients');
    expect(screen.getByRole('link', { name: /fleet/i })).toHaveAttribute('href', '/nexus/fleet');
    expect(screen.getByRole('link', { name: /studio/i })).toHaveAttribute('href', '/nexus/studio');
  });
});
