"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ServiceManifest } from "@/types/stack";

type QuickAction = {
  label: string;
  icon: string;
  text: string;
  title?: string;
};

type QuickLink = {
  label: string;
  icon: string;
  href: string;
  title?: string;
};

const ACTIONS: QuickAction[] = [
  {
    label: "launcher",
    icon: "INF",
    text: ".\\start-dev.bat",
    title: "Copy: start the full local stack",
  },
  {
    label: "deep smoke",
    icon: "SMK",
    text: ".\\scripts\\smoke-local-stack.ps1 -Deep",
    title: "Copy: run the deep smoke check",
  },
  {
    label: "staging env",
    icon: "STG",
    text: ".\\scripts\\validate-staging-env.ps1 -Path .\\.env.staging",
    title: "Copy: validate the staging environment scaffold",
  },
];

const PAGE_LINKS: QuickLink[] = [
  { label: "Progress", icon: "P", href: "/admin/progress", title: "Open progress view" },
  { label: "Blueprints", icon: "B", href: "/admin/blueprints", title: "Open blueprint pack" },
  { label: "Staging", icon: "T", href: "/admin/staging", title: "Open staging handoff" },
  { label: "Commands", icon: "C", href: "/admin/commands", title: "Open command library" },
];

function CopyChip({ action }: { action: QuickAction }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(action.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable in some environments.
    }
  }, [action.text]);

  return (
    <button
      onClick={handleCopy}
      title={action.title}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        copied
          ? "border-green-700 bg-green-900/80 text-green-300"
          : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-white active:scale-95"
      }`}
    >
      <span className="text-[10px] font-semibold">{copied ? "OK" : action.icon}</span>
      <span className="font-mono">{copied ? "copied" : action.label}</span>
    </button>
  );
}

function PageChip({ link }: { link: QuickLink }) {
  return (
    <Link
      href={link.href}
      title={link.title}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-150 hover:border-gray-600 hover:bg-gray-700 hover:text-white active:scale-95"
    >
      <span className="text-[10px] font-semibold text-gray-500">{link.icon}</span>
      <span>{link.label}</span>
    </Link>
  );
}

export function QuickActions({ services }: { services: ServiceManifest[] }) {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const verifiedUiServices = useMemo(
    () =>
      services
        .filter((service) => Boolean(service.uiUrl) && service.phase !== "2")
        .slice(0, 6),
    [services]
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-full border border-gray-700 bg-gray-900/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-300 shadow-2xl backdrop-blur-sm transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
          aria-label="Reopen operator dock"
          title="Reopen operator dock"
        >
          Dock
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[min(92vw,34rem)] transition-all duration-300">
      <div className="rounded-2xl border border-gray-700 bg-gray-900/95 p-3 shadow-2xl backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Operator Dock
            </div>
            <div className="mt-0.5 text-[11px] text-gray-600">
              Fast routes, verified apps, and copy-ready commands.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollTop}
              title="Scroll to top"
              className={`rounded-lg border px-2 py-1 text-[11px] transition-all duration-200 ${
                scrolled
                  ? "border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "cursor-default border-gray-800 text-gray-700"
              }`}
              disabled={!scrolled}
              aria-label="Scroll to top"
            >
              UP
            </button>
            <button
              onClick={() => setCollapsed(true)}
              title="Minimize quick actions"
              className="rounded-lg border border-gray-800 px-2 py-1 text-[11px] text-gray-500 transition-colors hover:border-gray-700 hover:text-gray-300"
              aria-label="Minimize quick actions"
            >
              Min
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              Jump
            </div>
            <div className="flex flex-wrap gap-2">
              {PAGE_LINKS.map((link) => (
                <PageChip key={link.href} link={link} />
              ))}
            </div>
          </div>

          {verifiedUiServices.length > 0 ? (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                Apps
              </div>
              <div className="flex flex-wrap gap-2">
                {verifiedUiServices.map((service) => (
                  <a
                    key={service.id}
                    href={service.uiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={service.accessNotes ?? service.role ?? service.domain}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-150 hover:border-gray-600 hover:bg-gray-700 hover:text-white active:scale-95"
                  >
                    <span className="text-[10px] font-semibold text-gray-500">
                      {service.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span>{service.name}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
              Copy
            </div>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((action) => (
                <CopyChip key={action.label} action={action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
