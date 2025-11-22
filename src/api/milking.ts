import { apiFetch } from "@/lib/apiFetch";
import {
  MilkingRecordRequest,
  MilkingRecordResponse,
  MilkingStatsResponse,
  CowMilkingSummary,
  MilkingShift
} from "@/types/milking";

const MILKING_BASE_URL = "/milking-records";

// Record milking session
export const recordMilking = (payload: MilkingRecordRequest): Promise<MilkingRecordResponse> =>
  apiFetch(`${MILKING_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Update milking record
export const updateMilkingRecord = (
  id: number, 
  payload: Partial<MilkingRecordRequest>
): Promise<MilkingRecordResponse> =>
  apiFetch(`${MILKING_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Get milking record by ID
export const fetchMilkingRecordById = (id: number): Promise<MilkingRecordResponse> =>
  apiFetch(`${MILKING_BASE_URL}/${id}`);

// Get milking history for specific animal
export const fetchMilkingRecordsByAnimal = (animalId: number): Promise<MilkingRecordResponse[]> =>
  apiFetch(`${MILKING_BASE_URL}/animal/${animalId}`);

// Get all milking records for specific date
export const fetchMilkingRecordsByDate = (date: string): Promise<MilkingRecordResponse[]> =>
  apiFetch(`${MILKING_BASE_URL}/date/${date}`);

// Get milking records by date range
export const fetchMilkingRecordsByDateRange = (
  startDate: string, 
  endDate: string
): Promise<MilkingRecordResponse[]> => {
  const queryString = new URLSearchParams({ 
    startDate, 
    endDate 
  }).toString();
  
  return apiFetch(`${MILKING_BASE_URL}/date-range?${queryString}`);
};

// Get daily milking statistics
export const fetchDailyMilkingStats = (date?: string): Promise<MilkingStatsResponse> => {
  const queryString = date ? `?date=${date}` : '';
  return apiFetch(`${MILKING_BASE_URL}/stats/daily${queryString}`);
};

// Get cow milking summaries with trends
export const fetchCowMilkingSummaries = (date?: string): Promise<CowMilkingSummary[]> => {
  const queryString = date ? `?date=${date}` : '';
  return apiFetch(`${MILKING_BASE_URL}/summaries${queryString}`);
};

// Get cows not yet milked for shift
export const fetchCowsNotMilked = (shift: MilkingShift): Promise<MilkingRecordResponse[]> => {
  const queryString = new URLSearchParams({ shift }).toString();
  return apiFetch(`${MILKING_BASE_URL}/not-milked?${queryString}`);
};

// Get animal average milk production
export const fetchAnimalAverageMilk = (
  animalId: number, 
  days: number = 7
): Promise<number> => {
  const queryString = new URLSearchParams({ days: days.toString() }).toString();
  return apiFetch(`${MILKING_BASE_URL}/animal/${animalId}/average?${queryString}`);
};

// Delete milking record
export const deleteMilkingRecord = (id: number): Promise<void> =>
  apiFetch(`${MILKING_BASE_URL}/${id}`, {
    method: "DELETE",
  });