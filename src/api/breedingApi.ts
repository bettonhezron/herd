import { apiFetch } from "@/lib/apiFetch";
import {
  HeatDetectionRequest,
  HeatDetectionResponse,
  BreedingRecordRequest,
  BreedingRecordResponse,
  BreedingStatsResponse,
  BreedingStatus,
  ActionTaken,
} from "@/types/breeding";

const BREEDING_BASE_URL = "/breeding-records";
const HEAT_BASE_URL = "/heat-detections";

// == HEAT DETECTION ==

export const createHeatDetection = (payload: HeatDetectionRequest): Promise<HeatDetectionResponse> =>
  apiFetch(HEAT_BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateHeatDetection = (
  id: number,
  payload: HeatDetectionRequest
): Promise<HeatDetectionResponse> =>
  apiFetch(`${HEAT_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const fetchHeatDetectionById = (id: number): Promise<HeatDetectionResponse> =>
  apiFetch(`${HEAT_BASE_URL}/${id}`);

export const fetchAllHeatDetections = (): Promise<HeatDetectionResponse[]> =>
  apiFetch(HEAT_BASE_URL);

export const fetchHeatDetectionsByAnimal = (animalId: number): Promise<HeatDetectionResponse[]> =>
  apiFetch(`${HEAT_BASE_URL}/animal/${animalId}`);

export const fetchRecentHeatDetections = (days: number): Promise<HeatDetectionResponse[]> =>
  apiFetch(`${HEAT_BASE_URL}/recent?days=${days}`);

export const fetchAnimalsInHeat = (): Promise<HeatDetectionResponse[]> =>
  apiFetch(`${HEAT_BASE_URL}/current`);

export const updateHeatActionTaken = (
  id: number,
  actionTaken: ActionTaken,
  breedingRecordId?: number
): Promise<HeatDetectionResponse> => {
  const params = new URLSearchParams({ actionTaken });
  if (breedingRecordId) params.append("breedingRecordId", breedingRecordId.toString());
  
  return apiFetch(`${HEAT_BASE_URL}/${id}/action?${params.toString()}`, {
    method: "PATCH",
  });
};

export const deleteHeatDetection = (id: number): Promise<void> =>
  apiFetch(`${HEAT_BASE_URL}/${id}`, {
    method: "DELETE",
  });

// == BREEDING RECORDS ==

export const createBreedingFromHeat = (
  heatId: number,
  payload: BreedingRecordRequest
): Promise<BreedingRecordResponse> =>
  apiFetch(`${BREEDING_BASE_URL}/from-heat/${heatId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });


export const fetchAllBreedingRecords = (): Promise<BreedingRecordResponse[]> =>
    apiFetch(`${BREEDING_BASE_URL}`);

export const skipHeatDetection = (heatId: number, reason?: string): Promise<void> => {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  return apiFetch(`${BREEDING_BASE_URL}/heat/${heatId}/skip${params}`, {
    method: "POST",
  });
};


export const confirmPregnancy = (
  breedingId: number,
  confirmationDate?: string,
  remarks?: string
): Promise<BreedingRecordResponse> => {
  const params = new URLSearchParams();
  if (confirmationDate) params.append("confirmationDate", confirmationDate);
  if (remarks) params.append("remarks", remarks);

  return apiFetch(`${BREEDING_BASE_URL}/${breedingId}/confirm-pregnancy?${params.toString()}`, {
    method: "PATCH",
  });
};

export const markPregnancyFailed = (
  breedingId: number,
  checkDate?: string,
  reason?: string
): Promise<BreedingRecordResponse> => {
  const params = new URLSearchParams();
  if (checkDate) params.append("checkDate", checkDate);
  if (reason) params.append("reason", reason);

  return apiFetch(`${BREEDING_BASE_URL}/${breedingId}/mark-failed?${params.toString()}`, {
    method: "PATCH",
  });
};

export const recordCalving = (
  breedingId: number,
  calvingDate?: string,
  remarks?: string
): Promise<BreedingRecordResponse> => {
  const params = new URLSearchParams();
  if (calvingDate) params.append("calvingDate", calvingDate);
  if (remarks) params.append("remarks", remarks);

  return apiFetch(`${BREEDING_BASE_URL}/${breedingId}/record-calving?${params.toString()}`, {
    method: "PATCH",
  });
};

export const fetchBreedingRecordById = (id: number): Promise<BreedingRecordResponse> =>
  apiFetch(`${BREEDING_BASE_URL}/${id}`);

export const fetchBreedingRecordsByAnimal = (animalId: number): Promise<BreedingRecordResponse[]> =>
  apiFetch(`${BREEDING_BASE_URL}/animal/${animalId}`);

export const fetchBreedingRecordsByStatus = (status: BreedingStatus): Promise<BreedingRecordResponse[]> =>
  apiFetch(`${BREEDING_BASE_URL}/status/${status}`);

export const fetchBreedingRecordsByDateRange = (
  startDate: string,
  endDate: string
): Promise<BreedingRecordResponse[]> => {
  const params = new URLSearchParams({ startDate, endDate });
  return apiFetch(`${BREEDING_BASE_URL}/date-range?${params.toString()}`);
};

export const fetchPendingPregnancyChecks = (): Promise<BreedingRecordResponse[]> =>
  apiFetch(`${BREEDING_BASE_URL}/pending-checks`);

export const fetchActivePregnancies = (): Promise<BreedingRecordResponse[]> =>
  apiFetch(`${BREEDING_BASE_URL}/active-pregnancies`);

export const fetchUpcomingCalvings = (daysAhead: number = 30): Promise<BreedingRecordResponse[]> => {
  const params = new URLSearchParams({ daysAhead: daysAhead.toString() });
  return apiFetch(`${BREEDING_BASE_URL}/upcoming-calvings?${params.toString()}`);
};

export const fetchOverdueCalvings = (): Promise<BreedingRecordResponse[]> =>
  apiFetch(`${BREEDING_BASE_URL}/overdue-calvings`);

export const fetchBreedingStats = (): Promise<BreedingStatsResponse> =>
  apiFetch(`${BREEDING_BASE_URL}/stats`);

export const updateBreedingRecord = (
  id: number,
  payload: BreedingRecordRequest
): Promise<BreedingRecordResponse> =>
  apiFetch(`${BREEDING_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteBreedingRecord = (id: number): Promise<void> =>
  apiFetch(`${BREEDING_BASE_URL}/${id}`, {
    method: "DELETE",
  });