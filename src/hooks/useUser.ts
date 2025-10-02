import {
  activateUser,
  deactivateUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  fetchUserStats,
  updateUser,
} from "@/api/usersApi";
import { UpdateUserPayload, User } from "@/types/user";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

const USER_BASE_URL = "/users";

export const userKeys = {
  all: [USER_BASE_URL] as const,
  lists: () => [...userKeys.all, "list"] as const,
  stats: () => [...userKeys.all, "stats"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

//  Fetch all users
export const useUsers = (): UseQueryResult<User[]> => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  });
};

// Fetch single user
export const useUser = (id: number): UseQueryResult<User> => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
};

//  Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(updatedUser.id),
      });
    },
  });
};

//  Activate user
export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

// Deactivate user
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

//  Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: fetchUserStats,
    staleTime: 5 * 60 * 1000, 
  });
};
