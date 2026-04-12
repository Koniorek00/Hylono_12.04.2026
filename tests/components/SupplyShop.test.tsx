import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SupplyShop } from '../../components/partner/SupplyShop';

vi.mock('../../components/partner/PartnerLayout', () => ({
  PartnerLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SupplyShop', () => {
  it('applies a standing template and submits the requisition draft', () => {
    render(<SupplyShop />);

    const sendDraftButton = screen.getByRole('button', { name: /send draft for review/i });

    fireEvent.click(screen.getByRole('button', { name: /clear draft/i }));
    expect(sendDraftButton).toBeDisabled();

    fireEvent.click(
      screen.getByRole('button', { name: /use high-turnover session pack template/i })
    );

    expect(sendDraftButton).not.toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(
      /high-turnover session pack added to the draft/i
    );

    fireEvent.click(sendDraftButton);

    expect(screen.getByRole('status')).toHaveTextContent(/draft sent for review/i);
    expect(screen.getByText(/3-line replenishment draft/i)).toBeInTheDocument();
    expect(sendDraftButton).toBeDisabled();
  });
});
