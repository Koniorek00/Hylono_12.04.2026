import Link from "next/link";
import { getManifest } from "@/lib/manifest";
import { CopyButton } from "@/components/CopyButton";

const PHASES = [
  { id: "infrastructure", label: "Infrastructure", short: "Infra",   cmd: "bash setup.sh infrastructure", tip: "PostgreSQL, Redis, MinIO, MongoDB, Uptime Kuma" },
  { id: "1a",             label: "Phase 1A",       short: "1A",      cmd: "bash setup.sh 1a",             tip: "Commerce, Fleet, CRM, IAM — 10 services" },
  { id: "1b",             label: "Phase 1B",       short: "1B",      cmd: "bash setup.sh 1b",             tip: "IoT, AI, Education, Health — 8 services" },
  { id: "1c",             label: "Phase 1C",       short: "1C",      cmd: "bash setup.sh 1c",             tip: "Marketing, Platform, Security — 8 services" },
  { id: "2",              label: "Phase 2",         short: "P2",      cmd: null,                           tip: "28 recommended additions — deploy as needed" },
];

const URLS = [
  { label: "Uptime Kuma",   url: "http://localhost:3001", desc: "Monitoring" },
  { label: "MinIO Console", url: "http://localhost:9001", desc: "Object storage" },
  { label: "n8n",           url: "http://localhost:5678", desc: "Automation" },
  { label: "Medusa",        url: "http://localhost:8100", desc: "Commerce API" },
  { label: "Lago",          url: "http://localhost:8102", desc: "Billing" },
  { label: "Twenty CRM",    url: "http://localhost:8107", desc: "CRM" },
  { label: "Zitadel",       url: "http://localhost:8109", desc: "IAM / Auth" },
  { label: "Snipe-IT",      url: "http://localhost:8104", desc: "Asset registry" },
];

export default function DashboardPage() {
  const manifest = getManifest();
  const all = [...manifest.infrastructure, ...manifest.services];
  const essential   = all.filter((s) => s.verdict === "ESSENTIAL").length;
  const recommended = all.filter((s) => s.verdict === "RECOMMENDED").length;
  const buildSrc    = all.filter((s) => s.buildFromSource).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">H</div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Hylono Stack</h1>
              <p className="text-gray-500 text-xs">v{manifest.meta.version} · Control Panel · READ-ONLY</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <div className="text-2xl font-bold text-white">{manifest.meta.totalServices}</div>
              <div className="text-xs text-gray-600">services total</div>
            </div>
          </div>
          <div className="h-px bg-gray-800 mt-4" />
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mb-10 text-sm">
          <div><span className="text-green-400 font-bold text-lg">{essential}</span> <span className="text-gray-500">essential</span></div>
          <div><span className="text-amber-400 font-bold text-lg">{recommended}</span> <span className="text-gray-500">recommended</span></div>
          <div><span className="text-orange-400 font-bold text-lg">{buildSrc}</span> <span className="text-gray-500">build-from-source</span></div>
          <div><span className="text-purple-400 font-bold text-lg">{manifest.integrations.length}</span> <span className="text-gray-500">integration flows</span></div>
        </div>

        {/* Deployment pipeline */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Deployment Pipeline</h2>
          <div className="space-y-2">
            {PHASES.map((p, i) => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
                {/* Step number */}
                <div className="w-7 h-7 rounded-full border border-gray-700 flex items-center justify-center text-xs text-gray-500 flex-shrink-0 font-mono">
                  {i + 1}
                </div>
                {/* Label + tip */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-200">{p.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">{p.tip}</div>
                </div>
                {/* Command copy */}
                {p.cmd ? (
                  <CopyButton text={p.cmd} label={p.cmd} />
                ) : (
                  <Link href="/admin/stack" className="text-xs text-gray-600 hover:text-blue-400 transition-colors">
                    Browse P2 ↗
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* First-time checklist */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">First-Time Setup</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
            {[
              { step: "1", label: "Generate secrets",     cmd: "bash scripts/generate-secrets.sh",  note: "Creates .env with unique keys — run once" },
              { step: "2", label: "Start infrastructure", cmd: "bash setup.sh infrastructure",       note: "PostgreSQL + Redis + MinIO + MongoDB + monitoring" },
              { step: "3", label: "Initialize databases", cmd: null,                                  note: "Done automatically by init-databases.sh on first boot" },
              { step: "4", label: "Launch Phase 1A",      cmd: "bash setup.sh 1a",                   note: "Commerce, Fleet, CRM, IAM — the core stack" },
            ].map((item) => (
              <div key={item.step} className="px-4 py-3.5 flex items-center gap-4">
                <span className="text-xs text-gray-600 font-mono w-4 flex-shrink-0">{item.step}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200">{item.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{item.note}</div>
                </div>
                {item.cmd && <CopyButton text={item.cmd} label="Copy" />}
              </div>
            ))}
          </div>
        </div>

        {/* Service URLs */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Service URLs (after launch)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {URLS.map((u) => (
              <a key={u.url} href={u.url} target="_blank" rel="noopener noreferrer"
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 hover:border-gray-600 hover:bg-gray-800 transition-colors group">
                <div className="text-xs font-medium text-gray-200 group-hover:text-white">{u.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{u.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: "/admin/stack",    icon: "◫", label: "Stack",    desc: "All 59 services" },
            { href: "/admin/deploy",   icon: "▲", label: "Deploy",   desc: "Step wizard" },
            { href: "/admin/commands", icon: ">", label: "Commands", desc: "Copy scripts" },
            { href: "/admin/help",     icon: "?", label: "Help",     desc: "FAQ + glossary" },
          ].map((n) => (
            <Link key={n.href} href={n.href}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800 transition-colors text-center group">
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform inline-block">{n.icon}</div>
              <div className="text-sm font-semibold text-gray-200">{n.label}</div>
              <div className="text-xs text-gray-600 mt-0.5">{n.desc}</div>
            </Link>
          ))}
        </div>

        <div className="text-center text-xs text-gray-700 pt-4 border-t border-gray-800">
          Press <kbd className="border border-gray-700 rounded px-1.5 py-0.5 font-mono">Ctrl+K</kbd> to open the command palette · Read-only dashboard
        </div>
      </div>
    </div>
  );
}
