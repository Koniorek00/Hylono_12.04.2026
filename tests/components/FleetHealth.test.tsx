import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FleetHealth } from '../../components/partner/FleetHealth';

const usePathnameMock = vi.fn();
const useSearchParamsMock = vi.fn();
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => useSearchParamsMock(),
}));

vi.mock('../../components/partner/PartnerLayout', () => ({
  PartnerLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('FleetHealth', () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue('/nexus/fleet');
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
    replaceMock.mockReset();
  });

  it('opens a requested device from route state and clears the query on close', () => {
    render(<FleetHealth initialSelectedDeviceId="d3" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/core pemf mat/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close device details/i }));

    expect(replaceMock).toHaveBeenCalledWith('/nexus/fleet', { scroll: false });
  });

  it('opens the maintenance log form when the log action deep link is used', () => {
    render(<FleetHealth initialSelectedDeviceId="d3" initialLogAction />);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/core pemf mat/i)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /save record/i })).toBeInTheDocument();
  });
});
