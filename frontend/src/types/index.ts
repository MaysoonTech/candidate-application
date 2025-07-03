// frontend/src/types/index.ts
import { CandidateStatus } from "./status";
import { Department } from "./department";

export interface Candidate {
  id: number;
  full_name: string;
  date_of_birth: string;
  years_of_experience: number;
  department: Department;
  email: string;
  phone: string;
  current_status: CandidateStatus;
  created_at: string;
  resume_url: string;
}

export interface StatusHistory {
  id: number;
  candidate_id: number;
  status: CandidateStatus;
  feedback: string | null;
  changed_at: string;
  changed_by: string;
}