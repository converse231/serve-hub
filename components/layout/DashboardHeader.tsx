"use client";

import { Church, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DesktopNav } from "./DesktopNav";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface DashboardHeaderProps {
  churchName: string;
}

export function DashboardHeader({ churchName }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 flex-1">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Church className="w-5 h-5 text-zinc-900" />
          </div>
          
          {/* Church name dropdown (future: switch churches) */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors">
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{churchName}</p>
              <p className="text-xs text-zinc-400">ServeHub</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
          
          <span className="text-sm font-semibold sm:hidden">{churchName}</span>
          
          {/* Desktop Navigation */}
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
