import { Link, useRouterState } from "@tanstack/react-router";
import { Box, Home, Package, Store, Trophy, User, Gift, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/mock-data";
import { BalanceDisplay, UserAvatar } from "@/components/game/primitives";
import { toast } from "sonner";

export const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cases", label: "Cases", icon: Box },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/leaderboard", label: "Ranks", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function useIsActive() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="grid size-9 place-items-center rounded-lg bg-gradient-primary font-display text-sm font-black shadow-glow">
        SV
      </div>
      <span className="font-display text-sm font-bold tracking-[0.2em]">SKINVAULT</span>
    </Link>
  );
}

export function Sidebar() {
  const isActive = useIsActive();
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 px-4 py-6 backdrop-blur lg:flex">
      <div className="mb-8 px-2">
        <Logo />
      </div>
      <Navigation isActive={isActive} />
      <div className="mt-auto card-premium p-4">
        <Gift className="mb-2 size-5 text-secondary" />
        <p className="font-display text-xs font-bold tracking-wide">DAILY DROP</p>
        <p className="mt-1 text-xs text-muted-foreground">Claim free credits every 24h.</p>
        <button
          onClick={() => toast.success("+500 credits claimed", { description: "Come back tomorrow for more." })}
          className="mt-3 w-full rounded-md bg-gradient-neon py-2 font-display text-[11px] font-bold tracking-widest text-background transition hover:brightness-110"
        >
          CLAIM
        </button>
      </div>
    </aside>
  );
}

export function Navigation({ isActive }: { isActive: (to: string) => boolean }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            isActive(to)
              ? "border border-primary/30 bg-primary/15 font-semibold text-foreground shadow-glow"
              : "border border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
          )}
        >
          <Icon className={cn("size-4 transition-colors", isActive(to) ? "text-primary" : "group-hover:text-secondary")} />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <BalanceDisplay value={CURRENT_USER.balance} />
          <Link to="/login" className="hidden rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground sm:block" aria-label="Login">
            <LogIn className="size-4" />
          </Link>
          <Link to="/profile" className="flex items-center gap-2">
            <UserAvatar name={CURRENT_USER.name} size="sm" level={CURRENT_USER.level} />
            <div className="hidden leading-tight md:block">
              <p className="text-xs font-semibold">{CURRENT_USER.name}</p>
              <p className="font-mono text-[10px] text-secondary">LVL {CURRENT_USER.level}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-background/90 backdrop-blur-xl lg:hidden">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
            isActive(to) ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/login" || path === "/register") return <>{children}</>;
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-6 md:px-6 lg:pb-10">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
