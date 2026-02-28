import Link from "next/link";

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "What is the Hylono Stack?",
    a: "The Hylono Stack is a curated collection of 59 open-source services that together form the complete technology platform for Hylono — covering e-commerce, equipment management, IoT device monitoring, AI/search, customer relationships, marketing, education, health data, and security. Instead of buying expensive SaaS tools, you self-host everything.",
  },
  {
    q: "What does 'Essential' vs 'Recommended' mean?",
    a: "'Essential' (green) means the service is required for Hylono to function — without it, a core business process breaks. 'Recommended' (amber) means the service adds value but is optional — you can launch without it and add it later.",
  },
  {
    q: "What does the ⚠ warning triangle mean?",
    a: "A yellow ⚠ means the service has an elevated risk level (HIGH or MEDIUM). This usually means: no official Docker image (must build from source), complex configuration, or known stability issues. Click the card to see the specific risk note. These services still work — they just need more careful setup.",
  },
  {
    q: "What does 'build-from-src' mean on a card?",
    a: "It means there is no pre-built official Docker image for this service. You must clone the repository and build the Docker image yourself. The card's GitHub link takes you to the source. Leihs and Strapi are the main ones. See the build instructions in their respective documentation.",
  },
  {
    q: "I ran generate-secrets.sh but nothing happened.",
    a: "If you already have a .env file, the script skips (by design — it won't overwrite your secrets). If you want to regenerate: delete .env first, then run the script again. Warning: deleting .env means your existing running services won't be able to connect until you recreate and update passwords.",
  },
  {
    q: "Docker says 'port already in use'. What do I do?",
    a: "Another process is using that port. Find it with: lsof -i :5432 (Mac/Linux) or netstat -ano | findstr 5432 (Windows). Either stop that process, or change the port mapping in the relevant docker-compose.yml file (e.g. change '5432:5432' to '5433:5432').",
  },
  {
    q: "Services start but immediately exit. What's wrong?",
    a: "Check the logs: docker compose -f docker/infrastructure/docker-compose.yml logs [service-name]. Common causes: (1) missing environment variable — check your .env file has all required vars, (2) not enough memory — ensure Docker has at least 4GB RAM allocated in Docker Desktop settings, (3) port conflict (see above).",
  },
  {
    q: "How do I see which services are running?",
    a: "Run: docker compose -f docker/infrastructure/docker-compose.yml ps\nFor Phase 1A: docker compose -f docker/phase-1a/docker-compose.yml ps\nOr open Uptime Kuma at http://localhost:3001 — it monitors all services with a visual dashboard.",
  },
  {
    q: "What is n8n and why is it important?",
    a: "n8n is the automation engine that connects all other services together. Most of the 27 integration flows (like 'when a new order is placed in Medusa, create an invoice in Lago') run through n8n. It's the glue of the stack. Access it at http://localhost:5678 after starting Phase 1A.",
  },
  {
    q: "What is Zitadel?",
    a: "Zitadel is the Identity and Access Management (IAM) service — it handles login, user accounts, permissions, and Single Sign-On (SSO) for all Hylono services. Think of it as the authentication backbone. All other services rely on it for login. Set it up first in Phase 1A.",
  },
  {
    q: "How do I back up my data?",
    a: "Run: bash scripts/backup.sh\nThis creates a timestamped folder at /backups/hylono/YYYY-MM-DD/ containing a compressed PostgreSQL dump and a Redis snapshot. Schedule this daily via cron: 0 2 * * * cd /path/to/hylono && bash scripts/backup.sh",
  },
  {
    q: "What's the difference between Phase 1A, 1B, 1C, and Phase 2?",
    a: "The phases define the deployment order based on dependencies and priority:\n• Infrastructure: database, cache, storage — must be first\n• Phase 1A: core business (commerce, fleet, CRM, auth) — start here\n• Phase 1B: IoT, AI, education, telehealth — add when ready\n• Phase 1C: marketing, advanced platform, security monitoring\n• Phase 2: 28 recommended additions — deploy as needed, in any order",
  },
  {
    q: "Can I run only some services instead of everything?",
    a: "Yes. Each service in docker-compose.yml is independent. You can start individual services with: docker compose -f docker/phase-1a/docker-compose.yml up -d medusa lago\nJust make sure the infrastructure layer is running first (postgres, redis, minio).",
  },
  {
    q: "How do I update a service to a newer version?",
    a: "1. Pull the latest image: docker compose -f docker/[phase]/docker-compose.yml pull [service]\n2. Recreate the container: docker compose -f docker/[phase]/docker-compose.yml up -d [service]\nAlways check the service's changelog before upgrading — some updates require database migrations.",
  },
];

const GLOSSARY = [
  { term: "Docker", def: "A tool that packages software into containers — isolated, reproducible environments. Each service runs in its own container." },
  { term: "Docker Compose", def: "A tool for defining and running multiple Docker containers together. The docker-compose.yml files describe how to start all services." },
  { term: "PostgreSQL", def: "The main relational database. Almost every service stores its data here in its own dedicated database." },
  { term: "Redis", def: "A fast in-memory cache and message broker. Used for sessions, queues, and real-time data by multiple services." },
  { term: "MinIO", def: "Object storage — like a self-hosted AWS S3. Stores files, images, documents uploaded to any service." },
  { term: "n8n", def: "A visual workflow automation tool. Connects services together by defining automated triggers and actions." },
  { term: "Temporal", def: "A workflow orchestration engine for long-running, multi-step business processes (like partner onboarding flows)." },
  { term: "IAM", def: "Identity and Access Management — the system that handles who can log in and what they're allowed to do. Zitadel is the IAM here." },
  { term: "MQTT", def: "A lightweight protocol for IoT device communication. Mosquitto is the MQTT broker in this stack." },
  { term: "RAG", def: "Retrieval-Augmented Generation — an AI technique that searches a knowledge base before answering questions. Used by Dify." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">❓ Help & FAQ</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Answers to common questions, plus a glossary of terms.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-8">
          <Link href="/admin/quickstart"
            className="flex-1 bg-blue-900/30 border border-blue-800/50 hover:border-blue-700 rounded-xl p-3 text-center transition-colors">
            <div className="text-base font-medium text-white">🚀 Quick Start</div>
            <div className="text-xs text-gray-500 mt-0.5">Step-by-step launch</div>
          </Link>
          <Link href="/admin/commands"
            className="flex-1 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-3 text-center transition-colors">
            <div className="text-base font-medium text-white">💻 Commands</div>
            <div className="text-xs text-gray-500 mt-0.5">Copy-paste scripts</div>
          </Link>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-800">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl group">
                <summary className="px-4 py-3.5 cursor-pointer text-sm font-medium text-gray-200 hover:text-white list-none flex items-center justify-between gap-2 select-none">
                  <span>{faq.q}</span>
                  <span className="text-gray-600 flex-shrink-0 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-4 pb-4 pt-0 text-sm text-gray-400 leading-relaxed whitespace-pre-line border-t border-gray-800">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-800">Glossary</h2>
          <div className="space-y-2">
            {GLOSSARY.map((item) => (
              <div key={item.term} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex gap-3">
                <span className="font-mono font-semibold text-cyan-400 text-sm flex-shrink-0 w-28">{item.term}</span>
                <span className="text-sm text-gray-400">{item.def}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Support note */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-sm text-gray-400">
          <div className="font-semibold text-white mb-1">📬 Still stuck?</div>
          <p>Check the individual service documentation via the <strong>Docs ↗</strong> links on each service card in the <Link href="/admin/stack" className="text-blue-400 hover:text-blue-300">Stack Overview</Link>. Each service has its own detailed documentation covering configuration, troubleshooting, and advanced usage.</p>
        </div>
      </div>
    </div>
  );
}
