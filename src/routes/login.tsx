import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/game/primitives";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Log in — SKINVAULT" },
      { name: "description", content: "Log in to your SKINVAULT collector account." },
      { property: "og:title", content: "Log in — SKINVAULT" },
      { property: "og:description", content: "Log in to your collector account." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message === "Email not confirmed" ? "Confirm your email first." : "Invalid email or password.");
    toast.success("Welcome back!");
    nav({ to: target });
  };

  return (
    <AuthLayout title="WELCOME BACK" subtitle="Log in to access your vault." footer={<>New here? <Link to="/register" className="text-secondary hover:underline">Create account</Link></>}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" name="password" type="password" autoComplete="current-password" required className="h-11 bg-surface" /></div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? <Spinner className="text-primary-foreground" /> : "LOG IN"}
        </Button>
      </form>
    </AuthLayout>
  );
}
