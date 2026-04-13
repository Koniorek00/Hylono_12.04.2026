"use client";

import { useState } from "react";
import { CopyCodeBlock } from "@/components/CopyButton";

type Command = {
  label: string;
  code: string;
  note?: string;
};

type Tab = {
  id: string;
  label: string;
  icon: string;
  desc: string;
  commands: Command[];
};

const TABS: Tab[] = [
  {
    id: "setup",
    label: "Setup",
    icon: "SET",
    desc: "Commands to initialize and start the pinned local stack from this checkout.",
    commands: [
      {
        label: "Start the full local stack",
        code: ".\\start-dev.bat",
        note: "Single entry point for Docker, control panel, the website on localhost:3000, and the launcher-wired operator bootstrap for the active first wave: Kuma, Twenty, n8n, Novu, plus the local mail-profile validation pass.",
      },
      {
        label: "Generate secrets (.env)",
        code: ".\\scripts\\generate-secrets.ps1",
        note: "Primary Windows path. Safe to run. It skips if .env already exists.",
      },
      {
        label: "Start infrastructure only",
        code: ".\\scripts\\setup.ps1 infrastructure",
      },
      {
        label: "Start infrastructure plus active first wave",
        code: ".\\scripts\\setup.ps1 active",
        note: "Starts only the current deploy-now app slice: Twenty, Novu, and n8n on top of infrastructure.",
      },
      {
        label: "Start infrastructure plus local Phase 1A lab slice",
        code: ".\\scripts\\setup.ps1 1a",
        note: "Brings up the broader local lab slice for Medusa, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Zitadel, Novu, and n8n. Keep in mind that the default staging first wave is narrower and should center on the live intake backbone plus control-plane services.",
      },
      {
        label: "Seed active first-wave operator baseline",
        code: ".\\scripts\\seed-active-wave-operator-baseline.ps1",
        note: "Reconciles the current deploy-now app settings for Uptime Kuma, Twenty, n8n, Novu, and the local mail-profile validation pass.",
      },
      {
        label: "Generate Documenso signing certificate",
        code: ".\\scripts\\generate-documenso-signing-certificate.ps1",
        note: "Creates the local PKCS#12 signing certificate used by Documenso for real document signatures.",
      },
      {
        label: "Reassert Phase 1A operator logins",
        code: ".\\scripts\\seed-phase1a-operator-logins.ps1",
        note: "Resets the verified local operator passwords for Lago, Snipe-IT, Cal.com, and Documenso against the running containers. Medusa keeps its own seeded admin baseline and does not use this password-reset script.",
      },
      {
        label: "Seed Uptime Kuma operator config",
        code: ".\\scripts\\seed-uptime-kuma-operator-config.ps1",
        note: "Creates the local Hylono status page, monitor groups, and monitor tags at http://localhost:3002/status/hylono-local.",
      },
      {
        label: "Seed Twenty CRM operator workspace",
        code: ".\\scripts\\seed-twenty-operator-workspace.ps1",
        note: "Idempotently seeds Hylono Operations, canonical operator contacts, opportunities, and follow-up tasks into Twenty.",
      },
      {
        label: "Seed Medusa local catalog baseline",
        code: ".\\scripts\\seed-medusa-local-catalog.ps1",
        note: "Guards the bundled Medusa demo seed so products, regions, stock locations, and a publishable store key exist without duplicating the starter catalog on every run.",
      },
      {
        label: "Seed Cal.com operator baseline",
        code: ".\\scripts\\seed-calcom-operator-baseline.ps1",
        note: "Ensures the local operator user has a default schedule, weekday availability, and the canonical public event types wired to that schedule.",
      },
      {
        label: "Seed Lago local billing baseline",
        code: ".\\scripts\\seed-lago-local-billing.ps1",
        note: "Idempotently creates the local demo customer, billable metric, and plan used as the deterministic billing baseline in Lago.",
      },
      {
        label: "Seed Snipe-IT operator baseline",
        code: ".\\scripts\\seed-snipeit-operator-baseline.ps1",
        note: "Seeds the operator-ready Warsaw clinic location, Hylono Medtech manufacturer, HBOT category and model, and the baseline HBOT-001 asset in Snipe-IT.",
      },
      {
        label: "Reconcile n8n Phase 2 workflows",
        code: ".\\scripts\\seed-n8n-phase2-workflows.ps1",
        note: "Reimports the versioned intake workflows, republishes the desired five, unpublishes stale ones, adds tags, and refreshes the local backup snapshot.",
      },
      {
        label: "Seed Novu operator bootstrap",
        code: ".\\scripts\\seed-novu-operator-bootstrap.ps1",
        note: "Upserts canonical operator subscribers and seeds one inbox bootstrap notification per canonical mailbox without re-spamming on every run.",
      },
      {
        label: "Validate mail provider profile",
        code: ".\\scripts\\validate-mail-provider-env.ps1",
        note: "Checks whether the current local mail profile is consistent for app mailers and Novu before you cut over from local-safe to a real delivery provider.",
      },
      {
        label: "Check stack version governance",
        code: "node scripts/check-stack-version-governance.cjs",
        note: "Verifies the pinned image-tag guardrails for the active first wave and prints advisories for intentionally delayed services that still remain on :latest.",
      },
      {
        label: "Validate staging env scaffold",
        code: ".\\scripts\\validate-staging-env.ps1 -Path .\\.env.staging",
        note: "Checks a real .env.staging against the narrowed active-first-wave staging template so you catch placeholder secrets, bad URLs, and missing values before server launch.",
      },
      {
        label: "Check Phase 1A status",
        code: "docker compose -f docker/phase-1a/docker-compose.yml ps",
      },
      {
        label: "Check active first-wave status",
        code: "docker compose -f docker/phase-1a/docker-compose.yml ps twenty novu-api novu-worker novu-ws novu-dashboard n8n n8n-worker",
      },
      {
        label: "Surface smoke check",
        code: ".\\scripts\\smoke-local-stack.ps1",
        note: "Confirms the browser-facing URLs respond cleanly.",
      },
      {
        label: "Deep smoke check",
        code: ".\\scripts\\smoke-local-stack.ps1 -Deep",
        note: "Runs live intake submissions and verifies DB plus Twenty plus Novu wiring, Medusa storefront access, Cal.com schedule availability, Lago billing baseline records, Snipe-IT operator inventory baseline, and mail-profile validation.",
      },
    ],
  },
  {
    id: "docker",
    label: "Docker",
    icon: "DOC",
    desc: "Day-to-day Docker Compose operations for the local containers.",
    commands: [
      {
        label: "Check infrastructure containers",
        code: "docker compose -f docker/infrastructure/docker-compose.yml ps",
      },
      {
        label: "View infrastructure logs",
        code: "docker compose -f docker/infrastructure/docker-compose.yml logs -f",
      },
      {
        label: "View one Phase 1A service log",
        code: "docker compose -f docker/phase-1a/docker-compose.yml logs -f n8n",
        note: "Replace n8n with medusa, lago-api, lago-front, snipe-it, calcom, twenty, documenso, zitadel, novu-api, novu-worker, novu-ws, or novu-dashboard.",
      },
      {
        label: "Restart n8n after manual workflow edits",
        code: "docker restart hylono-n8n",
        note: "Useful after making workflow publish changes through the CLI or importing updated local workflow JSON.",
      },
      {
        label: "Stop infrastructure",
        code: "docker compose -f docker/infrastructure/docker-compose.yml down",
      },
      {
        label: "Stop Phase 1A",
        code: "docker compose -f docker/phase-1a/docker-compose.yml down",
      },
      {
        label: "Restart one infrastructure service",
        code: "docker compose -f docker/infrastructure/docker-compose.yml restart postgres",
        note: "Replace postgres with any infrastructure service name.",
      },
      {
        label: "Resource usage snapshot",
        code: "docker stats --no-stream",
      },
      {
        label: "Disk usage by layer and container",
        code: "docker system df",
      },
    ],
  },
  {
    id: "db",
    label: "Database",
    icon: "DB",
    desc: "Direct access to PostgreSQL, Redis, and the Snipe-IT MariaDB service.",
    commands: [
      {
        label: "Open PostgreSQL shell",
        code: "docker exec -it hylono-postgres psql -U postgres",
      },
      {
        label: "Inspect Medusa local baseline",
        code: "@'\nselect 'users=' || count(*) from \"user\";\nselect 'products=' || count(*) from product;\nselect 'regions=' || count(*) from region;\nselect 'locations=' || count(*) from stock_location;\nselect 'keys=' || count(*) from api_key;\n'@ | docker exec -i hylono-postgres psql -U postgres -d medusa_db -t -A",
        note: "Confirms that the local Medusa admin, starter catalog, regions, stock locations, and publishable key are still present.",
      },
      {
        label: "Inspect Cal.com local baseline",
        code: "@'\nselect 'users=' || count(*) from users;\nselect 'event_types=' || count(*) from \"EventType\";\n'@ | docker exec -i hylono-postgres psql -U postgres -d calcom_db -t -A",
        note: "Confirms that the local Cal.com operator account and baseline event types are still present. The seeded public booking page is expected at http://localhost:8106/hylono.",
      },
      {
        label: "Inspect Lago local baseline",
        code: "@'\nselect 'users=' || count(*) from users;\nselect 'organizations=' || count(*) from organizations;\nselect 'customers=' || count(*) from customers;\nselect 'billable_metrics=' || count(*) from billable_metrics;\nselect 'plans=' || count(*) from plans;\n'@ | docker exec -i hylono-postgres psql -U postgres -d lago_db -t -A",
        note: "Confirms that the local Lago operator account, demo organization, customer, billable metric, and plan baseline are still present.",
      },
      {
        label: "List PostgreSQL databases",
        code: "docker exec -it hylono-postgres psql -U postgres -c '\\l'",
      },
      {
        label: "Connect to one PostgreSQL database",
        code: "docker exec -it hylono-postgres psql -U postgres -d twenty_db",
        note: "Replace twenty_db with the target database name.",
      },
      {
        label: "Open Snipe-IT MariaDB shell",
        code: "docker exec -it hylono-snipe-it-db mariadb -usnipeit -p${SNIPEIT_DB_PASSWORD} snipeit_db",
        note: "Load .env into your shell first so SNIPEIT_DB_PASSWORD is available.",
      },
      {
        label: "Open Redis CLI",
        code: "docker exec -it hylono-redis redis-cli -a ${REDIS_PASSWORD}",
        note: "Load .env into your shell first so REDIS_PASSWORD is available.",
      },
      {
        label: "Redis memory info",
        code: "docker exec -it hylono-redis redis-cli -a ${REDIS_PASSWORD} INFO memory",
      },
    ],
  },
  {
    id: "debug",
    label: "Debug",
    icon: "DBG",
    desc: "Diagnostic commands for failures, restarts, and port conflicts.",
    commands: [
      {
        label: "Inspect a container",
        code: "docker inspect hylono-postgres",
        note: "Replace hylono-postgres with any container name.",
      },
      {
        label: "Check common stack ports on Windows",
        code: "netstat -an | findstr \"3002 5432 5678 6379 8104 8107 8108 8109 9000 9001\"",
      },
      {
        label: "Show a container environment",
        code: "docker exec hylono-postgres env",
      },
      {
        label: "Shell into a running container",
        code: "docker exec -it hylono-postgres sh",
      },
      {
        label: "Run the control panel in dev mode",
        code: "cd control-panel && npm run dev",
      },
      {
        label: "Build the control panel",
        code: "cd control-panel && npm run build",
      },
    ],
  },
];

export default function CommandsPage() {
  const [activeTab, setActiveTab] = useState("setup");
  const tab = TABS.find((item) => item.id === activeTab) ?? TABS[0];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Commands Reference</h1>
          <p className="mt-1 text-sm text-gray-400">
            Copy the commands needed to operate the verified local stack.
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-blue-800/40 bg-blue-950/30 px-4 py-3 text-xs text-blue-200/80">
          <span className="font-semibold text-blue-300">Note:</span> Run all commands from the
          project root directory. On Windows PowerShell, use <code>.\\scripts\\generate-secrets.ps1</code> and{" "}
          <code>.\\scripts\\setup.ps1 infrastructure</code> or <code>.\\scripts\\setup.ps1 1a</code>.
          Git Bash or WSL still work with the <code>bash</code> variants. For normal day-to-day
          startup, prefer <code>.\\start-dev.bat</code>.
        </div>

        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-gray-800 bg-gray-900 p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div>
          <p className="mb-4 text-xs text-gray-500">{tab.desc}</p>
          <div className="space-y-3">
            {tab.commands.map((command) => (
              <div
                key={command.label}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4"
              >
                <div className="mb-2 text-xs font-medium text-gray-400">{command.label}</div>
                <CopyCodeBlock code={command.code} />
                {command.note ? (
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{command.note}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-700">
          {tab.commands.length} commands in this section ·{" "}
          {TABS.reduce((sum, item) => sum + item.commands.length, 0)} total
        </p>
      </div>
    </div>
  );
}
