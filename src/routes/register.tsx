import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/game/primitives";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — SKINVAULT" },
      { name: "description", content: "Join SKINVAULT and start collecting with free virtual credits." },
      { property: "og:title", content: "Create account — SKINVAULT" },
      { property: "og:description", content: "Join and start collecting with free virtual credits." },
    ],
  }),
  component: Register,
});

const schema = z.object({
  username: z.string().trim().min(3, "Username must be 3–24 characters").max(24, "Username must be 3–24 characters").regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and _ only"),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function Register() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid data"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { emailRedirectTo: window.location.origin, data: { username: parsed.data.username } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (data.session) {
      toast.success("Account created! +1,000 credits");
      window.location.assign("/");
    } else setSentTo(parsed.data.email);
  };

  if (sentTo)
    return (
      <AuthLayout title="CHECK YOUR EMAIL" subtitle={`We sent a confirmation link to ${sentTo}.`} footer={<Link to="/login" className="text-secondary hover:underline">Back to log in</Link>}>
        <div className="card-premium flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <MailCheck className="size-6 text-success" /> Confirm your email, then log in to claim your 1,000 starting credits.
        </div>
      </AuthLayout>
    );

  return (
    <AuthLayout title="JOIN THE VAULT" subtitle="Start with 1,000 free virtual credits." footer={<>Have an account? <Link to="/login" className="text-secondary hover:underline">Log in</Link></>}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2"><Label htmlFor="user">Username</Label><Input id="user" name="username" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" name="password" type="password" autoComplete="new-password" required className="h-11 bg-surface" /></div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          {loading ? <Spinner className="text-primary-foreground" /> : "CREATE ACCOUNT"}
        </Button>
      </form>
    </AuthLayout>
  );
}
