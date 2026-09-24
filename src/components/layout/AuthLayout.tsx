import { Link } from "@tanstack/react-router";
import caseNebula from "@/assets/case-nebula.jpg";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border grid-bg lg:block">
        <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-primary/30 blur-3xl animate-glow" />
        <img src={caseNebula} alt="" width={1024} height={1024} className="relative mx-auto mt-24 w-3/4 animate-float rounded-2xl" />
        <p className="relative mt-8 text-center font-display text-3xl font-black">
          OPEN. COLLECT. <span className="text-gradient">DOMINATE.</span>
        </p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 inline-flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-gradient-primary font-display text-sm font-black shadow-glow">SV</div>
            <span className="font-display text-sm font-bold tracking-[0.2em]">SKINVAULT</span>
          </Link>
          <h1 className="font-display text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
