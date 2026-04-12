# Jitsi — How It Works

## Phase B — Core architecture
- **Runtime model:** Multi-service media stack with web app, XMPP/JVB components, TURN/STUN, and optional recording/streaming add-ons. [https://jitsi.github.io/handbook/docs/intro/, 2026-04-12, current]
- **Main components:** Web UI, prosody/Jicofo/JVB, media relays, auth options, and deployment scripts. [https://github.com/jitsi/docker-jitsi-meet/releases, 2026-04-12, stable-10888]
- **Typical deployment model:** Official Docker deployment is the practical path. Still requires media-capacity and TURN/STUN planning. [https://jitsi.github.io/handbook/docs/intro/, 2026-04-12, current]
- **Runtime dependencies:** Compute, bandwidth, TURN/STUN, storage for recordings if enabled, TLS, and auth integration.
- **Primary data stores:** Config/state plus optional recording storage.
- **Auth model:** Anonymous, token, or integrated auth modes depending on setup.
- **API / integration surface:** Meet APIs, iframe/embed, JWT auth, recording integrations, and media services.
- **Operational complexity:** **Medium to High**
- **Security / compliance considerations:** Meeting access, media traffic, recording storage, and public exposure need careful configuration.

## Architecture interpretation for Hylono
- **Control-plane placement:** Deploy as a separate service. Keep the Hylono public site as the server-first customer surface and integrate through server-side API routes, webhooks, queued jobs, or SDKs.
- **Integration boundary:** Avoid rewriting the public site around this tool’s frontend unless the package explicitly says the tool should own that surface.
- **Blast-radius note:** Moderate.