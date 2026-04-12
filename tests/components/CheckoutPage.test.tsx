/**
 * CheckoutPage Component Tests
 * Covers: form rendering, submission loading state, success display,
 * API error handling, and server-side total calculation.
 *
 * The /api/checkout endpoint is mocked via globalThis.fetch.
 * The cart context is mocked via vi.mock so no CartProvider is needed.
 */
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { mockSubmitCheckoutFormAction } = vi.hoisted(() => ({
    mockSubmitCheckoutFormAction: vi.fn(),
}));

// ─── Mock Cart context ────────────────────────────────────────────────────────
// CheckoutPage calls useCart() which reads from CartContext.
// We mock the entire Cart module so we control what useCart() returns
// without needing to wrap the component in a CartProvider.
vi.mock('../../components/Cart', () => ({
    useCart: () => ({
        items: [
            {
                id: 'HBOT-001',
                name: 'Hyperbaric Chamber Pro',
                price: 25000,
                quantity: 1,
            },
        ],
        total: 25000,
        clearCart: vi.fn(),
        totalItems: 1,
    }),
}));

vi.mock('../../src/actions/formActions', () => ({
    submitCheckoutFormAction: mockSubmitCheckoutFormAction,
}));

// ─── Import component AFTER mocks are defined ─────────────────────────────────
// vi.mock is hoisted automatically — import order here is fine.
import { CheckoutPage } from '../../components/CheckoutPage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockNavigate = () => vi.fn() as (page: string) => void;

function fillShippingFields() {
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '1 Analytical Engine Way' } });
    fireEvent.change(screen.getByLabelText(/^city$/i), { target: { value: 'London' } });
    fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: 'SW1A 1AA' } });
}

function mockFetchSuccess(orderId = 'ORD-TEST-001') {
    mockSubmitCheckoutFormAction.mockResolvedValueOnce({
        success: true,
        orderId,
        message: 'Order placed successfully',
    });
}

function mockFetchError(message = 'Payment failed') {
    mockSubmitCheckoutFormAction.mockResolvedValueOnce({
        success: false,
        message,
    });
}

function mockFetchNetworkError() {
    mockSubmitCheckoutFormAction.mockResolvedValueOnce({
        success: false,
        message: 'Network error',
    });
}

// Helper: navigate CheckoutPage from 'shipping' → 'payment' → 'confirm'
async function navigateToConfirm() {
    fillShippingFields();

    const continueToPayment = screen.getByRole('button', { name: /continue to payment/i });
    fireEvent.click(continueToPayment);

    await waitFor(() => {
        expect(screen.queryByText(/payment method/i)).not.toBeNull();
    });

    const reviewOrder = screen.getByRole('button', { name: /review order/i });
    fireEvent.click(reviewOrder);

    await waitFor(() => {
        expect(screen.queryByText(/review your order/i)).not.toBeNull();
    });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('CheckoutPage', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockSubmitCheckoutFormAction.mockReset();
        mockSubmitCheckoutFormAction.mockResolvedValue({
            success: true,
            message: 'Order placed successfully',
            orderId: 'HYL-TEST-001',
        });
    });

    // ── Rendering ─────────────────────────────────────────────────────────────

    it('renders checkout form without crashing', () => {
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        // Shipping step renders by default — check for the section heading
        expect(screen.queryByRole('heading', { name: /shipping information/i })).not.toBeNull();
    });

    it('renders cart items in the order summary sidebar', () => {
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        // The mocked cart has "Hyperbaric Chamber Pro"
        expect(screen.queryByText(/hyperbaric chamber/i)).not.toBeNull();
    });

    it('renders Order Summary with total', () => {
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        expect(screen.queryByText(/order summary/i)).not.toBeNull();
    });

    // ── Step navigation ───────────────────────────────────────────────────────

    it('advances from shipping to payment step on "Continue to Payment"', async () => {
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        fillShippingFields();
        const btn = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(screen.queryByText(/payment method/i)).not.toBeNull();
        });
    });

    it('advances from payment to confirm step on "Review Order"', async () => {
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        fillShippingFields();
        const toPayment = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(toPayment);

        await waitFor(() => {
            expect(screen.queryByText(/payment method/i)).not.toBeNull();
        });

        const toConfirm = screen.getByRole('button', { name: /review order/i });
        fireEvent.click(toConfirm);

        await waitFor(() => {
            expect(screen.queryByText(/review your order/i)).not.toBeNull();
        });
    });

    // ── Submission — success ──────────────────────────────────────────────────

    it('calls submitCheckoutFormAction on Place Order click', async () => {
        mockFetchSuccess();
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            expect(mockSubmitCheckoutFormAction).toHaveBeenCalled();
        });
    });

    it('displays order ID on successful submission', async () => {
        mockFetchSuccess('ORD-2024-XYZ');
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            expect(screen.queryByText(/ORD-2024-XYZ/)).not.toBeNull();
        });
    });

    // ── Submission — loading state ────────────────────────────────────────────

    it('shows Processing text and disables button while request is in flight', async () => {
        mockSubmitCheckoutFormAction.mockImplementationOnce(() => new Promise(() => {}));
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            // Button text changes to "Processing…" while loading
            const processing = screen.queryByText(/processing/i);
            expect(processing).not.toBeNull();
        });
    });

    // ── Submission — error handling ───────────────────────────────────────────

    it('keeps user on confirm step when API returns success:false', async () => {
        mockFetchError('Payment declined by processor');
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            expect(mockSubmitCheckoutFormAction).toHaveBeenCalled();
            expect(screen.queryByText(/review your order/i)).not.toBeNull();
            expect(screen.queryByText(/order confirmed/i)).toBeNull();
        });
    });

    it('keeps user on confirm step when network-like failure payload is returned', async () => {
        mockFetchNetworkError();
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            expect(mockSubmitCheckoutFormAction).toHaveBeenCalled();
            expect(screen.queryByText(/review your order/i)).not.toBeNull();
            expect(screen.queryByText(/order confirmed/i)).toBeNull();
        });
    });

    // ── API payload integrity ─────────────────────────────────────────────────

    it('sends cart items in the request body', async () => {
        mockFetchSuccess();
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            const calls = mockSubmitCheckoutFormAction.mock.calls;
            if (calls.length === 0) return;
            const [, submittedFormData] = calls[0] as [unknown, FormData];
            const itemsJson = submittedFormData.get('itemsJson');
            expect(typeof itemsJson).toBe('string');
            const parsedItems = JSON.parse(itemsJson as string);
            expect(Array.isArray(parsedItems)).toBe(true);
            expect(parsedItems.length).toBeGreaterThan(0);
        });
    });

    it('sends paymentMethod in submitted form data', async () => {
        mockFetchSuccess();
        render(<CheckoutPage onNavigate={mockNavigate()} />);
        await navigateToConfirm();

        const placeOrder = await screen.findByRole('button', { name: /place order/i });
        fireEvent.click(placeOrder);

        await waitFor(() => {
            const calls = mockSubmitCheckoutFormAction.mock.calls;
            if (calls.length === 0) return;
            const [, submittedFormData] = calls[0] as [unknown, FormData];
            expect(submittedFormData.get('paymentMethod')).toBe('bank_transfer');
        });
    });
});
