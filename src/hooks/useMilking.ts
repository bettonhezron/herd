import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  recordMilking,
  updateMilkingRecord,
  fetchMilkingRecordById,
  fetchMilkingRecordsByAnimal,
  fetchMilkingRecordsByDate,
  fetchMilkingRecordsByDateRange,
  fetchDailyMilkingStats,
  fetchCowMilkingSummaries,
  fetchCowsNotMilked,
  fetchAnimalAverageMilk,
  deleteMilkingRecord,
} from "@/api/milking";
import {
  MilkingRecordRequest,
  MilkingRecordResponse,
  MilkingShift,
} from "@/types/milking";

// Query Keys
export const milkingKeys = {
  all: ["milking"] as const,
  records: () => [...milkingKeys.all, "records"] as const,
  record: (id: number) => [...milkingKeys.records(), id] as const,
  byAnimal: (animalId: number) => [...milkingKeys.records(), "animal", animalId] as const,
  byDate: (date: string) => [...milkingKeys.records(), "date", date] as const,
  byDateRange: (startDate: string, endDate: string) => 
    [...milkingKeys.records(), "range", startDate, endDate] as const,
  stats: (date?: string) => [...milkingKeys.all, "stats", date] as const,
  summaries: (date?: string) => [...milkingKeys.all, "summaries", date] as const,
  notMilked: (shift: MilkingShift) => [...milkingKeys.all, "not-milked", shift] as const,
  average: (animalId: number, days: number) => 
    [...milkingKeys.all, "average", animalId, days] as const,
};

// Get milking record by id
export const useMilkingRecord = (id: number) => {
  return useQuery({
    queryKey: milkingKeys.record(id),
    queryFn: () => fetchMilkingRecordById(id),
    enabled: !!id,
  });
};

// Get milking records by animal
export const useMilkingRecordsByAnimal = (animalId: number) => {
  return useQuery({
    queryKey: milkingKeys.byAnimal(animalId),
    queryFn: () => fetchMilkingRecordsByAnimal(animalId),
    enabled: !!animalId,
  });
};

// Get milking records by date
export const useMilkingRecordsByDate = (date: string) => {
  return useQuery({
    queryKey: milkingKeys.byDate(date),
    queryFn: () => fetchMilkingRecordsByDate(date),
    enabled: !!date,
  });
};

// Get milking records by date range
export const useMilkingRecordsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: milkingKeys.byDateRange(startDate, endDate),
    queryFn: () => fetchMilkingRecordsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
};

// Get daily milking stats
export const useDailyMilkingStats = (date?: string) => {
  return useQuery({
    queryKey: milkingKeys.stats(date),
    queryFn: () => fetchDailyMilkingStats(date),
  });
};

// Get cow milking summaries
export const useCowMilkingSummaries = (date?: string) => {
  return useQuery({
    queryKey: milkingKeys.summaries(date),
    queryFn: () => fetchCowMilkingSummaries(date),
  });
};

// Get cows not milked for shift
export const useCowsNotMilked = (shift: MilkingShift) => {
  return useQuery({
    queryKey: milkingKeys.notMilked(shift),
    queryFn: () => fetchCowsNotMilked(shift),
    enabled: !!shift,
  });
};

// Get animal average milk
export const useAnimalAverageMilk = (animalId: number, days: number = 7) => {
  return useQuery({
    queryKey: milkingKeys.average(animalId, days),
    queryFn: () => fetchAnimalAverageMilk(animalId, days),
    enabled: !!animalId,
  });
};

// Record milking mutation
export const useRecordMilking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MilkingRecordRequest) => recordMilking(payload),
    onSuccess: (data) => {
      toast.success("Milking recorded successfully");
      queryClient.invalidateQueries({ queryKey: milkingKeys.records() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.byAnimal(data.animalId) });
      queryClient.invalidateQueries({ queryKey: milkingKeys.notMilked(data.shift) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record milking");
    },
  });
};

// Update milking record mutation
export const useUpdateMilkingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<MilkingRecordRequest> }) =>
      updateMilkingRecord(id, payload),
    onSuccess: (data) => {
      toast.success("Milking record updated successfully");
      queryClient.invalidateQueries({ queryKey: milkingKeys.record(data.id) });
      queryClient.invalidateQueries({ queryKey: milkingKeys.records() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.byAnimal(data.animalId) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update milking record");
    },
  });
};

// Delete milking record mutation
export const useDeleteMilkingRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMilkingRecord(id),
    onSuccess: () => {
      toast.success("Milking record deleted successfully");
      queryClient.invalidateQueries({ queryKey: milkingKeys.records() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: milkingKeys.summaries() });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete milking record");
    },
  });
};