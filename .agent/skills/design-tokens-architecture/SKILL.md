# SKILL: Design Tokens Architecture
**Used by**: design-system-architect, frontend-specialist

---

## Token Hierarchy
```
Global Tokens (raw values)
    ↓
Alias Tokens (semantic meaning)
    ↓
Component Tokens (component-specific)
```

### Global Tokens (primitives — never use directly in components)
```css
:root {
  /* Color palette */
  --color-blue-100: #EFF6FF;
  --color-blue-500: #3B82F6;
  --color-blue-900: #1E3A5F;
  --color-teal-400: #2DD4BF;
  --color-neutral-50: #F9FAFB;
  --color-neutral-900: #111827;
  --color-white: #FFFFFF;
  
  /* Spacing scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;     /* MINIMUM for body */
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-4xl: 2.25rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}
```

### Alias Tokens (semantic — use these in components)
```css
:root {
  /* Brand colors */
  --color-primary: var(--color-blue-900);
  --color-primary-light: var(--color-blue-500);
  --color-accent: var(--color-teal-400);
  
  /* UI surfaces */
  --color-background: var(--color-white);
  --color-surface: var(--color-neutral-50);
  --color-surface-elevated: var(--color-white);
  
  /* Text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: #6B7280;
  --color-text-inverse: var(--color-white);
  --color-text-muted: #9CA3AF;
  
  /* Status */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: var(--color-blue-500);
  
  /* Device status */
  --color-status-active: var(--color-success);
  --color-status-inactive: var(--color-text-muted);
  --color-status-error: var(--color-error);
  --color-status-maintenance: var(--color-warning);
  
  /* Interactive */
  --color-border: #E5E7EB;
  --color-border-focus: var(--color-accent);
  --focus-ring: 0 0 0 2px var(--color-border-focus);
}
```

### Tailwind Token Integration
```javascript
/* Tailwind v4 CSS-first — define tokens in globals.css with @theme */
@theme {
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
  --color-surface: var(--color-surface);
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

## Component Token Pattern
```css
/* Component-level tokens inherit from alias */
.btn-primary {
  --btn-bg: var(--color-primary);
  --btn-text: var(--color-text-inverse);
  --btn-border: transparent;
  --btn-hover-bg: var(--color-primary-light);
  
  background: var(--btn-bg);
  color: var(--btn-text);
}
```

## Medical UI Status Indicators
```tsx
// ALWAYS use redundant encoding: icon + color + text
const DeviceStatus = ({ status }: { status: DeviceStatus }) => (
  <span className={`status-badge status-${status}`} aria-label={`Status: ${status}`}>
    <StatusIcon status={status} aria-hidden="true" />
    <span>{STATUS_LABELS[status]}</span>
  </span>
);

// Never color-only:
// ❌ <span className="text-green-500">●</span>
// ✅ <span><CheckIcon /> Active</span>
```

## Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-text-primary: #F1F5F9;
    --color-border: #334155;
  }
}
```
