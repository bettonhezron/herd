export type FeedType = "hay" | "silage" | "concentrate" | "minerals" | "water" | "other";

export interface FeedRecord {
  id: string;
  animalId: string;
  animalTag: string;
  animalName: string;
  feedType: FeedType;
  quantity: number;     // in kg or liters
  unit: "kg" | "liters";
  date: string;         // ISO date
  notes?: string;
}
