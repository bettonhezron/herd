import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAnimals,
  fetchAnimalsSummary,
  fetchAnimalById,
  fetchAnimalByTag,
  fetchAnimalsByStatus,
  fetchActiveLactatingCows,
  fetchAnimalsDueForDryOff,
  fetchHeifersReadyForBreeding,
  searchAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  fetchAnimalAnalytics,
  validateTagNumber,
} from "@/api/animalsApi";
import {
  AnimalDto,
  AnimalSummaryDto,
  AnimalAnalyticsDto,
  CreateAnimalRequest,
  UpdateAnimalRequest,
  AnimalStatus,
} from "@/types/animals";

// Query Keys
export const animalKeys = {
  all: ["animals"] as const,
  lists: () => [...animalKeys.all, "list"] as const,
  summaries: () => [...animalKeys.all, "summaries"] as const,
  detail: (id: number) => [...animalKeys.all, "detail", id] as const,
  byTag: (tagNumber: string) => [...animalKeys.all, "tag", tagNumber] as const,
  byStatus: (status: AnimalStatus) => [...animalKeys.all, "status", status] as const,
  lactating: () => [...animalKeys.all, "lactating"] as const,
  dueForDryOff: () => [...animalKeys.all, "due-for-dry-off"] as const,
  readyForBreeding: () => [...animalKeys.all, "ready-for-breeding"] as const,
  search: (query: string) => [...animalKeys.all, "search", query] as const,
  analytics: () => [...animalKeys.all, "analytics"] as const,
  validateTag: (tagNumber: string) => [...animalKeys.all, "validate", tagNumber] as const,
};

// Get all animals
export const useAnimals = (): UseQueryResult<AnimalDto[]> => {
  return useQuery({
    queryKey: animalKeys.lists(),
    queryFn: fetchAnimals,
    staleTime: 5 * 60 * 1000,
  });
};

// Get animals summary
export const useAnimalsSummary = (): UseQueryResult<AnimalSummaryDto[]> => {
  return useQuery({
    queryKey: animalKeys.summaries(),
    queryFn: fetchAnimalsSummary,
    staleTime: 5 * 60 * 1000,
  });
};

// Get animal by ID
export const useAnimal = (id: number): UseQueryResult<AnimalDto> => {
  return useQuery({
    queryKey: animalKeys.detail(id),
    queryFn: () => fetchAnimalById(id),
    enabled: !!id,
  });
};

// Get animal by tag number
export const useAnimalByTag = (tagNumber: string): UseQueryResult<AnimalDto> => {
  return useQuery({
    queryKey: animalKeys.byTag(tagNumber),
    queryFn: () => fetchAnimalByTag(tagNumber),
    enabled: !!tagNumber,
  });
};

// Get animals by status
export const useAnimalsByStatus = (status: AnimalStatus): UseQueryResult<AnimalDto[]> => {
  return useQuery({
    queryKey: animalKeys.byStatus(status),
    queryFn: () => fetchAnimalsByStatus(status),
    enabled: !!status,
  });
};

// Get active lactating cows (for milking)
export const useActiveLactatingCows = (): UseQueryResult<AnimalDto[]> => {
  return useQuery({
    queryKey: animalKeys.lactating(),
    queryFn: fetchActiveLactatingCows,
    staleTime: 2 * 60 * 1000, // 2 minutes - fresher data for milking
  });
};

// Get animals due for dry off
export const useAnimalsDueForDryOff = (): UseQueryResult<AnimalDto[]> => {
  return useQuery({
    queryKey: animalKeys.dueForDryOff(),
    queryFn: fetchAnimalsDueForDryOff,
  });
};

// Get heifers ready for breeding
export const useHeifersReadyForBreeding = (): UseQueryResult<AnimalDto[]> => {
  return useQuery({
    queryKey: animalKeys.readyForBreeding(),
    queryFn: fetchHeifersReadyForBreeding,
  });
};

// Search animals
export const useSearchAnimals = (query: string): UseQueryResult<AnimalSummaryDto[]> => {
  return useQuery({
    queryKey: animalKeys.search(query),
    queryFn: () => searchAnimals(query),
    enabled: query.length > 0,
  });
};

// Get animal analytics
export const useAnimalAnalytics = (): UseQueryResult<AnimalAnalyticsDto> => {
  return useQuery({
    queryKey: animalKeys.analytics(),
    queryFn: fetchAnimalAnalytics,
    staleTime: 5 * 60 * 1000,
  });
};

// Validate tag number
export const useValidateTagNumber = (tagNumber: string) => {
  return useQuery({
    queryKey: animalKeys.validateTag(tagNumber),
    queryFn: () => validateTagNumber(tagNumber),
    enabled: tagNumber.length > 0,
  });
};

// Create animal mutation
export const useCreateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAnimalRequest) => createAnimal(payload),
    onSuccess: () => {
      toast.success("Animal created successfully");
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create animal");
    },
  });
};

// Update animal mutation
export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAnimalRequest }) =>
      updateAnimal(id, payload),
    onSuccess: (data) => {
      toast.success("Animal updated successfully");
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: animalKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: animalKeys.lactating() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update animal");
    },
  });
};

// Delete animal mutation
export const useDeleteAnimal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAnimal(id),
    onSuccess: () => {
      toast.success("Animal deleted successfully");
      queryClient.invalidateQueries({ queryKey: animalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: animalKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: animalKeys.analytics() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete animal");
    },
  });
};