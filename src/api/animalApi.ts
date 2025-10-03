import { apiFetch } from "@/lib/fetcher";
import { Animal, AnimalsAnalytics, CreateAnimalPayload, UpdateAnimalPayload } from "@/types/animal";

const ANIMAL_BASE_URL = "/animals";

// Fetch all animals
export const fetchAnimals = (): Promise<Animal[]> =>
  apiFetch(ANIMAL_BASE_URL);

// Fetch a single animal by ID
export const fetchAnimalById = (id: number): Promise<Animal> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`);

// Create a new animal
export const createAnimal = (payload: CreateAnimalPayload): Promise<Animal> =>
  apiFetch(ANIMAL_BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Update an existing animal
export const updateAnimal = (id: number, payload: UpdateAnimalPayload): Promise<Animal> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// Delete an animal
export const deleteAnimal = (id: number): Promise<void> =>
  apiFetch(`${ANIMAL_BASE_URL}/${id}`, {
    method: "DELETE",
  });


export const fetchAnimalAnalytics = (): Promise<AnimalsAnalytics> =>
    apiFetch(`${ANIMAL_BASE_URL}/analytics`, {
      method: "GET",
    });