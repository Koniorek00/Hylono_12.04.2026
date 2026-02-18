# WEBSITE AUTOGENERATION - PHASE 3 (INTERACTIVE INTEL)

## Objective

Upgrade the website from static info-dumping to interactive utilities that empower users to engage with Hylono technology and the partner ecosystem.

## Plan

### 1. Protocol Engine Implementation

- **Goal**: Transform static protocol steps into an interactive session guide.
- **Component**: `components/ProtocolEngine.tsx`.
- **Logic**:
  - Track active step.
  - Interactive timer with start/pause/reset.
  - "Save to Dashboard" placeholder for session history.
- **Integration**: Insert into `TechDetail.tsx` under the Protocol section.

### 2. Interactive Partner Map

- **Goal**: Replace the CSS placeholder map with a live Leaflet map.
- **Library**: `leaflet`, `react-leaflet`.
- **Features**:
  - Clustered markers for partners.
  - Tooltips with partner highlights.
  - Auto-center on filter change.

### 3. Circadian Preferences UI

- **Goal**: Add a user preference layer for bio-optimization settings.
- **Location**: `AuthComponents.tsx` -> `AccountPage` (Settings Tab).
- **Features**:
  - Warm/Cool light toggle.
  - Default session intensity slider.
  - "Protocol Reminders" toggle.

## Success Criteria (DoD)

- [ ] Users can start a 10-minute "Intro Session" timer in `TechDetail`.
- [ ] `PartnerLocator` shows a functional map with pins.
- [ ] `AccountPage` has a new "Circadian Settings" section.
- [ ] Build passes with no lint errors.
