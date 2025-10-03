export interface Animal {
    id?: string;
    tagNumber: string;
    breed: "GUERNSEY" | "JERSEY" | "HOLSTEIN";
    gender: "MALE" | "FEMALE";
    status: "ACTIVE" | "SOLD" | "DEAD";
    weight: string;
    dob?: string;
    lactationStatus?: "LACTATING" | "DRY" | "UNKNOWN";
    createdAt?: string;
    updatedAt?: string;
    category?: string;
  }

  export interface AnimalsAnalytics {
    totalAnimals: number;
    lactatingAnimals: number;
    dryAnimals: number;
    totalBulls: number;
    totalCalves: number;
    activeAnimals: number;
  }
  
  // Used when creating a new animal
  export type CreateAnimalPayload = Omit<
    Animal,
    "id" | "createdAt" | "updatedAt" | "category" | "lactationStatus"
  >;

  export type UpdateAnimalPayload = Omit<
  Animal,
  "id" | "createdAt" | "updatedAt" 
>;
  

  