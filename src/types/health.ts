export type HealthType = "vaccination" | "treatment" | "checkup" | "emergency";
export type HealthStatus = "completed" | "scheduled" | "overdue";

export interface HealthRecord {
  id: string;
  animalId: string;          
  animalTag: string;      
  animalName: string;       
  type: HealthType;         
  description?: string;     
  date: string;              
  veterinarian?: string;     
  diagnosis?: string;       
  treatment?: string;       
  notes?: string;            
  status: HealthStatus;      
}
