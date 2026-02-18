# Feature Specification: Hylono Partner Studio

**Status**: PROPOSED  
**Priority**: HIGH (Growth/B2B)  
**Owner**: Product (CPO) / Growth  

## 1. Executive Summary

The **Hylono Partner Studio** is a controlled, "Canva-like" marketing asset generator designed to empower B2B partners (clinics, spas) to create professional, co-branded marketing materials instantly. It solves the critical bottleneck of partners failing to market the hardware effectively due to lack of design resources or fear of compliance violations.

**Core Value Proposition**: "Professional, Compliant, Instant Marketing for your Clinic."

## 2. Elite Improvements (The "WOW" Factors)

*Implemented as core differentiators.*

### 🚀 1. The "Campaign-in-a-Box" (Omni-Channel Generation)

Instead of generating one asset at a time, the system generates a **Unified Campaign Pack**.

- User selects "Grand Opening".
- System generates:
  - 1x Instagram Story (9:16)
  - 1x Social Feed Post (1:1)
  - 1x Email Header (16:9)
  - 1x A4 Counter Poster (Print)
- **Why**: Maximizes partner output and ensures consistent branding across all their channels.

### 🧠 2. AI Compliance & Tone Tuner

A "Smart Text Assistant" that rewrites partner input to be:

- **Compliant**: Validates against a blocklist of forbidden terms (e.g., "cure", "heal") and auto-suggests safe alternatives ("optimize", "revitalize").
- **Tone-Adaptive**: A slider to shift copy between **"Clinical/Medical"** (Trust, Science) and **"Spa/Luxury"** (Relaxation, Experience).

### 📊 3. Smart ROI Tracking (Dynamic QR)

Every generated printable/digital asset includes a **unique, dynamic QR code**.

- The QR code points to the partner's booking link but routes through Hylono's analytics.
- **Value**: Partners can see *exactly* how many scans their "Lobby Poster" got vs. their "Front Window Flyer".
- **Hylono Value**: We get data on end-consumer engagement.

---

## 3. User Journey: The "Smart Wizard"

### Step 1: Partner Identity (One-Time Setup/Confirm)

*Data sourced from Partner Profile if logged in.*

- **Logo Upload**: SVG/PNG.
- **Brand Color**: Hex code (System checks contrast ratio against Hylono White/Black; auto-adjusts if low contrast).
- **Contact**: Address, Phone, Booking URL.

### Step 2: Campaign Context

- **Inventory**: "I have: [Pinnacle 360 HBOT], [Aurora Light Panel]." (System filters templates).
- **Goal**: [New Member Acquisition], [Education], [Upsell], [Event].
- **Tone**: [Clinical] <-> [Spa].

### Step 3: Template Selection

- Grid of high-fidelity thumbnails showing *their* logo and color already applied (Pre-computation).

### Step 4: The Studio (Editor)

- **Left Panel**: Controls (Text, Image Swap, Color).
- **Center**: Canvas (WYSIWYG).
- **Right Panel**: Compliance Checklist (Real-time).
- **Constraints**:
  - **Locked Layers**: Hylono "Verified Technology" Badge, Medical Disclaimers, Footer.
  - **Safe Zones**: Text areas that prevent overflow.

### Step 5: Export & Print

- **Web**: Download ZIP of PNG/JPGs.
- **Print**: Download PDF (CMYK, Crop Marks, Bleed).

---

## 4. Technical Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router).
- **State Management**: `zustand` (for complex canvas state: layers, history, selection).
- **UI Components**: `shadcn/ui` + Tailwind CSS.
- **Canvas Rendering**:
  - **Edit Mode**: DOM-based overlay (HTML/CSS absolute positioning) for perfect WYSIWYG editing and accessibility.
  - **Export (Web)**: `html-to-image` (Client-side).
  - **Export (Print)**: `@react-pdf/renderer` (Client-side generation of high-res PDFs). This allows for vector-based text and CMYK color profiles better than canvas screenshots.

### Data Model (Prisma)

- **PartnerProfile**: Stores logo_url, brand_color, verified_devices[].
- **AssetTemplate**: JSON structure defining layout, locked zones, and text variables.
- **GeneratedAsset**: Log of created assets (for history and re-download).
- **CampaignQR**: id, target_url, scan_count, asset_id.

### Compliance Engine

- **Middleware**: Intercepts text input.
- **Blocklist**: `constants/compliance_terms.ts`.
- **Logic**: If `modality == 'HBOT'`, append `Disclaimer_HBOT_v1`.

## 5. Implementation Phases

- [ ] **Phase 1: Foundation**
  - Setup `@react-pdf/renderer`.
  - Build `PartnerContext` and `BrandConfig` store.
  - Create 3 hardcoded "Master Templates" (HBOT, Red Light, PEMF).

- [ ] **Phase 2: The Studio UI**
  - Build the Wizard Steps.
  - Implement the "Live Preview" (DOM overlay).
  - Implement PDF generation logic.

- [ ] **Phase 3: Intelligence**
  - Connect AI Tone Tuner (Mocked initially or API).
  - Implement Dynamic QR Generator.
  - Finalize Compliance Blocklist.
