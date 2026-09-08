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
