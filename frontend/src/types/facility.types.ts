import type { BloodGroup } from "../types/incident.types";

export enum FacilityType {
  Hospital = 1,
  BloodBank = 2,
  BSU = 3,
}

export interface BloodStockDto {
  bloodGroup: BloodGroup;
  quantity: number;
}

export interface Facility {
  facilityName: string;
  facilityType: number;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  contactPhone: string;
  email?: string;
  bloodStockDto?: [BloodStockDto];
  venomVialsCount: number;
}

export interface GetNearestFacilitiesRequest {
  latitude: number;
  longitude: number;
  incidentId: string;
  radius?: number;
}
