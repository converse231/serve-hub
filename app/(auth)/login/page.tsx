"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For now, just redirect to dashboard
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Logo/Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Church className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">ServeHub</h1>
        <p className="text-muted-foreground text-sm">
          Church ministry scheduling made simple
        </p>
      </div>

      {/* Login Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@church.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base" // Prevent zoom on iOS
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link 
                href="/signup" 
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Demo Notice */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-center text-muted-foreground">
            <span className="font-medium text-foreground">Demo Mode:</span> Enter any email and password to continue
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

