"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceManifest } from "@/types/stack";

const PAGES = [
  { label: "Dashboard", href: "/admin", icon: "D", desc: "Command center" },
  { label: "Progress", href: "/admin/progress", icon: "P", desc: "Bootstrap and state" },
  { label: "Blueprints", href: "/admin/blueprints", icon: "B", desc: "Source-backed flow pack" },
  { label: "Staging", href: "/admin/staging", icon: "T", desc: "Staging handoff" },
  { label: "Stack", href: "/admin/stack", icon: "S", desc: "All 59 services" },
  { label: "Credentials", href: "/admin/credentials", icon: "K", desc: "First login and secrets" },
  { label: "Quick Start", href: "/admin/quickstart", icon: "1", desc: "Launcher-first local flow" },
  { label: "Deploy Wizard", href: "/admin/deploy", icon: "W", desc: "Step-by-step launch" },
  { label: "Commands", href: "/admin/commands", icon: "C", desc: "Copy scripts" },
  { label: "Help", href: "/admin/help", icon: "?", desc: "Troubleshooting guide" },
] as const;

const COMMANDS = [
  { label: "Start local launcher", cmd: ".\\start-dev.bat" },
  { label: "Validate staging env", cmd: ".\\scripts\\validate-staging-env.ps1 -Path .\\.env.staging" },
  { label: "Generate secrets", cmd: ".\\scripts\\generate-secrets.ps1" },
  { label: "Launch infrastructure", cmd: ".\\scripts\\setup.ps1 infrastructure" },
  { label: "Launch Phase 1A", cmd: ".\\scripts\\setup.ps1 1a" },
  {
    label: "Check infrastructure containers",
    cmd: "docker compose -f docker/infrastructure/docker-compose.yml ps",
  },
  {
    label: "Check Phase 1A containers",
    cmd: "docker compose -f docker/phase-1a/docker-compose.yml ps",
  },
  {
    label: "View infrastructure logs",
    cmd: "docker compose -f docker/infrastructure/docker-compose.yml logs --tail=50",
  },
  { label: "Deep smoke check", cmd: ".\\scripts\\smoke-local-stack.ps1 -Deep" },
  { label: "Run backup", cmd: "bash scripts/backup.sh" },
] as const;

type Props = {
  services: ServiceManifest[];
};

type Item =
  | { type: "page"; label: string; href: string; desc?: string; icon: string }
  | { type: "cmd"; label: string; cmd: string }
  | { type: "service"; label: string; href: string; svc: ServiceManifest };

export function CommandPalette({ services }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setSelected(0);
    setCopied(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const { pages, commands, matchedServices } = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    if (!normalized) {
      return {
        pages: PAGES,
        commands: COMMANDS.slice(0, 5),
        matchedServices: services.slice(0, 6),
      };
    }

    return {
      pages: PAGES.filter(
        (page) =>
          page.label.toLowerCase().includes(normalized) ||
          page.desc.toLowerCase().includes(normalized)
      ),
      commands: COMMANDS.filter(
        (command) =>
          command.label.toLowerCase().includes(normalized) ||
          command.cmd.toLowerCase().includes(normalized)
      ),
      matchedServices: services
        .filter(
          (service) =>
            service.name.toLowerCase().includes(normalized) ||
            service.role?.toLowerCase().includes(normalized) ||
            service.domain.toLowerCase().includes(normalized) ||
            service.id.toLowerCase().includes(normalized)
        )
        .slice(0, 8),
    };
  }, [query, services]);

  const items: Item[] = useMemo(
    () => [
      ...pages.map((page) => ({ type: "page" as const, ...page })),
      ...commands.map((command) => ({ type: "cmd" as const, ...command })),
      ...matchedServices.map((service) => ({
        type: "service" as const,
        label: service.name,
        href: service.uiUrl ?? "/admin/stack",
        svc: service,
      })),
    ],
    [commands, matchedServices, pages]
  );

  const handleSelect = useCallback(
    (item: Item) => {
      if (item.type === "cmd") {
        navigator.clipboard.writeText(item.cmd).catch(() => {});
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setOpen(false);
        }, 1000);
        return;
      }

      setOpen(false);
      if (item.type === "service" && /^https?:\/\//.test(item.href)) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(item.href);
    },
    [router]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected((value) => Math.min(value + 1, items.length - 1));
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected((value) => Math.max(value - 1, 0));
      }

      if (event.key === "Enter" && items[selected]) {
        event.preventDefault();
        handleSelect(items[selected]);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSelect, items, open, selected]);

  useEffect(() => {
    const element = listRef.current?.querySelector(`[data-idx="${selected}"]`) as
      | HTMLElement
      | null;
    element?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) {
    return null;
  }

  let index = 0;

  const Row = ({
    item,
    rowIndex,
    children,
  }: {
    item: Item;
    rowIndex: number;
    children: React.ReactNode;
  }) => (
    <div
      data-idx={rowIndex}
      onClick={() => handleSelect(item)}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
        selected === rowIndex ? "bg-blue-900/40" : "hover:bg-gray-800/60"
      }`}
    >
      {children}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3.5">
          <span className="flex-shrink-0 text-sm text-gray-500">K</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder="Search services, commands, or pages"
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 focus:outline-none"
          />
          {copied ? (
            <span className="flex-shrink-0 text-xs text-green-400">Copied</span>
          ) : (
            <kbd className="flex-shrink-0 rounded border border-gray-800 px-1.5 py-0.5 text-xs text-gray-700">
              Esc
            </kbd>
          )}
        </div>

        <div ref={listRef} className="max-h-[min(420px,60vh)] overflow-y-auto py-1.5">
          {pages.length > 0 ? (
            <section>
              <div className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Navigate
              </div>
              {pages.map((page) => {
                const rowIndex = index++;
                return (
                  <Row key={page.href} item={{ type: "page", ...page }} rowIndex={rowIndex}>
                    <span className="w-5 flex-shrink-0 text-center text-base text-gray-500">
                      {page.icon}
                    </span>
                    <span className="flex-1 text-sm text-gray-200">{page.label}</span>
                    <span className="text-xs text-gray-600">{page.desc}</span>
                  </Row>
                );
              })}
            </section>
          ) : null}

          {commands.length > 0 ? (
            <section>
              <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Copy Command
              </div>
              {commands.map((command) => {
                const rowIndex = index++;
                return (
                  <Row key={command.cmd} item={{ type: "cmd", ...command }} rowIndex={rowIndex}>
                    <span className="w-5 flex-shrink-0 text-center font-mono text-xs text-gray-600">
                      $
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-gray-500">{command.label}</span>
                      <code className="font-mono text-xs text-cyan-400">{command.cmd}</code>
                    </span>
                    <span className="flex-shrink-0 text-xs text-gray-700">Enter</span>
                  </Row>
                );
              })}
            </section>
          ) : null}

          {matchedServices.length > 0 ? (
            <section>
              <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Services
              </div>
              {matchedServices.map((service) => {
                const rowIndex = index++;
                return (
                  <Row
                    key={service.id}
                    item={{
                      type: "service",
                      label: service.name,
                      href: service.uiUrl ?? "/admin/stack",
                      svc: service,
                    }}
                    rowIndex={rowIndex}
                  >
                    <span className="w-5 flex-shrink-0 text-center font-mono text-xs text-gray-600">
                      {service.phase}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-sm text-gray-200">{service.name}</span>
                      {service.role ? (
                        <span className="ml-2 text-xs text-gray-600">{service.role}</span>
                      ) : null}
                    </span>
                    <span
                      className={`flex-shrink-0 text-xs font-semibold ${
                        service.verdict === "ESSENTIAL" ? "text-green-400" : "text-amber-400"
                      }`}
                    >
                      {service.verdict === "ESSENTIAL" ? "E" : "R"}
                    </span>
                  </Row>
                );
              })}
            </section>
          ) : null}

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-600">
              No results for <span className="text-gray-400">"{query}"</span>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-4 border-t border-gray-800 px-4 py-2 text-xs text-gray-700">
          <span>Arrow keys navigate</span>
          <span>Enter selects</span>
          <span>Esc closes</span>
          <span className="ml-auto">Ctrl+K reopens</span>
        </div>
      </div>
    </div>
  );
}
