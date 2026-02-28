"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { ServiceManifest } from "@/types/stack";
import { useRouter } from "next/navigation";

const PAGES = [
  { label: "Dashboard",     href: "/admin",          icon: "⌂", desc: "Command center" },
  { label: "Stack",         href: "/admin/stack",    icon: "◫", desc: "All 59 services" },
  { label: "Deploy Wizard", href: "/admin/deploy",   icon: "▲", desc: "Step-by-step launch" },
  { label: "Commands",      href: "/admin/commands", icon: ">", desc: "Copy-paste scripts" },
  { label: "Help & FAQ",    href: "/admin/help",     icon: "?", desc: "Beginner guide" },
];

const CMDS = [
  { label: "Generate secrets",         cmd: "bash scripts/generate-secrets.sh" },
  { label: "Launch: Infrastructure",   cmd: "bash setup.sh infrastructure" },
  { label: "Launch: Phase 1A",         cmd: "bash setup.sh 1a" },
  { label: "Launch: Phase 1B",         cmd: "bash setup.sh 1b" },
  { label: "Check running containers", cmd: "docker compose ps" },
  { label: "View all logs",            cmd: "docker compose logs --tail=50" },
  { label: "Stop all services",        cmd: "docker compose down" },
  { label: "Run backup",               cmd: "bash scripts/backup.sh" },
];

interface Props { services: ServiceManifest[]; }

type Item =
  | { type: "page";    label: string; href: string; desc?: string; icon: string }
  | { type: "cmd";     label: string; cmd: string }
  | { type: "service"; label: string; href: string; svc: ServiceManifest };

export function CommandPalette({ services }: Props) {
  const router = useRouter();
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  // Open/close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setCopied(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const { pages, cmds, svcs } = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return {
      pages: PAGES,
      cmds:  CMDS.slice(0, 4),
      svcs:  services.slice(0, 6),
    };
    return {
      pages: PAGES.filter((p) => p.label.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q)),
      cmds:  CMDS.filter((c)  => c.label.toLowerCase().includes(q) || c.cmd.includes(q)),
      svcs:  services.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.role?.toLowerCase().includes(q) ||
        s.domain.includes(q) ||
        s.id.includes(q)
      ).slice(0, 8),
    };
  }, [query, services]);

  const items: Item[] = useMemo(() => [
    ...pages.map((p) => ({ type: "page" as const, ...p })),
    ...cmds.map((c) => ({ type: "cmd" as const, ...c })),
    ...svcs.map((s) => ({ type: "service" as const, label: s.name, href: s.repository, svc: s })),
  ], [pages, cmds, svcs]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((i) => Math.min(i + 1, items.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && items[selected]) {
        e.preventDefault();
        handleSelect(items[selected]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, items]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selected}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const handleSelect = useCallback((item: Item) => {
    if (item.type === "cmd") {
      navigator.clipboard.writeText(item.cmd).catch(() => {});
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1000);
    } else {
      setOpen(false);
      router.push(item.href);
    }
  }, [router]);

  if (!open) return null;

  let idx = 0;

  const Row = ({ item, i, children }: { item: Item; i: number; children: React.ReactNode }) => (
    <div
      data-idx={i}
      onClick={() => handleSelect(item)}
      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
        selected === i ? "bg-blue-900/40" : "hover:bg-gray-800/60"
      }`}
    >
      {children}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800">
          <span className="text-gray-500 text-sm flex-shrink-0">⌘</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search services, run commands, navigate…"
            className="flex-1 bg-transparent text-gray-100 text-sm placeholder-gray-600 focus:outline-none"
          />
          {copied
            ? <span className="text-xs text-green-400 flex-shrink-0">✓ Copied</span>
            : <kbd className="text-xs text-gray-700 border border-gray-800 rounded px-1.5 py-0.5 flex-shrink-0">Esc</kbd>
          }
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[min(420px,60vh)] overflow-y-auto py-1.5">
          {pages.length > 0 && (
            <section>
              <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Navigate</div>
              {pages.map((p) => {
                const i = idx++;
                return (
                  <Row key={p.href} item={{ type: "page", ...p }} i={i}>
                    <span className="text-gray-500 w-5 text-center text-base flex-shrink-0">{p.icon}</span>
                    <span className="text-sm text-gray-200 flex-1">{p.label}</span>
                    {p.desc && <span className="text-xs text-gray-600">{p.desc}</span>}
                  </Row>
                );
              })}
            </section>
          )}

          {cmds.length > 0 && (
            <section>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Copy Command</div>
              {cmds.map((c) => {
                const i = idx++;
                return (
                  <Row key={c.cmd} item={{ type: "cmd", ...c }} i={i}>
                    <span className="text-gray-600 w-5 text-center font-mono text-xs flex-shrink-0">$</span>
                    <span className="flex-1 min-w-0">
                      <span className="text-xs text-gray-500 block">{c.label}</span>
                      <code className="text-xs text-cyan-400 font-mono">{c.cmd}</code>
                    </span>
                    <span className="text-xs text-gray-700 flex-shrink-0">↵ copy</span>
                  </Row>
                );
              })}
            </section>
          )}

          {svcs.length > 0 && (
            <section>
              <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Services</div>
              {svcs.map((s) => {
                const i = idx++;
                return (
                  <Row key={s.id} item={{ type: "service", label: s.name, href: s.repository, svc: s }} i={i}>
                    <span className="text-gray-600 w-5 text-center font-mono text-xs flex-shrink-0">{s.phase}</span>
                    <span className="flex-1 min-w-0">
                      <span className="text-sm text-gray-200">{s.name}</span>
                      {s.role && <span className="text-xs text-gray-600 ml-2">{s.role}</span>}
                    </span>
                    <span className={`text-xs font-semibold flex-shrink-0 ${s.verdict === "ESSENTIAL" ? "text-green-400" : "text-amber-400"}`}>
                      {s.verdict === "ESSENTIAL" ? "E" : "R"}
                    </span>
                  </Row>
                );
              })}
            </section>
          )}

          {items.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-gray-600">
              No results for <span className="text-gray-400">"{query}"</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-800 flex items-center gap-4 text-xs text-gray-700">
          <span><kbd className="border border-gray-800 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-gray-800 rounded px-1">↵</kbd> select</span>
          <span><kbd className="border border-gray-800 rounded px-1">Esc</kbd> close</span>
          <span className="ml-auto">Ctrl+K to reopen</span>
        </div>
      </div>
    </div>
  );
}
