# SKILL: WCAG Audit Procedures
**Used by**: accessibility-specialist

---

## Quick Audit Procedure (30 minutes)

### Pass 1: Keyboard Navigation (10 min)
1. Close mouse/trackpad
2. Press Tab through entire page
3. Verify:
   - [ ] All interactive elements reachable
   - [ ] Focus indicator visible at all times (2px minimum, 3:1 contrast)
   - [ ] No keyboard traps (can Tab out of modals, dropdowns)
   - [ ] Skip navigation link as first focusable element
   - [ ] Logical Tab order (follows visual/DOM order)
   - [ ] Dropdowns operable with arrow keys
   - [ ] Modals close with Escape

### Pass 2: Screen Reader (10 min)
Use NVDA+Firefox or VoiceOver+Safari:
1. Navigate by headings (H key in NVDA)
   - [ ] Page has one H1 describing page purpose
   - [ ] Heading hierarchy logical (no skipped levels)
2. Navigate by landmarks (D key in NVDA)
   - [ ] `<main>`, `<nav>`, `<header>`, `<footer>` present
3. Navigate by links (K key)
   - [ ] All links descriptive (no "click here", "read more")
4. Navigate by forms (F key)
   - [ ] All inputs have accessible labels
   - [ ] Error messages associated with inputs

### Pass 3: Automated (10 min)
```bash
# Install axe CLI
pnpm add -D --save-exact @axe-core/playwright
axe https://localhost:3000 --save results.json

# Or in tests:
import { axe } from 'jest-axe';
const { container } = render(<Component />);
expect(await axe(container)).toHaveNoViolations();
```

---

## WCAG 2.2 AA Critical Criteria for Hylono

### 1.4.3 Contrast Minimum (AA)
- Normal text (< 18px or < 14px bold): 4.5:1 ratio minimum
- Large text (≥ 18px or ≥ 14px bold): 3:1 ratio minimum
- Check tool: https://webaim.org/resources/contrastchecker/

### 1.4.11 Non-text Contrast (AA)
- UI components (buttons, inputs, checkboxes): 3:1 against adjacent colors
- Focus indicators: 3:1

### 2.4.7 Focus Visible (AA)
```css
/* Minimum focus style */
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
/* Never: */
:focus { outline: none; } /* ❌ */
```

### 2.5.3 Label in Name (AA)
- Button with icon + text: accessible name must CONTAIN visible text
```tsx
// ❌ Accessible name "menu" doesn't match visible "Open Menu"
<button aria-label="menu"><MenuIcon /> Open Menu</button>

// ✅ Accessible name contains visible text
<button aria-label="Open Menu"><MenuIcon aria-hidden="true" /> Open Menu</button>
// Or just:
<button><MenuIcon aria-hidden="true" /> Open Menu</button>
```

### 4.1.3 Status Messages (AA)
```tsx
// Dynamic content (cart updates, form success, errors)
<div role="status" aria-live="polite">
  {cartMessage}
</div>

// Errors: assertive (immediate announcement)
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

---

## ARIA Patterns for Hylono Components

### Rental Configuration Stepper
```tsx
<nav aria-label="Rental configuration steps">
  <ol>
    {steps.map((step, i) => (
      <li key={step.id}
        aria-current={currentStep === i ? 'step' : undefined}>
        {step.label}
      </li>
    ))}
  </ol>
</nav>
```

### Product Tabs (modality selector)
```tsx
<div role="tablist" aria-label="Product information">
  <button role="tab" 
    aria-selected={activeTab === 'overview'} 
    aria-controls="panel-overview"
    id="tab-overview">
    Overview
  </button>
</div>
<div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview">
  {/* content */}
</div>
```

### Device Status Badge
```tsx
// Icon + color + text (never color alone)
<span className="device-status" role="status">
  <StatusIcon status={status} aria-hidden="true" />
  <span className="sr-only">Device status: </span>
  {STATUS_LABELS[status]}
</span>
```

---

## Testing Matrix
Every component PR requires:
| Test | Tool | Pass Criteria |
|------|------|--------------|
| Automated | axe-core | 0 violations |
| Keyboard nav | Manual | All actions completable |
| Contrast | Colour Contrast Analyser | ≥4.5:1 text, ≥3:1 UI |
| Screen reader | NVDA/VoiceOver spot check | Content makes sense |
| Zoom 200% | Browser zoom | No content lost |
| Mobile 375px | DevTools | No horizontal scroll |
