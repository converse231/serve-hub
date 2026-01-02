"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Church, 
  Users, 
  Music, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [churchName, setChurchName] = useState("");

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: churches } = await supabase.rpc("get_my_churches");

      if (churches && churches.length > 0) {
        router.push("/dashboard");
        return;
      }

      setChecking(false);
    } catch (error) {
      console.error("Error checking status:", error);
      setChecking(false);
    }
  };

  const handleCreateChurch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("create_church", {
        p_name: churchName.trim(),
      });

      if (error) {
        console.error("Church creation error:", error);
        throw new Error(error.message || "Failed to create church");
      }

      toast.success("Church created!", {
        description: "Welcome to ServeHub! Let's get started.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Onboarding error:", err);
      const message = err instanceof Error ? err.message : "Setup failed";
      toast.error("Setup failed", { description: message });
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950" />
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Branding (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center px-12 xl:px-24">
          <div className="max-w-xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Church className="w-6 h-6 text-zinc-900" />
              </div>
              <span className="text-2xl font-bold tracking-tight">ServeHub</span>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Ministry scheduling
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                made simple.
              </span>
            </h1>

            <p className="text-lg text-zinc-400 mb-12 leading-relaxed">
              Organize your worship team, create smart schedules, and manage your 
              song library — all in one beautiful app.
            </p>

            {/* Features */}
            <div className="space-y-6">
              <FeatureItem 
                icon={<Users className="w-5 h-5" />}
                title="Team Management"
                description="Track volunteers, skills, and availability"
                color="blue"
              />
              <FeatureItem 
                icon={<Calendar className="w-5 h-5" />}
                title="Smart Scheduling"
                description="Auto-generate fair, balanced schedules"
                color="emerald"
              />
              <FeatureItem 
                icon={<Music className="w-5 h-5" />}
                title="Song Library"
                description="Organize lyrics with genres and keys"
                color="violet"
              />
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 lg:w-1/2 xl:w-2/5 flex flex-col">
          {/* Mobile header */}
          <div className="lg:hidden pt-8 pb-6 px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-amber-500/25">
              <Church className="w-8 h-8 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to ServeHub</h1>
            <p className="text-zinc-400 text-sm">
              Ministry scheduling made simple
            </p>
          </div>

          {/* Form container */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              {/* Desktop welcome text */}
              <div className="hidden lg:block mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  Let&apos;s get started
                </div>
                <h2 className="text-3xl font-bold mb-2">Create your church</h2>
                <p className="text-zinc-400">
                  Set up your workspace in seconds. Invite your team later.
                </p>
              </div>

              {/* Mobile features row */}
              <div className="lg:hidden grid grid-cols-3 gap-3 mb-8">
                <MobileFeature icon={<Users className="w-5 h-5" />} label="People" color="blue" />
                <MobileFeature icon={<Calendar className="w-5 h-5" />} label="Schedules" color="emerald" />
                <MobileFeature icon={<Music className="w-5 h-5" />} label="Songs" color="violet" />
              </div>

              {/* Form card */}
              <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl">
                <form onSubmit={handleCreateChurch} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="churchName" className="text-sm font-medium text-zinc-300">
                      Church Name
                    </Label>
                    <Input
                      id="churchName"
                      type="text"
                      placeholder="Grace Community Church"
                      value={churchName}
                      onChange={(e) => setChurchName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20 text-base"
                      autoFocus
                    />
                  </div>

                  {/* Benefits list */}
                  <div className="space-y-3 py-4">
                    <BenefitItem text="Your own private workspace" />
                    <BenefitItem text="Invite up to 10 team members" />
                    <BenefitItem text="Create up to 3 churches" />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold text-base shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]" 
                    disabled={isLoading || !churchName.trim()}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Create Church
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Bottom note */}
              <p className="text-center text-xs text-zinc-500 mt-6">
                You can customize your church details anytime in settings
              </p>
            </div>
          </div>

          {/* Desktop footer branding */}
          <div className="hidden lg:flex items-center justify-center gap-2 py-6 text-zinc-500 text-sm">
            <Zap className="w-4 h-4 text-amber-500" />
            Powered by ServeHub
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature item for desktop
function FeatureItem({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: "blue" | "emerald" | "violet";
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`p-2.5 rounded-xl border ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-0.5">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

// Mobile feature badge
function MobileFeature({ 
  icon, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string;
  color: "blue" | "emerald" | "violet";
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-xl ${colorClasses[color]}`}>
      {icon}
      <span className="text-xs font-medium text-zinc-300">{label}</span>
    </div>
  );
}

// Benefit list item
function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <span className="text-zinc-300">{text}</span>
    </div>
  );
}
