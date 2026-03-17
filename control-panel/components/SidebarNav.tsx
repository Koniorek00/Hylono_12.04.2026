"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",          label: "Dashboard",  icon: "⌂",  exact: true },
  { href: "/admin/stack",    label: "Stack",      icon: "◫" },
  { href: "/admin/credentials", label: "Credentials", icon: "K" },
  { href: "/admin/deploy",   label: "Deploy",     icon: "▲" },
  { href: "/admin/commands", label: "Commands",   icon: ">" },
  { href: "/admin/help",     label: "Help",       icon: "?" },
];

export function SidebarNav() {
  const path = usePathname();

  return (
    <aside className="w-14 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col items-center flex-shrink-0">
      {/* Logo */}
      <div className="w-14 h-14 flex items-center justify-center border-b border-gray-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm select-none">
          H
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex-1 py-3 flex flex-col items-center gap-1">
        {NAV.map((n) => {
          const active = n.exact ? path === n.href : path.startsWith(n.href) && !(n.exact === false && path === "/admin");
          // Special case: /admin/stack shouldn't match /admin
          const isActive = n.href === "/admin"
            ? path === "/admin"
            : path.startsWith(n.href);

          return (
            <Link
              key={n.href}
              href={n.href}
              title={n.label}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors text-lg select-none ${
                isActive
                  ? "bg-blue-900/60 text-blue-300"
                  : "text-gray-600 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              {n.icon}
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                {n.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Cmd+K hint at bottom */}
      <div className="pb-3 flex flex-col items-center">
        <div
          title="Command Palette  Ctrl+K"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:text-gray-400 hover:bg-gray-800 transition-colors cursor-default group relative"
        >
          <span className="font-mono text-xs border border-gray-700 rounded px-1 py-0.5">K</span>
          <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
            Command Palette  Ctrl+K
          </span>
        </div>
      </div>
    </aside>
  );
}
