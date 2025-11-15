import { apiFetch } from "@/lib/apiFetch";
import { UserAnalytics } from "@/types/auths";
import { PageResponse, UpdateUserPayload, User } from "@/types/user";

const USER_BASE_URL = "/users";

interface FetchUsersParams {
  page: number;
  size?: number; 
}

export const fetchUsers = ({ page, size = 10 }: FetchUsersParams): Promise<PageResponse<User>> => {
  const queryString = new URLSearchParams({ 
      page: page.toString(), 
      size: size.toString() 
  }).toString();
  
  return apiFetch(`${USER_BASE_URL}?${queryString}`);
};


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
  
