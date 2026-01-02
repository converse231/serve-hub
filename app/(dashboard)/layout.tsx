import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard - ServeHub",
  description: "Manage your church ministry schedules",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Check if user has any churches (completed onboarding)
  const { data: churches } = await supabase.rpc("get_my_churches");

  if (!churches || churches.length === 0) {
    redirect("/onboarding");
  }

  // Pass the current church to header
  const currentChurch = churches[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col min-h-screen">
        <DashboardHeader churchName={currentChurch.church_name} />
        
        <main className="flex-1 pb-20 md:pb-6">
          <div className="container mx-auto px-4 py-6 md:px-6 max-w-7xl">
            {children}
          </div>
        </main>

        <MobileNav />
        <Toaster />
      </div>
    </div>
  );
}
