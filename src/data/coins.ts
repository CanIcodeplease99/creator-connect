export interface CoinPackage {
  id: string;
  coins: number;
  price: string; // in Rands
  bonus?: string;
  popular?: boolean;
}

export interface StreamGift {
  id: string;
  name: string;
  emoji: string;
  coins: number;
  animation?: "float" | "burst" | "shake" | "rain";
}

export const coinPackages: CoinPackage[] = [
  { id: "cp1", coins: 65, price: "R15" },
  { id: "cp2", coins: 330, price: "R69", bonus: "+30 bonus" },
  { id: "cp3", coins: 660, price: "R129", bonus: "+60 bonus", popular: true },
  { id: "cp4", coins: 1321, price: "R249", bonus: "+171 bonus" },
  { id: "cp5", coins: 3303, price: "R599", bonus: "+503 bonus" },
  { id: "cp6", coins: 6607, price: "R1 099", bonus: "+1 107 bonus" },
];

export const streamGifts: StreamGift[] = [
  { id: "g1", name: "Rose", emoji: "🌹", coins: 1, animation: "float" },
  { id: "g2", name: "Ice Cream", emoji: "🍦", coins: 5, animation: "float" },
  { id: "g3", name: "Fire", emoji: "🔥", coins: 10, animation: "burst" },
  { id: "g4", name: "Crown", emoji: "👑", coins: 50, animation: "burst" },
  { id: "g5", name: "Star", emoji: "⭐", coins: 99, animation: "shake" },
  { id: "g6", name: "Diamond", emoji: "💎", coins: 199, animation: "burst" },
  { id: "g7", name: "Rocket", emoji: "🚀", coins: 500, animation: "shake" },
  { id: "g8", name: "Lion", emoji: "🦁", coins: 1000, animation: "rain" },
  { id: "g9", name: "Universe", emoji: "🌌", coins: 2999, animation: "rain" },
  { id: "g10", name: "Planet", emoji: "🪐", coins: 4999, animation: "rain" },
];

// Conversion rate: creators earn ~50% of coin value
export const COIN_TO_RAND_RATE = 0.115; // R0.115 per coin earned by creator
