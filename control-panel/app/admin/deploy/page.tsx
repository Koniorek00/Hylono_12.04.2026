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
    title: "Run Desktop Launcher",
    subtitle: "Preferred local startup path",
    icon: "BAT",
    description:
      "Use the launcher instead of piecing the stack together by hand. It starts Docker services, replays the operator bootstrap, rebuilds stale app surfaces, and opens the local site and control panel.",
    command: ".\\start-dev.bat",
    checks: [
      "Main site responds at http://localhost:3000",
      "Control panel responds at http://localhost:3005/admin",
      "Uptime Kuma status page responds at http://localhost:3002/status/hylono-local",
    ],
    warning:
      "Only drop to the granular scripts if you are debugging or recovering a partially broken local stack.",
  },
  {
    number: 2,
    title: "Use Operator Credentials",
    subtitle: "Deterministic local logins and secrets",
    icon: "KEY",
    description:
      "The launcher gets the services online, but the operator panel is the source of truth for app logins, API keys, and infrastructure access. Start there instead of improvising first-run accounts.",
    checks: [
      "Open /admin/credentials for browser logins and runtime secrets",
      "Open /admin/progress for the current seeded and running state",
      "Use /admin/help for bootstrap expectations and local limitations",
      "Use /admin/commands for the explicit seed and recovery commands",
    ],
  },
  {
    number: 3,
    title: "Use Granular Recovery Only When Needed",
    subtitle: "PowerShell paths for partial control",
    icon: "PS1",
    description:
      "If one layer needs to be restarted or reconciled in isolation, use the PowerShell scripts directly from the repo root. That is the correct operator path on Windows; bash is no longer the default guidance.",
    command: ".\\scripts\\setup.ps1 1a",
    checks: [
      "Infrastructure only: .\\scripts\\setup.ps1 infrastructure",
      "Phase 1A only: .\\scripts\\setup.ps1 1a",
      "Full operator bootstrap replay: /admin/commands",
    ],
    warning:
      "The launcher already replays the Medusa, Snipe-IT, Cal.com, Lago, Twenty, n8n, Novu, and Kuma baselines. Do not re-run seed scripts blindly unless you are intentionally reconciling state.",
  },
  {
    number: 4,
    title: "Review Runtime and Roadmap Separately",
    subtitle: "Do not confuse the local slice with the full manifest",
    icon: "MAP",
    description:
      "The stack explorer still catalogs the broader roadmap. Use it to inspect ports, docs, and integration edges, but treat the local status page and deep smoke as the truth for what is actually live from this checkout.",
    checks: [
      "Use /admin/stack for the full catalog and flow graph",
      "Use http://localhost:3002/status/hylono-local for live local browser status",
      "Later phases remain roadmap-only from this repo",
    ],
  },
];

const PHASE_COLOR: Record<number, string> = {
  1: "border-blue-700/50 bg-blue-900/10",
  2: "border-emerald-700/50 bg-emerald-900/10",
  3: "border-purple-700/50 bg-purple-900/10",
  4: "border-teal-700/50 bg-teal-900/10",
};

const STEP_NUM_COLOR: Record<number, string> = {
  1: "bg-blue-800 text-blue-200",
  2: "bg-emerald-800 text-emerald-200",
  3: "bg-purple-800 text-purple-200",
  4: "bg-teal-800 text-teal-200",
};

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Deploy Wizard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Launcher-first local runbook for the verified stack in this checkout.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-blue-800/40 bg-blue-950/30 p-4 text-sm text-blue-200/80">
          <p className="mb-1 font-semibold text-blue-300">Before you start</p>
          <ul className="list-inside list-disc space-y-1 text-xs text-blue-200/70">
            <li>Docker Desktop must be running</li>
            <li>Run commands from the project root directory</li>
            <li>Use PowerShell-native scripts on Windows</li>
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
                <p className="mt-1 max-w-[88px] text-center text-[9px] leading-tight text-gray-600">
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
          <h3 className="mb-1 text-base font-semibold text-green-300">
            When the local stack is healthy
          </h3>
          <p className="mb-4 text-xs text-gray-500">
            Use the status page, credentials surface, and stack explorer as the operator trio.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/admin/progress"
              className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-800/30 hover:text-emerald-200"
            >
              Open progress
            </Link>
            <Link
              href="/admin/credentials"
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            >
              Open credentials
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
