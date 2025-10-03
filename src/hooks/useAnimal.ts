import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import {
  fetchAnimals,
  fetchAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  fetchAnimalAnalytics,
} from "@/api/animalApi";
import {
  Animal,
  CreateAnimalPayload,
  UpdateAnimalPayload,
  AnimalsAnalytics,
} from "@/types/animal";

export const ANIMAL_BASE_URL = "/animals";

export const animalKeys = {
  all: [ANIMAL_BASE_URL] as const,
  lists: () => [...animalKeys.all, "list"] as const,
  detail: (id: number) => [...animalKeys.all, "detail", id] as const,
  analytics: () => [...animalKeys.all, "analytics"] as const,
};

//  Get all animals
export const useAnimals = (): UseQueryResult<Animal[]> => {
  return useQuery({
    queryKey: animalKeys.lists(),
    queryFn: fetchAnimals,
    staleTime: 5 * 60 * 1000,
  });
};

//  Get one animal by ID
export const useAnimal = (id: number): UseQueryResult<Animal> => {
  return useQuery({
    queryKey: animalKeys.detail(id),
    queryFn: () => fetchAnimalById(id),
    enabled: !!id,
  });
};

//  Create animal + refresh lists, analytics
export const useCreateAnimal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAnimalPayload) => createAnimal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
    },
  });
};

//  Update animal + refresh lists, detail, analytics
export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAnimalPayload }) =>
      updateAnimal(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
    },
  });
};

// Delete animal + refresh lists, analytics
export const useDeleteAnimal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAnimal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
    },
  });
};

//  Animal analytics hook
export const useAnimalAnalytics = (): UseQueryResult<AnimalsAnalytics> => {
  return useQuery({
    queryKey: animalKeys.analytics(),
    queryFn: fetchAnimalAnalytics,
    staleTime: 5 * 60 * 1000,
  });
};
