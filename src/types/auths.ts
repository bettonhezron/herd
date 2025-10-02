export type UserRole = "ADMIN" | "FARM_OWNER" | "MANAGER" | "WORKER" | "VETERINARIAN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface LoginPayload {
    email: string;
    password: string;
  }
  
  // Response after login
  export interface LoginResponse {
    userEmail: string;
    token: string;
    tokenType: string; 
    expiresIn: string; 
    role: string | null;
    firstName: string | null;
    lastName: string | null;
    lastLogin: string | null; 
  }
  
  // Request payload for register
  export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role?: string; 
  }
  
  export type RegisterResponse = LoginResponse;
  
  // profile user 
  export interface User {
    id?: number;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    lastLogin?: string;
  }
  

  export type UpdateUserPayload = Omit<
    User,
    'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'status' | 'role'
  > & { role?: UserRole };

  
  //user stats
  export interface UserAnalytics {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    workerUsers: number;
  }