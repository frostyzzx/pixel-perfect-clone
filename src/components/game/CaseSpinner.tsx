import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Item } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CARD = 144; // px card width
const GAP = 8;
const STEP = CARD + GAP;
const TOTAL = 60;
const WIN_INDEX = 50;
const DURATION = 6500;

/** Purely decorative filler; weighted by the public odds so the reel "looks" right. */
function filler(pool: Item[]): Item {
  let r = Math.random() * 100;
  return pool.find((it) => (r -= it.odds ?? 0) < 0) ?? pool[0]!;
}

type Phase = "idle" | "waiting" | "spinning" | "done";

/**
 * Presents a result that the server ALREADY decided. `winner` is placed at a
 * fixed slot and the reel is animated to it — the animation never picks.
 */
export function CaseSpinner({
  pool,
  winner,
  waiting,
  onFinish,
}: {
  pool: Item[];
  winner: Item | null;
  waiting: boolean;
  onFinish: () => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [reel, setReel] = useState<Item[]>(() => pool.slice(0, 1));
  const idleReel = useMemo(() => Array.from({ length: 14 }, (_, i) => pool[i % pool.length]!), [pool]);

  useEffect(() => {
    if (waiting && !winner) setPhase("waiting");
  }, [waiting, winner]);

  // Build a new reel with the server's winner at WIN_INDEX
  useEffect(() => {
    if (!winner) return;
    const r = Array.from({ length: TOTAL }, () => filler(pool));
    r[WIN_INDEX] = winner;
    setReel(r);
    setPhase("spinning");
  }, [winner, pool]);

  useLayoutEffect(() => {
    if (phase !== "spinning" || !strip.current || !viewport.current) return;
    const el = strip.current;
    const center = viewport.current.clientWidth / 2;
    const jitter = (Math.random() - 0.5) * CARD * 0.7; // land off-center, still on the winner
    const target = WIN_INDEX * STEP + CARD / 2 - center + jitter;
    el.style.transition = "none";
    el.style.transform = "translate3d(0,0,0)";
    void el.offsetWidth;
    // slow-in (acceleration), long ease-out (progressive deceleration)
    el.style.transition = `transform ${DURATION}ms cubic-bezier(0.32, 0, 0.12, 1)`;
    el.style.transform = `translate3d(${-target}px,0,0)`;
    const t = setTimeout(() => {
      // settle to exact center
      el.style.transition = "transform 400ms ease-out";
      el.style.transform = `translate3d(${-(target - jitter)}px,0,0)`;
      setTimeout(() => {
        setPhase("done");
        onFinish();
      }, 450);
    }, DURATION);
    return () => clearTimeout(t);
  }, [phase, onFinish]);

  const items = phase === "idle" || phase === "waiting" ? idleReel : reel;

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card/60", winner && phase === "done" && `rarity-${winner.rarity}`)}>
      <div ref={viewport} className="relative h-48 overflow-hidden">
        <div
          ref={strip}
          className={cn("absolute left-0 top-6 flex will-change-transform", phase === "waiting" && "reel-idle")}
          style={{ gap: GAP }}
        >
          {items.map((it, i) => {
            const isWin = phase === "done" && i === WIN_INDEX;
            return (
              <div
                key={i}
                className={cn(
                  `rarity-${it.rarity}`,
                  "reel-card relative shrink-0 rounded-lg p-2",
                  isWin && "reel-win",
                  phase === "done" && !isWin && "opacity-30",
                )}
                style={{ width: CARD }}
              >
                <img src={it.image} alt="" className="aspect-square w-full rounded-md object-cover" draggable={false} />
                <p className="mt-1 truncate text-[11px] font-semibold">{it.name}</p>
              </div>
            );
          })}
        </div>
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        {/* center marker */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-warning shadow-[0_0_12px_var(--warning)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 size-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-warning" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 size-0 -translate-x-1/2 border-x-8 border-b-8 border-x-transparent border-b-warning" />

        {phase === "done" && winner && (
          <div className={cn(`rarity-${winner.rarity}`, "pointer-events-none absolute inset-0")}>
            <div className="reward-flash absolute inset-0" />
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="particle absolute left-1/2 top-1/2 size-1.5 rounded-full"
                style={{
                  ["--a" as string]: `${(360 / 28) * i + Math.random() * 10}deg`,
                  ["--d" as string]: `${90 + Math.random() * 90}px`,
                  animationDelay: `${Math.random() * 120}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
      {phase === "waiting" && (
        <p className="absolute inset-x-0 bottom-2 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Securing your roll…
        </p>
      )}
    </div>
  );
}
