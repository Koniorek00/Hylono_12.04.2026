import Link from "next/link";
import { CopyCodeBlock } from "@/components/CopyButton";
import { getStagingHandoffSnapshot } from "@/lib/staging-handoff";

export const dynamic = "force-dynamic";

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h2>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function StagingPage() {
  const snapshot = getStagingHandoffSnapshot();
  const presentCount = snapshot.fileCards.filter((file) => file.status === "present").length;
  const envSummary = snapshot.envSummary;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-800/40 bg-emerald-900/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Staging handoff
            </span>
            <span className="rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              File-backed contract
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Staging operator surface</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-400">
            This page is the concise operator view for moving the verified local stack toward a real
            staging host. It surfaces the handoff files, the launch order, the boundaries that stay
            local, and the acceptance criteria before any DNS cutover.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Scaffold files
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{presentCount}/4</div>
            <div className="mt-1 text-xs text-gray-500">Required staging files present locally.</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Launch steps
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{snapshot.launchOrder.length}</div>
            <div className="mt-1 text-xs text-gray-500">Ordered promotion sequence.</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Keep local
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{snapshot.keepLocal.length}</div>
            <div className="mt-1 text-xs text-gray-500">Artifacts that should not move unchanged.</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Promotion rules
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{snapshot.promotionRules.length}</div>
            <div className="mt-1 text-xs text-gray-500">Guardrails for a clean staging cutover.</div>
          </div>
        </div>

        <Panel
          title="Staging env readiness"
          description="A file-backed snapshot of .env.staging versus the example contract."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Status</div>
              <div
                className={`mt-1 text-sm font-semibold ${
                  envSummary.ready ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {envSummary.ready ? "Ready for staging" : "Needs attention"}
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Required keys</div>
              <div className="mt-1 text-sm font-semibold text-white">{envSummary.requiredKeyCount}</div>
              <div className="mt-1 text-xs text-gray-500">From .env.staging.example</div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Candidate keys</div>
              <div className="mt-1 text-sm font-semibold text-white">{envSummary.candidateKeyCount}</div>
              <div className="mt-1 text-xs text-gray-500">Present in .env.staging</div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-gray-500">Issue count</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {envSummary.missingKeys.length +
                  envSummary.placeholderKeys.length +
                  envSummary.urlIssues.length +
                  envSummary.numericIssues.length}
              </div>
              <div className="mt-1 text-xs text-gray-500">Missing, placeholder, URL, and timeout checks</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Missing / placeholder keys
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                {envSummary.missingKeys.length === 0 && envSummary.placeholderKeys.length === 0 ? (
                  <p className="text-emerald-300">No missing or placeholder keys detected.</p>
                ) : (
                  <>
                    {envSummary.missingKeys.length > 0 ? (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-600">Missing</div>
                        <ul className="mt-1 space-y-1">
                          {envSummary.missingKeys.slice(0, 8).map((key) => (
                            <li key={key} className="text-gray-300">
                              {key}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {envSummary.placeholderKeys.length > 0 ? (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-600">Placeholder-like</div>
                        <ul className="mt-1 space-y-1">
                          {envSummary.placeholderKeys.slice(0, 8).map((key) => (
                            <li key={key} className="text-gray-300">
                              {key}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                URL and timeout issues
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                {envSummary.urlIssues.length === 0 && envSummary.numericIssues.length === 0 ? (
                  <p className="text-emerald-300">No URL or timeout issues detected.</p>
                ) : (
                  <>
                    {envSummary.urlIssues.length > 0 ? (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-600">URL issues</div>
                        <ul className="mt-1 space-y-1">
                          {envSummary.urlIssues.slice(0, 8).map((issue) => (
                            <li key={issue} className="text-gray-300">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {envSummary.numericIssues.length > 0 ? (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-600">Timeout issues</div>
                        <ul className="mt-1 space-y-1">
                          {envSummary.numericIssues.slice(0, 8).map((issue) => (
                            <li key={issue} className="text-gray-300">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Validator command
            </div>
            <CopyCodeBlock code={".\\scripts\\validate-staging-env.ps1 -Path .\\.env.staging"} />
          </div>
        </Panel>

        <div className="mb-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {snapshot.fileCards.map((file) => (
            <section key={file.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">{file.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{file.purpose}</p>
                </div>
                <span
                  className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                    file.status === "present"
                      ? "border-emerald-800/40 bg-emerald-900/30 text-emerald-300"
                      : "border-amber-800/40 bg-amber-900/20 text-amber-300"
                  }`}
                >
                  {file.status}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {file.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] text-gray-400"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mb-3 text-xs text-gray-500">
                {file.sizeLabel ? <span>{file.sizeLabel}</span> : null}
                {file.sizeLabel && file.updatedLabel ? <span className="mx-2">|</span> : null}
                {file.updatedLabel ? <span>updated {file.updatedLabel}</span> : null}
              </div>

              <CopyCodeBlock code={file.path} />
            </section>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Panel
            title="Launch order"
            description="The order to use when moving from local verification toward staging."
          >
            <ol className="space-y-3">
              {snapshot.launchOrder.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-gray-300">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-950 text-xs text-gray-500">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel
            title="Promotion rules"
            description="Rules that keep staging distinct from your local operator machine."
          >
            <ul className="space-y-2">
              {snapshot.promotionRules.map((rule) => (
                <li key={rule} className="flex gap-2 text-sm text-gray-300">
                  <span className="mt-0.5 text-gray-600">-</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Keep local"
            description="Things that should stay anchored to this machine until staging is real."
          >
            <ul className="space-y-2">
              {snapshot.keepLocal.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300">
                  <span className="mt-0.5 text-gray-600">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Acceptance criteria"
            description="The minimum conditions that should be true before DNS cutover."
          >
            <ul className="space-y-2">
              {snapshot.acceptanceCriteria.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300">
                  <span className="mt-0.5 text-gray-600">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <section className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Operator shortcuts
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Use the existing operator surfaces to cross-check the staging handoff.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/progress"
              className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-1.5 text-xs text-emerald-300 transition-colors hover:bg-emerald-800/30 hover:text-emerald-200"
            >
              Progress
            </Link>
            <Link
              href="/admin/blueprints"
              className="rounded-lg border border-cyan-700/40 bg-cyan-900/20 px-3 py-1.5 text-xs text-cyan-300 transition-colors hover:bg-cyan-800/30 hover:text-cyan-200"
            >
              Blueprints
            </Link>
            <Link
              href="/admin/deploy"
              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Deploy
            </Link>
            <Link
              href="/admin/commands"
              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Commands
            </Link>
            <Link
              href="/admin/help"
              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              Help
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
