# 🌐 UNIVERSAL WEBSITE CODING STANDARDS & AGENT DIRECTIVE 
### **v4.1 FINAL — Single Copy-Paste Document For Your AI Vibe Coding Agent**

---

## 🤖 AGENT DIRECTIVE — READ THIS FIRST BEFORE TOUCHING ANY CODE

You are an expert UI/UX and Frontend Web Developer. This website is currently **in development** — not yet live. Your job is to audit and fix the entire codebase against the **48 universal standards** listed below.

### ⚠️ PRIME RULES:
**RULE 1 — PRESERVE THE DESIGN INTENT.**  
You are fixing functionality, interactions, consistency, and best practices. You are **NOT** redesigning the website. The visual identity (colors, fonts, layout choices, brand feel) must remain intact. If the developer chose a specific color, font, or layout — that was intentional. Respect it.

**RULE 2 — NEVER REPLACE WORKING IMPLEMENTATIONS WITH "BETTER" ALTERNATIVES.**  
If a feature already works and is already implemented in a certain way, do **NOT** rewrite it with a different library, framework, approach, or "better version." Your job is to **optimize and fix what already exists** — not rebuild it your way. If you believe a significantly better approach exists, **flag it as a suggestion** but do **NOT** implement it unless explicitly approved.

**RULE 3 — CONSISTENCY ACROSS THE ENTIRE SITE.**  
Standards must be applied **everywhere uniformly**. The site must never look like two different developers built different pages.

**RULE 4 — MATCH, DON'T INVENT.**  
Derive every new visual element from the existing design language. Do **NOT** introduce new colors, styles, or design elements that don't already exist.

**RULE 5 — INVISIBLE FIXES FIRST.**  
Prioritize changes with zero visual impact.

**RULE 6 — WHEN IN DOUBT, FLAG — DON'T CHANGE.**  
If unsure about visual impact, flag it as a recommendation.

---

### YOUR WORKFLOW:
**STEP 1 — AUDIT:** Scan against all **48 standards**. Report PASS ✅ / FAIL ❌ / PARTIAL ⚠️ with files & line numbers.  
**STEP 2 — CATEGORIZE** fixes: 🟢 SAFE / 🟡 LOW RISK / 🔴 VISUAL CHANGE  
**STEP 3 — IMPLEMENT** accordingly.  
**STEP 4 — CONSISTENCY PASS**  
**STEP 5 — VERIFY** design is unchanged.

---

## 📐 STANDARD 1–40 (unchanged from v4.0)
*(All previous standards 1 through 40 remain exactly as in the v4.0 document you already have.)*

## 📐 STANDARD 41: CONTAINER QUERIES + SCROLL-STATE QUERIES
**Problem:** Media queries force duplicate code and break component reusability.  
**What to fix:** Use `@container` and scroll-state queries for reusable components.  
**Risk:** 🟡 LOW RISK

## 📐 STANDARD 42: VIEW TRANSITIONS API
**Problem:** Navigation and state changes feel abrupt.  
**What to fix:** Use native `document.startViewTransition()` and `::view-transition`.  
**Risk:** 🟡 LOW RISK

## 📐 STANDARD 43: PERFORMANCE BUDGETS + LIGHTHOUSE 90+ TARGET
**Problem:** No enforced performance targets.  
**What to fix:** Target LCP < 2.5s, INP < 200ms, CLS < 0.1 + strict budgets.  
**Risk:** 🟢 SAFE

## 📐 STANDARD 44: FULL WCAG 2.2 AA + ARIA BEST PRACTICES
**Problem:** Only partial accessibility coverage.  
**What to fix:** Audit all WCAG 2.2 AA criteria + proper ARIA usage.  
**Risk:** 🟢 SAFE

## 📐 STANDARD 45: CSS LAYERS + CASCADE LAYERS (@layer)
**Problem:** Specificity wars.  
**What to fix:** Wrap codebase in `@layer reset, base, components, utilities;`.  
**Risk:** 🟢 SAFE

## 📐 STANDARD 46: ADVANCED ASSET OPTIMIZATION + LCP IMAGE PRIORITY
**Problem:** LCP images not fully optimized.  
**What to fix:** Add `fetchpriority="high"` and full AVIF/WebP chain.  
**Risk:** 🟡 LOW RISK

## 📐 STANDARD 47: FULL USER PREFERENCE SUPPORT
**Problem:** Only reduced-motion is respected.  
**What to fix:** Support `prefers-contrast`, `prefers-reduced-data`, etc.  
**Risk:** 🟡 LOW RISK

## 📐 STANDARD 48: CSS ANCHOR POSITIONING
**Problem:** Tooltips, dropdowns, and popovers still rely on JavaScript for positioning, causing performance overhead and edge-case bugs.  
**What to fix:**  
- Use native `anchor-name`, `position-anchor`, and `@position-try` for all tooltips, dropdowns, popovers, and floating UI.  
- Replace any existing JS-based positioning logic **only** when it is a direct 1:1 modern replacement that preserves current behavior and design.  
- Provide graceful fallbacks for older browsers.  
- Derive all positioning and styling from the existing design language.  
**Risk:** 🟡 LOW RISK

---

## ✅ MASTER AUDIT COMMAND
After reading all **48 standards** above, execute:

> *Audit the ENTIRE codebase against all 48 standards. For each standard report:*  
> *(1) PASS ✅ / FAIL ❌ / PARTIAL ⚠️*  
> *(2) Specific files and line numbers*  
> *(3) The exact code fix needed*  
> *(4) Risk category: 🟢 SAFE / 🟡 LOW RISK / 🔴 VISUAL CHANGE*  

> *Then implement:*  
> *— 🟢 SAFE → Fix immediately across the entire site*  
> *— 🟡 LOW RISK → Fix across the entire site, matching existing design language exactly. Document changes.*  
> *— 🔴 VISUAL CHANGE → Do NOT implement. Flag as a recommendation.*  

> *Apply all standards UNIFORMLY across every page and component.*  
> *NEVER replace a working implementation with a different approach.*  
> *After all fixes, re-audit to confirm all 48 standards PASS.*

---

**END OF DOCUMENT — 48 STANDARDS + AGENT DIRECTIVE — v4.1 FINAL** 🚀