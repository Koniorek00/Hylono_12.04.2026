import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

vi.mock('../../components/SmartText', () => ({
  SmartText: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../components/shared/MedicalDisclaimer', () => ({
  MedicalDisclaimer: () => null,
}));

vi.mock('../../components/support/DeviceScanner', () => ({
  DeviceScanner: () => <div>Device scanner</div>,
}));

vi.mock('../../components/SmartMessageInput', () => ({
  SmartMessageInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <textarea
      aria-label="Message"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  ),
}));

import HelpCenterPage from '../../components/HelpCenterPage';

describe('HelpCenterPage', () => {
  beforeEach(() => {
    mockSubmitContactFormAction.mockReset();
  });

  it('keeps clinic patient count in the submitted form state after advancing past step 2', async () => {
    const { container } = render(<HelpCenterPage initialTab="contact" />);

    fireEvent.click(
      screen.getByRole('button', { name: /i represent a clinic/i })
    );
    fireEvent.change(screen.getByLabelText(/approx\. monthly patients/i), {
      target: { value: '51-200' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    });

    const hiddenPatientCount = container.querySelector(
      'input[name="patientCount"]'
    ) as HTMLInputElement | null;

    expect(hiddenPatientCount?.value).toBe('51-200');
  });
});
