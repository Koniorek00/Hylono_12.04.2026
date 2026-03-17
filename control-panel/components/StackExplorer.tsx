"use client";

import { useMemo, useState } from "react";
import type { AccessMode, IntegrationFlow, ServiceStatus, ServiceWithStatus } from "@/types/stack";

const PHASE_ORDER = ["infrastructure", "1a", "1b", "1c", "2"] as const;

const PHASE_LABEL: Record<string, string> = {
  infrastructure: "Infrastructure",
  "1a": "Phase 1A",
  "1b": "Phase 1B",
  "1c": "Phase 1C",
  "2": "Phase 2",
};

const PHASE_COLOR: Record<string, string> = {
  infrastructure: "bg-violet-900/40 text-violet-300 border-violet-800/40",
  "1a": "bg-blue-900/40 text-blue-300 border-blue-800/40",
  "1b": "bg-cyan-900/40 text-cyan-300 border-cyan-800/40",
  "1c": "bg-teal-900/40 text-teal-300 border-teal-800/40",
  "2": "bg-indigo-900/40 text-indigo-300 border-indigo-800/40",
};

const VERDICT_COLOR: Record<string, string> = {
  ESSENTIAL: "bg-green-900/50 text-green-300 border-green-800/40",
  RECOMMENDED: "bg-amber-900/40 text-amber-300 border-amber-800/40",
};

const RISK_COLOR: Record<string, string> = {
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
};

const DOMAIN_COLOR: Record<string, string> = {
  infrastructure: "text-violet-400",
  commerce: "text-emerald-400",
  fleet: "text-sky-400",
  iot: "text-cyan-400",
  crm: "text-orange-400",
  ai: "text-pink-400",
  marketing: "text-rose-400",
  education: "text-lime-400",
  health: "text-teal-400",
  security: "text-red-400",
  platform: "text-blue-400",
  bi: "text-yellow-400",
  internal: "text-gray-400",
};

const STATUS_META: Record<
  ServiceStatus,
  {
    label: string;
    dot: string;
    badge: string;
    text: string;
  }
> = {
  running: {
    label: "Running",
    dot: "bg-green-400",
    badge: "bg-green-900/40 text-green-300 border-green-800/40",
    text: "text-green-300",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-rose-400",
    badge: "bg-rose-900/40 text-rose-300 border-rose-800/40",
    text: "text-rose-300",
  },
  error: {
    label: "Error",
    dot: "bg-orange-400",
    badge: "bg-orange-900/40 text-orange-300 border-orange-800/40",
    text: "text-orange-300",
  },
  "not-deployed": {
    label: "Not deployed",
    dot: "bg-slate-400",
    badge: "bg-slate-800/80 text-slate-300 border-slate-700",
    text: "text-slate-300",
  },
  unknown: {
    label: "Unknown",
    dot: "bg-gray-500",
    badge: "bg-gray-800 text-gray-300 border-gray-700",
    text: "text-gray-300",
  },
};

const ACCESS_META: Record<
  AccessMode,
  {
    label: string;
    badge: string;
    short: string;
  }
> = {
  "web-ui": {
    label: "Web UI",
    badge: "bg-sky-900/40 text-sky-300 border-sky-800/40",
    short: "UI",
  },
  api: {
    label: "API",
    badge: "bg-cyan-900/40 text-cyan-300 border-cyan-800/40",
    short: "API",
  },
  hybrid: {
    label: "UI + API",
    badge: "bg-blue-900/40 text-blue-300 border-blue-800/40",
    short: "UI+API",
  },
  native: {
    label: "Native port",
    badge: "bg-zinc-800 text-zinc-300 border-zinc-700",
    short: "TCP",
  },
  embedded: {
    label: "Embedded",
    badge: "bg-slate-800 text-slate-300 border-slate-700",
    short: "EMB",
  },
  unknown: {
    label: "Access unknown",
    badge: "bg-gray-800 text-gray-300 border-gray-700",
    short: "?",
  },
};

interface Props {
  services: ServiceWithStatus[];
  integrations: IntegrationFlow[];
}

function getAccessMode(service: ServiceWithStatus): AccessMode {
  if (service.accessMode) {
    return service.accessMode;
  }

  if (service.uiUrl && service.url && service.uiUrl !== service.url) {
    return "hybrid";
  }

  if (service.uiUrl) {
    return "web-ui";
  }

  if (service.embedded) {
    return "embedded";
  }

  return "unknown";
}

function renderProbeTarget(url?: string) {
  if (!url) {
    return <span className="text-xs text-gray-500">No probe target configured.</span>;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors font-mono"
      >
        Probe: {url} ↗
      </a>
    );
  }

  return (
    <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 font-mono">
      Probe: {url}
    </span>
  );
}

function ServiceDetailPanel({
  service,
  integrations,
  onClose,
}: {
  service: ServiceWithStatus;
  integrations: IntegrationFlow[];
  onClose: () => void;
}) {
  const flowsFrom = integrations.filter((f) => f.source === service.id);
  const flowsTo = integrations.filter((f) => f.target === service.id);
  const statusMeta = STATUS_META[service.status];
  const accessMode = getAccessMode(service);
  const accessMeta = ACCESS_META[accessMode];
  const probeUrl = service.url;
  const showProbeUrl = probeUrl && probeUrl !== service.uiUrl;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
        <div className="min-w-0 flex-1 pr-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                PHASE_COLOR[service.phase] ?? "bg-gray-800 text-gray-300 border-gray-700"
              }`}
            >
              {PHASE_LABEL[service.phase] ?? service.phase}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                VERDICT_COLOR[service.verdict] ?? "bg-gray-800 text-gray-300 border-gray-700"
              }`}
            >
              {service.verdict}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusMeta.badge}`}
            >
              {statusMeta.label}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${accessMeta.badge}`}
            >
              {accessMeta.label}
            </span>
            {service.buildFromSource && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-orange-900/40 text-orange-300 border-orange-800/40">
                BUILD
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white truncate">{service.name}</h2>
          <p className="text-xs text-gray-500 font-mono mt-0.5">{service.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-200 transition-colors text-lg leading-none flex-shrink-0 p-1 -mr-1"
          aria-label="Close detail panel"
        >
          X
        </button>
      </div>

      <div className="px-5 py-4 space-y-5">
        {service.role && (
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm text-gray-300">{service.role}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Runtime Status
            </p>
            <p className={`text-sm font-semibold ${statusMeta.text}`}>{statusMeta.label}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Access Type
            </p>
            <p className="text-sm font-semibold text-gray-200">{accessMeta.label}</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Domain</p>
            <p className={`text-sm font-semibold capitalize ${DOMAIN_COLOR[service.domain] ?? "text-gray-300"}`}>
              {service.domain}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Risk Level</p>
            <p className={`text-sm font-semibold ${RISK_COLOR[service.riskLevel ?? "LOW"]}`}>
              {service.riskLevel ?? "LOW"}
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Probe Time</p>
            <p className="text-sm font-mono text-gray-200">
              {typeof service.responseTimeMs === "number" ? `${service.responseTimeMs} ms` : "n/a"}
            </p>
          </div>
          {typeof service.httpStatus === "number" && (
            <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">HTTP Status</p>
              <p className="text-sm font-mono text-gray-200">{service.httpStatus}</p>
            </div>
          )}
          {service.defaultPort && (
            <div className="bg-gray-800/60 rounded-lg px-3 py-2.5">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Default Port</p>
              <p className="text-sm font-mono text-gray-200">:{service.defaultPort}</p>
            </div>
          )}
          {service.dockerImage && (
            <div className="bg-gray-800/60 rounded-lg px-3 py-2.5 col-span-2">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Docker Image</p>
              <p className="text-xs font-mono text-gray-300 break-all">{service.dockerImage}</p>
            </div>
          )}
        </div>

        {service.healthError && (
          <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wide mb-1">Health Error</p>
            <p className="text-xs text-rose-200/80">{service.healthError}</p>
          </div>
        )}

        {service.riskNotes && (
          <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-yellow-600 uppercase tracking-wide mb-1">Risk Notes</p>
            <p className="text-xs text-yellow-200/80">{service.riskNotes}</p>
          </div>
        )}

        {service.notes && (
          <div className="bg-gray-800/40 border border-gray-700/40 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Notes</p>
            <p className="text-xs text-gray-400">{service.notes}</p>
          </div>
        )}

        {service.accessNotes && (
          <div className="bg-sky-950/20 border border-sky-900/30 rounded-lg px-3 py-2.5">
            <p className="text-[10px] font-semibold text-sky-500 uppercase tracking-wide mb-1">Access Notes</p>
            <p className="text-xs text-sky-100/80">{service.accessNotes}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {service.repository && (
            <a
              href={service.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {service.docsUrl && (
            <a
              href={service.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors"
            >
              Docs ↗
            </a>
          )}
          {service.uiUrl && (
            <a
              href={service.uiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/40 hover:border-blue-700 text-blue-300 hover:text-blue-200 transition-colors font-mono"
            >
              Open UI ↗
            </a>
          )}
          {showProbeUrl ? renderProbeTarget(probeUrl) : null}
          {!service.uiUrl && accessMode === "native" && service.defaultPort && (
            <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 font-mono">
              localhost:{service.defaultPort}
            </span>
          )}
        </div>

        {flowsFrom.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Sends data to ({flowsFrom.length})
            </p>
            <div className="space-y-1.5">
              {flowsFrom.map((f, i) => (
                <div key={i} className="bg-gray-800/60 rounded-lg px-3 py-2 flex items-start gap-2">
                  <span className="text-blue-400 text-xs font-mono mt-0.5 flex-shrink-0">-&gt; {f.target}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300 truncate">{f.data}</p>
                    <p className="text-[10px] text-gray-600">via {f.via}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {flowsTo.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Receives data from ({flowsTo.length})
            </p>
            <div className="space-y-1.5">
              {flowsTo.map((f, i) => (
                <div key={i} className="bg-gray-800/60 rounded-lg px-3 py-2 flex items-start gap-2">
                  <span className="text-purple-400 text-xs font-mono mt-0.5 flex-shrink-0">&lt;- {f.source}</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300 truncate">{f.data}</p>
                    <p className="text-[10px] text-gray-600">via {f.via}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {flowsFrom.length === 0 && flowsTo.length === 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide mb-1">Integrations</p>
            <p className="text-xs text-gray-700">No integration flows defined.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function StackExplorer({ services, integrations }: Props) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return services.filter((s) => {
      if (phaseFilter !== "all" && s.phase !== phaseFilter) return false;
      if (verdictFilter !== "all" && s.verdict !== verdictFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.role ?? "").toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        STATUS_META[s.status].label.toLowerCase().includes(q)
      );
    });
  }, [services, query, phaseFilter, verdictFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, ServiceWithStatus[]> = {};
    for (const phase of PHASE_ORDER) {
      const items = filtered.filter((s) => s.phase === phase);
      if (items.length > 0) map[phase] = items;
    }
    return map;
  }, [filtered]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedId) ?? null,
    [services, selectedId]
  );

  const totalCount = services.length;
  const filteredCount = filtered.length;

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px] bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
      <div
        className={`flex flex-col border-r border-gray-800 bg-gray-900/50 transition-all duration-200 ${
          selectedService ? "w-72 flex-shrink-0" : "flex-1"
        }`}
      >
        <div className="p-3 border-b border-gray-800 space-y-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none">
              O
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-8 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:bg-gray-800 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 text-xs"
              >
                X
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-400 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All phases</option>
              {PHASE_ORDER.map((p) => (
                <option key={p} value={p}>
                  {PHASE_LABEL[p]}
                </option>
              ))}
            </select>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-400 focus:outline-none focus:border-blue-600"
            >
              <option value="all">All types</option>
              <option value="ESSENTIAL">Essential</option>
              <option value="RECOMMENDED">Recommended</option>
            </select>
          </div>
          <p className="text-[10px] text-gray-700 px-0.5">
            {filteredCount === totalCount
              ? `${totalCount} services`
              : `${filteredCount} of ${totalCount} services`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <p className="text-sm text-gray-500">No services match</p>
              <button
                onClick={() => {
                  setQuery("");
                  setPhaseFilter("all");
                  setVerdictFilter("all");
                }}
                className="mt-3 text-xs text-blue-500 hover:text-blue-400"
              >
                Clear filters
              </button>
            </div>
          ) : (
            Object.entries(grouped).map(([phase, items]) => (
              <div key={phase}>
                <div
                  className={`sticky top-0 z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border-b border-t border-gray-800 ${
                    PHASE_COLOR[phase] ?? "text-gray-500"
                  } bg-gray-900`}
                >
                  {PHASE_LABEL[phase]} · {items.length}
                </div>

                {items.map((svc) => {
                  const isSelected = selectedId === svc.id;
                  const hasFlows =
                    integrations.some((f) => f.source === svc.id || f.target === svc.id);
                  const statusMeta = STATUS_META[svc.status];
                  const accessMeta = ACCESS_META[getAccessMode(svc)];

                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedId(isSelected ? null : svc.id)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 group border-b border-gray-800/60 transition-colors ${
                        isSelected
                          ? "bg-blue-900/30 border-l-2 border-l-blue-500"
                          : "hover:bg-gray-800/50 border-l-2 border-l-transparent"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusMeta.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p
                            className={`text-xs font-medium truncate ${
                              isSelected ? "text-white" : "text-gray-300 group-hover:text-white"
                            }`}
                          >
                            {svc.name}
                          </p>
                          <span
                            className={`text-[9px] font-semibold uppercase tracking-wide ${statusMeta.text}`}
                          >
                            {statusMeta.label}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-500">
                            {accessMeta.short}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-600 truncate font-mono">{svc.id}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            svc.verdict === "ESSENTIAL" ? "bg-green-400" : "bg-amber-400"
                          }`}
                          title={svc.verdict}
                        />
                        {svc.buildFromSource && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-orange-900/50 text-orange-400 border border-orange-800/40">
                            BUILD
                          </span>
                        )}
                        {hasFlows && (
                          <span className="text-[9px] text-gray-600" title="Has integration flows">
                            &lt;&gt;
                          </span>
                        )}
                        {(svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM") && (
                          <span
                            className={`text-[9px] ${RISK_COLOR[svc.riskLevel]}`}
                            title={`Risk: ${svc.riskLevel}`}
                          >
                            !
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-3 py-2 border-t border-gray-800 flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Running
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> Stopped
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" /> Error
          </span>
          <span className="flex items-center gap-1 text-[10px] text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" /> Unchecked
          </span>
          <span className="text-[10px] text-gray-700">BUILD build-from-source</span>
          <span className="text-[10px] text-gray-700">&lt;&gt; integrates</span>
          <span className="text-[10px] text-gray-700">! risk</span>
        </div>
      </div>

      {selectedService ? (
        <div className="flex-1 bg-gray-900 min-w-0 overflow-hidden">
          <ServiceDetailPanel
            service={selectedService}
            integrations={integrations}
            onClose={() => setSelectedId(null)}
          />
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center px-8 bg-gray-900/30">
          <div className="text-4xl mb-3 opacity-20">[]</div>
          <p className="text-sm text-gray-600 max-w-xs">
            Select a service from the list to see its live runtime status, links, and integration
            flows.
          </p>
        </div>
      )}
    </div>
  );
}
