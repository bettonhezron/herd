export enum BreedingMethod {
    AI = "AI",
    NATURAL = "NATURAL"
  }
  
  export enum BreedingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    COMPLETED = "COMPLETED"
  }
  
  export enum ActionTaken {
    PENDING = "PENDING",
    BRED = "BRED",
    SKIP = "SKIPPED"
  }
  
  // == HEAT DETECTION ===
  
  export interface HeatDetectionRequest {
    animalId: number;
    heatDetectedDate?: string; 
    notes?: string;
  }
  
  export interface HeatDetectionResponse {
    id: number;
    animalId: number;
    animalTag: string;
    animalName?: string;
    heatDetectedDate: string;
    daysInHeat: number;
    recordedBy: string;
    actionTaken: ActionTaken;
    resultingBreedingId?: number;
    notes?: string;
    createdAt: string;
    lastBredDate?: string;
    daysSinceLastBirth?: number;
  }
  
  // == BREEDING RECORDS ==
  
  export interface BreedingRecordRequest {
    breedingDate?: string;
    method?: BreedingMethod;
    expectedCalvingDate?: string;
    remarks?: string;
  }
  
  export interface BreedingRecordResponse {
    id: number;
    animalId: number;
    animalTag: string;
    animalName?: string;
    breedingDate: string;
    method?: BreedingMethod;
    status: BreedingStatus;
    recordedBy: string;
    pregnancyConfirmationDate?: string;
    daysPregnant?: number;
    expectedCalvingDate: string;
    daysUntilCalving?: number;
    actualCalvingDate?: string;
    isOverdue?: boolean;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    heatDetectionId?: number;
  }
  
  export interface BreedingStatsResponse {
    inHeatCount: number;
    pendingChecksCount: number;
    activePregnanciesCount: number;
    upcomingCalvingsCount: number;
    overdueCalvingsCount: number;
    confirmedThisMonth: number;
    failedThisMonth: number;
  }
  
  // === HELPER TYPES ==
  
  export interface BreedingFilters {
    status?: BreedingStatus;
    startDate?: string;
    endDate?: string;
    animalId?: number;
  }
  
  export interface StatusOption {
    value: BreedingStatus;
    label: string;
    color: string;
  }
  
  export interface MethodOption {
    value: BreedingMethod;
    label: string;
  }
  
  // == CONSTANTS ==
  
  export const BREEDING_STATUS_OPTIONS: StatusOption[] = [
    { 
      value: BreedingStatus.PENDING, 
      label: "Pending Check", 
      color: "bg-amber-100 text-amber-700 border-amber-200" 
    },
    { 
      value: BreedingStatus.CONFIRMED, 
      label: "Confirmed", 
      color: "bg-green-100 text-green-700 border-green-200" 
    },
    { 
      value: BreedingStatus.FAILED, 
      label: "Failed", 
      color: "bg-red-100 text-red-700 border-red-200" 
    },
    { 
      value: BreedingStatus.COMPLETED, 
      label: "Completed", 
      color: "bg-blue-100 text-blue-700 border-blue-200" 
    },
  ];
  
  export const BREEDING_METHOD_OPTIONS: MethodOption[] = [
    { value: BreedingMethod.AI, label: "Artificial Insemination (AI)" },
    { value: BreedingMethod.NATURAL, label: "Natural Service" },
  ];
  
  export const ACTION_TAKEN_OPTIONS = [
    { value: ActionTaken.PENDING, label: "Pending", color: "bg-gray-100 text-gray-700" },
    { value: ActionTaken.BRED, label: "Bred", color: "bg-green-100 text-green-700" },
    { value: ActionTaken.SKIP, label: "Skipped", color: "bg-orange-100 text-orange-700" },
  ];
  
  export const STATUS_DISPLAY: Record<BreedingStatus, string> = {
    [BreedingStatus.PENDING]: "Awaiting Pregnancy Check",
    [BreedingStatus.CONFIRMED]: "Pregnancy Confirmed",
    [BreedingStatus.FAILED]: "Not Pregnant",
    [BreedingStatus.COMPLETED]: "Calved Successfully",
  };
  
  export const METHOD_DISPLAY: Record<BreedingMethod, string> = {
    [BreedingMethod.AI]: "AI",
    [BreedingMethod.NATURAL]: "Natural",
  };