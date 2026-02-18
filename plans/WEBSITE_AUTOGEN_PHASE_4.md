# Website Autogen Phase 4: Synergy AI (Intelligence & Personalization)

Date: 2026-01-16
Status: PLANNED
Owner: product-spec-writer

## 1. Objective

Transform the website from a product catalog into an "Intelligence System" by leveraging the Synergy Knowledge Graph to provide personalized tech-stack recommendations and an integrated "Protocol Stacking" experience.

## 2. Deliverables

### D1: SynergyEngine Component

- **Location**: `components/SynergyEngine.tsx`
- **Logic**:
  - Input: Array of `TechType` already "Selected" or "Owned".
  - Output: Ranked list of complementary technologies based on `KNOWLEDGE_REGISTRY.synergies`.
  - UI: Premium "Synergy Cards" showing the % Boost and specific biological rationale.

### D2: Protocol Stacking (Engine Upgrade)

- **File**: `components/ProtocolEngine.tsx`
- **Logic**: Modify to support "Stack Queues".
- **Feature**: "Auto-Advance to Synergy Partner" - When HBOT session ends, suggest immediate Hydrogen inhalation if available in the user's stack.

### D3: BioDashboard Integration

- **File**: `components/BioDashboard.tsx`
- **Feature**: "Synergy Status" Widget.
- **Metric**: "System Coherence" score (Calculated based on synergy overlaps of active protocols).

### D4: Goal-Oriented Stacks

- **Logic**: Map `TechData.goals` (Rest, Focus, Repair, Life) to specific multi-tech stacks.
- **UI**: "Stack Presets" in the Store and Dashboard.

## 3. Execution Roadmap

1. Create `SynergyEngine.tsx` correctly importing from `knowledge.ts`.
2. Update `BioDashboard.tsx` to include the `SynergyEngine` (Personalized View).
3. Enhance `ProtocolEngine.tsx` with "Next in Stack" transitions.
4. Add "Goal-Based Presets" to the Store/TechDetail pages.
5. Verify with `browser-regression-walkthrough`.

## 4. Definition of Done (DoD)

- [ ] Users see personalized "Synergy Boost" percentages.
- [ ] Protocol Engine can transition between two different techs in a single session.
- [ ] Dashboard displays a calculated "Coherence Score".
- [ ] No regression errors in build or console.
