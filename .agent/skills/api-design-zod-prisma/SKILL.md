# SKILL: API Design — Zod + Prisma
**Used by**: architect-orchestrator, backend-specialist

---

## Endpoint Design Principles

### Route Structure
```
/api/v1/
  products/              GET (list), POST (create)
  products/:id           GET, PUT, DELETE
  rentals/               GET (list), POST (create)
  rentals/:id            GET, PUT
  rentals/:id/state      PUT (state transitions only)
  users/:id/rentals      GET (user's rentals)
```

### HTTP Methods
| Method | Use | Body | Idempotent |
|--------|-----|------|-----------|
| GET | Read | None | ✅ Yes |
| POST | Create | Required | ❌ No |
| PUT | Replace | Required | ✅ Yes |
| PATCH | Partial update | Partial | ✅ Yes |
| DELETE | Remove | None | ✅ Yes |

---

## Zod Validation Patterns

### Request Schema Pattern
```typescript
import { z } from 'zod';

// Define schema
const CreateRentalSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  duration: z.enum(['7d', '30d', '90d']),
  startDate: z.string().datetime().optional(),
  protocolId: z.string().uuid().optional(),
  addressId: z.string().uuid('Delivery address required'),
});

// Infer type from schema (single source of truth)
type CreateRentalInput = z.infer<typeof CreateRentalSchema>;

// Usage in handler
const handler = async (req: Request) => {
  const result = CreateRentalSchema.safeParse(req.body);
  if (!result.success) {
    return Response.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: result.error.message }
    }, { status: 400 });
  }
  const data = result.data; // typed as CreateRentalInput
};
```

### Common Zod Validators for Hylono
```typescript
// Reusable field validators
const UUIDField = z.string().uuid();
const EmailField = z.string().email().toLowerCase();
const PhoneField = z.string().regex(/^\+[1-9]\d{1,14}$/, 'Use international format: +31...');
const PriceField = z.number().int().positive(); // store as cents
const DateField = z.string().datetime();

// Rental duration enum
const RentalDuration = z.enum(['7d', '30d', '60d', '90d', 'custom']);

// Rental state enum
const RentalState = z.enum([
  'available', 'reserved', 'active', 'returning', 'returned', 'maintenance', 'damaged', 'lost'
]);
```

---

## Prisma Patterns

### Schema Design Rules
```prisma
// Every model needs:
model Rental {
  id          String      @id @default(cuid())
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  // State with enum (not raw string)
  state       RentalState @default(AVAILABLE)
  
  // Relations with explicit names
  user        User        @relation("UserRentals", fields: [userId], references: [id])
  userId      String
  
  // Soft delete (never hard delete rental records)
  deletedAt   DateTime?
  
  @@index([userId])        // Index foreign keys
  @@index([state])         // Index commonly filtered fields
}

enum RentalState {
  AVAILABLE
  RESERVED
  ACTIVE
  RETURNING
  RETURNED
  MAINTENANCE
  DAMAGED
  LOST
}
```

### Query Patterns
```typescript
// Always select only needed fields
const rental = await prisma.rental.findUnique({
  where: { id: rentalId },
  select: {
    id: true,
    state: true,
    user: { select: { id: true, email: true } },
    // Don't select: passwordHash, internal fields
  }
});

// Pagination (always paginate list endpoints)
const rentals = await prisma.rental.findMany({
  where: { userId, deletedAt: null },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: (page - 1) * limit,
});

// Transactions for state changes (atomic)
const result = await prisma.$transaction(async (tx) => {
  const rental = await tx.rental.update({
    where: { id: rentalId },
    data: { state: 'ACTIVE' }
  });
  await tx.rentalEvent.create({
    data: { rentalId, event: 'ACTIVATED', timestamp: new Date() }
  });
  return rental;
});
```

### N+1 Prevention
```typescript
// ❌ N+1: separate query per rental
const rentals = await prisma.rental.findMany();
for (const rental of rentals) {
  rental.user = await prisma.user.findUnique({ where: { id: rental.userId } });
}

// ✅ Eager load with include
const rentals = await prisma.rental.findMany({
  include: { user: { select: { id: true, name: true } } }
});
```

---

## API Security Checklist
- [ ] Auth middleware applied before handler
- [ ] User can only access their own resources (ownership check)
- [ ] Admin routes protected by role check
- [ ] Rate limiting on auth + payment endpoints
- [ ] Input validated with Zod before any DB access
- [ ] Errors sanitized — no stack traces to client
- [ ] Idempotency key on POST endpoints (payments, rentals)
