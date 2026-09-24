import { createFileRoute } from "@tanstack/react-router";
import { ItemCard } from "@/components/game/cards";
import { Credits, SectionHeading, UserAvatar } from "@/components/game/primitives";
import { CURRENT_USER, ITEMS, formatCredits } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
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
  const u = CURRENT_USER;
  const stats = [
    ["Balance", <Credits key="b" value={u.balance} className="text-warning" />],
    ["Cases opened", formatCredits(u.casesOpened)],
    ["Level", u.level],
    ["Joined", u.joined],
  ] as const;
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="card-premium relative overflow-hidden p-6 md:p-8">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-neon opacity-20" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <UserAvatar name={u.name} size="lg" level={u.level} />
          <div>
            <h1 className="font-display text-3xl font-black">{u.name}</h1>
            <p className="text-sm text-muted-foreground">Collector since {u.joined}</p>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-surface-2/50 p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
              <div className="mt-1 font-display font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>
      <section>
        <SectionHeading title="BEST DROPS" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ITEMS.slice(0, 4).map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}
