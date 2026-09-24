import { createFileRoute } from "@tanstack/react-router";
import { CaseCard } from "@/components/game/cards";
import { PageHeader } from "@/components/game/primitives";
import { listCases } from "@/lib/catalog.functions";

export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Cases — SKINVAULT" },
      { name: "description", content: "Browse every virtual case and its possible drops." },
      { property: "og:title", content: "Cases — SKINVAULT" },
      { property: "og:description", content: "Browse every virtual case and its possible drops." },
    ],
  }),
  loader: () => listCases(),
  errorComponent: () => <p className="py-20 text-center">Could not load cases.</p>,
  component: CasesPage,
});

function CasesPage() {
  const cases = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="CASES" subtitle="Pick a case, check the odds, open with virtual credits." />
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
