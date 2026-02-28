# Deep Dive 4: The Liability Shield

**Topic**: "How do we aggressively sell health benefits without crossing the FDA 'Medical Advice' red line?"
**Why**: We need to market hard but safely.
**Constraint**: Zero FDA approval (Wellness Devices only).

---

## 🌀 Phase 1: Ingestion (The Shields)

**COMPLIANCE-GATE**:

- "The Exclusionary Funnel". Instead of saying "This Cures Cancer" (Illegal), say "Do NOT use if you have Cancer" (Legal Safety Warning). The user infers the power.
- "The 'Research Says' Linkout". Never make the claim ourselves. Say "See what NIH says about HBOT", and link to the government site. Note: We cannot *summarize* it misleadingly.

**GROWTH-HACKER**:

- "User-Generated Claims". "Let the users say it". If a user review says "It cured my back pain!", is that our claim?
  - *Response from Legal*: YES, if we feature it. Federal Trade Commission (FTC) says we are liable for reviews we highlight.
- "Influencer Disclaimers". Pay influencers to tell *their* story. "My experience with Hylono". Subjective truth.

**QA-VERIFIER**:

- "Binary Questionnaires". Before checkout, ask: "Are you buying this to treat a disease?" If they say Yes -> Block Sale + Refund. "We are for wellness only." Paper trail of innocence.

---

## 🧩 Phase 2: Clustering (The Vectors)

**Cluster A: "UX as Defense"**

- The Exclusionary Funnel (Symptom Checker = Block)
- Binary Questionnaires (Wellness Affirmation)

**Cluster B: "Borrowing Authority"**

- The 'Research Says' Linkout
- Influencer Disclaimers

**Cluster C: "Content Moderation"**

- Validating User Reviews (Removing "Cure" claims)

---

## 🥊 Phase 3: Red Teaming (The Reality Check)

**1. "User-Generated Claims" (Reviews)**

- **Breaker**: "FTC is cracking down. If we highlight 'It cured my Lyme disease', we get fined. We have to moderate reviews aggressively to remove medical claims."
- **Verdict**: **MODIFY**. "Review Gating". We only display reviews that focus on *Comfort, Service, and Energy*. We actively filter out "Cure" reviews to protect the company.

**2. "The 'Research Says' Linkout"**

- **Breaker**: "FDA calls this 'Cross-Labeling'. If you link to a study about Cancer, you are implying your device treats Cancer. Dangerous."
- **Verdict**: **KILL**. Too risky for Day 1. Stick to "Mechanism of Action" (It increases O2) not "Disease Outcomes".

**3. "The Exclusionary Funnel"**

- **Breaker**: "Conversion Killer. If you block everyone with a disease, you lose 90% of customers."
- **Verdict**: **KEEP**. Crucial for liability. We simply ask "Are you under a doctor's supervision?" If Yes -> Approved.

---

## 🏆 Phase 4: Convergence (The Safe Path)

**Winner 1: The "Contraindication Engine" (Exclusionary Funnel)**

- **Concept**: A tool that checks if you are *safe* to use it.
- **Why it works**: It feels like a medical checkup (Trust) but is actually a liability filter.
- **Action**: Build `SafetyCheck.tsx`.

**Winner 2: "Mechanism of Action" 3D Visuals**

- **Concept**: Show O2 entering the cell.
- **Why it works**: Science explains *how*, not *what* it cures. Perfectly legal.
- **Action**: WebGL animation of Oxygenation.

**Winner 3: The "Wellness Affirmation" Checkbox**

- **Concept**: "I understand this is a Non-Medical Wellness Device."
- **Why it works**: Instant legal defense.
- **Action**: Add to Checkout.
