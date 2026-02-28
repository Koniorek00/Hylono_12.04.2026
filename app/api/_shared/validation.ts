import { z } from 'zod';

export function sanitizeText(input: string, maxLength: number): string {
    return input.trim().replace(/[<>]/g, '').slice(0, maxLength);
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
