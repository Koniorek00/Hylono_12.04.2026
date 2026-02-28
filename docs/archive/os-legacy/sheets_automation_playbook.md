# Sheets Automation Playbook

## How to Run
These skills use the **Browser Subagent** to interact with Google Sheets directly.

1.  **Prerequisite**: You must be logged into Google in the browser session (or the sheet must be Public Edit). *Note: Security check required for Public Edit.*
2.  **Invocation**:
    - "Update the tracking sheet at [URL] with this new ticket."
    - "Clean up the customer list at [URL]."

## Common Prompts

### Update
> "Add a new row to [Sheet URL] for Ticket #123. Status: Open, Owner: Growth."

### Clean
> "The 'Emails' column in [Sheet URL] is messy. Dedupe it and convert to lowercase."

### Export
> "Read [Sheet URL] and give me a markdown summary of the Q1 revenue figures."

## Proof Expectations
- **Screenshot**: The agent *must* provide a screenshot of the sheet after the edit.
- **Diff**: If text-based, a diff of the CSV export.
