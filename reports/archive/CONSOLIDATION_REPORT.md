# Content Duplication & Consolidation Report
**Date:** 2026-02-19
**Author:** architect-orchestrator
**Status:** P1 & P2 COMPLETE — All Consolidations Implemented

## Implementation Summary

### ✅ P1: HelpCenterPage (32.3 KB)
- **Route:** `/help` with tab query params
- **Tabs:** FAQ, Contact, Device Support
- **Legacy redirects:** `/support`, `/faq`, `/contact` → `/help?tab=X`
- **File:** `components/HelpCenterPage.tsx`

### ✅ P2: RewardsPage (10.5 KB)
- **Route:** `/rewards` (gated)
- **Tabs:** Referral Program, Loyalty Points
- **Legacy redirect:** `/referral` → RewardsPage
- **File:** `components/RewardsPage.tsx`

### ✅ P2: PressHubPage (9.4 KB)
- **Route:** `/press` with tab query params
- **Tabs:** Overview, Press Releases, Media Assets
- **Legacy redirect:** `/press-kit` → `/press?tab=assets`
- **File:** `components/PressHubPage.tsx`

### ⏳ P3: AssurancePage (Deferred)
Warranty + Guarantee consolidation deferred due to data inconsistency (2-year vs 5-year warranty). Requires business clarification before merging.

---

## Build Verification
All builds successful. No TypeScript errors. Bundle sizes within limits.
**Note:** HBOT/Chamber pages EXCLUDED per user request (testing only)

---

## Executive Summary

Analysis of the Hylono codebase reveals **4 major consolidation opportunities** in non-HBOT pages, primarily around support/help, referral programs, press/media, and warranty/guarantee pages. Consolidation would improve user experience, reduce maintenance burden, and eliminate confusing navigation.

---

## 1. HIGH: Support/Help Page Fragmentation

### Current State (3 separate pages)

| File | Route | Purpose |
|------|-------|---------|
| `SupportPage.tsx` | `/support` | Contact cards, help categories, device scanner, enterprise support |
| `FAQPage.tsx` | `/faq` | Searchable FAQ accordion with 6 categories, 25+ questions |
| `ContactPage.tsx` | `/contact` | 3-step wizard form, callback scheduling, emergency modal |

### Content Overlap Analysis

| Feature | SupportPage | FAQPage | ContactPage |
|---------|-------------|---------|-------------|
| Contact methods (chat/phone/email) | ✅ | ✅ (CTA) | ✅ |
| Help categories/topics | ✅ | ✅ | — |
| Form to submit questions | — | — | ✅ |
| "Schedule callback" feature | — | — | ✅ |
| Enterprise support section | ✅ | — | — |
| Support metrics/stats | ✅ | — | — |
| Search functionality | — | ✅ | — |

### Problem
- Users must navigate 3 different pages to get help
- Overlapping contact information across all 3
- No clear distinction: "Contact" vs "Support" vs "FAQ"
- Duplicate CTAs (live chat, email support)

### Recommendation: **Unified Help Center with Tabs**

**Approach:**
1. Create `HelpCenterPage.tsx` at `/help` with 3 tabs:
   - **Tab 1: FAQ** — Searchable knowledge base (reuse FAQPage content)
   - **Tab 2: Contact** — Contact wizard + callback scheduler (reuse ContactPage)
   - **Tab 3: Device Support** — Device scanner + enterprise support
2. Redirect `/support`, `/faq`, `/contact` → `/help` with appropriate tab anchors
3. Keep pages as thin wrappers during transition for SEO

**Estimated Reduction:** ~150 lines of duplicate contact UI code

---

## 2. MEDIUM: Referral/Loyalty/Affiliate Program Overlap

### Current State (3 separate programs)

| File | Route | Model | Target Audience |
|------|-------|-------|-----------------|
| `ReferralPage.tsx` | `/referral` | €150 credit per referral, tiers | Customers |
| `LoyaltyProgram.tsx` | `/rewards` | Points system (1/10 PLN), 3 tiers | Customers |
| `AffiliatePage.tsx` | `/affiliate` | 10% commission, application | Professionals/Influencers |

### Content Overlap Analysis

| Feature | ReferralPage | LoyaltyProgram | AffiliatePage |
|---------|--------------|----------------|---------------|
| Tier-based rewards | ✅ (3 tiers) | ✅ (3 tiers) | — |
| "How it works" steps | ✅ (4 steps) | ✅ (earn methods) | ✅ (4 steps) |
| Copy/share code | ✅ | — | — |
| Points tracking | — | ✅ | — |
| Application form | — | — | ✅ |
| Dashboard stats | — | ✅ (mock) | — |

### Problem
- 3 different "earn rewards" programs confuse users
- Similar tier structures with different names (Advocate/Champion/Ambassador vs Bronze/Silver/Gold)
- ReferralPage and LoyaltyProgram serve same customer segment
- Overlapping UI patterns (step cards, tier comparison cards)

### Recommendation: **Two Distinct Programs**

**Approach:**
1. **Merge ReferralPage + LoyaltyProgram → `RewardsPage.tsx`**
   - Two sections: "Referral Rewards" + "Purchase Points"
   - Unified tier system (Bronze/Silver/Gold with referral multipliers)
   - Single dashboard showing points + referral credits
   - Route: `/rewards`

2. **Keep AffiliatePage separate** — different audience (professionals vs customers)
   - Requires application approval, different legal terms
   - Keep at `/affiliate` but add clear navigation distinction

**Estimated Reduction:** ~100 lines, clearer product positioning

---

## 3. MEDIUM: Press/Media Page Overlap

### Current State

| File | Route | Purpose |
|------|-------|---------|
| `PressPage.tsx` | `/press` | Press releases, company facts, media assets, contact |
| `PressKitPage.tsx` | `/press-kit` | Brand logos, product imagery, documents, coverage, contact |

### Content Overlap

| Content | PressPage | PressKitPage |
|---------|-----------|--------------|
| Company facts/stats | ✅ (5 items) | ✅ (4 items) |
| Media assets/downloads | ✅ (4 items) | ✅ (13 items) |
| Press releases/coverage | ✅ (3 releases) | ✅ (4 articles) |
| Media contact | ✅ press@hylono.com | ✅ press@hylono.com |

### Problem
- Two pages serving journalists with 60% overlapping content
- Confusing: "Press" vs "Press Kit" — which do I need?
- Both have downloadable assets sections

### Recommendation: **Single Press Hub with Tabs**

**Approach:**
1. Create unified `PressHubPage.tsx` with tabbed interface:
   - **Tab 1: Overview** — Company facts, recent coverage, contact
   - **Tab 2: Press Releases** — Timeline of announcements
   - **Tab 3: Media Assets** — Downloadable logos, images, documents
2. Route: `/press` (canonical)
3. Redirect `/press-kit` → `/press?tab=assets`
4. Delete `PressKitPage.tsx`

**Estimated Reduction:** ~200 lines

---

## 4. LOW: Warranty/Guarantee Confusion

### Current State

| File | Route | Scope |
|------|-------|-------|
| `WarrantyPage.tsx` | `/warranty` | 2-year standard warranty, service request form |
| `GuaranteePage.tsx` | `/guarantee` | 30-day transformation guarantee, 5-year warranty mention |

### Problem
- **Data inconsistency:** WarrantyPage says "2-Year Standard Warranty", GuaranteePage says "5-Year Device Warranty"
- Overlapping "protection/assurance" messaging
- Users confused about which page applies when

### Recommendation: **Single Assurance Page**

**Approach:**
1. Create `AssurancePage.tsx` with two sections:
   - **30-Day Satisfaction Guarantee** — Risk-free trial for new customers
   - **Warranty & Service** — Device warranty, extended coverage, service requests
2. Fix warranty duration (clarify: 2-year standard + 3-year extended = 5-year total available)
3. Route: `/guarantee` (purchase decision point) with anchor `/guarantee#warranty`
4. Redirect `/warranty` → `/guarantee#warranty`

**Estimated Reduction:** ~100 lines + data integrity fix

---

## 5. OBSERVATION: Partner Portal Complexity

### Current State
29 components in `components/partner/` directory serving clinic partners:
- Dashboard, Studio, Academy, Fleet Health, Protocol Prescriber
- Nexus, Supply Shop, Referral Connect, Team Dashboard
- Micro-learning, Leaderboards, Morning Briefing, etc.

### Status
**No consolidation recommended** — These are distinct tools within a professional dashboard, not duplicate pages. The partner portal is well-structured as a SPA with multiple views.

---

## Summary: Recommended Actions

| Priority | Action | Impact | Effort |
|----------|--------|--------|--------|
| P1 | Merge SupportPage + FAQPage + ContactPage → HelpCenterPage | High | Medium |
| P2 | Merge ReferralPage + LoyaltyProgram → RewardsPage | Medium | Low |
| P2 | Merge PressPage + PressKitPage → PressHubPage | Medium | Low |
| P3 | Merge WarrantyPage + GuaranteePage → AssurancePage | Low | Low |

---

## Files Analyzed (Non-HBOT)

- `components/SupportPage.tsx`
- `components/FAQPage.tsx`
- `components/ContactPage.tsx`
- `components/ReferralPage.tsx`
- `components/LoyaltyProgram.tsx`
- `components/AffiliatePage.tsx`
- `components/PressPage.tsx`
- `components/PressKitPage.tsx`
- `components/WarrantyPage.tsx`
- `components/GuaranteePage.tsx`
- `components/LegalPages.tsx` (good consolidation pattern reference)
- `components/partner/*` (29 files reviewed, no consolidation needed)

---

**Report Complete. No changes made. Awaiting decision to implement.**