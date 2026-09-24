import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
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
  return (
    <AuthLayout title="WELCOME BACK" subtitle="Log in to access your vault." footer={<>New here? <Link to="/register" className="text-secondary hover:underline">Create account</Link></>}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Logged in (demo)");
          nav({ to: "/" });
        }}
      >
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="h-11 bg-surface" /></div>
        <div className="space-y-2"><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required className="h-11 bg-surface" /></div>
        <Button type="submit" variant="hero" size="lg" className="w-full">LOG IN</Button>
      </form>
    </AuthLayout>
  );
}
