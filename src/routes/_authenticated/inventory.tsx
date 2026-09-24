import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ItemCard } from "@/components/game/cards";
import { CardSkeleton, Credits, PageHeader } from "@/components/game/primitives";
import { getMyInventory } from "@/lib/opening.functions";

export const Route = createFileRoute("/_authenticated/inventory")({
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
  const fetchInv = useServerFn(getMyInventory);
  const { data: items, isLoading } = useQuery({ queryKey: ["inventory"], queryFn: () => fetchInv() });
  const list = items ?? [];
  const total = list.reduce((s, i) => s + i.value, 0);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="INVENTORY" subtitle={`${list.length} items in your vault.`} />
      <div className="mb-6 card-premium inline-flex items-center gap-3 px-4 py-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total value</span>
        <Credits value={total} className="text-warning" />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="card-premium py-16 text-center">
          <p className="font-display text-lg">Your vault is empty</p>
          <Link to="/cases" className="mt-3 inline-block text-secondary hover:underline">Open your first case</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {list.map((it) => <ItemCard key={it.id} item={it} />)}
        </div>
      )}
    </div>
  );
}
