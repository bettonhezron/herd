import { apiFetch } from "@/lib/apiFetch";
import {
  AnimalDto,
  AnimalSummaryDto,
  AnimalAnalyticsDto,
  CreateAnimalRequest,
  UpdateAnimalRequest,
  AnimalStatus
} from "@/types/animals";

const ANIMAL_BASE_URL = "/animals";

export const fetchAnimals = (): Promise<AnimalDto[]> =>
  apiFetch(ANIMAL_BASE_URL);

export const fetchAnimalsSummary = (): Promise<AnimalSummaryDto[]> =>
  apiFetch(`${ANIMAL_BASE_URL}/summary`);

export const fetchAnimalById = (id: number): Promise<AnimalDto> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`);

export const fetchAnimalByTag = (tagNumber: string): Promise<AnimalDto> =>
  apiFetch(`${ANIMAL_BASE_URL}/tag/${tagNumber}`);

export const fetchAnimalsByStatus = (status: AnimalStatus): Promise<AnimalDto[]> =>
  apiFetch(`${ANIMAL_BASE_URL}/status/${status}`);

export const fetchActiveLactatingCows = (): Promise<AnimalDto[]> =>
  apiFetch(`${ANIMAL_BASE_URL}/lactating`);

export const fetchAnimalsDueForDryOff = (): Promise<AnimalDto[]> =>
  apiFetch(`${ANIMAL_BASE_URL}/due-for-dry-off`);

export const fetchHeifersReadyForBreeding = (): Promise<AnimalDto[]> =>
  apiFetch(`${ANIMAL_BASE_URL}/ready-for-breeding`);

export const searchAnimals = (query: string): Promise<AnimalSummaryDto[]> => {
  const queryString = new URLSearchParams({ query }).toString();
  return apiFetch(`${ANIMAL_BASE_URL}/search?${queryString}`);
};

export const createAnimal = (payload: CreateAnimalRequest): Promise<AnimalDto> =>
  apiFetch(ANIMAL_BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAnimal = (id: number, payload: UpdateAnimalRequest): Promise<AnimalDto> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAnimal = (id: number): Promise<void> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`, {
    method: "DELETE",
  });

export const fetchAnimalAnalytics = (): Promise<AnimalAnalyticsDto> =>
  apiFetch(`${ANIMAL_BASE_URL}/analytics`);

export const validateTagNumber = (tagNumber: string): Promise<{ available: boolean; tagNumber: boolean }> =>
  apiFetch(`${ANIMAL_BASE_URL}/validate-tag/${tagNumber}`);