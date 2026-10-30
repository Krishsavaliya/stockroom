
"use client";

import { useState } from "react";
import { Menu, Package } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarNav } from "./sidebar-nav";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        <SheetHeader className="border-b px-5 py-5 text-left">
          <SheetTitle className="flex items-center gap-2">
            <Package size={21} />
            Stockroom
          </SheetTitle>

          <SheetDescription>
            Manage your inventory
          </SheetDescription>
        </SheetHeader>

        <div className="py-5">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
