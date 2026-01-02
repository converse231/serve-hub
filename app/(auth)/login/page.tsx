"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, ArrowRight, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("message") === "confirm-email") {
        setShowConfirmMessage(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        toast.error("Login failed", {
          description: signInError.message,
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const { data: churches } = await supabase.rpc("get_my_churches");

        if (!churches || churches.length === 0) {
          toast.success("Welcome! Let's set up your church.");
          router.push("/onboarding");
        } else {
          toast.success("Welcome back!");
          router.push("/dashboard");
        }
        
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error("Login failed", { description: message });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-amber-500/25">
              <Church className="w-8 h-8 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
            <p className="text-zinc-400 text-sm">
              Sign in to continue to ServeHub
            </p>
          </div>

          {/* Form */}
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              {showConfirmMessage && (
                <div className="p-3 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Please check your email and click the confirmation link to activate your account.</span>
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@church.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Password
                  </Label>
                  <Link 
                    href="#" 
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-amber-500/20 text-base"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-900 font-semibold shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-zinc-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
