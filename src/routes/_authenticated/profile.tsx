import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { ItemCard } from "@/components/game/cards";
import { Credits, SectionHeading, Spinner, UserAvatar } from "@/components/game/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITEMS } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SKINVAULT" },
      { name: "description", content: "Your collector profile, level and best drops." },
      { property: "og:title", content: "Profile — SKINVAULT" },
      { property: "og:description", content: "Collector profile, level and best drops." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => setUsername(profile?.username ?? ""), [profile?.username]);

  if (!profile) return <div className="grid place-items-center py-20"><Spinner /></div>;

  const name = profile.username ?? user?.email?.split("@")[0] ?? "Player";
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ username: username.trim() || null }).eq("id", profile.id);
    setSaving(false);
    if (error) { toast.error(error.code === "23505" ? "Username already taken" : "Could not save username"); return; }
    toast.success("Username updated");
    refreshProfile();
  };

  const stats = [
    ["Balance", <Credits key="b" value={profile.balance} className="text-warning" />],
    ["XP", profile.xp.toLocaleString("en-US")],
    ["Level", profile.level],
    ["Joined", new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="card-premium relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-neon opacity-20" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <UserAvatar name={name} size="lg" level={profile.level} />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-black">{name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut /> Log out</Button>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-surface-2/50 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
              <div className="mt-1 font-display font-bold">{v}</div>
            </div>
          ))}
        </div>
        <div className="relative mt-6 flex max-w-md gap-2">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" maxLength={24} className="bg-surface" />
          <Button onClick={save} disabled={saving}>{saving ? <Spinner className="text-primary-foreground" /> : "Save"}</Button>
        </div>
      </div>
      <section>
        <SectionHeading title="BEST DROPS" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ITEMS.slice(0, 4).map((it) => <ItemCard key={it.id} item={it} />)}
        </div>
      </section>
    </div>
  );
}
