import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Case, Item } from "@/lib/mock-data";
import { Credits, RarityBadge } from "./primitives";
import { Button } from "@/components/ui/button";

export function CaseCard({ c }: { c: Case }) {
  return (
    <Link
      to="/cases/$id"
      params={{ id: c.id }}
      className={cn(`rarity-${c.rarity}`, "rarity-card group block p-4")}
    >
      <div className="flex items-center justify-between">
        <RarityBadge rarity={c.rarity} />
        <span className="font-mono text-[10px] text-muted-foreground">{c.items.length} items</span>
      </div>
      <div className={cn("relative my-3 overflow-hidden rounded-lg", c.rarity === "legendary" && "shimmer")}>
        <img
          src={c.image}
          alt={c.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3 className="font-display text-sm font-bold tracking-wide">{c.name}</h3>
      <p className="text-xs text-muted-foreground">{c.tagline}</p>
      <div className="mt-3 flex items-center justify-between">
        <Credits value={c.price} className="text-sm" />
        <Button size="sm" variant="neon" tabIndex={-1}>
          OPEN
        </Button>
      </div>
    </Link>
  );
}

export function ItemCard({ item, meta, className }: { item: Item; meta?: React.ReactNode; className?: string }) {
  return (
    <div className={cn(`rarity-${item.rarity}`, "rarity-card group p-3", className)}>
      <div className={cn("relative overflow-hidden rounded-lg", item.rarity === "legendary" && "shimmer")}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={816}
          height={816}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <RarityBadge rarity={item.rarity} className="absolute left-2 top-2 backdrop-blur" />
      </div>
      <p className="mt-2 truncate text-sm font-semibold">{item.name}</p>
      <div className="flex items-center justify-between">
        <Credits value={item.value} className="text-xs text-muted-foreground" />
        {meta}
      </div>
    </div>
  );
}
