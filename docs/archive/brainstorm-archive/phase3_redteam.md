# Phase 3: Adversarial Review (Red Teaming)

**Context**: Top 8 candidates selected. "Builder" (Product) vs "Breaker" (Security/QA).
**Goal**: Stress-test to find hallucinations, legal risks, or impossibilities.

---

## 1. The Hylono Bio-Index (HBI)

- **Builder (The Pitch)**: "Gamify health. We aggregate sleep, O2 sessions, and subjectivity into a single score: 'You are a 72/100'. People are addicted to Oura scores; we build ours for recovery."
- **Breaker (The Exploit)**: "Data Hallucination risk. We don't have access to their blood or real-time biometrics unless we integrate 3rd party APIs (Apple Health). Users will game it by manually logging fake sessions. If the score drops, they might quit. Also, 'Scoring health' sounds like a medical diagnosis (FDA risk)."
- **Verdict**: **KEEP**, but strictly as "Engagement Score" (Session Consistency), NOT "Health Score" until API integration is ready.

## 2. The Contraindication Engine

- **Builder**: "Safety is our moan. A visual body map. Click 'Pacemaker' -> Store hides PEMF devices. Zero liability, high trust."
- **Breaker**: "False Negative Liability. If a user has a rare condition we didn't list, and they buy it because 'it wasn't filtered', we are liable. Also, medical advice is legally dangerous for an AI to dispense."
- **Verdict**: **KEEP** with Disclaimers. Must be "Exclusionary Only" (We warn what NOT to use) rather than "Inclusionary" (We say what IS safe).

## 3. The Comparison Destroyer

- **Builder**: "Aggressive transparency. We scrape competitors daily. We show 'Us: $1200, Them: $1500' side-by-side. Unbeatable conversion logic."
- **Breaker**: "Legal & Stability Nightmare. Competitors will sue for trademark or block our scrapers. Their sites change structure -> our scraper breaks -> we show outdated data ($0) -> we look stupid."
- **Verdict**: **DEMOTE**. High maintenance. Better to use static, manually updated comparisons with "Last Updated" timestamps.

## 4. Visual Supply Chain (Uber-Style)

- **Builder**: "Peace of mind. High-ticket items ($20k) shouldn't feel like an Amazon $5 mystery package. Show the truck on the map."
- **Breaker**: "Over-engineering. We use FedEx/UPS APIs. We can't track the *truck* unless we own the fleet. We can only show 'In Transit'. Real-time map is a lie/hallucination."
- **Verdict**: **MODIFY**. "Visual Milestones" (UI Timeline) instead of "Live Map".

## 5. Hylono API (HAPI)

- **Builder**: "Platform play. Let devs build 'HBOT Timer' apps or 'Recovery Coach' apps on our OS."
- **Breaker**: "Zero adoption risk. We don't have enough users yet (<1M). Building an API + Documentation + SDK is 6 months of Engineering for 3 users. Premature optimization."
- **Verdict**: **KILL** (For now). Priority 3.

## 6. Referral Trees

- **Builder**: "MLM but cool. Visual node graph. 'You are the root of a $50k revenue tree'. Visible status."
- **Breaker**: "Pyramid Scheme vibes. If it looks too MLM-y, premium users (Clinics) will find it tacky. Privacy risk: Can I see how much money my friend spent?"
- **Verdict**: **KEEP**. Limit visibility to "Credits Earned", hide spend amounts. Focus on "Community" not "Downline".

## 7. RentalReturn AI

- **Builder**: "Computer Vision checks the box. 'Green check' before they ship. Stops 'You broke it' arguments."
- **Breaker**: "Tech complexity hell. Users have bad lighting, bad cameras. CV model will fail 40% of the time, frustrating users who just want to return the box. Support ticket explosion."
- **Verdict**: **DEMOTE**. Use manual photo upload + human review instead of AI for now.

## 8. The Truth Log

- **Builder**: "Radical Honesty. A public JSON/Markdown log of every claim + source."
- **Breaker**: "Boring? Users might not care. BUT, it adds 'Gravitas'. Zero downside, easy to build."
- **Verdict**: **KEEP**. Easy win for "Trust" brand pillar.
