"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { ServiceManifest, Domain } from "@/types/stack";

const DOMAIN_COLORS: Record<Domain, string> = {
  commerce:       "bg-emerald-500",
  fleet:          "bg-amber-500",
  iot:            "bg-blue-500",
  crm:            "bg-purple-500",
  ai:             "bg-pink-500",
  marketing:      "bg-orange-500",
  education:      "bg-cyan-500",
  health:         "bg-red-500",
  security:       "bg-indigo-500",
  platform:       "bg-teal-500",
  bi:             "bg-violet-500",
  internal:       "bg-gray-500",
  infrastructure: "bg-gray-400",
};

const DOMAIN_DESC: Partial<Record<Domain, string>> = {
  commerce: "E-commerce, billing, payments",
  fleet: "Equipment tracking, lending, scheduling",
  iot: "Device telemetry, MQTT, dashboards",
  crm: "Customer relationships, notifications, signatures",
  ai: "Search, RAG, recommendations",
  marketing: "Email, surveys, communities",
  education: "LMS, training, documentation",
  health: "Telehealth, wearables, medical records",
  security: "IAM, monitoring, compliance",
  platform: "Automation, orchestration, API gateway",
  bi: "Analytics, dashboards",
  internal: "Internal tools, wikis",
  infrastructure: "Core services: DB, cache, storage",
};

const PHASE_LABELS: Record<string, string> = {
  infrastructure: "Infrastructure",
  "1a": "Phase 1A — Commerce, Fleet, CRM, IAM",
  "1b": "Phase 1B — IoT, AI, Education, Health",
  "1c": "Phase 1C — Marketing, Platform, Security",
  "2":  "Phase 2 — Recommended Additions",
};

const PHASE_ORDER = ["infrastructure", "1a", "1b", "1c", "2"];

const ALL_DOMAINS: Domain[] = [
  "infrastructure","commerce","fleet","iot","crm","ai",
  "marketing","education","health","security","platform","bi","internal"
];

const SELECT_CLS = "bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-blue-500";

// ── Card view ────────────────────────────────────────────────────────────────

function ServiceCard({ svc }: { svc: ServiceManifest }) {
  const [expanded, setExpanded] = useState(false);
  const domainColor = DOMAIN_COLORS[svc.domain] ?? "bg-gray-500";
  const isHighRisk = svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM";

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-lg flex flex-col hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex flex-col gap-2.5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-100 text-sm truncate">{svc.name}</h3>
              {isHighRisk && (
                <span title={svc.riskNotes ?? `Risk: ${svc.riskLevel}`} className="text-yellow-400 text-xs flex-shrink-0">⚠</span>
              )}
            </div>
            {svc.role && <p className="text-xs text-gray-500 mt-0.5 truncate">{svc.role}</p>}
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
            svc.verdict === "ESSENTIAL"
              ? "bg-green-900 text-green-300 border border-green-700"
              : "bg-amber-900 text-amber-300 border border-amber-700"
          }`}>
            {svc.verdict === "ESSENTIAL" ? "E" : "R"}
          </span>
        </div>

        {/* Domain + port + build tag */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`${domainColor} text-white text-xs font-medium px-1.5 py-0.5 rounded`}>{svc.domain}</span>
          {svc.defaultPort && <span className="text-xs text-gray-600 font-mono">:{svc.defaultPort}</span>}
          {svc.buildFromSource && (
            <span className="text-xs text-orange-400 border border-orange-800 rounded px-1 py-0.5">src</span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-1 border-t border-gray-800">
          <a href={svc.repository} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            GitHub ↗
          </a>
          {svc.docsUrl && (
            <a href={svc.docsUrl} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Docs ↗
            </a>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-800 bg-gray-900/50 space-y-1.5">
          {svc.dockerImage && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">image</span>
              <code className="text-xs text-cyan-400 font-mono break-all">{svc.dockerImage}</code>
            </div>
          )}
          {svc.buildFromSource && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">build</span>
              <span className="text-xs text-orange-400">Must build from source — no official image</span>
            </div>
          )}
          {svc.riskNotes && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">risk</span>
              <span className="text-xs text-yellow-400">{svc.riskNotes}</span>
            </div>
          )}
          {svc.notes && (
            <div className="flex items-start gap-2">
              <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">notes</span>
              <span className="text-xs text-gray-400">{svc.notes}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">domain</span>
            <span className="text-xs text-gray-400">{DOMAIN_DESC[svc.domain] ?? svc.domain}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-16 flex-shrink-0 pt-0.5">id</span>
            <code className="text-xs text-gray-600 font-mono">{svc.id}</code>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Compact row view ─────────────────────────────────────────────────────────

function ServiceRow({ svc }: { svc: ServiceManifest }) {
  const [expanded, setExpanded] = useState(false);
  const dotColor = DOMAIN_COLORS[svc.domain] ?? "bg-gray-500";
  const isHighRisk = svc.riskLevel === "HIGH" || svc.riskLevel === "MEDIUM";

  return (
    <>
      <tr
        className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors text-xs"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-3 py-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            <span className="font-medium text-gray-100">{svc.name}</span>
            {isHighRisk && <span className="text-yellow-400" title={svc.riskNotes ?? "Elevated risk"}>⚠</span>}
          </div>
        </td>
        <td className="px-3 py-2 text-gray-500 hidden sm:table-cell truncate max-w-48">{svc.role ?? "—"}</td>
        <td className="px-3 py-2">
          <span className={svc.verdict === "ESSENTIAL" ? "text-green-400 font-semibold" : "text-amber-400"}>
            {svc.verdict === "ESSENTIAL" ? "✓" : "○"}
          </span>
        </td>
        <td className="px-3 py-2 text-gray-600 font-mono hidden md:table-cell">{svc.defaultPort ? `:${svc.defaultPort}` : ""}</td>
        <td className="px-3 py-2 hidden lg:table-cell">
          {svc.buildFromSource && <span className="text-orange-400">src</span>}
        </td>
        <td className="px-3 py-2">
          <a href={svc.repository} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-400 hover:text-blue-300">GH ↗</a>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-800 bg-gray-900/60">
          <td colSpan={6} className="px-4 py-2.5">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
              {svc.dockerImage && (
                <span><span className="text-gray-600">image:</span> <code className="text-cyan-400 font-mono">{svc.dockerImage}</code></span>
              )}
              {svc.riskNotes && (
                <span><span className="text-gray-600">risk:</span> <span className="text-yellow-400">{svc.riskNotes}</span></span>
              )}
              {svc.notes && (
                <span><span className="text-gray-600">note:</span> <span className="text-gray-400">{svc.notes}</span></span>
              )}
              <span><span className="text-gray-600">id:</span> <code className="text-gray-600 font-mono">{svc.id}</code></span>
              {svc.docsUrl && (
                <a href={svc.docsUrl} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-500 hover:text-gray-300">Docs ↗</a>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main grid ─────────────────────────────────────────────────────────────────

export function ServiceGrid({ services }: { services: ServiceManifest[] }) {
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState<Domain | "all">("all");
  const [filterPhase, setFilterPhase] = useState<string>("all");
  const [filterVerdict, setFilterVerdict] = useState<"all" | "ESSENTIAL" | "RECOMMENDED">("all");
  const [compact, setCompact] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setFilterDomain("all");
    setFilterPhase("all");
    setFilterVerdict("all");
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.role?.toLowerCase().includes(q) || s.domain.includes(q);
      const matchDomain = filterDomain === "all" || s.domain === filterDomain;
      const matchPhase = filterPhase === "all" || s.phase === filterPhase;
      const matchVerdict = filterVerdict === "all" || s.verdict === filterVerdict;
      return matchSearch && matchDomain && matchPhase && matchVerdict;
    });
  }, [services, search, filterDomain, filterPhase, filterVerdict]);

  const byPhase = useMemo(() => {
    const map: Record<string, ServiceManifest[]> = {};
    for (const p of PHASE_ORDER) map[p] = filtered.filter((s) => s.phase === p);
    return map;
  }, [filtered]);

  const activeFilters = (search ? 1 : 0) + (filterDomain !== "all" ? 1 : 0) + (filterPhase !== "all" ? 1 : 0) + (filterVerdict !== "all" ? 1 : 0);

  return (
    <div className="mb-6">
      {/* Filter bar — single tight row, no labels */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-5">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="flex-1 min-w-40 relative">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search  /"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-xs">✕</button>
            )}
          </div>

          <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className={SELECT_CLS}>
            <option value="all">All phases</option>
            {PHASE_ORDER.map((p) => (
              <option key={p} value={p}>{p === "infrastructure" ? "Infrastructure" : `Phase ${p.toUpperCase()}`}</option>
            ))}
          </select>

          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value as Domain | "all")} className={SELECT_CLS}>
            <option value="all">All domains</option>
            {ALL_DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select value={filterVerdict} onChange={(e) => setFilterVerdict(e.target.value as typeof filterVerdict)} className={SELECT_CLS}>
            <option value="all">All</option>
            <option value="ESSENTIAL">Essential</option>
            <option value="RECOMMENDED">Recommended</option>
          </select>

          {activeFilters > 0 && (
            <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 rounded-lg px-3 py-2 transition-colors">
              ✕ {activeFilters}
            </button>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 gap-0.5 ml-auto">
            <button onClick={() => setCompact(false)} title="Card view"
              className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${!compact ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              ⊞
            </button>
            <button onClick={() => setCompact(true)} title="Table view"
              className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${compact ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              ☰
            </button>
          </div>
        </div>

        {/* Status row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs text-gray-600">
            {filtered.length !== services.length
              ? <><span className="text-blue-400 font-medium">{filtered.length}</span> of {services.length}</>
              : <>{services.length} services</>
            }
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-700">↓</span>
            {PHASE_ORDER.map((p) => {
              const count = byPhase[p]?.length ?? 0;
              if (count === 0) return null;
              return (
                <Link key={p} href={`#phase-${p}`}
                  className="text-xs text-gray-600 hover:text-blue-400 transition-colors font-mono">
                  {p === "infrastructure" ? "infra" : p}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      {compact ? (
        <div className="rounded-xl border border-gray-800 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-600 uppercase text-xs tracking-wide border-b border-gray-800">
              <tr>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2 hidden sm:table-cell">Role</th>
                <th className="px-3 py-2" title="✓ = Essential  ○ = Recommended">E</th>
                <th className="px-3 py-2 hidden md:table-cell">Port</th>
                <th className="px-3 py-2 hidden lg:table-cell">Src</th>
                <th className="px-3 py-2">Repo</th>
              </tr>
            </thead>
            {PHASE_ORDER.map((phase) => {
              const svcs = byPhase[phase];
              if (!svcs || svcs.length === 0) return null;
              return (
                <tbody key={phase} id={`phase-${phase}`}>
                  <tr className="bg-gray-950">
                    <td colSpan={6} className="px-3 py-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                        {PHASE_LABELS[phase]} <span className="text-gray-700 font-normal">({svcs.length})</span>
                      </span>
                    </td>
                  </tr>
                  {svcs.map((svc) => <ServiceRow key={svc.id} svc={svc} />)}
                </tbody>
              );
            })}
          </table>
        </div>
      ) : (
        <>
          {PHASE_ORDER.map((phase) => {
            const svcs = byPhase[phase];
            if (!svcs || svcs.length === 0) return null;
            return (
              <section key={phase} id={`phase-${phase}`} className="mb-8 scroll-mt-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-gray-800 flex items-center gap-2">
                  {PHASE_LABELS[phase]}
                  <span className="font-normal text-gray-600">({svcs.length})</span>
                  <Link href={`#phase-${phase}`} className="ml-auto text-xs text-gray-700 hover:text-gray-500 font-mono transition-colors">#{phase}</Link>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {svcs.map((svc) => <ServiceCard key={svc.id} svc={svc} />)}
                </div>
              </section>
            );
          })}
        </>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <div className="text-3xl mb-3">🔍</div>
          <div className="text-sm">No services match.</div>
          <button onClick={clearAll} className="mt-3 text-xs text-blue-400 hover:text-blue-300">Clear filters</button>
        </div>
      )}
    </div>
  );
}