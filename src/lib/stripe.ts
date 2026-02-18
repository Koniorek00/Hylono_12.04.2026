import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
    throw new Error('STRIPE_SECRET_KEY is missing in production');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any, // Using a recent stable version
    typescript: true,
});
