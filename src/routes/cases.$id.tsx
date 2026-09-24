import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/game/cards";
import { Credits, RarityBadge, SectionHeading, Spinner } from "@/components/game/primitives";
import { Modal } from "@/components/game/Modal";
import type { Item } from "@/lib/mock-data";
import { getCaseById } from "@/lib/catalog.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cases/$id")({
  loader: async ({ params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.id)) throw notFound();
    const c = await getCaseById({ data: { id: params.id } });
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — SKINVAULT` },
          { name: "description", content: `${loaderData.tagline}. See drop odds and open with virtual credits.` },
          { property: "og:title", content: `${loaderData.name} — SKINVAULT` },
          { property: "og:description", content: loaderData.tagline },
        ]
      : [{ title: "Case not found — SKINVAULT" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="font-display text-xl">Case not found</p>
      <Link to="/cases" className="mt-4 inline-block text-secondary">Back to cases</Link>
    </div>
  ),
  errorComponent: () => <p className="py-20 text-center">Could not load this case.</p>,
  component: CaseDetail,
});

function CaseDetail() {
  const c = Route.useLoaderData();
  const [opening, setOpening] = useState(false);
  const [won, setWon] = useState<Item | null>(null);

  const open = () => {
    setOpening(true);
    setTimeout(() => {
      // Preview roll weighted by the real odds (server-side opening comes next)
      let r = Math.random() * 100;
      const item = c.items.find((it) => (r -= it.odds ?? 0) < 0) ?? c.items[c.items.length - 1]!;
      setOpening(false);
      setWon(item);
      toast.success(`You unboxed ${item.name}!`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Link to="/cases" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All cases
      </Link>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className={cn(`rarity-${c.rarity}`, "rarity-card p-4", c.rarity === "legendary" && "shimmer")}>
          <img src={c.image} alt={c.name} width={1024} height={1024} className={cn("aspect-square w-full rounded-lg object-cover", opening && "animate-pulse")} />
        </div>
        <div className="flex flex-col">
          <RarityBadge rarity={c.rarity} />
          <h1 className="mt-3 font-display text-4xl font-black tracking-wide">{c.name.toUpperCase()}</h1>
          <p className="mt-2 text-muted-foreground">{c.tagline}</p>
          <div className="mt-6 card-premium p-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Price</p>
            <Credits value={c.price} className="text-2xl text-warning" />
            <Button variant="hero" size="lg" className="mt-4 w-full" onClick={open} disabled={opening}>
              {opening ? <Spinner className="text-primary-foreground" /> : <Zap />} {opening ? "OPENING..." : "OPEN CASE"}
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Virtual credits only · No real money</p>
          </div>
          <div className="mt-6 card-premium p-5">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Drop odds</p>
            <ul className="space-y-2">
              {c.items.map((it) => (
                <li key={it.id} className={cn(`rarity-${it.rarity}`, "flex items-center justify-between text-sm")}>
                  <span className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: "var(--r)" }} />
                    {it.name}
                  </span>
                  <span className="rarity-text font-mono">{it.odds}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="mt-12">
        <SectionHeading title="POSSIBLE ITEMS" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {c.items.map((it) => (
            <ItemCard key={it.id} item={it} />
          ))}
        </div>
      </section>

      <Modal open={!!won} onOpenChange={(o) => !o && setWon(null)} title="YOU UNBOXED" description="Added to your inventory.">
        {won && (
          <div className="mx-auto w-56">
            <ItemCard item={won} />
          </div>
        )}
        <Button variant="hero" onClick={() => setWon(null)}>COLLECT</Button>
      </Modal>
    </div>
  );
}
