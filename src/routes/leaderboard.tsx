import { createFileRoute } from "@tanstack/react-router";
import { Credits, PageHeader, UserAvatar } from "@/components/game/primitives";
import { LEADERBOARD } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — SKINVAULT" },
      { name: "description", content: "Top collectors ranked by vault value." },
      { property: "og:title", content: "Leaderboard — SKINVAULT" },
      { property: "og:description", content: "Top collectors ranked by vault value." },
    ],
  }),
  component: Leaderboard,
});

const podium = ["rarity-legendary", "rarity-common", "rarity-uncommon"];

function Leaderboard() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="LEADERBOARD" subtitle="Top collectors this season." />
      <div className="card-premium divide-y divide-border overflow-hidden">
        {LEADERBOARD.map((p) => (
          <div
            key={p.rank}
            className={cn(
              "flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-2/60",
              p.rank <= 3 && podium[p.rank - 1],
              p.name === "Nova_7" && "bg-primary/10",
            )}
          >
            <span className={cn("w-8 font-display text-lg font-black", p.rank <= 3 ? "rarity-text" : "text-muted-foreground")}>
              #{p.rank}
            </span>
            <UserAvatar name={p.name} size="sm" />
            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="font-mono text-[10px] text-secondary">LVL {p.level}</p>
            </div>
            <Credits value={p.value} className="text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
