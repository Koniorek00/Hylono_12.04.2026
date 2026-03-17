# HYLONO SEO PHASE 2 FIX ACCEPTANCE CHECKLIST

Use this checklist only after the remediation pass has been completed.
A box may be checked only after direct verification.

---

## 0. AUDIT DRIFT RECONCILIATION

- [ ] each major audit claim was reviewed against current source before editing
- [ ] each major audit claim is labeled in the final report as one of:
- [ ] `fixed in this pass`
- [ ] `already fixed in source, verified`
- [ ] `external blocker`
- [ ] `deferred with reason`

---

## 1. HOST INTEGRITY AND RELEASE READINESS

- [ ] `NEXT_PUBLIC_SITE_URL` still matches the intended primary host
- [ ] canonical tags resolve only to the primary host
- [ ] `robots.txt` references only the primary host
- [ ] `sitemap.xml` uses only the primary host
- [ ] Organization, WebSite, Product, BlogPosting, and Breadcrumb JSON-LD use only the primary host for Hylono page/entity URLs
- [ ] no production-facing internal absolute URL still points at `https://hylono.com`
- [ ] any unavoidable third-party media URL has been reviewed and documented as third-party media rather than a canonical or brand-host signal
- [ ] public host resolution / redirect behavior has been verified, or the release is explicitly blocked as an external issue

---

## 2. DYNAMIC ROUTE CRAWLABILITY

- [ ] runtime verification was executed against a production build / `next start`, not only source review
- [ ] `/product/not-a-real-tech` does not return HTTP `200`
- [ ] `/conditions/not-a-real-condition` does not return HTTP `200`
- [ ] `/protocols/not-a-real-protocol` does not return HTTP `200`
- [ ] `/blog/not-a-real-post` does not return HTTP `200`
- [ ] `/product/HBOT` either redirects canonically or returns `404`
- [ ] `/conditions/Recovery` either redirects canonically or returns `404`
- [ ] `/protocols/Recovery-Oxygen-Foundation` either redirects canonically or returns `404`
- [ ] `/blog/Example-Post` either redirects canonically or returns `404`
- [ ] no invalid dynamic route serves a visible not-found body with HTTP `200`
- [ ] invalid dynamic routes do not emit indexable metadata
- [ ] invalid dynamic routes do not emit misleading canonicals
- [ ] invalid dynamic routes do not emit misleading valid-page schema

---

## 3. RENDERING AND INDEXABLE CONTENT VISIBILITY

- [ ] `/` returns substantial initial HTML content
- [ ] `/store` returns substantial initial HTML content
- [ ] `/product/hydrogen` returns substantial initial HTML content
- [ ] `/product/hbot` returns substantial initial HTML content
- [ ] `/conditions` returns substantial initial HTML content
- [ ] `/conditions/recovery` returns substantial initial HTML content
- [ ] `/research` returns substantial initial HTML content
- [ ] `/protocols` returns substantial initial HTML content
- [ ] `/protocols/recovery-oxygen-foundation` returns substantial initial HTML content
- [ ] at least one real blog article route returns substantial initial HTML content
- [ ] critical content is present before hydration on key SEO routes
- [ ] no SEO-critical route is reduced to a shell-only first response

---

## 4. METADATA QUALITY

- [ ] root metadata now includes a branded `title.template`
- [ ] titles remain unique across sampled routes
- [ ] descriptions remain unique across sampled routes
- [ ] product-page titles no longer use `| Product Details`
- [ ] product-page titles reflect product intent clearly
- [ ] no generic titles such as `Product Page` or `Technology` appear
- [ ] no spammy keyword stuffing was introduced

---

## 5. STRUCTURED DATA AND ENTITY CLARITY

- [ ] structured data validates successfully on sampled routes
- [ ] Product schema matches visible product content
- [ ] BlogPosting schema matches visible article content
- [ ] Organization / WebSite schema aligns with the primary host
- [ ] WebSite schema still exposes a valid `SearchAction` if search remains a supported entity signal
- [ ] Breadcrumb schema reflects real route structure
- [ ] invalid routes do not emit misleading valid-page schema

---

## 6. INTERNAL LINK GRAPH

- [ ] condition pages link to research using crawlable HTML links
- [ ] condition pages link to relevant products using crawlable HTML links
- [ ] research pages link to products using crawlable HTML links
- [ ] research pages link to protocols using crawlable HTML links
- [ ] product pages link to protocols using crawlable HTML links
- [ ] product pages link to rental/contact using crawlable HTML links
- [ ] protocol pages link back to products/research/contact using crawlable HTML links
- [ ] blog pages link into relevant informational or commercial surfaces where intended
- [ ] the canonical graph remains intact: `Condition -> Research -> Product -> Protocol -> Rental/Contact`

---

## 7. AI SEARCH READINESS

- [ ] key templates are not relying mainly on `sr-only` summaries for answer extraction
- [ ] homepage has visible answer-first or context-setting copy that fits the existing design
- [ ] store page has visible answer-first or context-setting copy that fits the existing design
- [ ] product template has visible answer-first or context-setting copy that fits the existing design
- [ ] condition template has visible answer-first or context-setting copy that fits the existing design
- [ ] protocol template has visible answer-first or context-setting copy that fits the existing design
- [ ] blog/article template has visible answer-first or context-setting copy that fits the existing design
- [ ] no fake authority, fake experts, fake reviews, or unsupported medical claims were introduced
- [ ] answer-first additions remain compliance-safe

---

## 8. LOCATOR / LOCAL SEO STRATEGY

- [ ] the team made an explicit decision on whether `/locator` should remain `noindex` or become indexable
- [ ] that decision is reflected consistently in metadata, visible content, and schema
- [ ] if `/locator` remains `noindex`, the final report explains why it is a utility page rather than an SEO landing page
- [ ] if `/locator` becomes indexable, server-visible local value and supporting schema were strengthened
- [ ] no contradictory local-SEO claims remain in the final report

---

## 9. BUILD / CHECK / COMPLIANCE

- [ ] `pnpm build` passes
- [ ] `pnpm check` passes
- [ ] `pnpm compliance:strict` passes
- [ ] compliance fixes were made properly, not hidden through broad suppression
- [ ] critical/high compliance issues are zero at final verification

---

## 10. DESIGN PARITY

- [ ] homepage still matches the premium baseline visually
- [ ] `/store` still matches the premium baseline visually
- [ ] `/product/hydrogen` still matches the premium baseline visually
- [ ] `/product/hbot` still matches the premium baseline visually
- [ ] `/conditions` still matches the premium baseline visually
- [ ] `/research` still matches the premium baseline visually
- [ ] `/protocols` still matches the premium baseline visually
- [ ] no visible SEO-only blocks break layout rhythm
- [ ] no spacing artifacts or hierarchy regressions were introduced
- [ ] any visible additions were documented and justified

---

## 11. FINAL REPORT AND RELEASE DECISION

- [ ] remediation report lists all changed files
- [ ] remediation report explains each resolved issue and each verified-already-fixed issue
- [ ] remediation report states external blockers clearly
- [ ] remediation report states residual risks clearly
- [ ] final score is reported out of 10
- [ ] release statement is one of the following:
- [ ] `SEO remediation is production-ready`
- [ ] `SEO remediation still requires fixes`

Production-ready sign-off is not allowed if any of the following remain true:

- [ ] primary host is still unresolved or publicly split
- [ ] any dynamic route family still soft-404s
- [ ] `pnpm compliance:strict` still fails
- [ ] critical design parity regressions exist
