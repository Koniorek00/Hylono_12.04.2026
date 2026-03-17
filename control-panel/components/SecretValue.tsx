"use client";

import { useMemo, useState } from "react";

function maskValue(value: string) {
  if (value.length <= 6) {
    return "******";
  }

  return `${value.slice(0, 3)}...${value.slice(-4)}`;
}

export function SecretValue({ value }: { value: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayValue = useMemo(() => {
    return revealed ? value : maskValue(value);
  }, [revealed, value]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <code className="min-w-0 flex-1 rounded bg-gray-900 px-2 py-1 text-xs text-gray-200 break-all">
        {displayValue}
      </code>
      <button
        onClick={() => setRevealed((current) => !current)}
        className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-[10px] text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
      >
        {revealed ? "Hide" : "Show"}
      </button>
      <button
        onClick={copy}
        className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-[10px] text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
