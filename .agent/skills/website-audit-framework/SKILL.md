# SKILL: Website Audit Framework
**Used by**: ceo-auditor

---

## Pre-Audit Setup
1. Open the site in an incognito window (no cached state)
2. Use Chrome DevTools → Network tab (throttle to "Fast 3G")
3. Open browser console — note any errors before clicking anything
4. Check on mobile viewport (375px width)

## Audit Checklist by Dimension

### 1. Trust & Credibility (First Impression)
- [ ] Professional design — no broken layouts, misaligned elements
- [ ] Logo visible and high-resolution
- [ ] Certifications/trust badges visible above fold
- [ ] Contact information findable within 2 clicks
- [ ] Physical/business address present (EU legal requirement)
- [ ] "About" page tells a credible company story
- [ ] Team/founders visible (E-E-A-T requirement for health content)
- [ ] Privacy policy + terms linked in footer
- [ ] HTTPS padlock present

### 2. Conversion & Business
- [ ] Value proposition clear within 10 seconds of landing
- [ ] Rental CTA visible and ≥ as prominent as purchase CTA
- [ ] Primary CTA above fold on homepage
- [ ] Product pages have clear price + access options
- [ ] Checkout flow completable without friction
- [ ] No dead-end pages without clear next step
- [ ] Social proof (reviews, testimonials) present
- [ ] FAQ addresses objections near purchase/rental CTAs

### 3. Content & Compliance
- [ ] All medical claims have "may help with" / "research suggests" language
- [ ] Medical disclaimer present on all product pages
- [ ] No "cure", "treat", "diagnose" language
- [ ] Safety information accessible (not buried)
- [ ] Contraindications listed for each device
- [ ] "Consult your healthcare provider" present on product pages
- [ ] Citations present for specific health claims

### 4. User Experience
- [ ] Main navigation: max 2 levels deep
- [ ] Mobile navigation usable with thumbs (hamburger menu works)
- [ ] Search functional
- [ ] Forms show validation errors clearly
- [ ] 404 page exists and has navigation
- [ ] Page load under 3 seconds (basic check)
- [ ] No horizontal scroll on mobile

### 5. Technical Health
- [ ] Console: zero errors on page load
- [ ] Console: zero errors after key interactions
- [ ] All images load (no broken img tags)
- [ ] All links functional (spot check key nav items)
- [ ] Forms submit successfully
- [ ] No visible TypeScript/React errors rendered in UI

### 6. SEO & Discovery
- [ ] Page titles present and descriptive (50-60 chars)
- [ ] Meta descriptions present (150-160 chars)
- [ ] H1 on every page (exactly one)
- [ ] Product pages have structured data (check with rich results tool)
- [ ] sitemap.xml accessible
- [ ] robots.txt present

### 7. Accessibility (Quick Check)
- [ ] Tab navigation reaches all interactive elements
- [ ] Focus indicator visible when tabbing
- [ ] Images have alt text (spot check)
- [ ] Color contrast sufficient (text readable)
- [ ] Skip navigation link present
- [ ] Font minimum 16px body text

### 8. Security & Privacy
- [ ] Cookie consent banner appears on first visit
- [ ] Cookie consent granular (not just "accept all")
- [ ] Analytics/tracking only fires after consent
- [ ] No sensitive data in URLs
- [ ] Login/forms use HTTPS (already covered by cert)

## Severity Framework
| Level | Criteria | Action |
|-------|---------|--------|
| 🔴 CRITICAL | Blocks conversion, legal risk, data breach risk | Fix this week |
| 🟡 HIGH | Damages trust, reduces conversion, WCAG fail | Fix this sprint |
| 🟢 IMPROVE | Better UX, missed opportunity | Backlog + prioritize |
| 💡 OPPORTUNITY | Growth/optimization idea | Consider in roadmap |

## Business Impact Language
Always frame findings in business terms:
- Not "button contrast is insufficient" → "Users can't see the CTA → rental signups drop"
- Not "missing alt text" → "Screen reader users can't access product info → excludes 15% of users"
- Not "no structured data" → "Missing rich results in Google → competitor takes that snippet"
