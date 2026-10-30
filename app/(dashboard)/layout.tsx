
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      <div className="mx-auto flex min-h-screen max-w-[1600px]">

        {/* Desktop Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <AppHeader />

          {/* Page Content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>

        </div>
      </div>

    </div>
  );
}
