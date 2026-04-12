'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { TECH_DETAILS } from '@/constants';
import { env } from '@/lib/env';
import { actionClient } from '@/lib/safe-action';
import { TechType } from '@/types';

export interface FormActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  ticketId?: string;
  bookingRef?: string;
  orderId?: string;
  rentalId?: string;
  statusCode?: number;
}

interface RentalActionItem {
  techId: string;
  quantity: number;
  monthlyPrice: number;
}

interface RentalActionContact {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  company?: string;
}

interface RentalActionResponse {
  id: string;
  userId: string;
  contact: RentalActionContact;
  items: RentalActionItem[];
  termMonths: number;
  status: 'pending' | 'active' | 'cancelled';
  totalMonthly: number;
  createdAt: string;
}

interface ContactApiResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

interface BookingApiResponse {
  success: boolean;
  message: string;
  bookingRef?: string;
}

interface CheckoutApiResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

interface NewsletterApiResponse {
  success: boolean;
  message: string;
}

interface RentalApiResponse {
  success: boolean;
  message: string;
  rental?: RentalActionResponse;
}

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  userType: z.string().trim().optional(),
  serialNumber: z.string().trim().max(100).optional(),
  clinicName: z.string().trim().max(100).optional(),
  patientCount: z.string().trim().max(50).optional(),
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

const rentalSchema = z.object({
  itemsJson: z.string().min(1),
  userId: z.string().trim().min(1).optional(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(50),
  company: z.string().trim().max(100).optional(),
  termMonths: z.coerce.number().int().min(1).max(60).optional().default(12),
});

const checkoutSchema = z.object({
  itemsJson: z.string().min(1),
  shippingJson: z.string().min(1),
  paymentMethod: z.enum(['card', 'bank_transfer', 'financing']),
});

const checkoutItemSchema = z.object({
  id: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(100),
});

const shippingSchema = z.object({
  firstName: z.string().trim().min(1).max(50),
  lastName: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(1).max(50),
});

const rentalItemSchema = z.object({
  techId: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(100),
  monthlyPrice: z.number().nonnegative(),
});

const TECH_ID_TO_TYPE: Record<string, TechType> = {
  'tech-hbot': TechType.HBOT,
  'tech-pemf': TechType.PEMF,
  'tech-rlt': TechType.RLT,
  'tech-hydrogen': TechType.HYDROGEN,
  'tech-ewot': TechType.EWOT,
  'tech-sauna_blanket': TechType.SAUNA_BLANKET,
  'tech-ems': TechType.EMS,
  'tech-vns': TechType.VNS,
  'tech-hypoxic': TechType.HYPOXIC,
  'tech-cryo': TechType.CRYO,
};

const parsePriceToMinorUnit = (amountText: string): number => {
  const parsed = Number(amountText.replace(/[^0-9.]/g, ''));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed * 100);
};

const getTrustedUnitPriceCents = (itemId: string): number | null => {
  const techType = TECH_ID_TO_TYPE[itemId.trim().toLowerCase()];

  if (!techType) {
    return null;
  }

  const techDetails = TECH_DETAILS[techType];
  const unitPriceCents = parsePriceToMinorUnit(techDetails.price);

  return unitPriceCents > 0 ? unitPriceCents : null;
};

const safeParseJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

async function parseApiResponse<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

const resolveApiBaseUrl = async (): Promise<string> => {
  try {
    const headerList = await headers();
    const host =
      headerList.get('x-forwarded-host') ??
      headerList.get('host') ??
      headerList.get('x-original-host');

    if (host) {
      const protocol =
        headerList.get('x-forwarded-proto') ??
        (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');

      return `${protocol}://${host}`.replace(/\/$/, '');
    }
  } catch {
    // no-op: fallback below handles environments without request context
  }

  const configured = env.NEXT_PUBLIC_API_BASE_URL.trim();
  if (/^https?:\/\//i.test(configured)) {
    return configured.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
};

const toApiUrl = async (path: string): Promise<string> => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${await resolveApiBaseUrl()}${normalizedPath}`;
};

const createApiRequestInit = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
  cache: 'no-store',
});

const asFallbackStatusCode = (error: unknown): number => {
  if (error instanceof TypeError) {
    return 503;
  }

  return 500;
};

const normalizeInquiryType = (
  userType: string | undefined
): 'general' | 'rental' | 'b2b' | 'support' | 'press' => {
  if (userType === 'clinic') {
    return 'b2b';
  }

  if (userType === 'owner') {
    return 'support';
  }

  if (userType === 'press') {
    return 'press';
  }

  if (userType === 'rental') {
    return 'rental';
  }

  return 'general';
};

const appendContactContext = (
  message: string,
  context: Array<[label: string, value: string | undefined]>
): string => {
  const normalizedContext = context
    .map(([label, value]) => [label, value?.trim()] as const)
    .filter(([, value]) => Boolean(value));

  if (normalizedContext.length === 0) {
    return message;
  }

  const detailLines = normalizedContext.map(
    ([label, value]) => `${label}: ${value}`
  );

  return `${message}\n\nAdditional details:\n${detailLines.join('\n')}`;
};

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
    patientCount: formData.get('patientCount') || undefined,
    interest: formData.get('interest') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid contact form.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: appendContactContext(parsed.data.message, [
      ['Serial number', parsed.data.serialNumber],
      ['Clinic name', parsed.data.clinicName],
      ['Monthly patients', parsed.data.patientCount],
      ['Interest', parsed.data.interest],
    ]),
    phone: undefined,
    company: parsed.data.clinicName,
    inquiryType: normalizeInquiryType(parsed.data.userType),
  };

  try {
    const response = await fetch(
      await toApiUrl('/api/contact'),
      createApiRequestInit(payload)
    );
    const result = await parseApiResponse<ContactApiResponse>(response);

    if (!result) {
      return {
        success: false,
        message: 'Contact submission failed. Please try again shortly.',
        statusCode: response.status,
      };
    }

    return {
      success: result.success,
      message: result.message,
      ticketId: result.ticketId,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('[formActions] submitContactFormAction failed:', error);
    return {
      success: false,
      message: 'Unable to submit contact request right now. Please try again shortly.',
      statusCode: asFallbackStatusCode(error),
    };
  }
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
  const payload = {
    email: parsed.data.email,
    source: parsed.data.source,
  };

  try {
    const response = await fetch(
      await toApiUrl('/api/newsletter'),
      createApiRequestInit(payload)
    );
    const result = await parseApiResponse<NewsletterApiResponse>(response);

    if (!result) {
      return {
        success: false,
        message: 'Newsletter subscription failed. Please try again.',
        statusCode: response.status,
      };
    }

    if (result.success) {
      updateTag('newsletter');
      revalidateTag('newsletter', 'max');
    }

    return {
      success: result.success,
      message: result.message,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('[formActions] submitNewsletterFormAction failed:', error);
    return {
      success: false,
      message: 'Unable to subscribe right now. Please try again shortly.',
      statusCode: asFallbackStatusCode(error),
    };
  }
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

  const payload = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    preferredDate: parsed.data.preferredDate,
    preferredTime: parsed.data.preferredTime,
    notes: parsed.data.notes,
    bookingType: parsed.data.bookingType,
    techInterest: parsed.data.interest,
  };

  try {
    const response = await fetch(
      await toApiUrl('/api/booking'),
      createApiRequestInit(payload)
    );
    const result = await parseApiResponse<BookingApiResponse>(response);

    if (!result) {
      return {
        success: false,
        message: 'Booking request failed. Please try again.',
        statusCode: response.status,
      };
    }

    return {
      success: result.success,
      message: result.message,
      bookingRef: result.bookingRef,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('[formActions] submitBookingFormAction failed:', error);
    return {
      success: false,
      message: 'Unable to submit booking request right now. Please try again shortly.',
      statusCode: asFallbackStatusCode(error),
    };
  }
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

  const parsedItemsRaw = safeParseJson<unknown>(parsed.data.itemsJson);
  const parsedShippingRaw = safeParseJson<unknown>(parsed.data.shippingJson);

  if (!Array.isArray(parsedItemsRaw) || !parsedShippingRaw) {
    return {
      success: false,
      message: 'Invalid checkout payload.',
    };
  }

  const itemsResult = z.array(checkoutItemSchema).safeParse(parsedItemsRaw);
  const shippingResult = shippingSchema.safeParse(parsedShippingRaw);

  if (!itemsResult.success || !shippingResult.success) {
    return {
      success: false,
      message: 'Invalid checkout payload.',
    };
  }

  const trustedItems = itemsResult.data.map((item) => {
    const unitPriceCents = getTrustedUnitPriceCents(item.id);

    if (!unitPriceCents) {
      return null;
    }

    return {
      id: item.id,
      quantity: item.quantity,
      unitPriceCents,
    };
  });

  if (trustedItems.some((item) => item === null)) {
    return {
      success: false,
      message:
        'One or more cart items are invalid. Please refresh your cart and try again.',
    };
  }

  const resolvedItems = trustedItems.filter(
    (item): item is NonNullable<typeof item> => Boolean(item)
  );

  const totalCents = resolvedItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );

  if (totalCents <= 0) {
    return {
      success: false,
      message: 'Unable to process checkout for this cart.',
    };
  }

  if (parsed.data.paymentMethod === 'card') {
    return {
      success: false,
      message:
        'Card payments are not available in this checkout yet. Please choose bank transfer or financing.',
      statusCode: 503,
    };
  }

  const payload = {
    items: resolvedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
    shipping: shippingResult.data,
    paymentMethod: parsed.data.paymentMethod,
  };

  try {
    const response = await fetch(
      await toApiUrl('/api/checkout'),
      createApiRequestInit(payload)
    );
    const result = await parseApiResponse<CheckoutApiResponse>(response);

    if (!result) {
      return {
        success: false,
        message: 'Checkout failed. Please try again shortly.',
        statusCode: response.status,
      };
    }

    return {
      success: result.success,
      message: result.message,
      orderId: result.orderId,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('[formActions] submitCheckoutFormAction failed:', error);
    return {
      success: false,
      message: 'Unable to process checkout right now. Please try again shortly.',
      statusCode: asFallbackStatusCode(error),
    };
  }
}

export async function submitRentalFormAction(
  _prevState: FormActionResult,
  formData: FormData
): Promise<FormActionResult> {
  const parsed = rentalSchema.safeParse({
    itemsJson: formData.get('itemsJson'),
    userId: formData.get('userId') || undefined,
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    address: formData.get('address'),
    city: formData.get('city'),
    postalCode: formData.get('postalCode'),
    country: formData.get('country'),
    company: formData.get('company') || undefined,
    termMonths: formData.get('termMonths') || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid rental payload.',
      fieldErrors: flattenFieldErrors(parsed.error),
    };
  }

  const parsedItemsRaw = safeParseJson<unknown>(parsed.data.itemsJson);
  if (!Array.isArray(parsedItemsRaw)) {
    return {
      success: false,
      message: 'Invalid rental payload.',
    };
  }

  const itemsResult = z.array(rentalItemSchema).safeParse(parsedItemsRaw);
  if (!itemsResult.success) {
    return {
      success: false,
      message: 'Invalid rental payload.',
      fieldErrors: flattenFieldErrors(itemsResult.error),
    };
  }

  const payload = {
    items: itemsResult.data,
    userId: parsed.data.userId || parsed.data.email,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: parsed.data.city,
    postalCode: parsed.data.postalCode,
    country: parsed.data.country,
    company: parsed.data.company,
    termMonths: parsed.data.termMonths,
  };

  try {
    const response = await fetch(
      await toApiUrl('/api/rental'),
      createApiRequestInit(payload)
    );
    const result = await parseApiResponse<RentalApiResponse>(response);

    if (!result) {
      return {
        success: false,
        message: 'Rental request failed. Please try again shortly.',
        statusCode: response.status,
      };
    }

    return {
      success: result.success,
      message: result.message,
      rentalId: result.rental?.id,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('[formActions] submitRentalFormAction failed:', error);
    return {
      success: false,
      message: 'Unable to submit rental request right now. Please try again shortly.',
      statusCode: asFallbackStatusCode(error),
    };
  }
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
