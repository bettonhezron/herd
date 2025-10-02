export type UserRole = "ADMIN" | "FARM_OWNER" | "MANAGER" | "WORKER" | "VETERINARIAN"; 
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id?: number;          
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: UserRole;
  status?: UserStatus;
}
