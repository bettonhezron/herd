import { apiFetch } from "@/lib/fetcher";
import { UserAnalytics } from "@/types/auths";
import { UpdateUserPayload, User } from "@/types/user";

const USER_BASE_URL = "/users";

export const fetchUsers = (): Promise<User[]> =>
  apiFetch(USER_BASE_URL);

export const fetchUserById = (id: number): Promise<User> =>
  apiFetch(`${USER_BASE_URL}/${id}`);

export const updateUser = (id: number, payload: UpdateUserPayload): Promise<User> =>
  apiFetch(`${USER_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const activateUser = (id: number): Promise<void> =>
  apiFetch(`${USER_BASE_URL}/${id}/activate`, {
    method: "PUT",
  });

export const deactivateUser = (id: number): Promise<void> =>
  apiFetch(`${USER_BASE_URL}/${id}/deactivate`, {
    method: "PUT",
  });

export const deleteUser = (id: number): Promise<void> =>
  apiFetch(`${USER_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  export const fetchUserStats = (): Promise<UserAnalytics> =>
    apiFetch(`${USER_BASE_URL}/analytics`, {
      method: "GET",
    });
  
