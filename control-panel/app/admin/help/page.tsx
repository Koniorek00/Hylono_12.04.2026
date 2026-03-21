import Link from "next/link";

type FAQ = {
  q: string;
  a: string;
};

const FAQS: FAQ[] = [
  {
    q: "What is the Hylono Stack?",
    a: "The Hylono Stack is a curated collection of self-hosted services that cover commerce, fleet, CRM, IAM, automation, IoT, AI, marketing, health, and security. The control panel shows the catalog and the currently runnable slices from this checkout.",
  },
  {
    q: "What does Essential vs Recommended mean?",
    a: "Essential means a service is part of the core operating stack. Recommended means it adds value but is not required to bring the current stack online.",
  },
  {
    q: "What does build-from-source mean?",
    a: "It means there is no official prebuilt image for that service, so it requires a custom build workflow before it can run.",
  },
  {
    q: "I ran generate-secrets.sh but nothing happened.",
    a: "If .env already exists, the script exits without overwriting it. Delete .env only if you intentionally want to regenerate all secrets and reconnect the stack with the new credentials.",
  },
  {
    q: "Docker says a port is already in use.",
    a: "Another process is already listening on that port. On Windows, use netstat -ano | findstr <port> to identify it. Either stop that process or change the docker-compose port mapping.",
  },
  {
    q: "Services start and then exit. What should I check first?",
    a: "Check docker compose logs for the failing service, then verify .env, memory allocation in Docker Desktop, and any port conflicts. Infrastructure must be healthy before Phase 1A can be stable.",
  },
  {
    q: "How do I see which services are running?",
    a: "Run docker compose -f docker/infrastructure/docker-compose.yml ps and docker compose -f docker/phase-1a/docker-compose.yml ps. Uptime Kuma is available at http://localhost:3002 once infrastructure is healthy.",
  },
  {
    q: "What does the desktop launcher seed automatically now?",
    a: "The local launcher now does more than bring containers up. It reasserts the deterministic operator logins that are already wired into the stack, ensures the Documenso signing certificate exists, seeds the Hylono Uptime Kuma status page, replays the Medusa local catalog baseline, replays the Snipe-IT operator inventory baseline, replays the Cal.com operator schedule and availability baseline, replays the Lago demo billing baseline, seeds the Twenty CRM operator workspace, reconciles the five versioned n8n intake workflows, seeds canonical Novu operator subscribers, and validates the current local mail-provider profile.",
  },
  {
    q: "Where do I see what is actually ready right now?",
    a: "Open /admin/progress. It is the operator-grade progress view for the local slice: launcher baseline, live infrastructure, verified browser URLs, Documenso signing support, n8n backup evidence, Novu operator recipients, and the remaining manual blockers like staging cutover or external delivery providers.",
  },
  {
    q: "Where is the local status page for the stack?",
    a: "The seeded Uptime Kuma status page is published at http://localhost:3002/status/hylono-local. It groups the browser-facing services into operator-friendly sections so you do not have to read the raw monitor list every time.",
  },
  {
    q: "Why does MongoDB or PostgreSQL look broken in the browser?",
    a: "Those ports are not browser UIs. Ports like 27017, 5432, and 6379 are native database or cache ports for drivers and CLIs. If you open them in a browser, protocol errors are expected. Use the browser-facing URLs shown in the control panel instead.",
  },
  {
    q: "What is n8n and why is it important?",
    a: "n8n is the automation layer that connects the rest of the stack. Many integration flows in the manifest rely on it as the glue between services.",
  },
  {
    q: "What is already wired locally beyond the browser apps?",
    a: "The local stack now has a working intake spine from the Hylono web app into n8n. Contact, booking, newsletter, checkout, and rental submissions are persisted in the local Postgres fallback tables. Contact, booking, checkout, and rental can also create real operator follow-up tasks in Twenty CRM, and the email-based flows sync into Novu subscriber profiles. Rental still requires an email-shaped user identity to promote into CRM and Novu; opaque IDs continue to stop at DB plus n8n. n8n is reconciled to the versioned five-workflow local intake set, Novu keeps canonical operator subscribers for ops, support, and contact, Medusa keeps a guarded local catalog plus a publishable store key for storefront probes, Cal.com keeps a deterministic operator schedule plus weekday availability, and Lago keeps a demo customer, billable metric, and plan for local billing checks. Documenso also has a local signing certificate bootstrap, so completed documents can be signed instead of only previewed.",
  },
  {
    q: "What baseline data should I expect in Medusa, Cal.com, and Lago locally?",
    a: "Medusa currently has a seeded local admin user, starter catalog products, multiple regions, stock locations, and a publishable store API key. Cal.com currently has the operator account, a default schedule, weekday availability, three baseline event types, and the public booking page at http://localhost:8106/hylono. Lago currently has the operator account, one local organization, and a demo customer plus billable metric plus plan baseline for billing tests.",
  },
  {
    q: "What baseline data should I expect in Snipe-IT locally?",
    a: "Snipe-IT now has a deterministic operator inventory baseline: the Warsaw clinic location, the Hylono Medtech manufacturer, the HBOT Equipment category, the HBOT Starter System model, and the seeded HBOT-001 asset. Re-run scripts/seed-snipeit-operator-baseline.ps1 if you need to reconcile it.",
  },
  {
    q: "Does Novu send real email locally right now?",
    a: "No. The local Novu runtime is currently configured for in-app notifications through Novu Inbox. Subscriber sync and workflow triggering are real, but email-provider setup remains manual until you have the SMTP or provider credentials you actually want to use.",
  },
  {
    q: "How do I validate the mail-provider setup before using real email delivery?",
    a: "Run .\\scripts\\validate-mail-provider-env.ps1 from the repo root. The local-safe profile is a valid baseline, and the script checks whether app mailers and Novu have the right settings before you switch to a real SMTP or provider-backed configuration.",
  },
  {
    q: "Where is the staging handoff scaffold?",
    a: "The staging scaffold is file-based for now. Start with .env.staging.example, docs/runbooks/local-to-staging.md, docs/runbooks/staging-launch-checklist.md, and deploy/staging/stack-contract.md. That is the current handoff path from the proven local operator stack to a server-backed staging deployment.",
  },
  {
    q: "What is Zitadel?",
    a: "Zitadel is the identity and access management service. It handles login, user accounts, permissions, and single sign-on for the broader stack.",
  },
  {
    q: "How do I back up the stack?",
    a: "Run bash scripts/backup.sh. That script writes timestamped backup artifacts under /backups/hylono/YYYY-MM-DD/.",
  },
  {
    q: "Can I run only some services instead of everything?",
    a: "Yes. Infrastructure and the verified Phase 1A subset can be started selectively with docker compose, as long as their dependencies are already running. Snipe-IT also needs its dedicated MariaDB container.",
  },
  {
    q: "Are Phase 1B and later runnable from this repo?",
    a: "Not yet. They are catalogued in the manifest and visible in the stack explorer, but the compose files included in this checkout currently cover only infrastructure and Phase 1A.",
  },
  {
    q: "Are all Phase 1A services runnable from this repo now?",
    a: "The pinned Phase 1A runtime is runnable from this checkout: Medusa, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Zitadel, Novu, and n8n. Leihs still remains build-from-source and is not part of the current default launch path.",
  },
  {
    q: "Do any of the Phase 1A browser apps still need a first-run wizard?",
    a: "Not for the current local operator path. Uptime Kuma, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Medusa, Zitadel, Novu, and n8n now all have deterministic local operator logins. Medusa also keeps a seeded catalog baseline, Cal.com keeps a seeded schedule plus event baseline, Lago keeps a seeded demo billing baseline, and MinIO keeps fixed browser credentials from .env.",
  },
];

const GLOSSARY = [
  {
    term: "Docker",
    def: "A platform for packaging software into isolated containers.",
  },
  {
    term: "Docker Compose",
    def: "The tool used here to start and coordinate multiple containers together.",
  },
  {
    term: "PostgreSQL",
    def: "The main relational database used by most services in the stack.",
  },
  {
    term: "Redis",
    def: "An in-memory cache and queue backend used by multiple services.",
  },
  {
    term: "MinIO",
    def: "Self-hosted object storage, similar to S3.",
  },
  {
    term: "IAM",
    def: "Identity and Access Management. Zitadel is the IAM service in this stack.",
  },
  {
    term: "RAG",
    def: "Retrieval-Augmented Generation, where AI answers are grounded in indexed knowledge.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Help</h1>
          <p className="mt-1 text-sm text-gray-400">
            Common questions, troubleshooting notes, and a short glossary.
          </p>
        </div>

        <div className="mb-8 flex gap-3">
          <Link
            href="/admin/progress"
            className="flex-1 rounded-xl border border-emerald-800/50 bg-emerald-900/20 p-3 text-center transition-colors hover:border-emerald-700"
          >
            <div className="text-base font-medium text-white">Progress</div>
            <div className="mt-0.5 text-xs text-gray-500">What is ready now</div>
          </Link>
          <Link
            href="/admin/quickstart"
            className="flex-1 rounded-xl border border-blue-800/50 bg-blue-900/30 p-3 text-center transition-colors hover:border-blue-700"
          >
            <div className="text-base font-medium text-white">Quick Start</div>
            <div className="mt-0.5 text-xs text-gray-500">Step-by-step launch</div>
          </Link>
          <Link
            href="/admin/commands"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-900 p-3 text-center transition-colors hover:border-gray-600"
          >
            <div className="text-base font-medium text-white">Commands</div>
            <div className="mt-0.5 text-xs text-gray-500">Copy-paste operations</div>
          </Link>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 border-b border-gray-800 pb-2 text-base font-semibold text-gray-200">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-800 bg-gray-900">
                <summary className="flex list-none cursor-pointer items-center justify-between gap-2 px-4 py-3.5 text-sm font-medium text-gray-200 select-none hover:text-white">
                  <span>{faq.q}</span>
                  <span className="flex-shrink-0 text-gray-600 transition-transform group-open:rotate-180">
                    v
                  </span>
                </summary>
                <div className="whitespace-pre-line border-t border-gray-800 px-4 pb-4 pt-0 text-sm leading-relaxed text-gray-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 border-b border-gray-800 pb-2 text-base font-semibold text-gray-200">
            Glossary
          </h2>
          <div className="space-y-2">
            {GLOSSARY.map((item) => (
              <div
                key={item.term}
                className="flex gap-3 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3"
              >
                <span className="w-28 flex-shrink-0 font-mono text-sm font-semibold text-cyan-400">
                  {item.term}
                </span>
                <span className="text-sm text-gray-400">{item.def}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 text-sm text-gray-400">
          <div className="mb-1 font-semibold text-white">Still blocked?</div>
          <p>
            Open the Docs links from the service cards in{" "}
            <Link href="/admin/stack" className="text-blue-400 hover:text-blue-300">
              Stack Overview
            </Link>
            . The seeded local status page is also available at{" "}
            <a
              href="http://localhost:3002/status/hylono-local"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              http://localhost:3002/status/hylono-local
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
