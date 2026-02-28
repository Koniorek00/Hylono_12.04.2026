# AntiGravity Customization Setup

## Overview
This document guides the user on how to optimize the AntiGravity UI experience for this workspace.

## 1. Browser Integration
To enable "Browser Subagent" capabilities (essential for Sheets Automation and UI Verification):
1.  Ensure you have the **Chrome Extension** installed (if applicable).
2.  Grant permission for the Agent to "Control Browser" when prompted.

## 2. Workspace Mapping
The Agent is hard-linked to `/GEMINI.md` as its brain.
- **Verify**: Check that the Agent reads `GEMINI.md` at the start of new sessions.
- **Reference**: If the Agent drifts, type: `@os read_blueprint`.

## 3. Workflow Import
The `/workflows/` directory contains "Prompt Recipes".
- **Usage**: You can copy-paste these into the Chat UI or save them as "Saved Prompts" / "Slash Commands" if your UI supports it.
- **Format**: Each `.txt` file is a self-contained instruction block.

## 4. Agent Manager
If you have access to the Agent Manager UI:
- **Load Constellation**: Point it to `/docs/os/agent_constellation.md`.
- **Register Skills**: Point it to `.agent/skills/`.
