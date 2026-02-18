# AUTO-0001: Implement browser-regression-walkthrough skill

## Context

Analysis of recent missions (e.g., Feature Flag implementation) shows a heavy reliance on manual thought-based verification or fragmented console commands. This increases regression risk and manual overhead.

## Goal

Implement a robust `browser-regression-walkthrough` skill in `/.agent/skills/` that uses `browser_subagent` to verify critical User Journeys.

## Requirements

- Use Playwright/Subagent to navigate the site.
- Capture screenshots of critical changes.
- Verify console logs for errors.
- Output a visual verification report.

## ROI Score: 9/10

High impact on verification reliability and speed.
