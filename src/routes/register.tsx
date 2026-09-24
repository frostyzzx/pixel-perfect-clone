import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function Register() {
  const nav = useNavigate();
  return (
    <AuthLayout title="JOIN THE VAULT" subtitle="Start with 1,000 free virtual credits." footer={<>Have an account? <Link to="/login" className="text-secondary hover:underline">Log in</Link></>}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Account created (demo)", { description: "+1,000 credits added." });
          nav({ to: "/" });
        }}
      >
        <div className="space-y-2"><Label htmlFor="user">Username</Label><Input id="user" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required className="h-11 bg-surface" /></div>
        <Button type="submit" variant="hero" size="lg" className="w-full">CREATE ACCOUNT</Button>
      </form>
    </AuthLayout>
  );
}
