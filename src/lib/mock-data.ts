import caseNebula from "@/assets/case-nebula.jpg";
import caseAurum from "@/assets/case-aurum.jpg";
import caseCryo from "@/assets/case-cryo.jpg";
import itemBlade from "@/assets/item-blade.jpg";
import itemHelmet from "@/assets/item-helmet.jpg";
import itemPistol from "@/assets/item-pistol.jpg";
import itemGloves from "@/assets/item-gloves.jpg";
import itemGem from "@/assets/item-gem.jpg";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  image: string;
  odds?: number;
}

export interface Case {
  id: string;
  name: string;
  tagline: string;
  price: number;
  rarity: Rarity;
  image: string;
  items: Item[];
}

export const ITEMS: Item[] = [
  { id: "i1", name: "Aurum Visor", rarity: "legendary", value: 42000, image: itemHelmet, odds: 0.6 },
  { id: "i2", name: "Void Edge", rarity: "epic", value: 12500, image: itemBlade, odds: 3.4 },
  { id: "i3", name: "Nebula Shard", rarity: "epic", value: 9800, image: itemGem, odds: 4.0 },
  { id: "i4", name: "Cryo Pulse", rarity: "rare", value: 3200, image: itemPistol, odds: 12 },
  { id: "i5", name: "Toxin Grips", rarity: "uncommon", value: 900, image: itemGloves, odds: 30 },
  { id: "i6", name: "Steel Pulse", rarity: "common", value: 150, image: itemPistol, odds: 50 },
];

export const CASES: Case[] = [
  { id: "nebula", name: "Nebula Prime", tagline: "Violet-core collectibles", price: 2500, rarity: "epic", image: caseNebula, items: ITEMS },
  { id: "aurum", name: "Aurum Vault", tagline: "Gold-tier legends only", price: 8000, rarity: "legendary", image: caseAurum, items: ITEMS },
  { id: "cryo", name: "Cryo Cache", tagline: "Sub-zero tech arsenal", price: 1200, rarity: "rare", image: caseCryo, items: ITEMS },
  { id: "starter", name: "Rookie Crate", tagline: "Your first drop", price: 300, rarity: "uncommon", image: caseCryo, items: ITEMS },
];

export const getCase = (id: string) => CASES.find((c) => c.id === id);

export const CURRENT_USER = {
  name: "Nova_7",
  level: 24,
  xp: 6800,
  xpNext: 10000,
  balance: 128450,
  casesOpened: 342,
  joined: "Mar 2026",
};

export const RECENT_DROPS = [
  { user: "Kairo", item: ITEMS[0] },
  { user: "Vexa", item: ITEMS[1] },
  { user: "Zenith", item: ITEMS[3] },
  { user: "Orbit", item: ITEMS[2] },
  { user: "Lumen", item: ITEMS[4] },
  { user: "Rift", item: ITEMS[3] },
];

export const LEADERBOARD = [
  { rank: 1, name: "Kairo", level: 58, value: 2_450_000 },
  { rank: 2, name: "Vexa", level: 51, value: 1_980_000 },
  { rank: 3, name: "Zenith", level: 47, value: 1_620_000 },
  { rank: 4, name: "Orbit", level: 41, value: 980_000 },
  { rank: 5, name: "Lumen", level: 39, value: 870_000 },
  { rank: 6, name: "Nova_7", level: 24, value: 412_000 },
  { rank: 7, name: "Rift", level: 22, value: 360_000 },
];

export const DAILY_REWARDS = [
  { day: 1, reward: 100, claimed: true },
  { day: 2, reward: 200, claimed: true },
  { day: 3, reward: 300, claimed: true },
  { day: 4, reward: 500, claimed: false, today: true },
  { day: 5, reward: 750, claimed: false },
  { day: 6, reward: 1000, claimed: false },
  { day: 7, reward: 2500, claimed: false, special: true },
];

export const formatCredits = (n: number) => n.toLocaleString("en-US");
