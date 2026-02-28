"use client";
import { useState, useEffect, useCallback } from "react";

interface QuickAction {
  label: string;
  icon: string;
  text: string;
  title?: string;
}

const ACTIONS: QuickAction[] = [
  {
    label: "infra",
    icon: "🏗",
    text: "bash setup.sh infrastructure",
    title: "Copy: launch infrastructure services (step 1)",
  },
  {
    label: "phase 1a",
    icon: "🚀",
    text: "bash setup.sh 1a",
    title: "Copy: launch Phase 1A services (step 2)",
  },
  {
    label: "phase 1b",
    icon: "🔬",
    text: "bash setup.sh 1b",
    title: "Copy: launch Phase 1B services",
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
      // clipboard unavailable in some environments
    }
  }, [action.text]);

  return (
    <button
      onClick={handleCopy}
      title={action.title}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
        copied
          ? "bg-green-900/80 border-green-700 text-green-300"
          : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 hover:text-white active:scale-95"
      }`}
    >
      <span>{copied ? "✓" : action.icon}</span>
      <span className="font-mono">{copied ? "copied!" : action.label}</span>
    </button>
  );
}

export function QuickActions() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Show bar only after user has scrolled a bit
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always visible on the stack page — just animate in after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Main bar */}
      <div className="flex items-center gap-1.5 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl px-3 py-2">
        {/* Label */}
        <span className="text-xs text-gray-600 font-medium pr-1 hidden sm:block">Quick copy:</span>

        {/* Copy chips */}
        {ACTIONS.map((a) => (
          <CopyChip key={a.label} action={a} />
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-gray-700 mx-1" />

        {/* Jump to top — only shown after scrolling */}
        <button
          onClick={scrollTop}
          title="Scroll to top"
          className={`p-1.5 rounded-lg text-xs transition-all duration-200 border ${
            scrolled
              ? "text-gray-400 hover:text-white border-gray-700 hover:bg-gray-700"
              : "text-gray-700 border-gray-800 cursor-default"
          }`}
          disabled={!scrolled}
          aria-label="Scroll to top"
        >
          ↑
        </button>

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          title="Hide quick actions (refresh to restore)"
          className="p-1.5 rounded-lg text-xs text-gray-700 hover:text-gray-400 transition-colors"
          aria-label="Dismiss quick actions bar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
