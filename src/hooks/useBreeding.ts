import { useQuery, useMutation, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createHeatDetection,
  updateHeatDetection,
  fetchHeatDetectionById,
  fetchAllHeatDetections,
  fetchHeatDetectionsByAnimal,
  fetchRecentHeatDetections,
  fetchAnimalsInHeat,
  updateHeatActionTaken,
  deleteHeatDetection,
  createBreedingFromHeat,
  skipHeatDetection,
  confirmPregnancy,
  markPregnancyFailed,
  recordCalving,
  fetchBreedingRecordById,
  fetchBreedingRecordsByAnimal,
  fetchBreedingRecordsByStatus,
  fetchBreedingRecordsByDateRange,
  fetchPendingPregnancyChecks,
  fetchActivePregnancies,
  fetchUpcomingCalvings,
  fetchOverdueCalvings,
  fetchBreedingStats,
  updateBreedingRecord,
  deleteBreedingRecord,
} from "@/api/breedingApi";
import {
  HeatDetectionRequest,
  HeatDetectionResponse,
  BreedingRecordRequest,
  BreedingRecordResponse,
  BreedingStatsResponse,
  BreedingStatus,
  ActionTaken,
} from "@/types/breeding";

// Query Keys
export const breedingKeys = {
  all: ["breeding"] as const,
  heat: () => [...breedingKeys.all, "heat"] as const,
  heatDetail: (id: number) => [...breedingKeys.heat(), id] as const,
  heatByAnimal: (animalId: number) => [...breedingKeys.heat(), "animal", animalId] as const,
  recentHeat: (days: number) => [...breedingKeys.heat(), "recent", days] as const,
  inHeat: () => [...breedingKeys.heat(), "current"] as const,
  
  records: () => [...breedingKeys.all, "records"] as const,
  record: (id: number) => [...breedingKeys.records(), id] as const,
  recordsByAnimal: (animalId: number) => [...breedingKeys.records(), "animal", animalId] as const,
  recordsByStatus: (status: BreedingStatus) => [...breedingKeys.records(), "status", status] as const,
  recordsByDateRange: (start: string, end: string) => [...breedingKeys.records(), "range", start, end] as const,
  pendingChecks: () => [...breedingKeys.records(), "pending-checks"] as const,
  activePregnancies: () => [...breedingKeys.records(), "active"] as const,
  upcomingCalvings: (days: number) => [...breedingKeys.records(), "upcoming", days] as const,
  overdueCalvings: () => [...breedingKeys.records(), "overdue"] as const,
  stats: () => [...breedingKeys.all, "stats"] as const,
};

// ==================== HEAT DETECTION QUERIES ====================

export const useHeatDetection = (id: number): UseQueryResult<HeatDetectionResponse> => {
  return useQuery({
    queryKey: breedingKeys.heatDetail(id),
    queryFn: () => fetchHeatDetectionById(id),
    enabled: !!id,
  });
};

export const useAllHeatDetections = (): UseQueryResult<HeatDetectionResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.heat(),
    queryFn: fetchAllHeatDetections,
  });
};

export const useHeatDetectionsByAnimal = (animalId: number): UseQueryResult<HeatDetectionResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.heatByAnimal(animalId),
    queryFn: () => fetchHeatDetectionsByAnimal(animalId),
    enabled: !!animalId,
  });
};

export const useRecentHeatDetections = (days: number = 7): UseQueryResult<HeatDetectionResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.recentHeat(days),
    queryFn: () => fetchRecentHeatDetections(days),
  });
};

export const useAnimalsInHeat = (): UseQueryResult<HeatDetectionResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.inHeat(),
    queryFn: fetchAnimalsInHeat,
  });
};

// ==================== BREEDING RECORD QUERIES ====================

export const useBreedingRecord = (id: number): UseQueryResult<BreedingRecordResponse> => {
  return useQuery({
    queryKey: breedingKeys.record(id),
    queryFn: () => fetchBreedingRecordById(id),
    enabled: !!id,
  });
};

export const useBreedingRecordsByAnimal = (animalId: number): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.recordsByAnimal(animalId),
    queryFn: () => fetchBreedingRecordsByAnimal(animalId),
    enabled: !!animalId,
  });
};

export const useBreedingRecordsByStatus = (status: BreedingStatus): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.recordsByStatus(status),
    queryFn: () => fetchBreedingRecordsByStatus(status),
    enabled: !!status,
  });
};

export const usePendingPregnancyChecks = (): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.pendingChecks(),
    queryFn: fetchPendingPregnancyChecks,
  });
};

export const useActivePregnancies = (): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.activePregnancies(),
    queryFn: fetchActivePregnancies,
  });
};

export const useUpcomingCalvings = (daysAhead: number = 30): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.upcomingCalvings(daysAhead),
    queryFn: () => fetchUpcomingCalvings(daysAhead),
  });
};

export const useOverdueCalvings = (): UseQueryResult<BreedingRecordResponse[]> => {
  return useQuery({
    queryKey: breedingKeys.overdueCalvings(),
    queryFn: fetchOverdueCalvings,
  });
};

export const useBreedingStats = (): UseQueryResult<BreedingStatsResponse> => {
  return useQuery({
    queryKey: breedingKeys.stats(),
    queryFn: fetchBreedingStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== HEAT DETECTION MUTATIONS ====================

export const useCreateHeatDetection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HeatDetectionRequest) => createHeatDetection(payload),
    onSuccess: () => {
      toast.success("Heat detection recorded successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record heat detection");
    },
  });
};

export const useUpdateHeatDetection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: HeatDetectionRequest }) =>
      updateHeatDetection(id, payload),
    onSuccess: (data) => {
      toast.success("Heat detection updated successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.heatDetail(data.id) });
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update heat detection");
    },
  });
};

export const useDeleteHeatDetection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteHeatDetection(id),
    onSuccess: () => {
      toast.success("Heat detection deleted successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete heat detection");
    },
  });
};

// ==================== BREEDING WORKFLOW MUTATIONS ====================

export const useCreateBreedingFromHeat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ heatId, payload }: { heatId: number; payload: BreedingRecordRequest }) =>
      createBreedingFromHeat(heatId, payload),
    onSuccess: () => {
      toast.success("Breeding recorded successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record breeding");
    },
  });
};

export const useSkipHeatDetection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ heatId, reason }: { heatId: number; reason?: string }) =>
      skipHeatDetection(heatId, reason),
    onSuccess: () => {
      toast.success("Heat detection skipped");
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to skip heat detection");
    },
  });
};

export const useConfirmPregnancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ breedingId, confirmationDate, remarks }: { 
      breedingId: number; 
      confirmationDate?: string; 
      remarks?: string 
    }) => confirmPregnancy(breedingId, confirmationDate, remarks),
    onSuccess: () => {
      toast.success("Pregnancy confirmed successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm pregnancy");
    },
  });
};

export const useMarkPregnancyFailed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ breedingId, checkDate, reason }: { 
      breedingId: number; 
      checkDate?: string; 
      reason?: string 
    }) => markPregnancyFailed(breedingId, checkDate, reason),
    onSuccess: () => {
      toast.success("Pregnancy marked as failed");
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update pregnancy status");
    },
  });
};

export const useRecordCalving = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ breedingId, calvingDate, remarks }: { 
      breedingId: number; 
      calvingDate?: string; 
      remarks?: string 
    }) => recordCalving(breedingId, calvingDate, remarks),
    onSuccess: () => {
      toast.success("Calving recorded successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ["animals"] }); // Refresh animal lactation status
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record calving");
    },
  });
};

export const useUpdateBreedingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BreedingRecordRequest }) =>
      updateBreedingRecord(id, payload),
    onSuccess: (data) => {
      toast.success("Breeding record updated successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.record(data.id) });
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update breeding record");
    },
  });
};

export const useDeleteBreedingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBreedingRecord(id),
    onSuccess: () => {
      toast.success("Breeding record deleted successfully");
      queryClient.invalidateQueries({ queryKey: breedingKeys.records() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.heat() });
      queryClient.invalidateQueries({ queryKey: breedingKeys.stats() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete breeding record");
    },
  });
};