import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";
import { getVerifiedLocalUiServices } from "@/lib/manifest";

const STEPS = [
  {
    num: "1",
    title: "Generate secrets",
    desc: "Create a local .env file with unique passwords and app secrets. Run once.",
    code: "bash scripts/generate-secrets.sh",
    note: "Safe to run. The script skips if .env already exists.",
    color: "border-blue-700 bg-blue-950/20",
    icon: "KEY",
  },
  {
    num: "2",
    title: "Start infrastructure",
    desc: "Boot the shared core services: PostgreSQL, Redis, MinIO, MongoDB, and Uptime Kuma.",
    code: "bash scripts/setup.sh infrastructure",
    note: "First boot can take about 30 seconds because images may need to be pulled.",
    color: "border-purple-700 bg-purple-950/20",
    icon: "INFRA",
  },
  {
    num: "3",
    title: "Start Phase 1A",
    desc: "Launch the pinned Phase 1A runtime: Medusa, Lago, Snipe-IT, Cal.com, Twenty CRM, Documenso, Zitadel, Novu, n8n, and the required sidecars.",
    code: "bash scripts/setup.sh 1a",
    note: "First boot is heavier here because Medusa is built locally and Cal.com runs additional seed steps.",
    color: "border-green-700 bg-green-950/20",
    icon: "1A",
  },
] as const;

export default function QuickStartPage() {
  const verifiedUiServices = getVerifiedLocalUiServices();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Quick Start</h1>
          <p className="mt-1 text-sm text-gray-400">
            Follow these three steps to bring up the verified local stack.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-amber-800/50 bg-amber-950/30 p-4">
          <div className="mb-2 text-sm font-semibold text-amber-300">Before you start</div>
          <ul className="space-y-1.5 text-sm text-amber-200/80">
            <li>Docker Desktop must be running</li>
            <li>Reserve at least 8 GB RAM for the local stack</li>
            <li>Run commands from the project root directory</li>
            <li>On Windows, use Git Bash or WSL for the shell scripts</li>
          </ul>
        </div>

        <div className="space-y-6">
          {STEPS.map((step) => (
            <div key={step.num} className={`rounded-xl border p-5 ${step.color}`}>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-sm font-bold text-white">
                  {step.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{step.icon}</span>
                    <h2 className="text-base font-semibold text-white">{step.title}</h2>
                  </div>
                  <p className="mb-3 text-sm text-gray-300">{step.desc}</p>
                  <CopyCodeBlock code={step.code} />
                  <p className="mt-2 text-xs text-gray-500">{step.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-base font-semibold text-white">Verified browser URLs</h2>
          <p className="mb-4 text-sm text-gray-400">
            Once the stack is up, these are the browser-facing entry points for the verified local runtime.
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {verifiedUiServices.map((service) => (
              <div
                key={service.uiUrl}
                className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2"
              >
                <span className="text-gray-400">{service.name}</span>
                <span className="font-mono text-blue-400">{service.uiUrl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/admin/commands"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center transition-colors hover:border-gray-600"
          >
            <div className="text-sm font-medium text-white">All Commands</div>
            <div className="mt-0.5 text-xs text-gray-500">Full script reference</div>
          </Link>
          <Link
            href="/admin/help"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center transition-colors hover:border-gray-600"
          >
            <div className="text-sm font-medium text-white">Help</div>
            <div className="mt-0.5 text-xs text-gray-500">Troubleshooting guide</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
