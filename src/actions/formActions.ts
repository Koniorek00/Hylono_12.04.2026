'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';

export interface FormActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  ticketId?: string;
  bookingRef?: string;
  orderId?: string;
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  userType: z.string().trim().optional(),
  serialNumber: z.string().trim().max(100).optional(),
  clinicName: z.string().trim().max(100).optional(),
  interest: z.string().trim().max(100).optional(),
});

const newsletterSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().trim().max(100).optional().default('unknown'),
});

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  preferredDate: z.string().trim().optional(),
  preferredTime: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
  bookingType: z.string().trim().optional().default('consultation'),
  interest: z.string().trim().max(100).optional(),
  date: z.string().trim().optional(),
  type: z.string().trim().optional(),
});

const checkoutSchema = z.object({
  itemsJson: z.string().min(1),
  shippingJson: z.string().min(1),
  paymentMethod: z.enum(['card', 'bank_transfer', 'financing']),
});

function flattenFieldErrors(error: z.ZodError): Record<string, string[]> | undefined {
  const flattened = z.flattenError(error);
  const fieldErrors: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[field] = messages;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export async function submitContactFormAction(
  _prevState: FormActionResult,
  formData: FormData
): Promise<FormActionResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
    userType: formData.get('userType') || undefined,
    serialNumber: formData.get('serialNumber') || undefined,
    clinicName: formData.get('clinicName') || undefined,
    interest: formData.get('interest') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid contact form.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const ticketId = `HYL-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    message: `Thank you! We'll respond within 1 business day. Reference: ${ticketId}`,
    ticketId,
  };
}

export async function submitNewsletterFormAction(
  _prevState: FormActionResult,
  formData: FormData
): Promise<FormActionResult> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get('email'),
    source: formData.get('source') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid email address.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  updateTag('newsletter');
  revalidateTag('newsletter', 'max');

  return {
    success: true,
    message: 'Thank you for subscribing! Check your inbox to confirm.',
  };
}

export async function submitBookingFormAction(
  _prevState: FormActionResult,
  formData: FormData
): Promise<FormActionResult> {
  const parsed = bookingSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    preferredDate: formData.get('preferredDate') || formData.get('date') || undefined,
    preferredTime: formData.get('preferredTime') || undefined,
    notes: formData.get('notes') || undefined,
    bookingType: formData.get('bookingType') || formData.get('type') || undefined,
    interest: formData.get('interest') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid booking data.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    message: `Booking request received. Reference: ${bookingRef}`,
    bookingRef,
  };
}

export async function submitCheckoutFormAction(
  _prevState: FormActionResult,
  formData: FormData
): Promise<FormActionResult> {
  const parsed = checkoutSchema.safeParse({
    itemsJson: formData.get('itemsJson'),
    shippingJson: formData.get('shippingJson'),
    paymentMethod: formData.get('paymentMethod'),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid checkout payload.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const orderId = `HYL-${Date.now().toString(36).toUpperCase()}`;
  return {
    success: true,
    message: `Order ${orderId} received.`,
    orderId,
  };
}

const submitNewsletterInputSchema = z.object({
  email: z.string().trim().email().max(254),
  source: z.string().trim().max(100).optional().default('unknown'),
});

export const submitNewsletterSafeAction = actionClient
  .inputSchema(submitNewsletterInputSchema)
  .action(async ({ parsedInput }) => {
    updateTag('newsletter');

    return {
      success: true,
      message: 'Thank you for subscribing! Check your inbox to confirm.',
      email: parsedInput.email,
      source: parsedInput.source,
    };
  });
