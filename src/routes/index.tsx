import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Gift, Lock, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CaseCard, ItemCard } from "@/components/game/cards";
import { Credits, RarityBadge, SectionHeading, UserAvatar } from "@/components/game/primitives";
import { CASES, CURRENT_USER, DAILY_REWARDS, ITEMS, RECENT_DROPS, formatCredits } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import caseAurum from "@/assets/case-aurum.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SKINVAULT — Open. Collect. Dominate." },
      { name: "description", content: "Discover rare virtual items, open cases and build your collection with virtual credits." },
      { property: "og:title", content: "SKINVAULT — Open. Collect. Dominate." },
      { property: "og:description", content: "Discover rare virtual items, open cases and build your collection." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-14">
      <Hero />
      <section>
        <SectionHeading
          eyebrow="Hot this week"
          title="FEATURED CASES"
          action={
            <Link to="/cases" className="flex items-center gap-1 text-xs text-secondary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          {CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </section>
      <RecentlyDiscovered />
      <div className="grid gap-6 lg:grid-cols-5">
        <DailyRewards />
        <LevelUp />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 grid-bg">
      <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/25 blur-3xl animate-glow" />
      <div className="absolute -bottom-32 right-0 size-96 rounded-full bg-secondary/15 blur-3xl animate-glow" />
      <div className="relative grid items-center gap-10 p-6 md:p-12 lg:grid-cols-2">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">
            <span className="size-1.5 rounded-full bg-secondary animate-glow" /> Season 01 live
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            OPEN.
            <br />
            COLLECT.
            <br />
            <span className="text-gradient">DOMINATE.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Discover rare virtual items, open cases and build your collection.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/cases">
                <Zap /> EXPLORE CASES
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/marketplace">VIEW MARKETPLACE</Link>
            </Button>
          </div>
          <div className="mt-8 flex gap-8 font-mono text-xs text-muted-foreground">
            <span><b className="block font-display text-lg text-foreground">2.4M</b>cases opened</span>
            <span><b className="block font-display text-lg text-foreground">18K</b>collectors</span>
            <span><b className="block font-display text-lg text-foreground">100%</b>virtual</span>
          </div>
        </div>

        {/* Visual area */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="rarity-legendary relative animate-float">
            <div className="absolute inset-6 rounded-full bg-warning/30 blur-3xl" />
            <div className="rarity-card shimmer relative p-3">
              <img src={caseAurum} alt="Aurum Vault case" width={1024} height={1024} className="aspect-square w-full rounded-lg object-cover" />
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <p className="font-display text-sm font-bold">AURUM VAULT</p>
                  <RarityBadge rarity="legendary" className="mt-1" />
                </div>
                <Credits value={8000} className="text-warning" />
              </div>
            </div>
          </div>
          <ItemCard item={ITEMS[1]!} className="absolute -left-8 bottom-28 hidden w-32 rotate-[-8deg] sm:block" />
          <ItemCard item={ITEMS[3]!} className="absolute -right-6 top-6 hidden w-28 rotate-[8deg] sm:block" />
        </div>
      </div>
    </section>
  );
}

function RecentlyDiscovered() {
  const drops = [...RECENT_DROPS, ...RECENT_DROPS];
  return (
    <section>
      <SectionHeading eyebrow="Live feed" title="RECENTLY DISCOVERED" />
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
          {drops.map((d, i) => (
            <div key={i} className={cn(`rarity-${d.item.rarity}`, "rarity-card flex w-64 items-center gap-3 p-3")}>
              <img src={d.item.image} alt={d.item.name} loading="lazy" width={816} height={816} className="size-14 rounded-md object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{d.item.name}</p>
                <p className="text-xs text-muted-foreground">
                  by <span className="rarity-text">{d.user}</span>
                </p>
                <Credits value={d.item.value} className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyRewards() {
  return (
    <section className="card-premium p-5 md:p-6 lg:col-span-3">
      <SectionHeading eyebrow="Streak: 3 days" title="DAILY REWARDS" />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {DAILY_REWARDS.map((r) => (
          <div
            key={r.day}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all",
              r.claimed && "border-success/30 bg-success/10",
              r.today && "border-primary bg-primary/15 shadow-glow scale-105",
              !r.claimed && !r.today && "border-border bg-surface-2/50",
              r.special && "border-warning/40 bg-warning/10",
            )}
          >
            <span className="font-mono text-[10px] text-muted-foreground">DAY {r.day}</span>
            {r.claimed ? <Check className="size-5 text-success" /> : r.today ? <Gift className="size-5 text-primary" /> : <Lock className="size-5 text-muted-foreground" />}
            <span className={cn("font-mono text-xs font-bold", r.special && "text-warning")}>{formatCredits(r.reward)}</span>
          </div>
        ))}
      </div>
      <Button className="mt-5 w-full" variant="hero" onClick={() => toast.success("+500 credits claimed!", { description: "Day 4 streak reward." })}>
        <Sparkles /> CLAIM DAY 4
      </Button>
    </section>
  );
}

function LevelUp() {
  const pct = Math.round((CURRENT_USER.xp / CURRENT_USER.xpNext) * 100);
  return (
    <section className="card-premium relative overflow-hidden p-5 md:p-6 lg:col-span-2">
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-secondary/20 blur-3xl" />
      <SectionHeading eyebrow="Progression" title="LEVEL UP" />
      <div className="flex items-center gap-4">
        <UserAvatar name={CURRENT_USER.name} size="lg" />
        <div className="flex-1">
          <p className="font-display text-lg font-bold">LVL {CURRENT_USER.level}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {formatCredits(CURRENT_USER.xp)} / {formatCredits(CURRENT_USER.xpNext)} XP
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gradient-neon shadow-glow transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {[
          ["LVL 25", "Nebula Prime case"],
          ["LVL 30", "Exclusive profile frame"],
          ["LVL 40", "Aurum Vault key"],
        ].map(([lvl, reward]) => (
          <li key={lvl} className="flex items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2">
            <span className="font-mono text-xs text-secondary">{lvl}</span>
            <span className="text-muted-foreground">{reward}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
