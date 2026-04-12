import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export interface CheckoutOrderItemRecord {
  id: string;
  quantity: number;
  unitPriceCents: number;
}

export interface CheckoutShippingRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RentalItemRecord {
  techId: string;
  quantity: number;
  monthlyPrice: number;
}

export interface RentalContactRecord {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  company?: string;
}

export const contactInquiriesTable = pgTable('contact_inquiries', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  phone: text('phone'),
  company: text('company'),
  inquiryType: text('inquiry_type').notNull(),
  submissionHash: text('submission_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bookingRequestsTable = pgTable('booking_requests', {
  id: text('id').primaryKey(),
  bookingRef: text('booking_ref').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  preferredDate: text('preferred_date'),
  preferredTime: text('preferred_time'),
  timezone: text('timezone').notNull(),
  techInterest: text('tech_interest'),
  notes: text('notes'),
  bookingType: text('booking_type').notNull(),
  submissionHash: text('submission_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscriptionsTable = pgTable('newsletter_subscriptions', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  source: text('source').notNull(),
  providerSynced: boolean('provider_synced').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const checkoutOrdersTable = pgTable('checkout_orders', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().unique(),
  paymentMethod: text('payment_method').notNull(),
  email: text('email').notNull(),
  requestFingerprint: text('request_fingerprint'),
  shipping: jsonb('shipping').$type<CheckoutShippingRecord>().notNull(),
  items: jsonb('items').$type<CheckoutOrderItemRecord[]>().notNull(),
  totalCents: integer('total_cents').notNull(),
  currency: text('currency').notNull().default('pln'),
  status: text('status').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripeClientSecret: text('stripe_client_secret'),
  lastErrorMessage: text('last_error_message'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rentalApplicationsTable = pgTable('rental_applications', {
  id: text('id').primaryKey(),
  rentalId: text('rental_id').notNull().unique(),
  userId: text('user_id').notNull(),
  contact: jsonb('contact').$type<RentalContactRecord | null>(),
  items: jsonb('items').$type<RentalItemRecord[]>().notNull(),
  termMonths: integer('term_months').notNull(),
  status: text('status').notNull(),
  totalMonthlyCents: integer('total_monthly_cents').notNull(),
  submissionHash: text('submission_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const stripeWebhookEventsTable = pgTable('stripe_webhook_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  orderId: text('order_id'),
  processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
});
