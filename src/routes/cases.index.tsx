import { createFileRoute } from "@tanstack/react-router";
import { CaseCard } from "@/components/game/cards";
import { PageHeader } from "@/components/game/primitives";
import { CASES } from "@/lib/mock-data";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Cases — SKINVAULT" },
      { name: "description", content: "Browse every virtual case and its possible drops." },
      { property: "og:title", content: "Cases — SKINVAULT" },
      { property: "og:description", content: "Browse every virtual case and its possible drops." },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="CASES" subtitle="Pick a case, check the odds, open with virtual credits." />
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {[...CASES, ...CASES].map((c, i) => (
          <CaseCard key={i} c={c} />
        ))}
      </div>
    </div>
  );
}
