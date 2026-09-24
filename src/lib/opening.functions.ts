import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Item, Rarity } from "@/lib/mock-data";

const ERRORS: Record<string, string> = {
  INSUFFICIENT_BALANCE: "Not enough credits to open this case.",
  CASE_NOT_FOUND: "This case is not available.",
  PROFILE_NOT_FOUND: "Your profile could not be found.",
  CASE_EMPTY: "This case has no items.",
};

// Client sends ONLY the case id. Price, balance, odds and result are decided in the database.
export const openCase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ caseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: res, error } = await supabaseAdmin.rpc("open_case", {
      _user_id: context.userId,
      _case_id: data.caseId,
    });
    if (error) {
      const code = Object.keys(ERRORS).find((k) => error.message.includes(k));
      if (!code) console.error("open_case failed", error);
      return { ok: false as const, error: code ? ERRORS[code]! : "Could not open the case. Try again." };
    }
    const r = res as {
      balance: number;
      item: { id: string; name: string; image_url: string | null; rarity: string; virtual_value: number };
    };
    const item: Item = {
      id: r.item.id,
      name: r.item.name,
      image: r.item.image_url ?? "",
      rarity: r.item.rarity.toLowerCase() as Rarity,
      value: Number(r.item.virtual_value),
    };
    return { ok: true as const, balance: Number(r.balance), item };
  });

export const getMyInventory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("inventory_items")
      .select("id, created_at, items(id,name,image_url,rarity,virtual_value)")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? [])
      .filter((r) => r.items)
      .map((r) => ({
        id: r.id,
        name: r.items!.name,
        image: r.items!.image_url ?? "",
        rarity: r.items!.rarity.toLowerCase() as Rarity,
        value: Number(r.items!.virtual_value),
      })) as Item[];
  });
