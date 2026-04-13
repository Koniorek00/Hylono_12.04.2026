import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PartnerLayout } from '../../components/partner/PartnerLayout';

const usePathnameMock = vi.fn();
const signOutMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock('next-auth/react', () => ({
  signOut: (...args: unknown[]) => signOutMock(...args),
}));

vi.mock('../../components/partner/CommandPalette', () => ({
  CommandPalette: () => <div data-testid="command-palette" />,
}));

vi.mock('../../components/partner/NotificationCenter', () => ({
  NotificationCenter: () => <div data-testid="notification-center" />,
}));

describe('PartnerLayout', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/nexus');
    signOutMock.mockReset();
  });

  it('signs the user out from the authenticated workspace chrome', () => {
    render(
      <PartnerLayout title="Overview" chromeMode="workspace">
        <div>Workspace</div>
      </PartnerLayout>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('shows public sample workspace actions by default', () => {
    render(
      <PartnerLayout title="Overview">
        <div>Workspace</div>
      </PartnerLayout>
    );

    expect(screen.getAllByText(/sample workspace/i).length).toBeGreaterThan(0);
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
    expect(signInLinks[0]).toHaveAttribute('href', '/login?auth=required&next=%2Faccount');
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
  });
});
