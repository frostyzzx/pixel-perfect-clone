import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Case, Item, Rarity } from "@/lib/mock-data";

const ORDER: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];

function client() {
  return createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

type Row = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  case_items: {
    probability: number;
    items: { id: string; name: string; image_url: string | null; rarity: string; virtual_value: number } | null;
  }[];
};

function toCase(r: Row): Case {
  const items: Item[] = r.case_items
    .filter((ci) => ci.items)
    .map((ci) => ({
      id: ci.items!.id,
      name: ci.items!.name,
      rarity: ci.items!.rarity.toLowerCase() as Rarity,
      value: Number(ci.items!.virtual_value),
      image: ci.items!.image_url ?? "",
      odds: Number(ci.probability),
    }))
    .sort((a, b) => ORDER.indexOf(b.rarity) - ORDER.indexOf(a.rarity));
  const price = Number(r.price);
  const rarity: Rarity = price >= 10000 ? "legendary" : price >= 4000 ? "epic" : price >= 1500 ? "rare" : price >= 500 ? "uncommon" : "common";
  return { id: r.id, name: r.name, tagline: r.description ?? "", price, rarity, image: r.image_url ?? "", items };
}

const SELECT = "id,name,description,image_url,price,case_items(probability,items(id,name,image_url,rarity,virtual_value))";

export const listCases = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await client().from("cases").select(SELECT).eq("active", true).order("price");
  if (error) throw new Error(error.message);
  return (data as unknown as Row[]).map(toCase);
});

export const getCaseById = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await client().from("cases").select(SELECT).eq("id", data.id).maybeSingle();
    if (error) throw new Error(error.message);
    return row ? toCase(row as unknown as Row) : null;
  });
