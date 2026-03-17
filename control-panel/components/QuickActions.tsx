"use client";

import { useCallback, useEffect, useState } from "react";

type QuickAction = {
  label: string;
  icon: string;
  text: string;
  title?: string;
};

const ACTIONS: QuickAction[] = [
  {
    label: "infra",
    icon: "INF",
    text: "bash scripts/setup.sh infrastructure",
    title: "Copy: launch infrastructure services",
  },
  {
    label: "phase 1a",
    icon: "1A",
    text: "bash scripts/setup.sh 1a",
    title: "Copy: launch infrastructure plus Phase 1A services",
  },
  {
    label: "status",
    icon: "PS",
    text: "docker compose -f docker/phase-1a/docker-compose.yml ps",
    title: "Copy: check Phase 1A container status",
  },
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
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        copied
          ? "border-green-700 bg-green-900/80 text-green-300"
          : "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-white active:scale-95"
      }`}
    >
      <span>{copied ? "OK" : action.icon}</span>
      <span className="font-mono">{copied ? "copied" : action.label}</span>
    </button>
  );
}

export function QuickActions() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
        <span className="hidden pr-1 text-xs font-medium text-gray-600 sm:block">Quick copy:</span>

        {ACTIONS.map((action) => (
          <CopyChip key={action.label} action={action} />
        ))}

        <div className="mx-1 h-4 w-px bg-gray-700" />

        <button
          onClick={scrollTop}
          title="Scroll to top"
          className={`rounded-lg border p-1.5 text-xs transition-all duration-200 ${
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
          onClick={() => setVisible(false)}
          title="Hide quick actions"
          className="rounded-lg p-1.5 text-xs text-gray-700 transition-colors hover:text-gray-400"
          aria-label="Hide quick actions"
        >
          X
        </button>
      </div>
    </div>
  );
}
