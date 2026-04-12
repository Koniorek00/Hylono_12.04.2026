import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardHome } from '../../components/partner/DashboardHome';

vi.mock('../../components/partner/PartnerLayout', () => ({
  PartnerLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('DashboardHome', () => {
  it('routes primary shortcuts into the supported nexus action states', () => {
    render(<DashboardHome />);

    const addClientLinks = screen.getAllByRole('link', { name: /add client/i });
    for (const link of addClientLinks) {
      expect(link).toHaveAttribute('href', '/nexus/clients?action=new');
    }

    expect(screen.getByRole('link', { name: /create campaign/i })).toHaveAttribute(
      'href',
      '/nexus/studio?action=new'
    );
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/nexus/fleet?device=d3'
    );
  });
});
