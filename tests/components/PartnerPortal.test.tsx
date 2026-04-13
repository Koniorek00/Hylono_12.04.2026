import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PartnerPortal } from '../../components/PartnerPortal';
import { RewardsPage } from '../../components/RewardsPage';

describe('PartnerPortal', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the public preview and submits a B2B application payload', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Application received.',
        ticketId: 'HYL-TEST-123',
      }),
    });

    render(<PartnerPortal isAuthenticated={false} onRequestAccess={vi.fn()} />);

    screen.getByText(/public partner overview/i);
    fireEvent.click(screen.getByRole('button', { name: /apply now/i }));

    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: 'Acme Clinic' },
    });
    fireEvent.change(screen.getByLabelText(/contact name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+48 123 456 789' },
    });
    fireEvent.change(screen.getByLabelText(/partnership type/i), {
      target: { value: 'Clinic Partner' },
    });
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Poland' },
    });
    fireEvent.change(screen.getByLabelText(/tell us about your business/i), {
      target: { value: 'We operate two wellness locations and need rollout support.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(init.method).toBe('POST');

    const payload = JSON.parse(String(init.body));
    expect(payload).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+48 123 456 789',
      company: 'Acme Clinic',
      inquiryType: 'b2b',
      subject: 'Partner application: Clinic Partner',
    });
    expect(payload.message).toContain('We operate two wellness locations');
    expect(payload.message).toContain('Country: Poland');

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toContain('Application received.');
    });
  });

  it('shows validation errors instead of submitting an empty application', async () => {
    render(<PartnerPortal isAuthenticated={false} onRequestAccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /apply now/i }));
    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(
      'Please fix the highlighted fields before submitting.'
    );
    screen.getByText(/company name is required/i);
    screen.getByText(/contact name is required/i);
  });
});

describe('RewardsPage', () => {
  it('shows the public preview CTA when the visitor is signed out', () => {
    render(<RewardsPage isAuthenticated={false} onNavigate={vi.fn()} />);

    screen.getByText(/public preview/i);
    screen.getByRole('button', { name: /sign in for your rewards/i });
    screen.getByRole('button', { name: /explore the store first/i });
  });
});
