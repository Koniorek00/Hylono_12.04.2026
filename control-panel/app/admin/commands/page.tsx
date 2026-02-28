"use client";
import { useState } from "react";
import { CopyCodeBlock } from "@/components/CopyButton";

type Cmd = { label: string; code: string; note?: string };
type Tab = { id: string; label: string; icon: string; desc: string; commands: Cmd[] };

const TABS: Tab[] = [
  {
    id: "setup",
    label: "Setup",
    icon: "🚀",
    desc: "Commands to initialise and start the stack for the first time.",
    commands: [
      { label: "Generate secrets (.env)", code: "bash scripts/generate-secrets.sh", note: "Safe to run — skips if .env already exists." },
      { label: "Start infrastructure only", code: "bash scripts/setup.sh infrastructure" },
      { label: "Start Phase 1A services", code: "bash scripts/setup.sh 1a" },
      { label: "Start Phase 1B services", code: "bash scripts/setup.sh 1b" },
      { label: "Start Phase 1C services", code: "bash scripts/setup.sh 1c" },
    ],
  },
  {
    id: "docker",
    label: "Docker",
    icon: "🐳",
    desc: "Day-to-day Docker Compose operations for managing running containers.",
    commands: [
      { label: "Check running containers", code: "docker compose -f docker/infrastructure/docker-compose.yml ps" },
      { label: "View live logs (all)", code: "docker compose -f docker/infrastructure/docker-compose.yml logs -f" },
      { label: "View logs for one service", code: "docker compose -f docker/infrastructure/docker-compose.yml logs -f postgres", note: "Replace postgres with any service name." },
      { label: "Stop infrastructure", code: "docker compose -f docker/infrastructure/docker-compose.yml down" },
      { label: "Stop Phase 1A", code: "docker compose -f docker/phase-1a/docker-compose.yml down" },
      { label: "Restart a single service", code: "docker compose -f docker/infrastructure/docker-compose.yml restart postgres", note: "Replace postgres with any service name." },
      { label: "Pull latest images", code: "docker compose -f docker/infrastructure/docker-compose.yml pull" },
      { label: "Resource usage snapshot", code: "docker stats --no-stream" },
      { label: "Disk usage by layer/container", code: "docker system df" },
      { label: "Remove unused data (safe)", code: "docker system prune -f", note: "Removes stopped containers and dangling images." },
    ],
  },
  {
    id: "db",
    label: "Database",
    icon: "🗄",
    desc: "Direct access to PostgreSQL and Redis for debugging and inspection.",
    commands: [
      { label: "Open PostgreSQL shell", code: "docker exec -it hylono-postgres psql -U postgres" },
      { label: "List all databases", code: "docker exec -it hylono-postgres psql -U postgres -c '\\l'" },
      { label: "Connect to a specific database", code: "docker exec -it hylono-postgres psql -U postgres -d medusa", note: "Replace medusa with the target database name." },
      { label: "Open Redis CLI", code: "docker exec -it hylono-redis redis-cli -a ${REDIS_PASSWORD}", note: "Source your .env first: export $(grep -v '^#' .env | xargs)" },
      { label: "Redis memory info", code: "docker exec -it hylono-redis redis-cli INFO memory" },
      { label: "Redis key count", code: "docker exec -it hylono-redis redis-cli DBSIZE" },
    ],
  },
  {
    id: "backup",
    label: "Backup",
    icon: "💾",
    desc: "Data safety — creating and restoring backups.",
    commands: [
      { label: "Run a full backup", code: "bash scripts/backup.sh", note: "Saves compressed dumps to /backups/hylono/YYYY-MM-DD/" },
      { label: "List existing backups", code: "ls -la /backups/hylono/" },
      { label: "Restore PostgreSQL from backup", code: "gunzip -c /backups/hylono/LATEST/postgres.sql.gz | docker exec -i hylono-postgres psql -U postgres", note: "Replace LATEST with the exact date folder name." },
      { label: "Restore Redis from backup", code: "docker cp /backups/hylono/LATEST/dump.rdb hylono-redis:/data/dump.rdb && docker compose restart redis", note: "Stop redis before restoring, then restart." },
    ],
  },
  {
    id: "debug",
    label: "Debug",
    icon: "🔧",
    desc: "Diagnostic commands for when things go wrong.",
    commands: [
      { label: "Inspect a container", code: "docker inspect hylono-postgres", note: "Replace hylono-postgres with any container name." },
      { label: "Check if ports are free (Linux/Mac)", code: "netstat -tlnp | grep -E '5432|6379|9000|27017'" },
      { label: "Check open ports (Windows)", code: "netstat -an | findstr \"5432 6379 9000\"" },
      { label: "Show container environment vars", code: "docker exec hylono-postgres env" },
      { label: "Shell into a running container", code: "docker exec -it hylono-postgres bash", note: "Use sh instead of bash if bash isn't available." },
      { label: "Control panel dev server", code: "cd control-panel && npm run dev" },
      { label: "Build control panel", code: "cd control-panel && npm run build" },
    ],
  },
];

export default function CommandsPage() {
  const [activeTab, setActiveTab] = useState("setup");

  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">💻 Commands Reference</h1>
          <p className="mt-1 text-gray-400 text-sm">
            All commands to operate the Hylono Stack. Click any block to copy.
          </p>
        </div>

        {/* Root dir tip */}
        <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl px-4 py-3 mb-6 text-xs text-blue-200/80">
          <span className="font-semibold text-blue-300">💡 </span>
          All commands run from the{" "}
          <code className="bg-blue-900/50 px-1 rounded text-blue-300">project root</code> directory.
          On Windows, use Git Bash or WSL — not PowerShell.
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 flex-wrap mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          <p className="text-xs text-gray-500 mb-4">{tab.desc}</p>
          <div className="space-y-3">
            {tab.commands.map((cmd) => (
              <div key={cmd.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-xs font-medium text-gray-400 mb-2">{cmd.label}</div>
                <CopyCodeBlock code={cmd.code} />
                {cmd.note && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">{cmd.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-center text-xs text-gray-700 mt-8">
          {tab.commands.length} commands in this section ·{" "}
          {TABS.reduce((sum, t) => sum + t.commands.length, 0)} total
        </p>
      </div>
    </div>
  );
}
