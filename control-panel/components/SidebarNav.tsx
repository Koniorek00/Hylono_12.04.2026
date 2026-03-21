"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "H", exact: true },
  { href: "/admin/progress", label: "Progress", icon: "P" },
  { href: "/admin/blueprints", label: "Blueprints", icon: "B" },
  { href: "/admin/staging", label: "Staging", icon: "T" },
  { href: "/admin/stack", label: "Stack", icon: "S" },
  { href: "/admin/credentials", label: "Credentials", icon: "K" },
  { href: "/admin/quickstart", label: "Quick Start", icon: "1" },
  { href: "/admin/deploy", label: "Deploy", icon: "D" },
  { href: "/admin/commands", label: "Commands", icon: ">" },
  { href: "/admin/help", label: "Help", icon: "?" },
];

export function SidebarNav() {
  const path = usePathname();

  return (
    <aside className="min-h-screen w-14 flex-shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col items-center">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center border-b border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white select-none">
          H
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 py-3">
        {NAV.map((item) => {
          const isActive = item.href === "/admin" ? path === "/admin" : path.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-colors select-none ${
                isActive
                  ? "bg-blue-900/60 text-blue-300"
                  : "text-gray-600 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {item.icon}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-100 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center pb-3">
        <div
          title="Command Palette  Ctrl+K"
          className="group relative flex h-10 w-10 cursor-default items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-800 hover:text-gray-400"
        >
          <span className="rounded border border-gray-700 px-1 py-0.5 font-mono text-xs">K</span>
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-xs text-gray-100 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
            Command Palette  Ctrl+K
          </span>
        </div>
      </div>
    </aside>
  );
}
