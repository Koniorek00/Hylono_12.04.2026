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
        label: "Generate secrets (.env)",
        code: "bash scripts/generate-secrets.sh",
        note: "Safe to run. It skips if .env already exists.",
      },
      {
        label: "Start infrastructure only",
        code: "bash scripts/setup.sh infrastructure",
      },
      {
        label: "Start infrastructure plus default Phase 1A",
        code: "bash scripts/setup.sh 1a",
        note: "Brings up Medusa, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Zitadel, Novu, n8n, and the required sidecars.",
      },
      {
        label: "Check Phase 1A status",
        code: "docker compose -f docker/phase-1a/docker-compose.yml ps",
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
        code: "docker exec -it hylono-snipe-it-db mariadb -uroot -p${POSTGRES_ROOT_PASSWORD}",
        note: "Load .env into your shell first so POSTGRES_ROOT_PASSWORD is available.",
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
          Git Bash or WSL still work with the <code>bash</code> variants.
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
