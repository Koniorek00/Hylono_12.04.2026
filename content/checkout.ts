export const checkoutContent = {
  meta: {
    title: 'Checkout',
    emptyCartTitle: 'Your cart is empty',
    continueShopping: 'Continue Shopping →',
  },
  steps: {
    shipping: 'Shipping',
    payment: 'Payment',
    confirm: 'Confirm',
  },
  shipping: {
    title: 'Shipping Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    streetAddress: 'Street Address',
    city: 'City',
    postalCode: 'Postal Code',
    continueToPayment: 'Continue to Payment',
  },
  payment: {
    title: 'Payment Method',
    cardTitle: 'Credit/Debit Card',
    cardDescription: 'Visa, Mastercard, American Express',
    bankTransferTitle: 'Bank Transfer',
    bankTransferDescription: 'Direct bank transfer (EU)',
    financingTitle: 'Financing (36 months)',
    financingFromPrefix: 'From',
    financingPerMonthSuffix: 'PLN/month',
    back: 'Back',
    reviewOrder: 'Review Order',
  },
  confirmation: {
    title: 'Review Your Order',
    shippingTo: 'Shipping to',
    placeOrder: 'Place Order',
    processing: 'Processing…',
  },
  success: {
    title: 'Order Confirmed!',
    messagePrefix: "Thank you for your order. We've sent a confirmation email to",
    orderPrefix: 'Order',
    cta: 'View confirmation details',
  },
  errors: {
    attestRequired: 'Please confirm intended use before placing your order.',
    orderFailed: 'Order failed. Please try again.',
    network: 'Network error. Please check your connection and try again.',
  },
  summary: {
    title: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingFree: 'Free',
    total: 'Total',
  },
  trustLayer: {
    badge: 'Trust Layer Certified',
    verifiedPrefix: 'Verified',
    note:
      'This order contains verified bio-optimization technology. All claims are reviewed for wellness-safe framing.',
  },
  intendedUseAttestation:
    "I confirm that I have reviewed the product's intended use and proper usage information.",
  trustSignals: ['🔒 Secure payment', '📦 Free shipping', '↩️ 14-day returns'],
} as const;
