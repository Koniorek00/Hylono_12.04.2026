import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { getManifest, getVerifiedLocalUiServices } from "@/lib/manifest";
import { getStagingHandoffSnapshot } from "@/lib/staging-handoff";

const PHASES = [
  {
    id: "launcher",
    label: "Desktop Launcher",
    cmd: ".\\start-dev.bat",
    tip: "Preferred local entrypoint. Starts the stack and replays the seeded operator bootstrap.",
  },
  {
    id: "granular",
    label: "Granular Recovery",
    cmd: ".\\scripts\\setup.ps1 1a",
    tip: "Use the PowerShell startup scripts only when you need partial control or recovery.",
  },
  {
    id: "stack-review",
    label: "Stack Review",
    cmd: null,
    tip: "Use the explorer for ports, docs, and integration flow details.",
  },
] as const;

const FIRST_TIME_SETUP = [
  {
    step: "1",
    label: "Run the desktop launcher",
    cmd: ".\\start-dev.bat",
    note: "Preferred local path. It starts the stack and replays the seeded operator baseline automatically.",
  },
  {
    step: "2",
    label: "Open Credentials",
    cmd: null,
    note: "Use the operator logins and secrets from /admin/credentials instead of guessing first-run accounts.",
  },
  {
    step: "3",
    label: "Check the status page",
    cmd: null,
    note: "Confirm the browser-facing services are green in Uptime Kuma before you start editing app state.",
  },
  {
    step: "4",
    label: "Use granular scripts only if needed",
    cmd: ".\\scripts\\setup.ps1 1a",
    note: "The infrastructure and Phase 1A scripts remain useful for recovery, selective restarts, and debugging.",
  },
] as const;

export default function DashboardPage() {
  const manifest = getManifest();
  const staging = getStagingHandoffSnapshot();
  const all = [...manifest.infrastructure, ...manifest.services];
  const verifiedUiServices = getVerifiedLocalUiServices();
  const essential = all.filter((service) => service.verdict === "ESSENTIAL").length;
  const recommended = all.filter((service) => service.verdict === "RECOMMENDED").length;
  const buildFromSource = all.filter((service) => service.buildFromSource).length;
  const stagingIssueCount =
    staging.envSummary.missingKeys.length +
    staging.envSummary.placeholderKeys.length +
    staging.envSummary.urlIssues.length +
    staging.envSummary.numericIssues.length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-white">Hylono Stack</h1>
              <p className="text-xs text-gray-500">
                v{manifest.meta.version} | Control Panel | Local runtime dashboard
              </p>
            </div>
            <div className="ml-auto hidden text-right sm:block">
              <div className="text-2xl font-bold text-white">{manifest.meta.totalServices}</div>
              <div className="text-xs text-gray-600">services catalogued</div>
            </div>
          </div>
          <div className="mt-4 h-px bg-gray-800" />
        </div>

        <div className="mb-6 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4 text-sm text-amber-100/80">
          <p className="font-semibold text-amber-300">Runtime scope</p>
          <p className="mt-1">
            This panel catalogs the full stack. The current checkout now auto-starts infrastructure
            plus the pinned Phase 1A runtime. Later phases remain catalogued but are still
            roadmap-only from this repo.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-lg font-bold text-green-400">{essential}</span>{" "}
            <span className="text-gray-500">essential</span>
          </div>
          <div>
            <span className="text-lg font-bold text-amber-400">{recommended}</span>{" "}
            <span className="text-gray-500">recommended</span>
          </div>
          <div>
            <span className="text-lg font-bold text-orange-400">{buildFromSource}</span>{" "}
            <span className="text-gray-500">build-from-source</span>
          </div>
          <div>
            <span className="text-lg font-bold text-cyan-400">{verifiedUiServices.length}</span>{" "}
            <span className="text-gray-500">verified local URLs</span>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Staging env readiness
            </div>
            <div
              className={`mt-2 text-lg font-bold ${
                staging.envSummary.ready ? "text-emerald-300" : "text-amber-300"
              }`}
            >
              {staging.envSummary.ready ? "Ready for handoff" : "Needs operator work"}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Required keys: {staging.envSummary.requiredKeyCount} | Candidate keys:{" "}
              {staging.envSummary.candidateKeyCount} | Issues: {stagingIssueCount}
            </div>
            <Link
              href="/admin/staging"
              className="mt-3 inline-flex text-xs text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Open staging surface
            </Link>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Operator backbone
            </div>
            <div className="mt-2 text-lg font-bold text-white">Local-to-staging contract</div>
            <div className="mt-2 text-xs leading-relaxed text-gray-500">
              Local launcher, seeded operator accounts, exported workflows, and file-backed staging
              validation are the canonical baseline. Promote artifacts, not ad hoc app state.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/admin/blueprints"
                className="rounded-lg border border-cyan-700/40 bg-cyan-900/20 px-3 py-1.5 text-xs text-cyan-300 transition-colors hover:bg-cyan-800/30 hover:text-cyan-200"
              >
                Blueprints
              </Link>
              <Link
                href="/admin/progress"
                className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-800/30 hover:text-emerald-200"
              >
                Progress
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Operator Entry
          </h2>
          <div className="space-y-2">
            {PHASES.map((phase, index) => (
              <div
                key={phase.id}
                className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-700 font-mono text-xs text-gray-500">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-200">{phase.label}</div>
                  <div className="mt-0.5 truncate text-xs text-gray-600">{phase.tip}</div>
                </div>
                {phase.cmd ? (
                  <CopyButton text={phase.cmd} label={phase.cmd} />
                ) : (
                  <Link
                    href="/admin/stack"
                    className="text-xs text-gray-600 transition-colors hover:text-blue-400"
                  >
                    Review details
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            First-Time Local Flow
          </h2>
          <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900">
            {FIRST_TIME_SETUP.map((item) => (
              <div key={item.step} className="flex items-center gap-4 px-4 py-3.5">
                <span className="w-4 flex-shrink-0 font-mono text-xs text-gray-600">
                  {item.step}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-gray-200">{item.label}</div>
                  <div className="mt-0.5 text-xs text-gray-600">{item.note}</div>
                </div>
                {item.cmd ? <CopyButton text={item.cmd} label="Copy" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Verified Browser URLs
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {verifiedUiServices.map((service) => (
              <a
                key={service.uiUrl}
                href={service.uiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-gray-800 bg-gray-900 px-3 py-2.5 transition-colors hover:border-gray-600 hover:bg-gray-800"
              >
                <div className="text-xs font-medium text-gray-200 group-hover:text-white">
                  {service.name}
                </div>
                <div className="mt-0.5 text-xs text-gray-600">
                  {service.accessNotes ?? service.role ?? service.domain}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/admin/progress", icon: "P", label: "Progress", desc: "What is ready now" },
            {
              href: "/admin/blueprints",
              icon: "B",
              label: "Blueprints",
              desc: "Source-backed flow pack",
            },
            { href: "/admin/staging", icon: "T", label: "Staging", desc: "Handoff scaffold" },
            { href: "/admin/stack", icon: "S", label: "Stack", desc: "Catalog + flow map" },
            {
              href: "/admin/credentials",
              icon: "K",
              label: "Credentials",
              desc: "First login + secrets",
            },
            {
              href: "/admin/quickstart",
              icon: "1",
              label: "Quick Start",
              desc: "Launcher-first path",
            },
            { href: "/admin/deploy", icon: "D", label: "Deploy", desc: "Accurate launch steps" },
            { href: "/admin/commands", icon: ">", label: "Commands", desc: "Copy real commands" },
            { href: "/admin/help", icon: "?", label: "Help", desc: "Troubleshooting notes" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-4 text-center transition-colors hover:border-gray-600 hover:bg-gray-800"
            >
              <div className="mb-1.5 inline-block text-2xl transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <div className="text-sm font-semibold text-gray-200">{item.label}</div>
              <div className="mt-0.5 text-xs text-gray-600">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-4 text-center text-xs text-gray-700">
          Press <kbd className="rounded border border-gray-700 px-1.5 py-0.5 font-mono">Ctrl+K</kbd>{" "}
          to open the command palette.
        </div>
      </div>
    </div>
  );
}
