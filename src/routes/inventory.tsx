import { createFileRoute } from "@tanstack/react-router";
import { ItemCard } from "@/components/game/cards";
import { Credits, PageHeader } from "@/components/game/primitives";
import { ITEMS } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — SKINVAULT" },
      { name: "description", content: "Your collection of virtual items." },
      { property: "og:title", content: "Inventory — SKINVAULT" },
      { property: "og:description", content: "Your collection of virtual items." },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const total = ITEMS.reduce((s, i) => s + i.value, 0);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="INVENTORY" subtitle={`${ITEMS.length} items in your vault.`} />
      <div className="mb-6 card-premium inline-flex items-center gap-3 px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total value</span>
        <Credits value={total} className="text-warning" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {ITEMS.map((it) => (
          <ItemCard key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}
