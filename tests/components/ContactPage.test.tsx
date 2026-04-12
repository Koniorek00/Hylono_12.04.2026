import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const { mockSubmitContactFormAction } = vi.hoisted(() => ({
  mockSubmitContactFormAction: vi.fn(),
}));

vi.mock('../../src/actions/formActions', () => ({
  submitContactFormAction: mockSubmitContactFormAction,
}));

vi.mock('../../utils/csrf', () => ({
  getCSRFToken: () => 'test-csrf-token',
  validateCSRFToken: () => true,
}));

import { ContactPage } from '../../components/ContactPage';

describe('ContactPage', () => {
  beforeEach(() => {
    mockSubmitContactFormAction.mockReset();
  });

  it('drafts the selected callback slot into the contact form instead of silently dropping it', async () => {
    render(<ContactPage />);

    fireEvent.click(
      screen.getAllByRole('button', { name: /^schedule a callback$/i })[0]!
    );

    const dialog = screen.getByRole('dialog', {
      name: /schedule a callback/i,
    });

    fireEvent.click(within(dialog).getAllByRole('button')[0]!);
    fireEvent.click(within(dialog).getByRole('button', { name: '09:00 AM' }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        /preferred callback slot added/i
      );
    });

    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
    expect(messageInput.value).toContain('Preferred callback slot:');
    expect(messageInput.value).toContain('09:00 AM');
  });
});
