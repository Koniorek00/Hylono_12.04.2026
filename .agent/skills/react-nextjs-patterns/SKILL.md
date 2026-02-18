# SKILL: React / Vite Patterns
**Used by**: architect-orchestrator, frontend-specialist

---

## Component Architecture Patterns

### Container/Presentational Split
```tsx
// Container: handles data fetching, state
export const RentalListContainer = () => {
  const { data: rentals, isLoading, error } = useRentals();
  if (isLoading) return <RentalListSkeleton />;
  if (error) return <ErrorState error={error} />;
  return <RentalList rentals={rentals ?? []} />;
};

// Presentational: pure display, no side effects
export const RentalList = ({ rentals }: RentalListProps) => {
  if (!rentals.length) return <EmptyState message="No active rentals" />;
  return <ul>{rentals.map(r => <RentalCard key={r.id} rental={r} />)}</ul>;
};
```

### Custom Hook Pattern
```tsx
// All logic in hook, component stays thin
export const useRentalCheckout = (productId: string) => {
  const [step, setStep] = useState<CheckoutStep>('configure');
  const [config, setConfig] = useState<RentalConfig>({...});
  
  const handleNextStep = useCallback(() => {
    setStep(prev => CHECKOUT_STEPS[CHECKOUT_STEPS.indexOf(prev) + 1]);
  }, []);
  
  return { step, config, setConfig, handleNextStep };
};
```

### Error Boundary Pattern
```tsx
// Wrap each major section, not the whole app
<LazyErrorBoundary fallback={<SectionError />}>
  <ProductDetails productId={id} />
</LazyErrorBoundary>
```

## State Management Rules
| State Type | Solution |
|-----------|---------|
| UI state (open/closed, active tab) | `useState` locally |
| Form state | `useState` or React Hook Form |
| Server data (products, rentals) | TanStack Query |
| Global auth state | React Context |
| Global UI state (cart, theme) | React Context |
| URL state (filters, pagination) | URL search params |

**Never use**: Redux, Zustand, MobX — unless TanStack Query genuinely can't solve it.

## Vite-Specific Performance Patterns

### Code Splitting
```tsx
// Lazy load pages — only load what user navigates to
const StorePage = lazy(() => import('./components/StorePage'));
const RentalCheckout = lazy(() => import('./components/RentalCheckoutPage'));

// Always wrap in Suspense
<Suspense fallback={<PageSkeleton />}>
  <StorePage />
</Suspense>
```

### Bundle Analysis
```bash
# Check what's in the bundle
npm run build -- --analyze
# Or: npx vite-bundle-visualizer
```

## Form Patterns
```tsx
// Controlled form with validation
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (val: string) => {
  if (!val) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(val)) return 'Invalid email format';
  return '';
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const error = validateEmail(email);
  if (error) { setEmailError(error); return; }
  // submit...
};
```

## Accessibility in React
```tsx
// Dialog/Modal
<dialog aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">Rental Configuration</h2>
  {/* Focus trap via useFocusTrap hook */}
</dialog>

// Dynamic content announcements
<div aria-live="polite" aria-atomic="true">
  {status && <span>{status}</span>}
</div>

// Loading states
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? 'Processing...' : 'Start Rental'}
</button>
```

## Common Anti-Patterns to Avoid
```tsx
// ❌ Effect for derived state
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Computed directly
const fullName = `${firstName} ${lastName}`;

// ❌ Unnecessary memo
const value = useMemo(() => items.length > 0, [items]); // cheap calc

// ✅ Just compute it
const hasItems = items.length > 0;

// ❌ Index as key (reordering breaks state)
{items.map((item, i) => <Item key={i} {...item} />)}

// ✅ Stable ID as key
{items.map(item => <Item key={item.id} {...item} />)}
```
