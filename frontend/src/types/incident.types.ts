export type IncidentType = "BLOOD" | "VENOM";

export type BloodGroup =
  | "O+"
  | "A+"
  | "B+"
  | "AB+"
  | "O-"
  | "A-"
  | "B-"
  | "AB-";

export interface createIncidentRequest {
  incidentType: number;
  locationName: string;
  latitude: number;
  longitude: number;
  bloodGroup?: number;
  unitsRequired?: number;
  vialsRequired?: number;
}

export const INCIDENT_TYPE_MAP: Record<IncidentType, number> = {
  BLOOD: 1,
  VENOM: 2,
};

export const BLOOD_GROUP_MAP: Record<BloodGroup, number> = {
  "O+": 1,
  "A+": 2,
  "B+": 3,
  "AB+": 4,
  "O-": 5,
  "A-": 6,
  "B-": 7,
  "AB-": 8,
};

export const BLOOD_GROUP_REVERSE_MAP: Record<number, BloodGroup> = {
  1: "O+",
  2: "A+",
  3: "B+",
  4: "AB+",
  5: "O-",
  6: "A-",
  7: "B-",
  8: "AB-",
};

export interface IncidentParticipant {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IncidentResponse {
  id: string;
  userId: string;
  familyId?: string | null;
  incidentType: 1 | 2; // 1 = Blood, 2 = Venom
  locationName: string;
  latitude: number;
  longitude: number;
  bloodGroup?: number | null;
  unitsRequired?: number | null;
  vialsRequired?: number | null;
  shareCode: string;
  status: 1 | 2 | 3; // 1 = Active, 2 = Resolved, 3 = Cancelled
  createdAtUtc: string;
  participants: IncidentParticipant[];
}
