import Link from "next/link";
import type { ReactNode } from "react";
import { CopyCodeBlock } from "@/components/CopyButton";
import { checkHealth } from "@/lib/health";
import { getBootstrapSnapshot, type BootstrapStatus } from "@/lib/bootstrap-progress";
import { getServices, getVerifiedLocalUiServices } from "@/lib/manifest";

export const dynamic = "force-dynamic";

const STATUS_META: Record<
  BootstrapStatus,
  { label: string; className: string; description: string }
> = {
  complete: {
    label: "Complete",
    className: "border-emerald-800/40 bg-emerald-900/40 text-emerald-300",
    description: "Already present and verified locally.",
  },
  partial: {
    label: "Partial",
    className: "border-amber-800/40 bg-amber-900/30 text-amber-300",
    description: "Some of the local evidence exists, but the slice is not fully green.",
  },
  manual: {
    label: "Manual",
    className: "border-slate-700 bg-slate-800 text-slate-300",
    description: "Still needs an operator decision or external provider setup.",
  },
  unknown: {
    label: "Unknown",
    className: "border-gray-700 bg-gray-800 text-gray-300",
    description: "No reliable local signal yet.",
  },
};

function statusTone(status: BootstrapStatus) {
  return STATUS_META[status] ?? STATUS_META.unknown;
}

function HealthSummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs leading-relaxed text-gray-500">{detail}</div>
    </div>
  );
}

function ProgressCard({
  title,
  status,
  evidence,
  meta,
  action,
}: {
  title: string;
  status: BootstrapStatus;
  evidence: string;
  meta?: string[];
  action?: ReactNode;
}) {
  const tone = statusTone(status);

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{tone.description}</p>
        </div>
        <span
          className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${tone.className}`}
        >
          {tone.label}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-gray-300">{evidence}</p>

      {meta && meta.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {meta.map((item) => (
            <span
              key={item}
              className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] text-gray-400"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}

export default async function ProgressPage() {
  const manifestServices = getServices();
  const essentialInfrastructure = manifestServices.filter(
    (service) => service.phase === "infrastructure" && service.verdict === "ESSENTIAL"
  );
  const verifiedLocalUiServices = getVerifiedLocalUiServices();

  const [infrastructureHealth, localUiHealth] = await Promise.all([
    Promise.all(essentialInfrastructure.map((service) => checkHealth(service))),
    Promise.all(verifiedLocalUiServices.map((service) => checkHealth(service))),
  ]);

  const snapshot = getBootstrapSnapshot();

  const infrastructureRunning = infrastructureHealth.filter((result) => result.status === "running");
  const localUiRunning = localUiHealth.filter((result) => result.status === "running");
  const coreChecks: Array<{ label: string; status: BootstrapStatus }> = [
    { label: "Launcher baseline", status: snapshot.launcher.status },
    {
      label: "Infrastructure",
      status:
        infrastructureHealth.length > 0 && infrastructureHealth.every((result) => result.status === "running")
          ? "complete"
          : infrastructureRunning.length > 0
            ? "partial"
            : "unknown",
    },
    {
      label: "Verified local UI",
      status:
        localUiHealth.length > 0 && localUiHealth.every((result) => result.status === "running")
          ? "complete"
          : localUiRunning.length > 0
            ? "partial"
            : "unknown",
    },
    { label: "Documenso certificate", status: snapshot.documensoCertificate.status },
    { label: "Medusa catalog baseline", status: snapshot.medusaCatalog.status },
    { label: "Cal.com baseline", status: snapshot.calcomBaseline.status },
    { label: "Snipe-IT baseline", status: snapshot.snipeitBaseline.status },
    { label: "n8n backup snapshot", status: snapshot.n8nBackup.status },
    { label: "Novu operator bootstrap", status: snapshot.novuBootstrap.status },
    { label: "Mail provider profile", status: snapshot.mailProvider.status },
  ];

  const completeChecks = coreChecks.filter((item) => item.status === "complete").length;
  const progressPercent = Math.round((completeChecks / coreChecks.length) * 100);

  const manualBlockers = [
    {
      title: "Outbound delivery providers",
      status: "manual" as const,
      evidence:
        "Email/SMS delivery for Novu and app notifications still depends on your chosen SMTP or provider credentials.",
      meta: ["SMTP", "Novu delivery", "application mailers"],
      action: (
        <Link href="/admin/credentials" className="text-xs text-blue-400 hover:text-blue-300">
          Review credentials
        </Link>
      ),
    },
    {
      title: "Staging and production deployment",
      status: "manual" as const,
      evidence:
        "The local bootstrap is complete, but a real server, reverse proxy, TLS, and locked-down ports are still separate work.",
      meta: ["staging", "TLS", "reverse proxy"],
      action: (
        <Link href="/admin/deploy" className="text-xs text-blue-400 hover:text-blue-300">
          Open deploy guide
        </Link>
      ),
    },
    {
      title: "Business-specific integrations",
      status: "manual" as const,
      evidence:
        "Billing, calendar, identity, and workflow depth still need final business decisions before they become production defaults.",
      meta: ["billing", "calendar", "identity"],
      action: (
        <Link href="/admin/stack" className="text-xs text-blue-400 hover:text-blue-300">
          Inspect stack graph
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-800/40 bg-blue-900/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              Bootstrap / Progress
            </span>
            <span className="rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Local operator state
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">What is actually ready right now</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
            This surface shows the current local operator state from the live stack, bootstrap artifacts on
            disk, and the remaining manual boundaries. It is meant to answer one question quickly:
            what is seeded, what is running, and what still needs an operator decision?
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <HealthSummaryCard
            label="Core checks complete"
            value={`${completeChecks}/${coreChecks.length}`}
            detail="Launcher, live services, and bootstrap artifacts."
          />
          <HealthSummaryCard
            label="Live services monitored"
            value={`${infrastructureHealth.length + localUiHealth.length}`}
            detail="Essential infrastructure plus verified local browser URLs."
          />
          <HealthSummaryCard
            label="Running now"
            value={`${infrastructureRunning.length + localUiRunning.length}`}
            detail="Health checks that are returning running right now."
          />
          <HealthSummaryCard
            label="Manual blockers"
            value={`${manualBlockers.length}`}
            detail="Remaining external decisions, not local bootstrap failures."
          />
        </div>

        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Bootstrap completion
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Core local bootstrap state across launcher, runtime, and persistent artifacts.
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{progressPercent}%</div>
              <div className="text-xs text-gray-500">
                {completeChecks} complete, {coreChecks.length - completeChecks} still partial/manual
              </div>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <ProgressCard
            title="Desktop launcher baseline"
            status={snapshot.launcher.status}
            evidence={snapshot.launcher.evidence}
            meta={snapshot.launcher.meta}
            action={<CopyCodeBlock code=".\\start-dev.bat" />}
          />
          <ProgressCard
            title="Live infrastructure"
            status={
              infrastructureHealth.length > 0 &&
              infrastructureHealth.every((result) => result.status === "running")
                ? "complete"
                : infrastructureRunning.length > 0
                  ? "partial"
                  : "unknown"
            }
            evidence={
              infrastructureHealth.length > 0
                ? `${infrastructureRunning.length}/${infrastructureHealth.length} essential infrastructure services are running right now.`
                : "No infrastructure services were available to probe."
            }
            meta={infrastructureHealth.map((result) => `${result.serviceId}: ${result.status}`)}
            action={<Link href="/admin/stack" className="text-xs text-blue-400 hover:text-blue-300">Open stack explorer</Link>}
          />
          <ProgressCard
            title="Verified local browser URLs"
            status={
              localUiHealth.length > 0 && localUiHealth.every((result) => result.status === "running")
                ? "complete"
                : localUiRunning.length > 0
                  ? "partial"
                  : "unknown"
            }
            evidence={
              localUiHealth.length > 0
                ? `${localUiRunning.length}/${localUiHealth.length} verified browser-facing URLs are reachable from the local runtime.`
                : "No local browser-facing services were available to probe."
            }
            meta={verifiedLocalUiServices.map((service) => service.name)}
            action={<Link href="/admin/credentials" className="text-xs text-blue-400 hover:text-blue-300">Open credentials</Link>}
          />
          <ProgressCard
            title="Documenso signing certificate"
            status={snapshot.documensoCertificate.status}
            evidence={snapshot.documensoCertificate.evidence}
            meta={snapshot.documensoCertificate.meta}
          />
          <ProgressCard
            title="Medusa catalog baseline"
            status={snapshot.medusaCatalog.status}
            evidence={snapshot.medusaCatalog.evidence}
            meta={snapshot.medusaCatalog.meta}
          />
          <ProgressCard
            title="Cal.com operator baseline"
            status={snapshot.calcomBaseline.status}
            evidence={snapshot.calcomBaseline.evidence}
            meta={snapshot.calcomBaseline.meta}
          />
          <ProgressCard
            title="Snipe-IT operator baseline"
            status={snapshot.snipeitBaseline.status}
            evidence={snapshot.snipeitBaseline.evidence}
            meta={snapshot.snipeitBaseline.meta}
          />
          <ProgressCard
            title="n8n Phase 2 backup snapshot"
            status={snapshot.n8nBackup.status}
            evidence={snapshot.n8nBackup.evidence}
            meta={snapshot.n8nBackup.meta}
          />
          <ProgressCard
            title="Novu operator bootstrap"
            status={snapshot.novuBootstrap.status}
            evidence={snapshot.novuBootstrap.evidence}
            meta={snapshot.operatorNotifications.map((entry) => `${entry.role}: ${entry.email}`)}
          />
          <ProgressCard
            title="Mail provider profile"
            status={snapshot.mailProvider.status}
            evidence={snapshot.mailProvider.evidence}
            meta={snapshot.mailProvider.meta}
            action={
              <Link href="/admin/commands" className="text-xs text-blue-400 hover:text-blue-300">
                Validate provider config
              </Link>
            }
          />
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Seeded evidence
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                The local artifacts that prove the bootstrap has already been replayed on this machine.
              </p>
            </div>
            <Link href="/admin/commands" className="text-xs text-blue-400 hover:text-blue-300">
              View replay commands
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-base font-semibold text-white">Operator recipients</h3>
              <p className="mt-1 text-sm text-gray-400">
                These three contacts were seeded into the Novu operator baseline and are already tracked
                locally.
              </p>
              <div className="mt-4 space-y-2">
                {snapshot.operatorNotifications.map((item) => (
                  <div key={`${item.role}:${item.email}`} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{item.email}</div>
                        <div className="text-xs text-gray-500">{item.role}</div>
                      </div>
                      <span className="rounded border border-emerald-800/40 bg-emerald-900/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                        seeded
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500">{item.notifiedAt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-base font-semibold text-white">n8n backup snapshot</h3>
              <p className="mt-1 text-sm text-gray-400">
                Latest reconcile bundle stored on disk for the local Phase 2 workflow state.
              </p>
              <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm text-gray-300">
                <div className="text-xs uppercase tracking-wider text-gray-600">Path</div>
                <div className="mt-1 break-all font-mono text-xs text-cyan-400">{snapshot.n8nBackup.path}</div>
                <div className="mt-3 text-xs uppercase tracking-wider text-gray-600">Evidence</div>
                <div className="mt-1 text-sm text-gray-300">{snapshot.n8nBackup.evidence}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {snapshot.n8nBackup.meta.map((item) => (
                    <span key={item} className="rounded-full border border-gray-800 bg-gray-900 px-2.5 py-1 text-[11px] text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
              <h3 className="text-base font-semibold text-white">Documenso certificate</h3>
              <p className="mt-1 text-sm text-gray-400">
                Local signing support is already seeded and ready for operator testing.
              </p>
              <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-3 text-sm text-gray-300">
                <div className="text-xs uppercase tracking-wider text-gray-600">Path</div>
                <div className="mt-1 break-all font-mono text-xs text-cyan-400">
                  {snapshot.documensoCertificate.path}
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider text-gray-600">Evidence</div>
                <div className="mt-1 text-sm text-gray-300">{snapshot.documensoCertificate.evidence}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {snapshot.documensoCertificate.meta.map((item) => (
                    <span key={item} className="rounded-full border border-gray-800 bg-gray-900 px-2.5 py-1 text-[11px] text-gray-400">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              What still stays manual
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              These are not failures in the local bootstrap. They are the boundaries that should be
              handled when you choose a real provider or a production deployment target.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {manualBlockers.map((item) => (
              <ProgressCard
                key={item.title}
                title={item.title}
                status={item.status}
                evidence={item.evidence}
                meta={item.meta}
                action={item.action}
              />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Open the operator surfaces
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Jump directly to the surface that matches the work you are doing next.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { href: "/admin/credentials", label: "Credentials", desc: "Logins and secrets" },
              { href: "/admin/stack", label: "Stack", desc: "Catalog and live health" },
              { href: "/admin/deploy", label: "Deploy", desc: "Launcher and recovery flow" },
              { href: "/admin/commands", label: "Commands", desc: "Copyable scripts" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-gray-800 bg-gray-950 p-4 transition-colors hover:border-gray-600 hover:bg-gray-800"
              >
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="mt-1 text-xs text-gray-500">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
