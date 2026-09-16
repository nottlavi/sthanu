import { IncidentResponse } from "./incident.types";

export interface CreateFamilyRequest {
  familyName: string;
}

export interface JoinFamilyRequest {
  inviteCode: string;
}

export interface FamilyMemberDto {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalDonations: number;
}

export interface FamilyGroupResponse {
  id: string;
  familyName: string;
  inviteCode: string;
  pooledCredits: number;
  members: FamilyMemberDto[];
  familyIncidents?: IncidentResponse[] | null;
}
