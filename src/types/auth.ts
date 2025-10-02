export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    userEmail: string;
    token: string;
    tokenType: string;
    expiresIn: string;
    role: string;
    firstName: string;
    lastName: string;
    lastLogin: string; 

  }
   
  export interface User {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    lastLogin: string;
    phoneNumber: string | null;
    photoUrl: string | null;
    updatedAt: string;
    createdAt: string; 
    

  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
  }
  
  