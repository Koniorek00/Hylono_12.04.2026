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

  it('signs the user out from the workspace chrome', () => {
    render(
      <PartnerLayout title="Overview">
        <div>Workspace</div>
      </PartnerLayout>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
