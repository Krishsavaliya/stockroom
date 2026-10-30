
import { UserButton } from "@clerk/nextjs";

import { MobileNav } from "./mobile-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">

      {/* Left section */}
      <div className="flex items-center gap-3">
        <MobileNav />

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Stockroom
          </p>

          <p className="hidden text-xs text-slate-500 sm:block">
            Inventory management workspace
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <UserButton />
      </div>

    </header>
  );
}
