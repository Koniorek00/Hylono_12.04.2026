# Medplum — Overview

## Snapshot
- Environment context: **Phase 2 / UNKNOWN**
- Researched as: **Medplum healthcare developer platform**
- Current version researched: **v5.1.6** — **CONFIRMED** [https://github.com/medplum/medplum/releases, 2026-04-12, v5.1.6]
- License posture: **Apache-2.0 / verify hosted-service terms separately if relevant** — **PARTLY VERIFIED** [https://www.medplum.com/docs, 2026-04-12, current]
- Recommended timing: **DEFER UNLESS EXPLICIT HEALTHCARE DATA PROGRAM EXISTS**
- Maintenance burden: **High**
- Risk level: **High**

## Phase A — App identity
- **What it is:** Open-source healthcare developer platform built around FHIR, APIs, auth, forms, messaging, and healthcare-grade workflows. [https://www.medplum.com/docs, 2026-04-12, current]
- **What it solves:** Healthcare data models, FHIR APIs, scheduling/forms/workflows, and regulated-health application development. [https://github.com/medplum/medplum/releases, 2026-04-12, v5.1.6]
- **Best-fit users:** Healthcare software teams and organizations building real clinical or patient-data systems. [https://www.medplum.com/docs, 2026-04-12, current]
- **Where it fits in a modern stack:** Powerful but likely too heavy and too clinical for Hylono unless the business explicitly enters regulated health data territory. This should not be adopted casually for health-adjacent wellness operations. [https://github.com/medplum/medplum, 2026-04-12, v5.1.6]

## Hylono fit snapshot
- **Business usefulness:** Only relevant if Hylono decides to build regulated or patient-data workflows. Otherwise it is overkill. [https://github.com/medplum/medplum/releases, 2026-04-12, v5.1.6]
- **Overlap watch:** Could overlap with Metriport/FHIR ambitions, but all of those are unnecessary unless true healthcare data enters scope.
- **Must verify before implementation:** Decide whether Hylono will ever store PHI/regulated healthcare data. If not, Medplum is likely unnecessary now.