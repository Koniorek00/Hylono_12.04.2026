import Link from "next/link";
import { getManifest, getVerifiedLocalUiServices } from "@/lib/manifest";
import { CopyButton } from "@/components/CopyButton";

const PHASES = [
  {
    id: "infrastructure",
    label: "Infrastructure",
    cmd: "bash scripts/setup.sh infrastructure",
    tip: "PostgreSQL, Redis, MinIO, MongoDB, Uptime Kuma",
  },
  {
    id: "1a",
    label: "Phase 1A",
    cmd: "bash scripts/setup.sh 1a",
    tip: "Medusa, Lago, Snipe-IT, Cal.com, Twenty, Documenso, Zitadel, Novu, n8n",
  },
  {
    id: "stack-review",
    label: "Stack Review",
    cmd: null,
    tip: "Use the explorer for ports, docs, and integration flow details",
  },
] as const;

const FIRST_TIME_SETUP = [
  {
    step: "1",
    label: "Generate secrets",
    cmd: "bash scripts/generate-secrets.sh",
    note: "Creates .env with unique keys. Run once.",
  },
  {
    step: "2",
    label: "Start infrastructure",
    cmd: "bash scripts/setup.sh infrastructure",
    note: "PostgreSQL, Redis, MinIO, MongoDB, and Uptime Kuma",
  },
  {
    step: "3",
    label: "Initialize databases",
    cmd: null,
    note: "PostgreSQL databases are created on first infrastructure boot. Snipe-IT uses its own MariaDB from Phase 1A.",
  },
  {
    step: "4",
    label: "Launch Phase 1A",
    cmd: "bash scripts/setup.sh 1a",
    note: "Brings up the full pinned Phase 1A runtime, including vendor services and their sidecars.",
  },
] as const;

export default function DashboardPage() {
  const manifest = getManifest();
  const all = [...manifest.infrastructure, ...manifest.services];
  const verifiedUiServices = getVerifiedLocalUiServices();
  const essential = all.filter((service) => service.verdict === "ESSENTIAL").length;
  const recommended = all.filter((service) => service.verdict === "RECOMMENDED").length;
  const buildFromSource = all.filter((service) => service.buildFromSource).length;

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
                v{manifest.meta.version} · Control Panel · Local runtime dashboard
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
            This panel catalogs the full stack. The current checkout now auto-starts
            infrastructure plus the pinned Phase 1A runtime. Later phases remain catalogued but
            are still roadmap-only from this repo.
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

        <div className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Deployment Pipeline
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
            First-Time Setup
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
            { href: "/admin/stack", icon: "[]", label: "Stack", desc: "Catalog + flow map" },
            { href: "/admin/credentials", icon: "K", label: "Credentials", desc: "First login + secrets" },
            { href: "/admin/deploy", icon: "/\\", label: "Deploy", desc: "Accurate launch steps" },
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
