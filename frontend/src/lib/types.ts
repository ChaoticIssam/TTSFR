export type UserRole = "ADMIN" | "COORDINATOR" | "EXPERT" | "COOPERATIVE";

export interface CooperativeSummary {
  id: string;
  name: string;
  region?: string | null;
  city?: string | null;
  member_count: number;
  women_member_count: number;
  sector_id?: string | null;
  sub_sector_id?: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  is_active: boolean;
  cooperative?: CooperativeSummary | null;
}

export interface SubSector {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  order_index: number;
}

export interface Sector {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  order_index: number;
  sub_sectors: SubSector[];
}

export interface Cooperative {
  id: string;
  user_id: string;
  name: string;
  registration_number?: string | null;
  region?: string | null;
  city?: string | null;
  address?: string | null;
  member_count: number;
  women_member_count: number;
  sector_id?: string | null;
  sub_sector_id?: string | null;
  activity_description?: string | null;
  products_list: string[];
  equipment_list: string[];
  created_at: string;
  updated_at: string;
  sector?: Sector | null;
  sub_sector?: SubSector | null;
}

export interface Cluster {
  id: string;
  code: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  color_code?: string | null;
  icon?: string | null;
  order_index: number;
}

export interface DiagnosticSubmission {
  id: string;
  cooperative_id: string;
  status: "DRAFT" | "SUBMITTED" | "VALIDATED";
  current_step: number;
  answers: Record<string, any>;
  score_operational?: number | null;
  score_economic?: number | null;
  score_organizational?: number | null;
  score_tech_energy?: number | null;
  score_global?: number | null;
  cluster_id?: string | null;
  rule_version: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  cooperative_id?: string | null;
}
