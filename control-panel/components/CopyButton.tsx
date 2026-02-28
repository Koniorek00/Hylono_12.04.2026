"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors"
    >
      {copied ? "✓ Copied!" : `📋 ${label}`}
    </button>
  );
}

export function CopyCodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}
