# Component Registry

| Component | Path | Server/Client | Description | Last Updated |
|---|---|---|---|---|
| RootLayout | app/layout.tsx | Server | Root App Router layout with providers, header/footer shell, and noscript fallback. | 2026-03-03 |
| HomePage | app/page.tsx | Server | Home route server entry with organization JSON-LD injection. | 2026-03-03 |
| HomeClient | app/HomeClient.tsx | Client | Home interactive leaf for product and planner navigation. | 2026-03-03 |
| AboutPageRoute | app/about/page.tsx | Server | About route server entry using createPageMetadata and direct server render of AboutPage. | 2026-03-05 |
| StorePage | app/store/page.tsx | Server | Store route server entry with route-level metadata. | 2026-03-03 |
| StoreClient | app/store/StoreClient.tsx | Client | Store interactive leaf handling product navigation callbacks. | 2026-03-03 |
| WellnessPlannerPage | app/wellness-planner/page.tsx | Server | Wellness planner route server entry with metadata. | 2026-03-03 |
| WellnessPlannerClient | app/wellness-planner/WellnessPlannerClient.tsx | Client | Planner interactive leaf that redirects to store after completion. | 2026-03-03 |
| ProductPageRoute | app/product/[tech]/page.tsx | Server | Product route server entry with typed JSON-LD schemas. | 2026-03-03 |
| ProductClient | app/product/[tech]/ProductClient.tsx | Client | Product route interactive leaf and in-route tech navigation. | 2026-03-03 |
| AccountClient | app/account/AccountClient.tsx | Client | Account route interactive leaf delegating account view navigation callbacks. | 2026-03-03 |
| BlogClient | app/blog/BlogClient.tsx | Client | Blog route interactive leaf with shared navigation helper integration. | 2026-03-03 |
| CheckoutClient | app/checkout/CheckoutClient.tsx | Client | Checkout route interactive leaf with shared navigation helper integration. | 2026-03-03 |
| ErrorPage | app/error.tsx | Client | Route-level client error boundary UI. | 2026-03-03 |
| GlobalError | app/global-error.tsx | Client | Root global error boundary fallback UI. | 2026-03-03 |
| NotFound | app/not-found.tsx | Server | Route-level 404 page with Link-based recovery path. | 2026-03-03 |
| Loading | app/loading.tsx | Server | Route-level loading fallback with accessible live region. | 2026-03-03 |
| LoginPageRoute | app/login/page.tsx | Server | Login route server entry delegating to dedicated login client composition. | 2026-03-03 |
| LoginClient | app/login/LoginClient.tsx | Client | Login route interactive leaf rendering auth modal and close navigation behavior. | 2026-03-03 |
| StructuredData | src/components/StructuredData.tsx | Server | Structured data rendering helper for SEO metadata blocks. | 2026-03-02 |
| Footer | src/components/layout/Footer.tsx | Client | Global site footer component. | 2026-03-03 |
| GlobalOverlays | src/components/layout/GlobalOverlays.tsx | Client | Global overlay container (modals/toasts/cookie shell). | 2026-03-03 |
| Header | src/components/layout/Header.tsx | Client | Global site header component. | 2026-03-03 |
| Providers | src/components/providers/Providers.tsx | Client | Application-level providers wrapper. | 2026-03-03 |
| BreadcrumbBar | src/components/ui/BreadcrumbBar/BreadcrumbBar.tsx | Client | Breadcrumb bar container component with interactive visibility and section navigation hooks. | 2026-03-03 |
| BreadcrumbNav | src/components/ui/BreadcrumbBar/BreadcrumbNav.tsx | Server | Breadcrumb navigation renderer with internal Link/external anchor split. | 2026-03-03 |
| PageNavigatorDropdown | src/components/ui/BreadcrumbBar/PageNavigatorDropdown.tsx | Client | Dropdown navigator for section jumping with WCAG-aligned text sizing and 44px touch targets. | 2026-03-03 |
| Breadcrumbs | src/components/navigation/Breadcrumbs.tsx | Client | Canonical breadcrumb component with route-derived path rendering, on-page section dropdown, and keyboard/outside-click handling. | 2026-03-04 |
| MultitoolContainer | src/components/ui/Multitool/MultitoolContainer.tsx | Client | Container for multitool UI assembly and browser-interaction orchestration. | 2026-03-03 |
| PeekTooltip | src/components/ui/Multitool/components/PeekTooltip.tsx | Client | Tooltip primitive for multitool preview interactions with delayed hover visibility state. | 2026-03-03 |
| usePageStructure | src/components/ui/Multitool/hooks/usePageStructure.ts | Client | Hook for extracting page section structure. | 2026-03-03 |
| useScrollSpy | src/components/ui/Multitool/hooks/useScrollSpy.ts | Client | Hook for tracking active section by scroll position. | 2026-03-03 |
| FocusMode | src/components/ui/Multitool/tools/FocusMode.tsx | Client | Reading/focus aid tool with browser-side state and event handling. | 2026-03-03 |
| PageNavigator | src/components/ui/Multitool/tools/PageNavigator.tsx | Client | In-page navigator tool with interactive section controls and 44px minimum touch targets. | 2026-03-03 |
| QuickSupport | src/components/ui/Multitool/tools/QuickSupport.tsx | Client | Quick support tool panel. | 2026-03-04 |
| ReadingTools | src/components/ui/Multitool/tools/ReadingTools.tsx | Client | Reading utility controls with user-triggered interactions. | 2026-03-03 |
| CookieConsent | components/CookieConsent.tsx | Client | Global consent banner/modal managing localStorage consent state and synchronized `cookieConsent` cookie parity for server-side GDPR gates. | 2026-03-03 |
| AuthComponents | components/AuthComponents.tsx | Client | Active auth/account client module consumed by `app/login/LoginClient.tsx` and `app/account/AccountClient.tsx`. | 2026-03-04 |
| AboutPage | components/AboutPage.tsx | Server | Static about page presentation rendered from the server route without client pass-through wrapper. | 2026-03-05 |
| LegalPages | components/LegalPages.tsx | Client | Consolidated legal page module using shared disclaimer SSOT content and reusable disclaimer component. | 2026-03-03 |
| MedicalDisclaimer | components/shared/MedicalDisclaimer.tsx | Server | Shared disclaimer primitive backed by `content/disclaimers.ts` with warning/info/compliance variants. | 2026-03-03 |
| HomeDemoModal | components/home/HomeDemoModal.tsx | Client | Extracted Home page demo modal leaf with animated open/close and booking CTA handlers. | 2026-03-04 |
| HomeTestimonialsSection | components/home/HomeTestimonialsSection.tsx | Client | Extracted Home page testimonials block using centralized MedicalDisclaimer SSOT. | 2026-03-04 |
| HomeHowItWorksSection | components/home/HomeHowItWorksSection.tsx | Client | Home section module for 3-step workflow narrative extracted from Home monolith. | 2026-03-04 |
| HomeScienceSection | components/home/HomeScienceSection.tsx | Client | Home science/evidence section with spotlight effect and modality cards extracted from Home monolith. | 2026-03-04 |
| HomeFinalCtaSection | components/home/HomeFinalCtaSection.tsx | Client | Home terminal conversion CTA section extracted from Home monolith with builder/store actions. | 2026-03-04 |
| TestimonialsPage | components/TestimonialsPage.tsx | Client | Testimonials/case-study page with softened compliance language and MedicalDisclaimer integration. | 2026-03-04 |
| TechDetail | components/TechDetail.tsx | Client | Product detail interactive shell (commerce track, safety, evidence, and modality-specific sections). | 2026-03-04 |
| ResearchOverviewSection | components/product/detail/ResearchOverviewSection.tsx | Client | Reusable research overview section extracted from TechDetail modality blocks (stats + applications + disclaimer). | 2026-03-04 |
