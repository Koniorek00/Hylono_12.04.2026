import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";

const STEPS = [
  {
    num: "1",
    title: "Generate your secrets",
    desc: "This creates a .env file with unique random passwords for every service. You only do this once.",
    code: "bash scripts/generate-secrets.sh",
    note: "✅ Safe to run — it skips if .env already exists.",
    color: "border-blue-700 bg-blue-950/20",
    icon: "🔑",
  },
  {
    num: "2",
    title: "Start the infrastructure layer",
    desc: "This boots the 5 core services: PostgreSQL (database), Redis (cache), MinIO (file storage), MongoDB (used by Novu), and Uptime Kuma (monitoring).",
    code: "bash scripts/setup.sh infrastructure",
    note: "⏱ Takes ~30 seconds the first time (downloading Docker images).",
    color: "border-purple-700 bg-purple-950/20",
    icon: "🏗",
  },
  {
    num: "3",
    title: "Start Phase 1A services",
    desc: "Launches the first set of application services: Medusa (commerce), Lago (billing), Snipe-IT (assets), Cal.com (scheduling), Twenty CRM, Documenso (e-signatures), Zitadel (auth), Novu (notifications), n8n (automation).",
    code: "bash scripts/setup.sh 1a",
    note: "⏱ Takes 1–3 minutes. Leihs requires manual build (see Help page).",
    color: "border-green-700 bg-green-950/20",
    icon: "🚀",
  },
];

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">🚀 Quick Start</h1>
          <p className="mt-1 text-gray-400 text-sm">
            New to Hylono? Follow these 3 steps to get the stack running. Each step builds on the last.
          </p>
        </div>

        {/* Prerequisites box */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 mb-8">
          <div className="font-semibold text-amber-300 text-sm mb-2">📋 Before you start — Prerequisites</div>
          <ul className="space-y-1.5 text-sm text-amber-200/80">
            <li className="flex items-start gap-2"><span className="text-amber-500 flex-shrink-0 mt-0.5">•</span> <span><strong>Docker Desktop</strong> must be running on your machine</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-500 flex-shrink-0 mt-0.5">•</span> <span>You need at least <strong>8 GB RAM</strong> available for the infrastructure layer</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-500 flex-shrink-0 mt-0.5">•</span> <span>You must be in the <strong>project root directory</strong> when running commands</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-500 flex-shrink-0 mt-0.5">•</span> <span>On Windows, run commands in <strong>Git Bash</strong> or <strong>WSL</strong> (not PowerShell)</span></li>
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {STEPS.map((step) => (
            <div key={step.num} className={`border rounded-xl p-5 ${step.color}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{step.icon}</span>
                    <h2 className="font-semibold text-white text-base">{step.title}</h2>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{step.desc}</p>
                  <CopyCodeBlock code={step.code} />
                  <p className="text-xs text-gray-500 mt-2">{step.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* After setup */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-white text-base mb-3">✅ After setup — service URLs</h2>
          <p className="text-sm text-gray-400 mb-4">Once running, each service is accessible at its port on your machine:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              ["Uptime Kuma (monitoring)", "http://localhost:3001"],
              ["MinIO console (files)", "http://localhost:9001"],
              ["n8n (automation)", "http://localhost:5678"],
              ["Medusa (commerce)", "http://localhost:8100"],
              ["Lago (billing)", "http://localhost:8102"],
              ["Snipe-IT (assets)", "http://localhost:8104"],
              ["Twenty CRM", "http://localhost:8107"],
              ["Zitadel (auth)", "http://localhost:8109"],
            ].map(([name, url]) => (
              <div key={url} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <span className="text-gray-400">{name}</span>
                <span className="font-mono text-blue-400">{url}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="mt-6 flex gap-3">
          <Link href="/admin/commands"
            className="flex-1 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 text-center transition-colors">
            <div className="text-xl mb-1">💻</div>
            <div className="text-sm font-medium text-white">All Commands</div>
            <div className="text-xs text-gray-500 mt-0.5">Full script reference</div>
          </Link>
          <Link href="/admin/help"
            className="flex-1 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 text-center transition-colors">
            <div className="text-xl mb-1">❓</div>
            <div className="text-sm font-medium text-white">Help & FAQ</div>
            <div className="text-xs text-gray-500 mt-0.5">Troubleshooting guide</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
