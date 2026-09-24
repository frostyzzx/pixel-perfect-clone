import { Coins, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCredits, RARITY_LABEL, type Rarity } from "@/lib/mock-data";

export function RarityBadge({ rarity, className }: { rarity: Rarity; className?: string }) {
  return (
    <span
      className={cn(
        `rarity-${rarity}`,
        "rarity-chip inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest",
        className,
      )}
    >
      {RARITY_LABEL[rarity]}
    </span>
  );
}

export function Credits({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-mono font-semibold tabular-nums", className)}>
      <Coins className="size-3.5 text-warning" />
      {formatCredits(value)}
    </span>
  );
}

export function BalanceDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5">
      <Coins className="size-4 text-warning" />
      <span className="font-mono text-sm font-bold tabular-nums text-warning">{formatCredits(value)}</span>
      <span className="hidden text-[10px] uppercase tracking-widest text-warning/70 sm:inline">Credits</span>
    </div>
  );
}

export function UserAvatar({ name, size = "md", level }: { name: string; size?: "sm" | "md" | "lg"; level?: number }) {
  const s = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-20 text-2xl" }[size];
  return (
    <div className="relative shrink-0">
      <div className={cn("grid place-items-center rounded-xl bg-gradient-primary p-[2px]", s)}>
        <div className="grid size-full place-items-center rounded-[10px] bg-surface font-display font-bold">
          {name.slice(0, 2).toUpperCase()}
        </div>
      </div>
      {level !== undefined && (
        <span className="absolute -bottom-1 -right-1 rounded-md bg-secondary px-1 font-mono text-[9px] font-bold text-secondary-foreground">
          {level}
        </span>
      )}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-secondary">{eyebrow}</p>}
        <h2 className="font-display text-xl font-bold tracking-wide md:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl font-black tracking-wide md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-primary", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="card-premium p-4">
      <div className="aspect-square animate-pulse rounded-lg bg-surface-2" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-surface-2" />
    </div>
  );
}
