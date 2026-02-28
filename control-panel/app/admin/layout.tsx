import { getManifest } from "@/lib/manifest";
import { SidebarNav } from "@/components/SidebarNav";
import { CommandPalette } from "@/components/CommandPalette";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const manifest = getManifest();
  const allServices = [...manifest.infrastructure, ...manifest.services];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <SidebarNav />
      <main className="flex-1 overflow-x-hidden min-w-0">{children}</main>
      <CommandPalette services={allServices} />
    </div>
  );
}
