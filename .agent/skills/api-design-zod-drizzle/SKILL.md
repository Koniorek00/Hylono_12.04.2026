# SKILL: API Design — Zod + Drizzle (Next.js 16)
**Used by**: architect-orchestrator, backend-specialist

## Core Rules
- Validate every input with Zod server-side
- Use Drizzle for DB access only
- Prefer Server Actions for mutations
- Use `route.ts` for webhooks/external integrations only
- Enforce auth + ownership checks on protected resources
- Avoid PII in logs and API error details

## Response Envelope
```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; total?: number; limit?: number };
}
```

## Validation Pattern
```ts
const Schema = z.object({ id: z.string().uuid() });
const parsed = Schema.safeParse(input);
if (!parsed.success) return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } };
```

## Drizzle Patterns
- Select only required columns
- Paginate list endpoints
- Use transactions for multi-step state changes
- Add indexes for frequent filters
- Never modify already-applied migrations

## Security Checklist
- Zod validation before DB operations
- Auth checks before mutations
- Idempotency key on payment-sensitive endpoints
- Arcjet protection for public endpoints
- Sanitized errors to client

## Rental State Safety
Handle allowed transitions explicitly:
`available -> reserved -> active -> returning -> returned -> maintenance -> available`
