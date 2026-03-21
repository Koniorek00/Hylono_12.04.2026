import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";
import { getVerifiedLocalUiServices } from "@/lib/manifest";

const STEPS = [
  {
    num: "1",
    title: "Run the desktop launcher",
    desc: "Use the desktop/local launcher instead of piecing the stack together manually. It is the default local entrypoint now.",
    code: ".\\start-dev.bat",
    note: "This starts the site, control panel, Docker services, and the seeded operator bootstrap.",
    color: "border-blue-700 bg-blue-950/20",
    icon: "BAT",
  },
  {
    num: "2",
    title: "Open Credentials",
    desc: "Use the operator logins and secrets from the credentials page instead of guessing first-run accounts.",
    code: null,
    note: "Go to /admin/credentials for browser logins, API keys, and infrastructure access.",
    color: "border-emerald-700 bg-emerald-950/20",
    icon: "KEY",
  },
  {
    num: "3",
    title: "Check local health",
    desc: "Confirm the stack is green in the status page before changing app state or debugging a service.",
    code: "powershell -NoProfile -ExecutionPolicy Bypass -File .\\scripts\\smoke-local-stack.ps1",
    note: "Use the deep variant later when you want to verify the full intake and operator path.",
    color: "border-purple-700 bg-purple-950/20",
    icon: "CHK",
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
            Launcher-first path for bringing the verified local stack online.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-amber-800/50 bg-amber-950/30 p-4">
          <div className="mb-2 text-sm font-semibold text-amber-300">Before you start</div>
          <ul className="space-y-1.5 text-sm text-amber-200/80">
            <li>Docker Desktop must be running</li>
            <li>Reserve at least 8 GB RAM for the local stack</li>
            <li>Run commands from the project root directory</li>
            <li>Use the PowerShell-native scripts on Windows</li>
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
                  {step.code ? <CopyCodeBlock code={step.code} /> : null}
                  <p className="mt-2 text-xs text-gray-500">{step.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-base font-semibold text-white">Verified browser URLs</h2>
          <p className="mb-4 text-sm text-gray-400">
            Once the launcher finishes, these are the browser-facing entry points for the verified
            local runtime.
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
            href="/admin/credentials"
            className="flex-1 rounded-xl border border-gray-800 bg-gray-900 p-4 text-center transition-colors hover:border-gray-600"
          >
            <div className="text-sm font-medium text-white">Credentials</div>
            <div className="mt-0.5 text-xs text-gray-500">Logins and secrets</div>
          </Link>
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
