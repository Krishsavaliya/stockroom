"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: ArrowLeftRight,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon size={19} strokeWidth={1.8} />

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}