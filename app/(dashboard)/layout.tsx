import type { Metadata } from "next";
import { MobileNav } from "@/components/layout/MobileNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dashboard - ServeHub",
  description: "Manage your church ministry schedules",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 pb-20 md:pb-6">
        <div className="container mx-auto px-4 py-6 md:px-6 max-w-7xl">
          {children}
        </div>
      </main>

      <MobileNav />
      <Toaster />
    </div>
  );
}

