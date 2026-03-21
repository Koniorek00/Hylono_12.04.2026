import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";
import { SecretValue } from "@/components/SecretValue";
import { checkHealth } from "@/lib/health";
import { getServices } from "@/lib/manifest";
import {
  getFirstLoginEntries,
  getOperatorCredentialEntries,
  type OnboardingPriority,
} from "@/lib/credentials";

export const dynamic = "force-dynamic";

const MODE_META = {
  "env-ready": {
    label: "Ready credential",
    badge: "bg-green-900/40 text-green-300 border-green-800/40",
  },
  "setup-wizard": {
    label: "Setup wizard",
    badge: "bg-amber-900/40 text-amber-300 border-amber-800/40",
  },
  signup: {
    label: "Create account",
    badge: "bg-blue-900/40 text-blue-300 border-blue-800/40",
  },
  manual: {
    label: "Manual bootstrap",
    badge: "bg-gray-800 text-gray-300 border-gray-700",
  },
} as const;

const PRIORITY_META: Record<
  OnboardingPriority,
  {
    label: string;
    description: string;
    badge: string;
  }
> = {
  "start-here": {
    label: "Start here",
    description: "Best order for someone setting up the browser-facing apps for the first time.",
    badge: "bg-emerald-900/40 text-emerald-300 border-emerald-800/40",
  },
  later: {
    label: "Do later",
    description: "Useful modules, but not required to understand the stack on day one.",
    badge: "bg-blue-900/40 text-blue-300 border-blue-800/40",
  },
  advanced: {
    label: "Advanced / operator-led",
    description: "Requires extra bootstrap knowledge or manual work beyond the simple browser flow.",
    badge: "bg-gray-800 text-gray-300 border-gray-700",
  },
};

const OPERATOR_COMMANDS = [
  {
    title: "Start the full local operator stack",
    code: ".\\start-dev.bat",
    note: "Preferred single entry point. Starts Docker services, the control panel, the site on localhost:3000, and replays the local operator bootstrap seeds for Kuma, Medusa, Snipe-IT, Cal.com, Lago, Twenty, n8n, Novu, plus the mail-profile validation pass.",
  },
  {
    title: "Start infrastructure",
    code: ".\\scripts\\setup.ps1 infrastructure",
    note: "Run from the repo root in PowerShell. Starts PostgreSQL, Redis, MinIO, MongoDB, and Uptime Kuma.",
  },
  {
    title: "Start Phase 1A runtime",
    code: ".\\scripts\\setup.ps1 1a",
    note: "Run from the repo root in PowerShell. Starts the verified app layer on top of infrastructure.",
  },
  {
    title: "Check infrastructure status",
    code: "docker compose -f docker/infrastructure/docker-compose.yml ps",
    note: "Best first CLI check if something looks down in the browser.",
  },
  {
    title: "Check Phase 1A status",
    code: "docker compose -f docker/phase-1a/docker-compose.yml ps",
    note: "Shows whether the app containers are running and healthy.",
  },
  {
    title: "Reapply the operator bootstrap",
    code: ".\\scripts\\seed-uptime-kuma-operator-config.ps1; .\\scripts\\seed-medusa-local-catalog.ps1; .\\scripts\\seed-snipeit-operator-baseline.ps1; .\\scripts\\seed-calcom-operator-baseline.ps1; .\\scripts\\seed-lago-local-billing.ps1; .\\scripts\\seed-twenty-operator-workspace.ps1; .\\scripts\\seed-n8n-phase2-workflows.ps1; .\\scripts\\seed-novu-operator-bootstrap.ps1; .\\scripts\\validate-mail-provider-env.ps1",
    note: "Use this if you want to reconcile the local operator layer without re-running the full launcher.",
  },
];

function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export default async function CredentialsPage() {
  const services = getServices();
  const infrastructureServices = services.filter(
    (service) => service.phase === "infrastructure" && service.verdict === "ESSENTIAL"
  );
  const phase1BrowserServices = services.filter(
    (service) => service.phase === "1a" && Boolean(service.uiUrl)
  );
  const [infrastructureHealth, phase1Health] = await Promise.all([
    Promise.all(infrastructureServices.map((service) => checkHealth(service))),
    Promise.all(phase1BrowserServices.map((service) => checkHealth(service))),
  ]);
  const infrastructureReady =
    infrastructureHealth.length > 0 &&
    infrastructureHealth.every((result) => result.status === "running");
  const appLayerReady =
    phase1Health.length > 0 && phase1Health.every((result) => result.status === "running");
  const firstLoginEntries = getFirstLoginEntries();
  const operatorEntries = getOperatorCredentialEntries();
  const startHereEntries = sortByOrder(
    firstLoginEntries.filter((entry) => entry.priority === "start-here")
  );
  const laterEntries = sortByOrder(firstLoginEntries.filter((entry) => entry.priority === "later"));
  const advancedEntries = sortByOrder(
    firstLoginEntries.filter((entry) => entry.priority === "advanced")
  );

  const groupedEntries: Array<{
    priority: OnboardingPriority;
    entries: typeof firstLoginEntries;
  }> = [
    { priority: "start-here", entries: startHereEntries },
    { priority: "later", entries: laterEntries },
    { priority: "advanced", entries: advancedEntries },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Credentials / First Login</h1>
          <p className="mt-1 text-sm text-gray-400">
            Local operator page for first browser logins, runtime secrets, and shell access.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 text-sm text-rose-100/80">
          <p className="font-semibold text-rose-300">Sensitive local data</p>
          <p className="mt-1">
            Values shown here come from the current local environment file. This page is meant for
            the operator of the stack and should stay local to this machine.
          </p>
        </div>

        {appLayerReady ? (
          <div className="mb-8 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 text-sm text-emerald-100/80">
            <p className="font-semibold text-emerald-300">Local stack already running</p>
            <p className="mt-1">
              Infrastructure and Phase 1A browser apps are already up on this machine. You can skip
              the startup commands below and go straight to the first-login cards.
            </p>
          </div>
        ) : infrastructureReady ? (
          <div className="mb-8 rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 text-sm text-blue-100/80">
            <p className="font-semibold text-blue-300">Infrastructure already running</p>
            <p className="mt-1">
              Core services are already up. You only need the Phase 1A startup command if one of the
              browser apps is missing.
            </p>
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
            <p className="font-semibold text-white">Run commands from the repo root</p>
            <p className="mt-1">
              Open PowerShell in <code className="rounded bg-gray-950 px-1.5 py-0.5 text-xs">F:\\ag projects\\Hylono_MAIN - SEO BOOST</code>{" "}
              before using the startup commands below.
            </p>
          </div>
        )}

        <div className="mb-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Beginner Fast Path
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                For someone who knows nothing yet: bring the stack up, then open the cards marked
                <span className="mx-1 rounded border border-emerald-800/40 bg-emerald-900/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  Start here
                </span>
                in order.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  1. Start infrastructure only if needed
                </div>
                <CopyCodeBlock code=".\\scripts\\setup.ps1 infrastructure" />
                <div className="mt-2 text-xs text-gray-500">
                  {infrastructureReady
                    ? "Already running right now. Skip this unless infrastructure was stopped."
                    : "Run from the repo root in PowerShell. Bash alternative: bash scripts/setup.sh infrastructure."}
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  2. Start the app layer only if needed
                </div>
                <CopyCodeBlock code=".\\scripts\\setup.ps1 1a" />
                <div className="mt-2 text-xs text-gray-500">
                  {appLayerReady
                    ? "Already running right now. Skip this and continue directly to the browser modules below."
                    : "Run from the repo root in PowerShell. Bash alternative: bash scripts/setup.sh 1a."}
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  3. Open these first
                </div>
                <div className="space-y-2">
                  {startHereEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
                            {entry.order}
                          </span>
                          <span className="text-sm font-medium text-white">{entry.name}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{entry.firstAction}</div>
                      </div>
                      {entry.url ? (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Open ↗
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-blue-900/30 bg-blue-950/20 p-3 text-xs text-blue-100/80">
                Ignore the operator secrets below unless you are troubleshooting, connecting a CLI,
                or administering the underlying databases and storage yourself.
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Operator Fast Path
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Full control path for the person operating the stack: startup, health checks, and
                direct credentials for infrastructure services.
              </p>
            </div>

            <div className="space-y-3">
              {OPERATOR_COMMANDS.map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {item.title}
                  </div>
                  <CopyCodeBlock code={item.code} />
                  <div className="mt-2 text-xs text-gray-500">{item.note}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-amber-900/30 bg-amber-950/20 p-3 text-xs text-amber-100/80">
              Browser apps are only one layer. As operator, you should treat the `Operator
              Credentials` section below as the canonical source for DB/cache/storage access in this
              checkout. The seeded local status page is available at{" "}
              <a
                href="http://localhost:3002/status/hylono-local"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200"
              >
                http://localhost:3002/status/hylono-local
              </a>
              .
            </div>
          </section>
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Browser First Login
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Full browser-facing setup map, grouped by how soon it makes sense to configure the
                module.
              </p>
            </div>
            <Link
              href="/admin/stack"
              className="text-xs text-blue-400 transition-colors hover:text-blue-300"
            >
              Open stack explorer
            </Link>
          </div>

          <div className="space-y-6">
            {groupedEntries.map(({ priority, entries }) => {
              if (entries.length === 0) {
                return null;
              }

              const priorityMeta = PRIORITY_META[priority];

              return (
                <div key={priority}>
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${priorityMeta.badge}`}
                    >
                      {priorityMeta.label}
                    </span>
                    <p className="text-sm text-gray-500">{priorityMeta.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {entries.map((entry) => {
                      const modeMeta = MODE_META[entry.mode];

                      return (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-gray-800 bg-gray-900 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="rounded bg-gray-950 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
                                  {entry.order}
                                </span>
                                <h3 className="text-base font-semibold text-white">{entry.name}</h3>
                              </div>
                              {entry.url ? (
                                <a
                                  href={entry.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs font-mono text-blue-400 hover:text-blue-300"
                                >
                                  {entry.url} ↗
                                </a>
                              ) : (
                                <p className="text-xs text-gray-600">No browser URL pinned in manifest.</p>
                              )}
                            </div>
                            <span
                              className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${modeMeta.badge}`}
                            >
                              {modeMeta.label}
                            </span>
                          </div>

                          <div className="mb-3 rounded-lg border border-gray-800 bg-gray-950 p-3">
                            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                              First action
                            </div>
                            <div className="text-sm text-gray-300">{entry.firstAction}</div>
                          </div>

                          <div className="space-y-2">
                            {entry.usernameValue ? (
                              <div>
                                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                                  {entry.usernameLabel ?? "Username"}
                                </div>
                                <code className="block rounded bg-gray-950 px-2 py-1 text-xs text-gray-200 break-all">
                                  {entry.usernameValue}
                                </code>
                              </div>
                            ) : null}

                            {entry.passwordValue ? (
                              <div>
                                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                                  {entry.passwordLabel ?? "Password"}
                                </div>
                                <SecretValue value={entry.passwordValue} />
                              </div>
                            ) : null}
                          </div>

                          <p className="mt-3 text-xs leading-relaxed text-gray-400">{entry.notes}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Operator Credentials
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Infrastructure and backend access values for CLI tools, local clients, and Docker
              operations.
            </p>
          </div>

          <div className="space-y-3">
            {operatorEntries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold text-white">{entry.name}</h3>
                  <span className="rounded bg-gray-950 px-2 py-1 text-xs font-mono text-gray-300">
                    {entry.endpoint}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {entry.usernameValue ? (
                    <div>
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {entry.usernameLabel ?? "Username"}
                      </div>
                      <code className="block rounded bg-gray-950 px-2 py-1 text-xs text-gray-200 break-all">
                        {entry.usernameValue}
                      </code>
                    </div>
                  ) : null}

                  {entry.passwordValue ? (
                    <div>
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                        {entry.passwordLabel ?? "Password"}
                      </div>
                      <SecretValue value={entry.passwordValue} />
                    </div>
                  ) : null}
                </div>

                {entry.command ? (
                  <div className="mt-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                      {entry.commandLabel ?? "Command"}
                    </div>
                    <CopyCodeBlock code={entry.command} />
                  </div>
                ) : null}

                <p className="mt-3 text-xs leading-relaxed text-gray-400">{entry.notes}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
