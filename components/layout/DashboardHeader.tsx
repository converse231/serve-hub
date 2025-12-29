"use client";

import { Church, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DesktopNav } from "./DesktopNav";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, this would clear auth tokens
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Church className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold">ServeHub</h2>
            <p className="text-xs text-muted-foreground">Grace Community Church</p>
          </div>
          <h2 className="text-lg font-semibold sm:hidden">ServeHub</h2>
          
          {/* Desktop Navigation */}
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

