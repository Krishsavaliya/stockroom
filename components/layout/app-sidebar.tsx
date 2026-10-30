
import Link from "next/link";
import { Package } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">

      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Package size={21} />
        </div>

        <Link href="/dashboard">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Stockroom
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        <p className="mb-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <SidebarNav />
      </div>

      {/* Sidebar footer */}
      <div className="border-t border-slate-200 p-4">
        <p className="text-xs font-medium text-slate-700">
          Stockroom Inventory
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Manage your business inventory
        </p>
      </div>

    </aside>
  );
}
