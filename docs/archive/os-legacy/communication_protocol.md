# Agent Communication Protocol (Shared State)

In AntiGravity, agents do not "chat" in real-time. They communicate via **Persistent Shared State**.

## The Mechanism: The Task Brief
Communication happens by writing files to the `/tasks/` directory.

### 1. Requesting Help (Delegation)
Agent A (Requester) -> Writes `task_brief.yml` to `/tasks/queued/`.
- **Target**: Agent B (Owner).
- **Context**: Why this is needed.
- **DoD**: What success looks like.

### 2. Acknowledgment
Agent B (Owner) -> Moves file to `/tasks/active/` and updates `status: in-progress`.

### 3. Response / Completion
Agent B (Owner) -> Writes findings/result -> Moves to `/tasks/completed/`.
Agent A (Requester) -> Reads the result and proceeds.

## The Council (High-Stakes)
For multi-agent debate (Council Mode), a single `council_round.yml` is created where multiple agents append their "Arguments" as distinct blocks.

## Benefits
- **Traceability**: Every "handover" is a file in Git history.
- **Asynchronous**: Agents don't need to be "online" at the same time.
- **Contextual**: The handover includes the full technical brief, not just a chat message.
