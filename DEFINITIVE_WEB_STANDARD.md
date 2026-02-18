# ⚡ THE DEFINITIVE WEB DEVELOPMENT STANDARD
## For AI Coding Agents — Read Before Every Task

> **Version**: 2.2 (2024) — Production-Ready Edition  
> **Purpose**: Prescriptive standards for building high-performance, accessible web applications  
> **Audience**: AI agents, senior developers, technical leads

---

## 📖 HOW TO USE THIS DOCUMENT

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER SYSTEM:                                                   │
│  🏆 S-TIER → Use on EVERY project. Highest impact.              │
│  ⭐ A-TIER → Use on production apps. Major quality boost.       │
│  ✓  B-TIER → Use when relevant. Nice-to-have polish.           │
│  ❌ NEVER  → Anti-patterns. Causes bugs or performance issues.  │
│                                                                 │
│  MARKERS:                                                       │
│  ✂️ COPY THIS    → Reference implementation, use as-is          │
│  ⚠️ DANGEROUS    → Easy to misuse, read carefully               │
│  🎯 DECISION     → Flowchart for choosing approach              │
│  💡 WHY         → Explanation of underlying principle           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 FOUNDATIONAL KNOWLEDGE: THE BROWSER RENDERING PIPELINE

**💡 WHY THIS MATTERS**: Every performance decision stems from understanding what makes browsers slow.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BROWSER RENDERING PIPELINE                       │
│                                                                     │
│  JavaScript → Style Calc → Layout → Paint → Composite              │
│                                                                     │
│  🔴 LAYOUT (Most Expensive — AVOID)                                 │
│  ├── Triggered by: width, height, margin, padding, top, left,      │
│  │   position, display, font-size, border-width                    │
│  ├── Effect: Recalculates geometry of ALL affected elements        │
│  └── Cost: ~10-50ms. Blocks main thread. User sees jank.           │
│                                                                     │
│  🟡 PAINT (Moderate — OK for transitions)                           │
│  ├── Triggered by: color, background, box-shadow, border-color     │
│  ├── Effect: Rasterizes pixels into layers                         │
│  └── Cost: ~2-10ms. CPU-bound. OK for hover states.                │
│                                                                     │
│  🟢 COMPOSITE (Cheapest — USE FOR ANIMATIONS)                       │
│  ├── Triggered by: transform, opacity, filter, clip-path           │
│  ├── Effect: Moves/blends pre-painted layers on GPU                │
│  └── Cost: <1ms. Runs on dedicated GPU thread. 60fps guaranteed.   │
│                                                                     │
│  🎯 RULE: Animate composite properties. Transition paint properties.│
│          Never animate layout properties.                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 1: CSS PERFORMANCE 🏆

## 1.1 — Animation Properties [S-TIER]

```css
/* 🟢 COMPOSITE-ONLY — Animate these freely (GPU, 60fps) */
.element {
  transform: translateX(100px) scale(1.05) rotate(5deg);
  opacity: 0.8;
  filter: blur(4px) brightness(1.1);
  clip-path: circle(50%);
}

/* 🟡 GPU-ACCELERATED BUT EXPENSIVE */
.element {
  backdrop-filter: blur(8px);
  /*
    ⚠️ Reads background pixels — heavier than regular filter
    - Limit blur radius to 12px on mobile
    - Avoid on full-screen elements on low-end devices
    - Never animate the blur value itself
    - Acceptable for navbars, modals, small overlays
  */
}

/* 🟡 PAINT-ONLY — Acceptable for transitions, not continuous animation */
.element {
  color: #333;
  background-color: #f0f0f0;
  border-color: #ddd;
  /* These repaint but don't relayout. Fine for :hover transitions. */
}

/* 🔴 LAYOUT-TRIGGERING — Never animate these */
.element {
  width: 200px;        /* ❌ Use transform: scaleX() instead */
  height: 200px;       /* ❌ Use transform: scaleY() instead */
  margin: 10px;        /* ❌ Use transform: translate() instead */
  padding: 20px;       /* ❌ Restructure to avoid animating */
  top: 50px;           /* ❌ Use transform: translateY() instead */
  left: 50px;          /* ❌ Use transform: translateX() instead */
  font-size: 18px;     /* ❌ Use transform: scale() instead */
}
```

**🎯 DECISION: What property should I animate?**

```
Does it move/resize visually?
├─ YES → Use transform: translate() / scale() / rotate()
└─ NO  → Does it fade in/out?
    ├─ YES → Use opacity
    └─ NO  → Does it blur/color-shift?
        ├─ YES → Use filter (paint-only, OK for :hover)
        └─ NO  → Reconsider if animation is necessary
```

---

## 1.2 — `will-change` [⚠️ DANGEROUS - READ CAREFULLY]

```css
/* ❌ CATASTROPHIC: Applying will-change globally */
* { will-change: transform; }
.animated { will-change: transform; } /* Permanent allocation */

/*
  💡 WHY THIS IS WRONG:
  - will-change creates a NEW compositor layer
  - Each layer consumes GPU VRAM (video memory)
  - 10 layers = ~20-60MB VRAM (fine)
  - 50 layers = ~200-300MB VRAM (mobile GPU exhaustion)
  - 200 layers = Browser crash on low-end devices
  
  Mobile devices share 256MB-1GB VRAM between ALL apps.
  Overuse DEGRADES performance — opposite of intent.
*/

/* ✅ CORRECT: Apply right before animation, remove after */
.card {
  transition: transform 0.3s ease;
  /* NO will-change by default */
}

.card:hover {
  will-change: transform; /* Browser creates layer just before needed */
  transform: translateY(-4px);
}
```

```javascript
/* ✂️ COPY THIS: JavaScript-managed will-change for complex animations */
const element = document.querySelector('.animated');

element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform, opacity';
});

element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto'; // ⚠️ CRITICAL: Release the GPU layer
});

element.addEventListener('animationend', () => {
  element.style.willChange = 'auto';
});
```

**🎯 VERIFICATION**: Check layer count
```
Chrome DevTools → More Tools → Layers
If you see 20+ layers: You're overusing will-change
```

**📊 LIMITS**:
- **Maximum 10-15 active `will-change` declarations simultaneously**
- **Verify with**: Chrome DevTools → Layers panel
- **Never use on**: Static elements, elements that rarely animate

---

## 1.3 — Content Visibility [🏆 S-TIER]

```css
/*
  💡 WHY S-TIER:
  - Single biggest CSS performance feature most developers don't use
  - Reduces initial render time by 30-60% on long pages
  - Zero JavaScript required
  - Browser skips layout, paint, style for off-screen content
  
  Real-world impact: 7x rendering improvement measured
*/

/* ✅ Apply to page sections, cards, list items */
.page-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
  /*
    contain-intrinsic-size = ESTIMATED height
    'auto' prefix = browser remembers real height after first render
    Prevents scrollbar jumping when sections render
  */
}

/* ✅ Example: Blog post with many sections */
.blog-section {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}

/* ✅ Example: Product cards in a grid */
.product-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 320px;
}

/* ❌ NEVER on above-the-fold content */
.hero {
  /* NO content-visibility here — must render immediately for LCP */
}
```

**✅ COMBINE with CSS containment for maximum optimization**:

```css
.isolated-widget {
  contain: layout style paint;
  /*
    layout: Internal layout changes don't affect outside elements
    style: CSS counter/quote changes don't leak
    paint: Content doesn't paint outside bounds
    
    Browser recalculates ONLY this subtree when it changes,
    not the entire page.
  */
}
```

---

## 1.4 — Passive Event Listeners [🏆 S-TIER]

```javascript
/*
  💡 THIS IS THE #1 MOBILE SCROLL JANK FIX
  
  One-line change. Massive impact.
  More important than any debounce/throttle timing.
*/

/* ❌ WITHOUT passive: Browser BLOCKS scrolling until JS finishes */
window.addEventListener('scroll', handler);
window.addEventListener('touchstart', handler);
// Browser must wait for JS to check if you call preventDefault()
// User sees: Janky, delayed scrolling

/* ✅ WITH passive: Browser scrolls IMMEDIATELY */
window.addEventListener('scroll', handler, { passive: true });
window.addEventListener('touchstart', handler, { passive: true });
window.addEventListener('touchmove', handler, { passive: true });
window.addEventListener('wheel', handler, { passive: true });
// Browser scrolls on compositor thread while JS runs in parallel
// User sees: Buttery smooth scrolling

/*
  💡 WHY:
  Without passive, browser blocks scrolling ~100-300ms per event
  waiting for your JS to complete — in case you call preventDefault().
  
  With passive, browser knows you WON'T call preventDefault(),
  so it scrolls immediately on the GPU compositor thread.
  
  Your JavaScript still runs — it just can't block the scroll.
*/

/* ❌ ONLY use non-passive when you NEED preventDefault */
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent page scroll while drawing
  handleDraw(e);
}, { passive: false }); // Explicit opt-in to blocking
```

**🎯 WHEN TO USE**:
- Scroll handlers → `{ passive: true }` ✅
- Touch handlers (not preventing scroll) → `{ passive: true }` ✅
- Wheel handlers (not preventing scroll) → `{ passive: true }` ✅
- Drawing/dragging (need preventDefault) → `{ passive: false }` ⚠️

---

## 1.5 — Responsive Design: Mobile-First [🏆 S-TIER]

```css
/*
  💡 WHY MOBILE-FIRST:
  1. Mobile CSS is simpler (single column, stacked)
  2. Desktop ADDS features (multi-column, hover, spacing)
  3. Mobile users on slow connections download LESS CSS
  4. Forces content hierarchy prioritization
  
  60%+ of traffic is mobile. Design for mobile, enhance for desktop.
*/

/* ✂️ COPY THIS PATTERN */
.grid {
  /* BASE = MOBILE (360px minimum — 320px is <2% of traffic) */
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet: 640px+ */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 2rem;
  }
}

/* Wide: 1280px+ */
@media (min-width: 1280px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
    margin-inline: auto;
  }
}
```

**✂️ COPY THIS: Auto-responsive grid (zero media queries)**:

```css
/*
  💡 NO MEDIA QUERIES NEEDED
  Grid automatically adjusts columns based on available space
*/
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill, 
    minmax(min(280px, 100%), 1fr)
  );
  gap: 1.5rem;
}

/*
  HOW IT WORKS:
  - auto-fill: Creates as many columns as fit
  - minmax(280px, 1fr): Each column 280px-flexible
  - min(280px, 100%): Prevents overflow on <280px screens
  
  RESULT:
  320px screen  → 1 column
  640px screen  → 2 columns
  960px screen  → 3 columns
  1280px screen → 4 columns
*/
```

---

## 1.6 — Fluid Typography with `clamp()` [⭐ A-TIER]

```css
/*
  💡 WHY BETTER THAN BREAKPOINTS:
  - Scales SMOOTHLY instead of jumping
  - Reduces CSS from 50+ lines to 5 lines
  - No media queries needed
  - Mathematically scales between screen sizes
*/

/* ✂️ COPY THIS: Production-ready scale */
:root {
  /* Headings */
  --text-hero:     clamp(2.5rem, 5vw + 1rem, 5rem);      /* 40px → 80px */
  --text-h1:       clamp(2rem, 4vw + 0.5rem, 3.5rem);    /* 32px → 56px */
  --text-h2:       clamp(1.5rem, 3vw + 0.5rem, 2.5rem);  /* 24px → 40px */
  --text-h3:       clamp(1.25rem, 2vw + 0.5rem, 1.75rem);/* 20px → 28px */
  
  /* Body text */
  --text-body:     clamp(0.938rem, 1vw + 0.5rem, 1.125rem); /* 15px → 18px */
  --text-small:    clamp(0.813rem, 0.8vw + 0.5rem, 0.938rem);/* 13px → 15px */
  
  /* Spacing (also fluid) */
  --space-section: clamp(3rem, 8vw, 8rem);     /* 48px → 128px */
  --space-element: clamp(1rem, 3vw, 2.5rem);   /* 16px → 40px */
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
p  { font-size: var(--text-body); }
.section { padding-block: var(--space-section); }
```

**📐 FORMULA EXPLAINED**:
```
clamp(MIN, PREFERRED, MAX)

Example: clamp(1rem, 2vw + 0.5rem, 2rem)

At 320px viewport:  2vw = 6.4px,  + 0.5rem(8px) = 14.4px → clamped to 1rem (16px)
At 768px viewport:  2vw = 15.4px, + 8px = 23.4px → 23.4px (within range)
At 1920px viewport: 2vw = 38.4px, + 8px = 46.4px → clamped to 2rem (32px)
```

---

## 1.7 — Viewport Units: Use the Right One [⭐ A-TIER]

```css
/*
  ⚠️ COMMON MISTAKE: Using vh on mobile
  
  vh includes URL bar height → when user scrolls and URL bar
  collapses, elements sized with vh suddenly jump/resize.
*/

/* ❌ BROKEN ON MOBILE */
.hero {
  height: 100vh; /* Content hidden behind URL bar on mobile */
}

/* ✅ CORRECT: Use svh for content sections (stable) */
.hero {
  min-height: 100svh; /* Stable — won't resize on scroll */
}

/* ✅ CORRECT: Use dvh for overlays (dynamic) */
.fullscreen-modal {
  height: 100dvh; /* Adjusts as URL bar shows/hides */
}
```

**🎯 DECISION: Which viewport unit?**

```
What type of element?
├─ Hero section / content area   → svh (stable, never resizes)
├─ Full-screen overlay / modal   → dvh (always fills screen)
├─ Background decoration         → lvh (maximum height)
└─ DEFAULT for most sections     → svh
```

**📊 VIEWPORT UNIT REFERENCE**:

| Unit | Full Name | URL bar included? | Changes on scroll? | Use Case |
|------|-----------|-------------------|-------------------|----------|
| `vh` | Viewport Height | Yes | No | ❌ Avoid (legacy) |
| `svh` | Small VH | Yes | No | ✅ Default for sections |
| `dvh` | Dynamic VH | Varies | Yes | ✅ Modals, overlays |
| `lvh` | Large VH | No | No | ✓ Background elements |

```css
/* ✂️ COPY THIS: Best practice usage */
.hero-section {
  min-height: 100svh; /* Stable minimum — content never hidden */
}

.fullscreen-modal {
  height: 100dvh; /* Dynamic — always fills available space */
}

.background-layer {
  height: 100lvh; /* Maximum space — decorative only */
}

/* Fallback for older browsers */
.hero {
  min-height: 100vh;    /* Fallback */
  min-height: 100svh;   /* Modern browsers override */
}
```

**💡 WHY min-height NOT height**:
- `height: 100dvh` will CROP content if content is taller than viewport
- `min-height: 100dvh` allows content to expand beyond viewport

---

## 1.8 — Container Queries [⭐ A-TIER]

```css
/*
  💡 WHY REVOLUTIONARY:
  @media queries respond to VIEWPORT width.
  @container queries respond to PARENT ELEMENT width.
  
  Essential for reusable components in different contexts.
*/

/* ✂️ COPY THIS: Define containment context */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Component responds to ITS container, not viewport */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

**🎯 WHEN TO USE**:
- `@media` → Page-level responsive design
- `@container` → Component-level responsive design

---

## 1.9 — Touch Targets [🏆 S-TIER for Mobile]

```css
/*
  📱 MOBILE IS 60%+ OF TRAFFIC
  
  WCAG 2.5.8 (Level AA — MUST meet):  24×24px minimum
  WCAG 2.5.5 (Level AAA — SHOULD meet): 44×44px minimum
  Apple HIG / Material Design:          44-48px recommended
  
  RECOMMENDATION: Target 44×44px — satisfies all standards.
*/

/* ✅ CORRECT: Adequate touch targets */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* ✅ For visually small icon buttons */
.icon-button {
  position: relative;
  width: 24px;   /* Visual size */
  height: 24px;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;   /* Actual touch area */
  height: 44px;
}
```

---

## 1.10 — Modern CSS Reset [🏆 S-TIER]

```css
/* ✂️ COPY THIS: Modern CSS reset with latest features */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  hanging-punctuation: first last;
  color-scheme: light dark;  /* Tells browser which schemes you support */
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

body {
  min-height: 100svh;
  line-height: 1.6;
  font-family: system-ui, -apple-system, sans-serif;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input, button, textarea, select {
  font: inherit;
  color: inherit;
}

/* ⭐ MODERN TEXT WRAPPING */
h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
  text-wrap: balance;  /* Evens out line lengths in headings */
}

p {
  text-wrap: pretty;   /* Prevents orphaned single word on last line */
}

a {
  color: inherit;
  text-decoration: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* ⚠️ PRESERVE informative/essential animations */
  .progress-bar,
  .loading-spinner,
  [data-essential-motion="true"] {
    animation-duration: revert !important;
    animation-iteration-count: revert !important;
    transition-duration: revert !important;
  }
}
```

---

## 1.11 — Logical Properties [⭐ A-TIER]

```css
/*
  💡 ESSENTIAL FOR INTERNATIONALIZATION
  Automatic RTL (Arabic, Hebrew) support
  Future-proofs your CSS
*/

/* ❌ PHYSICAL — breaks in RTL */
.card {
  margin-left: 16px;
  padding-right: 24px;
  border-left: 3px solid blue;
  text-align: left;
}

/* ✅ LOGICAL — works in LTR and RTL */
.card {
  margin-inline-start: 16px;
  padding-inline-end: 24px;
  border-inline-start: 3px solid blue;
  text-align: start;
}

/* SHORTHAND equivalents */
.element {
  margin-inline: 16px;      /* left + right */
  padding-block: 24px;      /* top + bottom */
  inset-inline: 0;          /* left: 0; right: 0 */
  border-inline: 1px solid; /* left + right borders */
}

/*
  REFERENCE:
  left/right  → inline-start/inline-end
  top/bottom  → block-start/block-end
  width       → inline-size
  height      → block-size
  margin-left → margin-inline-start
*/
```

---

## 1.12 — CSS Scroll-Driven Animations [⭐ A-TIER]

```css
/*
  💡 ZERO JAVASCRIPT. COMPOSITOR THREAD ONLY.
  Perfect performance by definition.
  
  BROWSER SUPPORT (late 2024):
  Chrome/Edge 115+:  ✅ Full support
  Firefox 110+:      ✅ Full support (shipped Feb 2023)
  Safari:            ❌ Not supported (as of Safari 18.1)
  
  STRATEGY: Progressive enhancement with fallback.
*/

/* ✂️ COPY THIS: Fade-in on scroll with fallback */
.scroll-reveal {
  /* Fallback: visible by default */
  opacity: 1;
  transform: translateY(0);
}

@supports (animation-timeline: view()) {
  @keyframes fade-slide-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .scroll-reveal {
    animation: fade-slide-in linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 100%;
  }
}

/* ✂️ COPY THIS: Scroll progress bar */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--accent-color);
  transform-origin: left;
  transform: scaleX(0);  /* Hidden by default in unsupported browsers */
}

@supports (animation-timeline: scroll()) {
  .progress-bar {
    animation: grow-progress linear;
    animation-timeline: scroll();
  }
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

**🎯 USE FOR**:
- Scroll-linked reveal animations ✅
- Progress bars ✅
- Parallax effects ✅
- Header shrink on scroll ✅

**🎯 USE IntersectionObserver/Framer Motion FOR**:
- Complex choreographed animations
- Conditional logic (animate once vs repeat)
- Spring physics
- Stagger patterns

---

## 1.13 — Shadows [⭐ A-TIER]

```css
/* ✂️ COPY THIS: Animated shadows via pseudo-element */
.card {
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-2px);
}

.card:hover::after {
  opacity: 1; /* GPU-composited, zero layout cost */
}
```

---

## 1.13A — Borders vs Ring vs Outline [⭐ A-TIER]

```css
/*
  💡 THE DIFFERENCE IS LAYOUT BEHAVIOR
  Getting this wrong causes layout shift on hover/focus.
*/

/* BORDER: Part of box model — AFFECTS layout */
.input {
  border: 1px solid #d1d5db;
  /* Element is 2px wider + taller */
  /* Changing border-width causes LAYOUT SHIFT */
}

/* ✂️ COPY THIS: Prevent shift with transparent border */
.card {
  border: 2px solid transparent;  /* Space always allocated */
}
.card:hover {
  border-color: #3b82f6;  /* No shift — space was reserved */
}

/* OUTLINE: NEVER affects layout — best for focus */
.button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  /* Doesn't increase element dimensions */
}

/* RING (box-shadow): NEVER affects layout — combinable */
.card:focus-visible {
  box-shadow:
    0 0 0 2px #3b82f6,              /* Focus ring */
    0 4px 12px rgba(0, 0, 0, 0.1);  /* Elevation shadow */
  /* Both in one property — impossible with outline */
}
```

**🎯 DECISION: When to use each**:
- **`border`**: Static visible borders (input fields, cards)  
  → Always reserve space with `transparent` to prevent shift
- **`outline`**: Keyboard focus indicators (best accessibility support)  
  → Screen readers announce it, doesn't affect layout
- **`ring` (box-shadow)**: Interactive states that need elevation shadows  
  → Can combine focus ring + drop shadow in single property

---

## 1.14 — Gradients with oklch [⭐ A-TIER]

```css
/* ✅ MODERN: oklch = perceptually uniform, vibrant */
.gradient-vibrant {
  background: linear-gradient(
    in oklch,
    oklch(65% 0.25 30),
    oklch(55% 0.22 270)
  );
}

/* 
  💡 NOTE: Both forms valid:
  oklch(65% 0.25 30)   ← percentage (more readable)
  oklch(0.65 0.25 30)  ← decimal
  
  Be consistent within your project.
*/
```

---

## 1.15 — Font Loading [🏆 S-TIER]

```html
<!-- STEP 1: Preload critical fonts -->
<link rel="preload" 
      href="/fonts/inter-var-latin.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>
```

```css
/* STEP 2: @font-face with font-display */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF;
}

/* STEP 3: Size-adjusted fallback */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

/* STEP 4: Font stack */
body {
  font-family: 'Inter', 'Inter Fallback', system-ui, sans-serif;
}
```

---

## 1.16 — Color Contrast [🏆 S-TIER - Legal Requirement]

```css
/*
  ⚠️ LEGAL REQUIREMENT in many jurisdictions (ADA, EN 301 549)
  #1 most common accessibility violation on the web.
  
  AI agents frequently generate low-contrast placeholder text.
  Without explicit ratios, agents will use #999 on white (fails).
  
  WCAG 2.1 Level AA (MUST meet):
  - Normal text (<18px):          4.5:1 contrast ratio
  - Large text (≥18px bold/24px): 3:1 contrast ratio
  - UI components & graphics:     3:1 contrast ratio
  
  WCAG 2.1 Level AAA (SHOULD meet for body text):
  - Normal text: 7:1
  - Large text:  4.5:1
*/

/* ✂️ COPY THIS: Safe color values */
:root {
  /* ✅ All pass WCAG AA on white background */
  --text-primary:   #1a1a1a;  /* 16.8:1 on white ✅ */
  --text-secondary: #525252;  /* 7.4:1 on white  ✅ */
  --text-muted:     #737373;  /* 4.6:1 on white  ✅ barely AA */
  --text-disabled:  #a3a3a3;  /* 2.7:1 on white  ❌ FAILS AA */
}

/* ❌ COMMON FAILURES — Do NOT use these */
.bad-placeholder {
  color: #c0c0c0; /* 1.6:1 — FAILS. Invisible to many users. */
}

.bad-gray-text {
  color: #999;    /* 2.8:1 — FAILS AA for normal text */
}

.bad-light-gray {
  color: #a3a3a3; /* 2.7:1 — FAILS AA */
}

/* ✅ DARK MODE: Avoid pure white on pure black */
.dark-mode {
  background: #0a0a0a;
  color: #e5e5e5;  /* 16.5:1 — high but comfortable */
  /* 
    NOT #ffffff on #000000
    - 21:1 contrast ratio is TOO HIGH
    - Causes halation (glow effect) on OLED screens
    - Creates eye strain from extreme brightness difference
  */
}
```

**🔍 TESTING TOOLS**:
```
1. Chrome DevTools → Color picker shows contrast ratio
2. https://webaim.org/resources/contrastchecker/
3. DevTools → Rendering → Emulate vision deficiencies
4. axe DevTools extension (automated bulk checking)
```

**📊 MINIMUM REQUIREMENTS TABLE**:

| Element Type | WCAG AA | WCAG AAA | Recommendation |
|--------------|---------|----------|----------------|
| Body text (<18px) | 4.5:1 | 7:1 | Use AAA (7:1) for readability |
| Large text (≥18px bold, ≥24px) | 3:1 | 4.5:1 | Use AA minimum |
| UI components (buttons, icons) | 3:1 | N/A | Always meet AA |
| Disabled text | N/A | N/A | Contrast not required (but UX suffers) |

---

## 1.17 — Motion Preferences [🏆 S-TIER - Legal Requirement]

```css
/*
  ⚠️ LEGAL REQUIREMENT in many jurisdictions (ADA, EN 301 549)
  
  Users with vestibular disorders, motion sensitivity, or epilepsy
  set this OS-level preference.
  
  Your CSS reset in Section 1.10 handles the global override ✅
  But components also need individual awareness.
*/
```

**💡 WHY 0.01ms INSTEAD OF 0**:
```css
/*
  animation-duration: 0 skips to end but some browsers
  don't fire animationend events.
  0.01ms ensures animation technically "runs" and
  all callbacks fire correctly.
*/
```

**✂️ COPY THIS: React/Framer Motion awareness**:

```javascript
import { useReducedMotion } from 'framer-motion';

function AnimatedCard({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: shouldReduce ? 0 : 20  // Skip movement
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduce 
        ? { duration: 0 }  // Instant
        : { type: "spring", stiffness: 200, damping: 25 }
      }
    >
      {children}
    </motion.div>
  );
}

// ✂️ COPY THIS: Vanilla JS detection
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable parallax, auto-play, complex animations
  disableParallax();
  pauseAutoPlayCarousel();
}
```

**🎯 WHAT TO KEEP with reduced motion**:
- ✅ Opacity fades (generally safe for vestibular disorders)
- ✅ Color transitions
- ✅ Essential loading indicators (use opacity pulse, not spin)
- ✅ Progress bars (informative, not decorative)

**🎯 WHAT TO REMOVE**:
- ❌ Parallax scrolling
- ❌ Auto-playing carousels/sliders
- ❌ Scale/zoom animations
- ❌ Horizontal/vertical slide animations
- ❌ Background video autoplay
- ❌ Rotation animations (like spinners — use pulse instead)

---

# SECTION 2: HTML PERFORMANCE 🏆

## 2.1 — Meta Viewport Tag [🏆 S-TIER - REQUIRED]

```html
<!-- ⚠️ WITHOUT THIS, NO MOBILE CSS WORKS -->
<!-- This MUST be in <head> of EVERY page -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!--
  ❌ NEVER add:
  - maximum-scale=1 (blocks pinch-zoom — accessibility violation)
  - user-scalable=no (blocks zoom — accessibility violation)
  
  EXCEPTION: Full-screen web apps (games, maps) where zoom
  interferes with core interaction.
-->
```

---

## 2.2 — Image Optimization [🏆 S-TIER]

```html
<!-- ✂️ COPY THIS: Complete below-fold image -->
<img
  src="product-800.webp"
  srcset="
    product-400.webp   400w,
    product-800.webp   800w,
    product-1200.webp 1200w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 80vw,
    60vw
  "
  width="800"
  height="600"
  alt="Product description"
  loading="lazy"
  decoding="async"
  fetchpriority="low"
>

<!--
  💡 ATTRIBUTE PURPOSES:
  
  srcset + sizes:
    Browser picks optimal size based on screen + DPR
  
  width + height:
    Reserves space BEFORE image loads → prevents CLS
  
  loading="lazy":
    Defers network request until near viewport
  
  decoding="async":
    Decodes pixels on background thread (different from loading)
  
  fetchpriority:
    "high" = LCP image, "low" = below-fold
-->

<!-- ✂️ COPY THIS: Hero/LCP image -->
<img
  src="hero-1200.webp"
  srcset="hero-800.webp 800w, hero-1200.webp 1200w, hero-1600.webp 1600w"
  sizes="100vw"
  width="1600"
  height="900"
  alt="Main hero image"
  fetchpriority="high"
  decoding="async"
>
<!-- NO loading="lazy" — needs immediate load for LCP -->
```

**✂️ COPY THIS: Format fallbacks**:

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Photo" width="800" height="600"
       loading="lazy" decoding="async">
</picture>
```

**✂️ COPY THIS: Responsive image preloading**:

```html
<!-- ❌ Preloads one size for everyone -->
<link rel="preload" href="/hero-1200.webp" as="image">

<!-- ✅ Browser picks correct size based on viewport -->
<link 
  rel="preload" 
  as="image"
  imagesrcset="
    /hero-400.avif   400w,
    /hero-800.avif   800w,
    /hero-1200.avif 1200w
  "
  imagesizes="100vw"
  fetchpriority="high"
  type="image/avif"
>
```

---

## 2.3 — Resource Hints [🏆 S-TIER]

```html
<head>
  <!-- 1. PRECONNECT: Critical third-party origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://cdn.example.com" crossorigin>

  <!-- 2. DNS-PREFETCH: Less critical origins -->
  <link rel="dns-prefetch" href="https://analytics.example.com">

  <!-- 3. PRELOAD: Critical resources for current page -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" 
        type="font/woff2" crossorigin>
  <link rel="preload" href="/hero.webp" as="image" fetchpriority="high">

  <!-- 4. MODULEPRELOAD: Critical JS modules -->
  <link rel="modulepreload" href="/src/app.js">

  <!-- 5. PREFETCH: Next page resources -->
  <link rel="prefetch" href="/about/page.js" as="script">
</head>
```

---

## 2.3A — Critical CSS Inlining [🏆 S-TIER for LCP]

```html
<!--
  💡 WHY S-TIER:
  External CSS is render-blocking. Browser won't paint
  ANYTHING until all <link rel="stylesheet"> files download.
  
  Inlining critical above-fold CSS eliminates this blocking request.
  Measured impact: 200-500ms faster FCP/LCP.
-->

<!-- ✂️ COPY THIS: Inline critical above-fold styles -->
<head>
  <style>
    /* Only styles needed for first viewport paint */
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    body { font-family: system-ui, sans-serif; line-height: 1.6; }
    .nav { position: sticky; top: 0; backdrop-filter: blur(12px); }
    .hero { min-height: 100svh; display: grid; place-items: center; }
  </style>

  <!-- Load remaining CSS without blocking render -->
  <link rel="preload" href="/styles.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="/styles.css" /></noscript>
</head>
```

**🎯 WHEN TO USE**:
- ✅ Marketing/landing pages (LCP critical)
- ✅ Server-rendered pages
- ✓ SPAs (less impactful — JS blocks anyway)

**🔧 TOOLS**:
- **critters** (Vite plugin) — auto-extracts critical CSS
- **critical** (npm package) — generates critical CSS from URL
- **Next.js** — built-in with `_document.js` customization

**📊 WHAT TO INLINE**:
- Above-fold layout (grid, flex, positioning)
- Typography for visible text
- Navigation styles
- Hero section styles
- **Target**: <14KB (fits in first TCP packet)

**❌ DON'T INLINE**:
- Full component library
- Unused utility classes
- Below-fold styles
- Hover states (user can't interact yet)

---

## 2.4 — Semantic HTML [🏆 S-TIER]

```html
<!-- ✂️ COPY THIS: Correct semantic structure -->
<body>
  <!-- Skip link: First focusable element -->
  <a href="#main-content" class="sr-only focus:not-sr-only">
    Skip to main content
  </a>

  <header>
    <nav aria-label="Main navigation">
      <!-- ⚠️ role="list" needed when using list-style: none (Tailwind) -->
      <!-- Safari VoiceOver strips list semantics without it -->
      <ul role="list">
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/products">Products</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content">
    <article>
      <h1>Page Title</h1>
      
      <section aria-labelledby="features-heading">
        <h2 id="features-heading">Features</h2>
      </section>
    </article>
  </main>

  <footer>
    <nav aria-label="Footer navigation">
      <!-- Footer links -->
    </nav>
  </footer>
</body>

<!--
  💡 NOTE: <header>, <main>, <footer> have implicit ARIA roles
  when direct children of <body>. Don't add redundant role="banner" etc.
-->
```

---

# SECTION 3: JAVASCRIPT & REACT PERFORMANCE 🏆

## 3.1 — Bundle Size Strategy [🏆 S-TIER]

**🎯 TARGET**: <200KB initial JavaScript (gzipped)

```javascript
/* ❌ WRONG: Imports entire library */
import _ from 'lodash';           // 72KB
import * as Icons from 'lucide-react'; // All icons

/* ✅ CORRECT: Import only what you use */
import { debounce, throttle } from 'lodash-es'; // ~3KB
import { Search, Menu, X } from 'lucide-react';  // 3 icons
```

**✂️ COPY THIS: Route-based code splitting**:

```javascript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**✂️ COPY THIS: Preload on intent**:

```javascript
function NavLink({ to, children }) {
  const preload = () => {
    if (to === '/dashboard') import('./pages/Dashboard');
  };

  return (
    <Link 
      to={to} 
      onMouseEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
    >
      {children}
    </Link>
  );
}
```

**✂️ COPY THIS: Request Priority Hints**:

```javascript
// ✅ Fetch API uses "priority" property
const criticalData = fetch('/api/products', { priority: 'high' });
const analyticsData = fetch('/api/analytics', { priority: 'low' });

// HTML attribute is "fetchpriority":
// <img src="hero.jpg" fetchpriority="high">
// <script src="app.js" fetchpriority="low"></script>
```

---

## 3.2 — TypeScript Strict Configuration [🏆 S-TIER]

```jsonc
/* ✂️ COPY THIS: tsconfig.json — Non-negotiable */
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,  // array[i] → T | undefined
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "skipLibCheck": true
  }
}
```

**✂️ COPY THIS: Discriminated unions**:

```typescript
// ❌ WRONG: Multiple booleans allow impossible states
interface ApiState {
  data: User[] | null;
  isLoading: boolean;
  isError: boolean;
}

// ✅ CORRECT: Impossible states are impossible
type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error };

function UserList({ state }: { state: ApiState }) {
  switch (state.status) {
    case 'idle':    return null;
    case 'loading': return <Skeleton />;
    case 'success': return <List items={state.data} />;
    case 'error':   return <Error message={state.error.message} />;
  }
}
```

**✂️ COPY THIS: const assertions**:

```typescript
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
// = 'active' | 'inactive' (literal types)
```

**✂️ COPY THIS: Zero any policy**:

```typescript
// ❌ NEVER
function processData(data: any) { ... }

// ✅ Use unknown + type guard
function processData(data: unknown) {
  if (isUser(data)) {
    return data.name;
  }
  throw new Error('Invalid data');
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'email' in value
  );
}
```

---

## 3.2A — Memoization Guidelines [⚠️ DANGEROUS - Profile First]

**💡 THE CORE RULE**: Memoization has a cost. Profile FIRST, memoize MEASURED bottlenecks only.

React's reconciler is already very fast. Most components don't need memoization.

**🎯 DECISION FLOWCHART**: See Appendix B for full decision tree.

```typescript
/*
  ⚠️ React.memo COMPARISON COST:
  - Shallow-compares ALL props on EVERY render
  - If props change frequently, memo runs AND re-render runs
  - Net result: SLOWER than no memo
*/

// ❌ WRONG: Simple component
const Label = React.memo(({ text }: { text: string }) => (
  <span>{text}</span>
));
// Memo comparison costs MORE than rendering a <span>

// ❌ WRONG: Props change every render anyway
const Card = React.memo(({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick}>Card</div>
));
// If parent creates new onClick each render (no useCallback),
// memo comparison runs AND component re-renders = slower

// ✅ CORRECT: Expensive component + stable props
const ExpensiveChart = React.memo(function ExpensiveChart({ 
  data 
}: { 
  data: ChartData 
}) {
  // Heavy work: Canvas rendering, complex calculations
  return <canvas ref={renderChart(data)} />;
});

// ✅ CORRECT: List item in large list
const ProductCard = React.memo(function ProductCard({ 
  product, 
  onSelect 
}: { 
  product: Product;
  onSelect: (id: string) => void;
}) {
  return (
    <div onClick={() => onSelect(product.id)}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
});

// ✅ Parent MUST stabilize callbacks
const Parent = () => {
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []); // Stable reference
  
  return products.map(p => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
};
```

**useMemo Guidelines**:

```typescript
// ❌ WRONG: Trivial computation
const fullName = useMemo(() => `${first} ${last}`, [first, last]);
// String concatenation: ~0.001ms
// useMemo overhead: ~0.003ms
// Net result: 3x SLOWER

// ✅ CORRECT: Expensive computation (>1ms)
const sortedAndFiltered = useMemo(() => {
  return products
    .filter(p => p.category === selectedCategory)
    .filter(p => p.price >= priceMin && p.price <= priceMax)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
}, [products, selectedCategory, priceMin, priceMax, sortBy]);
// O(n log n) sort: ~5-50ms depending on n
// useMemo overhead: ~0.003ms
// Net result: 1000x+ FASTER

// ✅ CORRECT: Reference stability for dependencies
const apiConfig = useMemo(() => ({
  baseUrl: buildUrl(environment),
  headers: buildHeaders(authToken),
  timeout: 5000,
}), [environment, authToken]);

useEffect(() => {
  initializeApi(apiConfig);
  // Without useMemo, new object every render → infinite loop
}, [apiConfig]);
```

**useCallback Guidelines**:

```typescript
// ✅ WHEN TO USE: Passed to memo'd children
const handleClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);

<MemoizedChild onClick={handleClick} />

// ✅ WHEN TO USE: useEffect dependency
const fetchData = useCallback(async () => {
  const response = await api.get(`/products/${categoryId}`);
  setProducts(response.data);
}, [categoryId]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// ❌ WRONG: Not passed to memo'd child or effect
const handleSubmit = useCallback(() => {
  console.log('submitted');
}, []);
// Pure overhead if not used as dependency
```

**⚠️ REACT 19+ COMPILER NOTE**:

```typescript
/*
  React 19 includes a COMPILER that auto-memoizes:
  - Components (auto React.memo)
  - Callbacks (auto useCallback)
  - Computed values (auto useMemo)
  
  If targeting React 19+ with compiler enabled:
  Manual memoization becomes LARGELY unnecessary.
  The compiler handles optimization automatically.
  
  Focus on ALGORITHMIC optimization instead:
  - Better data structures
  - Reducing work before React sees it
  - Web Workers for heavy computation
  
  Check: https://react.dev/learn/react-compiler
*/
```

**📊 WHEN TO MEMOIZE - SUMMARY TABLE**:

| Scenario | React.memo? | useMemo? | useCallback? |
|----------|-------------|----------|--------------|
| Simple component (<10 lines JSX) | ❌ | N/A | N/A |
| Expensive render (>16ms) | ✅ | N/A | ✅ for props |
| List items (100+ in list) | ✅ | N/A | ✅ for handlers |
| Trivial computation (<0.1ms) | N/A | ❌ | N/A |
| Expensive computation (>1ms) | N/A | ✅ | N/A |
| Reference stability for effects | N/A | ✅ | ✅ |
| React 19 with compiler | ❌ | ❌ | ❌ |

---

## 3.3 — Debouncing & Throttling [🏆 S-TIER]

**📊 TIMING REFERENCE**:

| Use Case | Technique | Timing |
|----------|-----------|--------|
| Search input | Debounce | 300ms |
| Autocomplete | Debounce | 150ms |
| Form validation | Debounce | 400ms |
| Window resize | Debounce | 150ms |
| Auto-save | Debounce | 2000ms |
| Scroll position | **rAF** (best) | 16ms |
| Scroll animation | **CSS scroll-driven** | N/A |

**✂️ COPY THIS: Debounce hook**:

```typescript
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**✂️ COPY THIS: Scroll with rAF + passive**:

```javascript
useEffect(() => {
  let rafId;
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      rafId = requestAnimationFrame(() => {
        updateProgressBar(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScroll);
    cancelAnimationFrame(rafId);
  };
}, []);
```

---

## 3.4 — Component Architecture [🏆 S-TIER]

```typescript
/* ✂️ COPY THIS: Extract hooks for side effects */

// Custom hook: Data fetching
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    setIsLoading(true);
    fetchUser(userId)
      .then(data => { if (!cancelled) setUser(data); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    
    return () => { cancelled = true; };
  }, [userId]);

  return { user, isLoading, error };
}

// Page component: Composition
function UserDashboard({ userId }: { userId: string }) {
  const { user, isLoading, error } = useUser(userId);

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="dashboard">
      <UserHeader user={user} />
      <UserStats stats={user.stats} />
    </div>
  );
}
```

---

## 3.5 — Error Boundaries [🏆 S-TIER]

```typescript
/* ✂️ COPY THIS: TypeScript error boundary */
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 3.6 — Virtual Scrolling [⭐ A-TIER]

```typescript
/* ✂️ COPY THIS: @tanstack/react-virtual */
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Product[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={items[virtualRow.index].id}
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <ProductCard product={items[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**🎯 DECISION**:
```
< 50 items:      Render all
50-200 items:    content-visibility: auto
200+ items:      Virtual scrolling
```

---

## 3.7 — INP Optimization [🏆 S-TIER]

```javascript
/* ✂️ COPY THIS: Yield to main thread */
async function processLargeDataset(items) {
  const results = [];
  let startTime = performance.now();

  for (const item of items) {
    results.push(expensiveTransform(item));

    if (performance.now() - startTime > 50) {
      if ('scheduler' in globalThis && 'yield' in scheduler) {
        await scheduler.yield();
      } else {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      startTime = performance.now();
    }
  }

  return results;
}
```

**✂️ COPY THIS: React Transitions**:

```typescript
import { useState, useTransition } from 'react';

function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filtered, setFiltered] = useState(products);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value); // URGENT
    
    startTransition(() => { // NON-URGENT
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} />
      <div style={{ opacity: isPending ? 0.7 : 1 }}>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
```

---

## 3.7A — requestIdleCallback [⭐ A-TIER]

```javascript
/*
  💡 DIFFERENT FROM scheduler.yield():
  
  scheduler.yield(): Yields DURING a long task, then resumes
  requestIdleCallback(): Schedules ENTIRELY NEW work during idle time
  
  Use for: analytics, prefetching, cache warming, logging
  These should NEVER compete with user interactions.
*/

/* ✂️ COPY THIS: Track analytics during idle time */
function trackEvent(data: Record<string, unknown>) {
  const send = () => {
    navigator.sendBeacon('/api/analytics', JSON.stringify(data));
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(send, { timeout: 5000 });
    // timeout: guarantees execution within 5s even if never idle
  } else {
    setTimeout(send, 1); // Fallback: next macrotask
  }
}

/* ✂️ COPY THIS: Batch multiple idle tasks */
function runWhenIdle(tasks: Array<() => void>) {
  let i = 0;

  function processNext(deadline: IdleDeadline) {
    while (i < tasks.length && deadline.timeRemaining() > 5) {
      tasks[i]();
      i++;
    }
    if (i < tasks.length) {
      requestIdleCallback(processNext);
    }
  }

  requestIdleCallback(processNext);
}

// ✂️ Usage: Schedule non-critical work
runWhenIdle([
  () => prefetchNextPageData(),
  () => warmImageCache(),
  () => reportPerformanceMetrics(),
]);
```

**🎯 WHEN TO USE**:
- ✅ Analytics tracking
- ✅ Prefetching next page resources
- ✅ Cache warming
- ✅ Performance metric reporting
- ✅ Non-urgent logging

**🎯 WHEN NOT TO USE**:
- ❌ Animations (use `requestAnimationFrame`)
- ❌ User interactions (must be immediate)
- ❌ Critical data fetching
- ❌ Time-sensitive updates

**💡 BROWSER SUPPORT**:
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (Safari 13+)

---

## 3.8 — Streaming SSR [⭐ A-TIER]

```jsx
/* ✂️ COPY THIS: Independent Suspense boundaries */

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Each section streams independently */}
      <Suspense fallback={<RevenueSkeleton />}>
        <RevenueChart />   {/* Slow query → streams last */}
      </Suspense>

      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrders />   {/* Medium → streams mid */}
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <QuickStats />     {/* Fast → streams first */}
      </Suspense>
    </div>
  );
}
```

---

## 3.9 — Service Worker Caching [⭐ A-TIER]

```javascript
/* ✂️ COPY THIS: Vite PWA Configuration */
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|webp|avif|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.yoursite\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data',
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },
    }),
  ],
});

/*
  CACHING STRATEGY GUIDE:
  CacheFirst:            Static assets (fonts, images, hashed JS/CSS)
  NetworkFirst:          Fresh content (HTML, API data)
  StaleWhileRevalidate:  Semi-fresh content (avatars)
  NetworkOnly:           Never cache (payments, auth)
*/
```

---

# SECTION 4: ANIMATION BEST PRACTICES 🏆

## 4.1 — Spring Physics [🏆 S-TIER]

```javascript
/* ✂️ COPY THIS: Framer Motion spring presets */
const springPresets = {
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  smooth: { type: "spring", stiffness: 200, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
};

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={springPresets.gentle}
/>
```

---

## 4.2 — Stagger Timing [⭐ A-TIER]

```javascript
/* ✂️ COPY THIS: Stagger pattern */
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

**📊 TIMING GUIDE**:

| Items | Delay | Total Duration |
|-------|-------|----------------|
| 3-5 | 80-100ms | 240-500ms ✅ |
| 5-10 | 50-80ms | 250-800ms ✅ |
| 10-20 | 30-50ms | 300-1000ms ✅ |
| 20+ | Cap at 800ms total ⚠️ |

---

## 4.3 — View Transitions API [⭐ A-TIER]

```javascript
/* ✂️ COPY THIS: Native page transitions */

function navigateWithTransition(updateDOM) {
  if (!document.startViewTransition) {
    updateDOM(); // Fallback
    return;
  }
  document.startViewTransition(() => updateDOM());
}
```

```css
/* Customize transition */
::view-transition-old(root) {
  animation: fade-out 200ms ease-out;
}

::view-transition-new(root) {
  animation: fade-in 200ms ease-in;
}

/* Morph specific elements */
.hero-image {
  view-transition-name: hero;
}
```

**🎯 USE FOR**:
- Page transitions in SPAs ✅
- Tab switching ✅
- Shared element transitions ✅

---

## 4.4 — Scroll-Triggered Animations [🏆 S-TIER]

```jsx
/* ✂️ COPY THIS: Framer Motion useInView */
import { motion, useInView } from 'framer-motion';

function AnimatedSection({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: "-100px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
```

---

# SECTION 5: ACCESSIBILITY ESSENTIALS 🏆

## 5.1 — Keyboard Navigation [🏆 S-TIER]

```css
/* ✂️ COPY THIS: Focus-visible styling */
:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

```jsx
/* ✂️ COPY THIS: Keyboard-accessible dropdown */
function Dropdown({ items }: { items: MenuItem[] }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect();
        break;
    }
  };

  return <div onKeyDown={handleKeyDown}>...</div>;
}
```

---

## 5.2 — Native `<dialog>` [🏆 S-TIER]

```jsx
/* ✂️ COPY THIS: Native modal with built-in focus trap */

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal(); // Focus trap + backdrop automatic
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="backdrop:bg-black/60 rounded-2xl p-6 max-w-lg"
    >
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>✕</button>
    </dialog>
  );
}
```

---

## 5.3 — ARIA Live Regions [⭐ A-TIER]

```jsx
/* ✂️ COPY THIS: Announce dynamic content */

function SearchResults({ results, query }: SearchResultsProps) {
  return (
    <div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {results.length} results found for "{query}"
      </div>

      <ul role="list">
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

# SECTION 6: CORE WEB VITALS TARGETS 🏆

```
┌──────────────────────────────────────────────────────────────┐
│                    PERFORMANCE TARGETS (2024)                │
│                                                              │
│  🏆 CORE WEB VITALS                                          │
│  ├─ LCP  < 2.5s   (Largest Contentful Paint)                │
│  ├─ INP  < 200ms  (Interaction to Next Paint)               │
│  ├─ CLS  < 0.1    (Cumulative Layout Shift)                 │
│  └─ ⚠️ FID: DEPRECATED (March 2024, replaced by INP)        │
│                                                              │
│  📊 LIGHTHOUSE SCORES                                        │
│  ├─ Performance:      ≥ 95                                   │
│  ├─ Accessibility:    = 100                                  │
│  ├─ Best Practices:   = 100                                  │
│  └─ SEO:              = 100                                  │
│                                                              │
│  📦 BUNDLE SIZE                                              │
│  ├─ Initial JS:        < 200KB gzipped                      │
│  ├─ Per-route chunk:   < 50KB gzipped                       │
│  └─ Total CSS:         < 50KB gzipped                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 6.1 — Real User Monitoring (RUM) [🏆 S-TIER]

```typescript
/*
  💡 WHY THIS MATTERS:
  Lighthouse = LAB data (your machine, your network)
  RUM = REAL user data (actual devices, actual networks)
  
  Your Lighthouse score can be 100 while real users on
  3G in rural areas get LCP of 8 seconds.
  
  Google uses CrUX (Chrome User Experience Report) data
  for search rankings, NOT your Lighthouse score.
*/

/* ✂️ COPY THIS: Track real user metrics */
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendMetric(metric: { 
  name: string; 
  value: number; 
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}) {
  const body = JSON.stringify({
    name: metric.name,
    value: Math.round(metric.value),
    rating: metric.rating,
    page: window.location.pathname,
    timestamp: Date.now(),
  });

  // sendBeacon survives page unload
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body);
  } else {
    fetch('/api/vitals', { 
      body, 
      method: 'POST', 
      keepalive: true 
    });
  }
}

onLCP(sendMetric);   // Largest Contentful Paint
onINP(sendMetric);   // Interaction to Next Paint
onCLS(sendMetric);   // Cumulative Layout Shift
onFCP(sendMetric);   // First Contentful Paint (optional)
onTTFB(sendMetric);  // Time to First Byte (optional)
```

**📊 SETUP**:

```bash
npm install web-vitals
```

```typescript
// In your app entry point
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(sendMetric);
onINP(sendMetric);
onCLS(sendMetric);
```

**🎯 BACKEND IMPLEMENTATION**:

```typescript
// API route: /api/vitals
export async function POST(req: Request) {
  const data = await req.json();
  
  // Store in analytics DB (e.g., BigQuery, ClickHouse)
  await db.insert({
    metric: data.name,
    value: data.value,
    rating: data.rating,
    page: data.page,
    timestamp: data.timestamp,
    userAgent: req.headers.get('user-agent'),
    // Optional: Add user ID, session ID, A/B test variant
  });
  
  return new Response('OK', { status: 200 });
}
```

**📈 WHAT TO TRACK**:
- **LCP** — Loading performance
- **INP** — Interactivity (replaced FID in 2024)
- **CLS** — Visual stability
- **FCP** (optional) — Initial render
- **TTFB** (optional) — Server response time

**🎯 HOW TO USE THE DATA**:
- Monitor 75th percentile (not average)
- Segment by device type (mobile vs desktop)
- Segment by network (4G vs 3G vs WiFi)
- Alert on regressions (>10% increase in P75)
- Correlate with business metrics (bounce rate, conversions)

**💡 P75 RULE**:
Google ranks you based on 75th percentile of real users.  
If 75% of users get LCP < 2.5s, you pass.  
If 26% of users get LCP > 4s, you fail.

---

# SECTION 7: QUICK REFERENCE CHECKLIST ✅

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE EVERY COMPONENT:                                    │
│  □ Semantic HTML (not div soup)                             │
│  □ Accessible name on interactive elements                  │
│  □ Keyboard operable (Tab, Enter, Escape)                   │
│  □ focus-visible styles                                     │
│  □ Touch targets ≥ 44×44px on mobile                        │
│                                                             │
│  BEFORE EVERY PAGE:                                         │
│  □ <meta name="viewport"> in <head>                         │
│  □ Mobile-first responsive design                           │
│  □ Images: srcset + width/height + loading + decoding       │
│  □ Hero image: fetchpriority="high" (no lazy load)          │
│  □ Fonts: preload + font-display: swap + size-adjust        │
│  □ Error boundary around lazy routes                        │
│  □ content-visibility: auto on below-fold sections          │
│  □ Passive event listeners on scroll/touch                  │
│  □ prefers-reduced-motion respected                         │
│                                                             │
│  BEFORE EVERY ANIMATION:                                    │
│  □ Uses composite properties (transform, opacity, filter)   │
│  □ Spring physics (not linear easing)                       │
│  □ Scroll-triggered via Intersection Observer OR CSS        │
│  □ Stagger total duration < 800ms                           │
│  □ will-change applied surgically (not globally)            │
│                                                             │
│  BEFORE SHIPPING:                                           │
│  □ Lighthouse ≥ 95 performance                              │
│  □ Zero a11y violations (axe-core)                          │
│  □ Color contrast ≥ 4.5:1 text, ≥ 3:1 UI (Section 1.16)    │
│  □ Bundle < 200KB initial JS (gzipped)                      │
│  □ LCP < 2.5s, INP < 200ms, CLS < 0.1                       │
│  □ Real user monitoring deployed (web-vitals, Section 6.1)  │
│  □ TypeScript strict mode, zero `any`                       │
│  □ Test on real mobile device                               │
│  □ Test on slow 3G network throttling                       │
└─────────────────────────────────────────────────────────────┘
```

---

# APPENDIX: DECISION FLOWCHARTS

## A. Animation Property Selection

```
Need to animate element?
├─ Does it move/resize?
│  └─ YES → transform: translate() / scale() / rotate()
├─ Does it fade?
│  └─ YES → opacity
├─ Does it blur/color-shift?
│  └─ YES → filter (paint-only, OK for :hover)
└─ Anything else?
   └─ Reconsider if animation is necessary
```

## B. Memoization Decision

```
Is there a MEASURED performance problem?
├─ NO → Don't memoize
└─ YES → What's slow?
    ├─ Component render (>16ms)
    │  └─ React.memo + useCallback
    ├─ Computation (>1ms)
    │  └─ useMemo
    └─ Large list (100+ items)
       └─ React.memo + virtualization
```

## C. Image Optimization

```
What type of image?
├─ Above-fold hero
│  ├─ fetchpriority="high" ✅
│  ├─ NO loading="lazy" ✅
│  └─ decoding="async" ✅
├─ Below-fold content
│  ├─ loading="lazy" ✅
│  ├─ fetchpriority="low" ✅
│  └─ decoding="async" ✅
└─ Always include:
   ├─ width + height attributes ✅
   ├─ srcset for responsive ✅
   └─ AVIF + WebP + fallback ✅
```

## D. List Rendering Strategy

```
How many items?
├─ < 50 items
│  └─ Render all
├─ 50-200 items
│  └─ content-visibility: auto
└─ 200+ items
   └─ Virtual scrolling
```

---

**📚 THIS IS THE COMPLETE REFERENCE**  
**Every rule is backed by browser internals and current web standards.**

**Version**: 2.2 (2024) — Production-Ready Edition  
**Last Updated**: All audits incorporated, production-ready  
**Based on**: Chrome 131, React 19, WCAG 2.2, Core Web Vitals 2024
