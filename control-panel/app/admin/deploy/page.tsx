import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";

type Step = {
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  command?: string;
  checks: string[];
  warning?: string;
};

const STEPS: Step[] = [
  {
    number: 1,
    title: "Generate Secrets",
    subtitle: "One-time setup",
    icon: "KEY",
    description:
      "Creates a .env file with randomly generated passwords and secrets for the local stack. The script skips if .env already exists.",
    command: "bash scripts/generate-secrets.sh",
    checks: [
      "A .env file exists in the project root",
      "The file is not empty",
      "The file stays out of git",
    ],
  },
  {
    number: 2,
    title: "Start Infrastructure",
    subtitle: "PostgreSQL, Redis, MinIO, MongoDB, Uptime Kuma",
    icon: "INFRA",
    description:
      "Launches the shared core services. Wait for the infrastructure containers to settle before bringing up application services.",
    command: "bash scripts/setup.sh infrastructure",
    checks: [
      "docker compose -f docker/infrastructure/docker-compose.yml ps shows healthy core services",
      "Uptime Kuma is reachable at http://localhost:3002",
      "MinIO Console is reachable at http://localhost:9001",
    ],
    warning: "If a service is restarting or exited, fix that before moving to Phase 1A.",
  },
  {
    number: 3,
    title: "Deploy Phase 1A",
    subtitle: "Full pinned Phase 1A runtime",
    icon: "1A",
    description:
      "Runs the full Phase 1A slice from this checkout. It brings up Medusa, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Zitadel, Novu, n8n, and their pinned sidecars.",
    command: "bash scripts/setup.sh 1a",
    checks: [
      "Medusa responds at http://localhost:8100/health",
      "Lago responds at http://localhost:8102",
      "n8n opens at http://localhost:5678",
      "Snipe-IT responds at http://localhost:8104",
      "Cal.com responds at http://localhost:8106",
      "Twenty CRM responds at http://localhost:8107",
      "Documenso responds at http://localhost:8108",
      "Zitadel responds at http://localhost:8109",
      "Novu responds at http://localhost:8110",
    ],
    warning:
      "First boot can take longer here because Medusa is built locally and Cal.com seeds its bundled app catalog during startup.",
  },
  {
    number: 4,
    title: "Review Stack",
    subtitle: "Catalogued runtime plus roadmap context",
    icon: "PLAN",
    description:
      "The stack explorer still catalogs the full roadmap. Use it to verify ports, docs, and integration edges after the local runtime is online.",
    checks: [
      "Use /admin/stack to review catalogued services and flow dependencies",
      "Phase 1B and later remain roadmap-only in this checkout",
      "Leihs remains build-from-source and is not part of the current runnable Phase 1A slice",
    ],
  },
];

const PHASE_COLOR: Record<number, string> = {
  1: "border-purple-700/50 bg-purple-900/10",
  2: "border-blue-700/50 bg-blue-900/10",
  3: "border-cyan-700/50 bg-cyan-900/10",
  4: "border-teal-700/50 bg-teal-900/10",
};

const STEP_NUM_COLOR: Record<number, string> = {
  1: "bg-purple-800 text-purple-200",
  2: "bg-blue-800 text-blue-200",
  3: "bg-cyan-800 text-cyan-200",
  4: "bg-teal-800 text-teal-200",
};

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Deploy Wizard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Follow the verified local launch order. Each step depends on the previous one being
            healthy.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-blue-800/40 bg-blue-950/30 p-4 text-sm text-blue-200/80">
          <p className="mb-1 font-semibold text-blue-300">Before you start</p>
          <ul className="list-inside list-disc space-y-1 text-xs text-blue-200/70">
            <li>Docker Desktop must be running</li>
            <li>Run commands from the project root directory</li>
            <li>On Windows PowerShell, use .\scripts\generate-secrets.ps1 and .\scripts\setup.ps1</li>
            <li>Git Bash or WSL still work with the bash script variants</li>
            <li>Reserve at least 8 GB RAM and 20 GB free disk space</li>
          </ul>
        </div>

        <div className="mb-10 flex items-center gap-0">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${STEP_NUM_COLOR[step.number]}`}
                >
                  {step.number}
                </div>
                <p className="mt-1 max-w-[72px] text-center text-[9px] leading-tight text-gray-600">
                  {step.title}
                </p>
              </div>
              {index < STEPS.length - 1 ? (
                <div className="-mt-4 mx-1 h-px flex-1 bg-gray-800" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={`rounded-xl border p-5 ${PHASE_COLOR[step.number] ?? "border-gray-800 bg-gray-900/30"}`}
            >
              <div className="mb-4 flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${STEP_NUM_COLOR[step.number]}`}
                >
                  {step.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      {step.icon} {step.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{step.subtitle}</p>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-400">{step.description}</p>

              {step.warning ? (
                <div className="mb-4 rounded-lg border border-yellow-800/30 bg-yellow-950/30 px-3 py-2 text-xs text-yellow-200/80">
                  Warning: {step.warning}
                </div>
              ) : null}

              {step.command ? (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Run this command
                  </p>
                  <CopyCodeBlock code={step.command} />
                </div>
              ) : null}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Verify it worked
                </p>
                <ul className="space-y-1.5">
                  {step.checks.map((check) => (
                    <li key={check} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="mt-0.5 flex-shrink-0 text-gray-700">[]</span>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-green-800/30 bg-green-950/20 p-5 text-center">
          <h3 className="mb-1 text-base font-semibold text-green-300">When the local stack is healthy</h3>
          <p className="mb-4 text-xs text-gray-500">
            Use the verified URLs on the dashboard and the stack explorer for day-to-day work.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/admin"
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            >
              Back to dashboard
            </Link>
            <Link
              href="/admin/stack"
              className="rounded-lg border border-blue-700/40 bg-blue-900/40 px-3 py-1.5 text-xs text-blue-300 transition-colors hover:bg-blue-800/40 hover:text-blue-200"
            >
              Browse stack
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-700">
          Need exact copy-paste commands? Open the{" "}
          <Link href="/admin/commands" className="text-blue-600 hover:text-blue-500">
            Commands Reference
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
