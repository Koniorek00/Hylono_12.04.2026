import Link from "next/link";
import { checkHealth } from "@/lib/health";
import { getServices } from "@/lib/manifest";
import {
  getMedtechFlowPack,
  getMedtechFlowPackPath,
  getMedtechLanePackIndex,
  getMedtechLanePackIndexPath,
} from "@/lib/medtech-blueprints";

export const dynamic = "force-dynamic";

const LOCAL_TOOL_SERVICE_NAMES = ["n8n", "Twenty CRM", "Novu", "Cal.com", "Documenso"] as const;

function toneClass(isRunning: boolean) {
  return isRunning
    ? "border-emerald-800/40 bg-emerald-900/30 text-emerald-300"
    : "border-amber-800/40 bg-amber-900/20 text-amber-300";
}

export default async function BlueprintsPage() {
  const pack = getMedtechFlowPack();
  const lanePackIndex = getMedtechLanePackIndex();
  const services = getServices().filter((service) =>
    LOCAL_TOOL_SERVICE_NAMES.includes(
      service.name as (typeof LOCAL_TOOL_SERVICE_NAMES)[number]
    )
  );
  const toolHealth = await Promise.all(
    services.map(async (service) => ({
      service,
      health: await checkHealth(service),
    }))
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-800/40 bg-cyan-900/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Blueprints
            </span>
            <span className="rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Official-source flow pack
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Medtech workflow blueprints</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-400">
            Source-backed operating patterns for intake, consent, scheduling, and reminder ladders.
            This page surfaces the reusable flow pack already stored in the repo so the operator can
            configure the apps from proven patterns instead of rebuilding them ad hoc.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Source policy: {pack.sourcePolicy} | Pack version: {pack.version} | Artifact:{" "}
            <span className="font-mono text-cyan-400">{getMedtechFlowPackPath()}</span>
          </p>
          {lanePackIndex ? (
            <p className="mt-1 text-xs text-gray-500">
              Machine-readable lane index:{" "}
              <span className="font-mono text-cyan-400">{getMedtechLanePackIndexPath()}</span>
            </p>
          ) : null}
        </div>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Local-ready tools
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              These are the apps from the flow pack that are already wired into the local slice and can
              be configured right now.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {toolHealth.map(({ service, health }) => {
              const blueprint =
                pack.primaryTools[service.id] ??
                pack.primaryTools[service.name.toLowerCase().replace(/[^a-z0-9]+/g, "")];
              const isRunning = health.status === "running";

              return (
                <div key={service.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-white">{service.name}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {service.role ?? service.domain}
                      </div>
                    </div>
                    <span
                      className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${toneClass(
                        isRunning
                      )}`}
                    >
                      {isRunning ? "running" : health.status}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">
                    {blueprint?.role ??
                      "Available in the local stack and ready for operator configuration."}
                  </p>
                  {service.uiUrl ? (
                    <a
                      href={service.uiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-xs text-blue-400 hover:text-blue-300"
                    >
                      Open app
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Recommended lanes
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              The reusable operating flows to implement next, in the order that gives the best operator
              value without unnecessary custom glue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {pack.recommendedLanes.map((lane) => (
              <section key={lane.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{lane.name}</h3>
                  <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] text-gray-400">
                    {lane.id}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-300">{lane.purpose}</p>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Trigger
                    </div>
                    <div className="mt-1 text-sm text-white">{lane.trigger.tool}</div>
                    <div className="mt-1 text-xs text-gray-500">{lane.trigger.pattern}</div>
                  </div>
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Tools
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {lane.sourceTools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-gray-800 bg-gray-900 px-2.5 py-1 text-[11px] text-gray-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Actions
                  </div>
                  <ul className="space-y-2">
                    {lane.actions.map((action) => (
                      <li key={action} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-0.5 text-gray-600">-</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lanePackIndex ? (
                  <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Machine-readable pack
                    </div>
                    {lanePackIndex.artifacts
                      .filter((artifact) => artifact.laneId === lane.id)
                      .map((artifact) => (
                        <div key={artifact.file} className="mt-2">
                          <div className="break-all font-mono text-xs text-cyan-400">
                            {artifact.file}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">{artifact.purpose}</div>
                        </div>
                      ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Tool patterns
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Official-source patterns already normalized for this stack. Use these instead of inventing
              custom operating logic when a platform-native capability already exists.
            </p>
          </div>

          <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Promotion contract
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="text-[11px] uppercase tracking-wider text-gray-600">Local</div>
                <div className="mt-1 text-sm text-white">Build and prove flows safely</div>
                <div className="mt-1 text-xs text-gray-500">
                  Use n8n production webhooks only after publish, seed stable subscribers, and keep
                  workflows or templates in repo-backed exports.
                </div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="text-[11px] uppercase tracking-wider text-gray-600">Staging</div>
                <div className="mt-1 text-sm text-white">Promote artifacts, not guesses</div>
                <div className="mt-1 text-xs text-gray-500">
                  Reuse exported workflow packs, staging env validation, and the same operator
                  baseline with staging-only secrets and URLs.
                </div>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <div className="text-[11px] uppercase tracking-wider text-gray-600">Production</div>
                <div className="mt-1 text-sm text-white">Change through validated promotion</div>
                <div className="mt-1 text-xs text-gray-500">
                  Keep production edits minimal. Prefer synced or published workflows and validated
                  templates over manual UI drift.
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(pack.primaryTools).map(([toolId, blueprint]) => (
              <section key={toolId} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="mb-2 text-lg font-semibold text-white">{toolId}</div>
                <p className="text-sm leading-relaxed text-gray-300">{blueprint.role}</p>
                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Recommended patterns
                    </div>
                    <ul className="space-y-2">
                      {blueprint.recommendedPatterns.map((pattern) => (
                        <li key={pattern} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="mt-0.5 text-gray-600">-</span>
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Official sources
                    </div>
                    <div className="space-y-2">
                      {blueprint.officialSources.map((source) => (
                        <a
                          key={source}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block break-all text-sm text-blue-400 hover:text-blue-300"
                        >
                          {source}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Default guidance
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Use these rules as the operator baseline whenever you wire a new business flow.
            </p>
          </div>
          <ul className="space-y-2">
            {pack.defaultGuidance.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="mt-0.5 text-gray-600">-</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          {lanePackIndex ? (
            <>
              <div className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Operator rules from lane index
              </div>
              <ul className="space-y-2">
                {lanePackIndex.operatorRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="mt-0.5 text-gray-600">-</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/admin/progress"
              className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-800/30 hover:text-emerald-200"
            >
              Open progress
            </Link>
            <Link
              href="/admin/commands"
              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Open commands
            </Link>
            <Link
              href="/admin/stack"
              className="rounded-lg border border-blue-700/40 bg-blue-900/20 px-3 py-1.5 text-xs text-blue-300 transition-colors hover:bg-blue-800/30 hover:text-blue-200"
            >
              Open stack
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
