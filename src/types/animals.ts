export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
  }
  
  export enum Breed {
    FRIESIAN = "FRIESIAN",
    JERSEY = "JERSEY",
    AYRSHIRE = "AYRSHIRE",
    GUERNSEY = "GUERNSEY"
    
  }
  
  export enum AnimalStatus {
    ACTIVE = "ACTIVE",
    SOLD = "SOLD",
    DEAD = "DEAD",
    CULLED = "CULLED"
  }
  
  export enum LactationStatus {
    HEIFER = "HEIFER",
    LACTATING = "LACTATING",
    DRY = "DRY"
  }
  
  export enum AnimalCategory {
    BULL_CALF = "BULL_CALF",
    BULL = "BULL",
    HEIFER_CALF = "HEIFER_CALF",
    HEIFER = "HEIFER",
    MILKING_COW = "MILKING_COW",
    DRY_COW = "DRY_COW"
  }
  
  export interface CreateAnimalRequest {
    tagNumber: string;
    name?: string;
    gender: Gender;
    breed: Breed;
    dateOfBirth: string; 
    weight?: number;
    notes?: string;
  }
  
  export interface UpdateAnimalRequest {
    name?: string;
    breed?: Breed;
    dateOfBirth?: string;
    status?: AnimalStatus;
    lactationStatus?: LactationStatus;
    currentLactationNumber?: number;
    lactationStartDate?: string;
    expectedDryOffDate?: string;
    weight?: number;
    notes?: string;
  }
  
  export interface AnimalDto {
    id: number;
    tagNumber: string;
    name?: string;
    gender: Gender;
    breed: Breed;
    dateOfBirth: string;
    status: AnimalStatus;
    lactationStatus?: LactationStatus;
    currentLactationNumber?: number;
    lactationStartDate?: string;
    expectedDryOffDate?: string;
    weight?: number;
    notes?: string;
    // Computed fields
    ageInDays?: number;
    ageInMonths?: number;
    ageInYears?: number;
    daysInMilk?: number;
    animalType?: string;
    animalCategory?: string;
    lactationStage?: string;
    readyForBreeding?: boolean;
    needsDryOff?: boolean;
  }
  
  export interface AnimalSummaryDto {
    id: number;
    tagNumber: string;
    name?: string;
    gender?: string;
    breed?: string;
    ageInMonths?: number;
    animalType?: string;
    animalCategory?: string;
    status?: string;
    lactationStatus?: string;
    daysInMilk?: number;
    weight?: number;
  }
  
  export interface AnimalAnalyticsDto {
    totalAnimals: number;
    activeAnimals: number;
    soldAnimals: number;
    deceasedAnimals: number;
    totalMales: number;
    totalFemales: number;
    bullCalves: number;
    bulls: number;
    heiferCalves: number;
    heifers: number;
    milkingCows: number;
    dryCows: number;
    lactatingAnimals: number;
    dryAnimals: number;
    heiferAnimals: number;
    animalsDueForDryOff: number;
    heifersReadyForBreeding: number;
    averageWeight?: number;
    animalsInProduction: number;
  }
  
  // Helper types
  export interface AnimalFilters {
    status?: AnimalStatus;
    gender?: Gender;
    breed?: Breed;
    lactationStatus?: LactationStatus;
    searchQuery?: string;
  }
  
  // Constants
  export const GENDER_OPTIONS = [
    { value: Gender.MALE, label: "Male" },
    { value: Gender.FEMALE, label: "Female" }
  ];
  
  export const BREED_OPTIONS = [
    { value: Breed.FRIESIAN, label: "Friesian" },
    { value: Breed.JERSEY, label: "Jersey" },
    { value: Breed.AYRSHIRE, label: "Ayrshire" },
    { value: Breed.GUERNSEY, label: "Guernsey" },
    
  ];
  
  export const STATUS_OPTIONS = [
    { value: AnimalStatus.ACTIVE, label: "Active", color: "success" },
    { value: AnimalStatus.SOLD, label: "Sold", color: "warning" },
    { value: AnimalStatus.DEAD, label: "Deceased", color: "error" },
    { value: AnimalStatus.CULLED, label: "Culled", color: "default" }
  ];
  
  export const LACTATION_STATUS_OPTIONS = [
    { value: LactationStatus.HEIFER, label: "Heifer", color: "info" },
    { value: LactationStatus.LACTATING, label: "Lactating", color: "success" },
    { value: LactationStatus.DRY, label: "Dry", color: "warning" }
  ];
  
  export const CATEGORY_DISPLAY: Record<AnimalCategory, string> = {
    [AnimalCategory.BULL_CALF]: "Bull Calf",
    [AnimalCategory.BULL]: "Bull",
    [AnimalCategory.HEIFER_CALF]: "Heifer Calf",
    [AnimalCategory.HEIFER]: "Heifer",
    [AnimalCategory.MILKING_COW]: "Milking Cow",
    [AnimalCategory.DRY_COW]: "Dry Cow"
  };