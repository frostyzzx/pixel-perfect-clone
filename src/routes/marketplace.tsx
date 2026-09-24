import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ItemCard } from "@/components/game/cards";
import { PageHeader } from "@/components/game/primitives";
import { Button } from "@/components/ui/button";
import { ITEMS } from "@/lib/mock-data";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — SKINVAULT" },
      { name: "description", content: "Trade virtual collectibles with other players using credits." },
      { property: "og:title", content: "Marketplace — SKINVAULT" },
      { property: "og:description", content: "Trade virtual collectibles using credits." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="MARKETPLACE" subtitle="Swap collectibles with other players. Credits only." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {[...ITEMS, ...ITEMS].map((it, i) => (
          <ItemCard
            key={i}
            item={it}
            meta={
              <Button size="sm" variant="neon" className="h-6 px-2 text-[10px]" onClick={() => toast("Marketplace coming soon")}>
                BUY
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
