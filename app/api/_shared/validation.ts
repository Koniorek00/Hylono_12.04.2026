import { z } from 'zod';

const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MULTI_WHITESPACE_REGEX = /\s{2,}/g;
const EMAIL_ALLOWED_REGEX = /[^a-z0-9._%+@-]/g;
const PHONE_ALLOWED_REGEX = /[^0-9+()\-\s]/g;
const SLUG_ALLOWED_REGEX = /[^a-z0-9-]/g;

export type SanitizeTextContext =
    | 'default'
    | 'email'
    | 'phone'
    | 'slug'
    | 'multiline';

export interface SanitizeTextOptions {
    maxLength: number;
    context?: SanitizeTextContext;
}

const removeUnsafeCharacters = (value: string): string =>
    value
        .replace(CONTROL_CHARS_REGEX, '')
        .replace(/[<>]/g, '');

const normalizeNewlines = (value: string): string =>
    value.replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n');

const sanitizeByContext = (input: string, context: SanitizeTextContext): string => {
    if (context === 'email') {
        return input
            .trim()
            .toLowerCase()
            .replace(MULTI_WHITESPACE_REGEX, '')
            .replace(EMAIL_ALLOWED_REGEX, '');
    }

    if (context === 'phone') {
        return input
            .trim()
            .replace(PHONE_ALLOWED_REGEX, '')
            .replace(MULTI_WHITESPACE_REGEX, ' ');
    }

    if (context === 'slug') {
        return input
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(SLUG_ALLOWED_REGEX, '')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    if (context === 'multiline') {
        return normalizeNewlines(input.trim())
            .replace(/\t/g, ' ')
            .replace(/ {2,}/g, ' ');
    }

    return input.trim().replace(MULTI_WHITESPACE_REGEX, ' ');
};

function resolveSanitizeOptions(
    maxLengthOrOptions: number | SanitizeTextOptions
): SanitizeTextOptions {
    if (typeof maxLengthOrOptions === 'number') {
        return {
            maxLength: maxLengthOrOptions,
            context: 'default',
        };
    }

    return {
        maxLength: maxLengthOrOptions.maxLength,
        context: maxLengthOrOptions.context ?? 'default',
    };
}

export function sanitizeText(
    input: string,
    maxLengthOrOptions: number | SanitizeTextOptions
): string {
    const { maxLength, context = 'default' } = resolveSanitizeOptions(maxLengthOrOptions);
    const safeLength = Number.isFinite(maxLength) && maxLength > 0
        ? Math.floor(maxLength)
        : 1;

    const normalized = sanitizeByContext(removeUnsafeCharacters(input), context);
    return normalized.slice(0, safeLength);
}

export function sanitizeTextWithContext(
    input: string,
    options: SanitizeTextOptions
): string {
    return sanitizeText(input, options);
}

export async function readJsonBody(request: Request): Promise<unknown> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

export function flattenFieldErrors(error: z.ZodError): Record<string, string[]> | undefined {
    const flattened = z.flattenError(error);
    const fieldErrors: Record<string, string[]> = {};

    for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
        if (Array.isArray(messages) && messages.length > 0) {
            fieldErrors[field] = messages;
        }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function validationErrorResponse(error: z.ZodError, fallbackMessage = 'Invalid request payload.'): Response {
    const fields = flattenFieldErrors(error);
    const firstIssue = error.issues[0]?.message;

    return Response.json(
        {
            success: false,
            message: firstIssue || fallbackMessage,
            ...(fields ? { fieldErrors: fields } : {}),
        },
        { status: 400 }
    );
}
