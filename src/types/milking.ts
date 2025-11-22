export enum MilkingShift {
    MORNING = "MORNING",
    AFTERNOON = "AFTERNOON",
    EVENING = "EVENING"
  }
  
  export interface MilkingRecordRequest {
    animalId: number;
    milkingDate?: string; 
    shift: MilkingShift;
    quantity: number;
    remarks?: string;
  }
  
  export interface MilkingRecordResponse {
    id: number;
    animalId: number;
    animalTag: string;
    animalName?: string;
    milkingDate: string;
    shift: MilkingShift;
    quantity: number;
    recordedBy: string;
    remarks?: string;
    createdAt: string;
    updatedAt: string;
    // Computed fields
    daysInMilk?: number;
    lactationStage?: string;
  }
  
  export interface MilkingStatsResponse {
    date: string;
    totalCowsMilked: number;
    totalMilkProduced: number;
    averageMilkPerCow: number;
    morningMilk: number;
    afternoonMilk: number;
    eveningMilk: number;
    activeLactatingCows: number;
    cowsNotMilkedToday: number;
  }
  
  export interface CowMilkingSummary {
    animalId: number;
    tagNumber: string;
    name?: string;
    daysInMilk?: number;
    todayTotal: number;
    weekAverage: number;
    monthAverage: number;
    trend: "INCREASING" | "STABLE" | "DECREASING";
    lastMilked?: string;
  }
  
  // Helper types
  export interface MilkingFilters {
    animalId?: number;
    startDate?: string;
    endDate?: string;
    shift?: MilkingShift;
  }
  
  export interface ShiftOption {
    value: MilkingShift;
    label: string;
    icon?: string;
  }
  
  // Constants
  export const SHIFT_OPTIONS: ShiftOption[] = [
    { value: MilkingShift.MORNING, label: "Morning", icon: "☀️" },
    { value: MilkingShift.AFTERNOON, label: "Afternoon", icon: "🌤️" },
    { value: MilkingShift.EVENING, label: "Evening", icon: "🌙" }
  ];
  
  export const SHIFT_DISPLAY: Record<MilkingShift, string> = {
    [MilkingShift.MORNING]: "Morning (AM)",
    [MilkingShift.AFTERNOON]: "Afternoon (Midday)",
    [MilkingShift.EVENING]: "Evening (PM)"
  };