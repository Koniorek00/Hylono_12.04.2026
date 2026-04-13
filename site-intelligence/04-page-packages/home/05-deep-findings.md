# Deep Findings

## Finding 1
- Observation: Brand-led first view is slower than it should be for non-branded traffic.
- Evidence: app/page.tsx, app/HomeClient.tsx, components/Home.tsx
- Why it matters: This route needs to match its real job in the wider site system.
- Severity: High
- Confidence: High
- Recommended direction: Rewrite the hero so it states what Hylono does, for whom, and why the access model matters.

## Finding 2
- Observation: The route shell is SEO-safe, but the homepage body still depends on a large motion-heavy client component.
- Evidence: app/page.tsx, app/HomeClient.tsx, components/Home.tsx
- Why it matters: This route needs to match its real job in the wider site system.
- Severity: High
- Confidence: High
- Recommended direction: Move verification/support/rental proof directly below the first CTA cluster.

## Finding 3
- Observation: Trust-layer and access-layer proof need to move closer to the hero.
- Evidence: app/page.tsx, app/HomeClient.tsx, components/Home.tsx
- Why it matters: This route needs to match its real job in the wider site system.
- Severity: High
- Confidence: High
- Recommended direction: Reduce critical-path motion and keep the main hub links obvious without scrolling.
