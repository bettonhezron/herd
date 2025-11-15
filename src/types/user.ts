export type UserRole = "ADMIN" | "FARM_OWNER" | "MANAGER" | "WORKER" | "VETERINARIAN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  lastLogin: string;
  phoneNumber: string | null;
  photoUrl: string | null;
  updatedAt: string;
  createdAt: string;
  status: UserStatus;
}

export type UpdateUserPayload = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'status' | 'role'
> & { role?: UserRole };


export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}
