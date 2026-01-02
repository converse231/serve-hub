"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Calendar, Music, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "People",
    href: "/dashboard/people",
    icon: Users,
  },
  {
    label: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    label: "Songs",
    href: "/dashboard/lyrics",
    icon: Music,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200",
                "min-w-[60px] active:scale-95",
                isActive 
                  ? "text-amber-400" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive && "bg-amber-500/10"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "text-amber-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
