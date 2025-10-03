export type FeedType = "hay" | "silage" | "concentrate" | "minerals" | "water" | "other";

export interface FeedRecord {
  id: string;
  animalId: string;
  animalTag: string;
  animalName: string;
  feedType: FeedType;
  quantity: number;     
  unit: "kg" | "liters";
  date: string;      
  notes?: string;
}
