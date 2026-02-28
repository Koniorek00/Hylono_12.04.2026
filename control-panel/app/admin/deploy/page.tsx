import { CopyCodeBlock } from "@/components/CopyButton";
import Link from "next/link";

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
    icon: "🔑",
    description:
      "Creates a .env file with randomly generated passwords and secrets for every service. Safe to run — skips if .env already exists.",
    command: "bash scripts/generate-secrets.sh",
    checks: [
      "A .env file appears in the project root",
      "Run cat .env to verify it's not empty",
      "Never commit .env to git — it's in .gitignore",
    ],
    warning: undefined,
  },
  {
    number: 2,
    title: "Start Infrastructure",
    subtitle: "PostgreSQL · Redis · MinIO · Traefik · Portainer",
    icon: "🏗",
    description:
      "Launches the five core infrastructure services that everything else depends on. Wait for all containers to report healthy before proceeding.",
    command: "bash scripts/setup.sh infrastructure",
    checks: [
      "docker compose -f docker/infrastructure/docker-compose.yml ps shows all containers Up",
      "MinIO console reachable at http://localhost:9001",
      "Portainer dashboard at http://localhost:9000",
    ],
    warning: "If any container shows Exit or Restarting — check logs before continuing.",
  },
  {
    number: 3,
    title: "Deploy Phase 1A",
    subtitle: "Medusa · Twenty · Zitadel · n8n · Lago · Snipe-IT",
    icon: "🚀",
    description:
      "Deploys the core business services. These depend on PostgreSQL and Redis from infrastructure, so step 2 must be healthy first.",
    command: "bash scripts/setup.sh 1a",
    checks: [
      "Zitadel login page loads at http://localhost:8080",
      "Twenty CRM accessible at http://localhost:3001",
      "Medusa admin panel at http://localhost:9002/app",
      "n8n workflow editor at http://localhost:5678",
    ],
    warning: "Zitadel first-boot may take 60–90 seconds. Be patient.",
  },
  {
    number: 4,
    title: "Deploy Phase 1B",
    subtitle: "Uptime Kuma · PostHog · Nocodb · Mattermost · Outline",
    icon: "📊",
    description:
      "Adds monitoring, analytics, and collaboration tools. Phase 1A must be running before starting this step.",
    command: "bash scripts/setup.sh 1b",
    checks: [
      "Uptime Kuma at http://localhost:3002 — create your admin account",
      "PostHog at http://localhost:8000 — set up your organisation",
      "Outline wiki at http://localhost:3003",
    ],
    warning: undefined,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">▲ Deploy Wizard</h1>
          <p className="mt-1 text-gray-400 text-sm">
            Follow these steps in order. Each step depends on the previous one being healthy.
          </p>
        </div>

        {/* Pre-flight tip */}
        <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-4 mb-8 text-sm text-blue-200/80">
          <p className="font-semibold text-blue-300 mb-1">Before you start</p>
          <ul className="space-y-1 text-xs list-disc list-inside text-blue-200/70">
            <li>Docker Desktop (or Docker Engine on Linux) must be running</li>
            <li>All commands run from the <code className="bg-blue-900/40 px-1 rounded text-blue-300">project root</code> directory</li>
            <li>On Windows: use Git Bash or WSL — not PowerShell</li>
            <li>You need at least 8 GB RAM and 20 GB free disk space</li>
          </ul>
        </div>

        {/* Progress bar (visual only) */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${STEP_NUM_COLOR[step.number]}`}
                >
                  {step.number}
                </div>
                <p className="text-[9px] text-gray-600 mt-1 text-center leading-tight max-w-[60px]">{step.title}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px flex-1 bg-gray-800 -mt-4 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={`rounded-xl border p-5 ${PHASE_COLOR[step.number] ?? "border-gray-800 bg-gray-900/30"}`}
            >
              {/* Step header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${STEP_NUM_COLOR[step.number]}`}
                >
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-white">
                      {step.icon} {step.title}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{step.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{step.description}</p>

              {/* Warning */}
              {step.warning && (
                <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg px-3 py-2 mb-4 text-xs text-yellow-200/80">
                  ⚠ {step.warning}
                </div>
              )}

              {/* Command */}
              {step.command && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Run this command</p>
                  <CopyCodeBlock code={step.command} />
                </div>
              )}

              {/* Verification checklist */}
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Verify it worked
                </p>
                <ul className="space-y-1.5">
                  {step.checks.map((check, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-gray-700 mt-0.5 flex-shrink-0">□</span>
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Done state */}
        <div className="mt-8 bg-green-950/20 border border-green-800/30 rounded-xl p-5 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h3 className="text-base font-semibold text-green-300 mb-1">Stack is running</h3>
          <p className="text-xs text-gray-500 mb-4">
            All four steps complete? Your Hylono Stack is live. Bookmark the service URLs for daily use.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Link
              href="/admin"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              ← Dashboard
            </Link>
            <Link
              href="/admin/stack"
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/40 border border-blue-700/40 text-blue-300 hover:text-blue-200 transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-8">
          Need more commands? Check the{" "}
          <Link href="/admin/commands" className="text-blue-600 hover:text-blue-500">
            Commands Reference
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
