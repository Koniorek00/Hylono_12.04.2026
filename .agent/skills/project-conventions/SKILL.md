# SKILL: Project Conventions
**Used by**: architect-orchestrator, frontend-specialist, backend-specialist, code-skeptic, code-reviewer, docs-specialist, test-engineer, devops-deploy, i18n-specialist

---

## Tech Stack
- **Framework**: React 18 + TypeScript (strict mode)
- **Build**: Vite
- **Styling**: Tailwind CSS + CSS Modules where needed
- **State**: React Context + useState (local), TanStack Query (server)
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod (server-side, always)
- **Auth**: JWT + HttpOnly cookies
- **Testing**: Vitest + React Testing Library + Playwright

## Directory Structure
```
/
├── .agent/           # Agent system (modes, skills, memory)
├── app/              # API routes + server logic
│   ├── api/          # REST endpoints
│   └── rental/       # Rental-specific routes
├── components/       # React components
│   ├── shared/       # Reusable across pages
│   ├── product/      # Product-related components
│   ├── navigation/   # Nav components
│   └── [page]/       # Page-specific components
├── constants/        # Static data, enums, config
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utilities, services, helpers
│   ├── services/     # External service integrations
│   └── rbac/         # Role-based access control
├── prisma/           # Database schema + migrations
├── public/           # Static assets
├── types.ts          # Shared TypeScript types
└── utils/            # Pure utility functions
```

## TypeScript Rules
- `strict: true` — no exceptions
- No `any`. Use `unknown` + type guards.
- Explicit return types on all exported functions
- Interface over type for object shapes (unless union needed)
- Enums for finite sets of values (device status, rental states, etc.)

## Component Conventions
```tsx
// Named exports only
export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return <div>...</div>;
};

// Props interface above component
interface ComponentNameProps {
  prop1: string;
  prop2?: boolean;
}
```

- One component per file
- File name = component name (PascalCase)
- Co-locate: `ComponentName.tsx`, `ComponentName.module.css` (if needed), `ComponentName.test.tsx`

## API Conventions
All API responses use this envelope:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;      // Machine-readable: "RENTAL_NOT_FOUND"
    message: string;   // Human-readable
  };
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
  };
}
```

## Error Handling
```typescript
// Server: Typed error classes
class AppError extends Error {
  constructor(public code: string, message: string, public statusCode = 400) {
    super(message);
  }
}

// Client: Always handle loading + error + empty states
if (isLoading) return <Skeleton />;
if (error) return <ErrorState error={error} />;
if (!data?.length) return <EmptyState />;
```

## Environment Variables
- `.env.local` — local secrets (gitignored)
- `.env.example` — template with placeholder values (committed)
- `.env` — non-secret defaults (committed)
- Never access `process.env` directly in components — use config module

## Git Conventions
- Branch: `feature/slug`, `fix/slug`, `chore/slug`
- Commits: Conventional commits — `feat:`, `fix:`, `docs:`, `chore:`
- No direct commits to `main`

## Code Quality Gates
- ESLint: no warnings in production builds
- TypeScript: no errors (strict)
- All tests pass before merge
- No `console.log` in production code (use structured logger)
- No commented-out code shipped
