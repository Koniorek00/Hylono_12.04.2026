# Hylono Partner Hub (SaaS OS) - Master Product Requirement Document

**Version**: 1.0 (Draft)  
**Status**: PLANNING  
**Owner**: Product (CPO)  
**Target Audience**: Clinic Owners, Spa Managers, Wellness Directors  

## 1. Vision & Strategy

Transition from "Hardware Vendor" to "Strategic Business Partner." The **Partner Hub** is the operating system for modern regeneration clinics. It centralizes Operations, Marketing, Education, and Revenue Management into a single, indispensable dashboard.

**North Star Metric**: "Weekly Active Clinics" (WAC).

---

## 2. Core Modules (The Foundation)

### 🎨 1. Marketing Studio (Implemented - MVP)

*The creative engine.*

- **Features**: Compliance-safe Asset Generator, "Campaign-in-a-Box", Multi-channel export.
- **Next Step**: Integration with "Smart Nudges" (e.g., "Post new content").
- **Value**: Removes the "I don't know how to market this" friction.

### 🎓 2. Hylono Academy (LMS)

*The knowledge engine.*

- **Structure**:
  - **Level 1: Operator** (Safety, Basic Operation, Sanitation) -> *Required for Warranty*.
  - **Level 2: Protocol Specialist** (Stacking modalities, Client management).
  - **Level 3: Master Trainer** (Train-the-trainer).
- **Features**: Video modules, Quizzes, Digital Certificates.
- **Value**: Reduces support tickets caused by user error; ensures safety compliance.

### 🛒 3. Supply & Commerce

*The logistics engine.*

- **Features**:
  - One-click Reorder (Masks, Cannulas, Filters).
  - Subscription Autoship ("Subscribe & Save 15%").
  - Wholesale Catalog access.
- **Smart Logic**: "Based on your 50 sessions/week volume, you need filters by Feb 14th."

### 🔧 4. Fleet Health & Warranty

*The reliability engine.*

- **Features**:
  - Digital Service Log (Maintenance history).
  - "Report Issue" Wizard (Photo upload => Creates Support Ticket).
  - Warranty Status visualizer.
- **Value**: Peace of mind; higher uptime for revenue generation.

---

## 3. Autonomous Expansion Modules (High-Value Additions)

### 💰 5. The Revenue Cockpit (ROI & Analytics)

*The business brain.*

- **Input**: Partner sets their "Session Price" (e.g., $100/hr).
- **Logic**: Partner logs session volume (manual or via API if smart device).
- **Output**:
  - "Your HBOT generated **$12,500** this month."
  - "Payback Progress": [===========92%---] (Visual bar showing when the machine is paid off).
  - **Strategic Nudge**: "You're at 85% capacity. Adding a second unit would increase revenue by $X."

### 🤝 6. Partner Referral Engine ("Hylono Connect")

*The commission ecosystem.*

- **Concept**: Clinics often have patients who want a unit at home but can't afford full cash price.
- **Flow**:
  1. Clinic refers patient via "Connect" module (sends magic link).
  2. Patient rents/buys a home unit from Hylono.
  3. Clinic gets **Revenue Share** (Recurring Commission) tracked in this dashboard.
- **Value**: Turns the clinic into a Hylono Sales Channel without inventory risk.

### 🧬 7. Protocol Playlist Builder

*The clinical tool.*

- **Features**:
  - Drag-and-drop builder: "10 mins PEMF (Calm) + 60 mins HBOT (1.5 ATA)".
  - Save as "Custom Stack" (e.g., "Post-Marathon Recovery").
  - Print "Session Cards" for operators to follow.
- **Differentiation**: Moves conversation from "Hardware Specs" to "Client Outcomes."

---

## 4. Architecture & UX

### Navigation Structure

- **Global Sidebar**:
  - **Dashboard** (Overview, ROI Pulse, Smart Nudges).
  - **My Fleet** (Health, Warranty, Maintenance).
  - **Marketing Studio** (Asset Generator).
  - **Academy** (Training & Certs).
  - **Shop** (Supplies & Upgrades).
  - **Connect** (Referrals & Commissions).
  - **Settings** (Profile, Users, Billing).

### Role-Based Access Control (RBAC)

- **Use Case**: A clinic owner doesn't want their receptionist seeing wholesale pricing or commission data.
- **Roles**:
  - `admin`: Full access (Owner).
  - `manager`: Can buy supplies, view analytics.
  - `staff`: Can view Academy, Marketing, and Fleet Logs. No pricing/ROI visibility.

### The "Smart Nudge" Engine

*Proactive Intelligence Layer*

1. **Maintenance**: "Clean filters reminder (Due in 3 days)."
2. **Growth**: "You typically slow down in August. Generate a 'Back to School' promo?"
3. **Training**: "New staff member 'Sarah' hasn't completed Safety Onboarding."

---

## 5. Technical Strategy

- **Database**: Expand Prisma Schema (`Clinic`, `UserRole`, `Device`, `TrainingProgress`, `SalesRecord`).
- **Auth**: Clerk or Supabase Auth with Custom Claims for RBAC.
- **Payments**: Stripe Connect (for Payouts to partners) + Stripe Customer Portal (for their billing).
- **LMS**: Integrate a lightweight video player + state tracking, or headless LMS API.

## 6. Implementation Roadmap

*See `/plans/loop/partner_hub_expansion.yml`*
