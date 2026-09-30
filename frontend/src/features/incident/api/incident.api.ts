import { apiClient } from "@/lib/api/client";
import {
  createIncidentRequest,
  IncidentResponse,
} from "@/types/incident.types";

export async function CreateIncident(payload: createIncidentRequest) {
  const res = await apiClient.post("/incident/create", payload);
  return res.data;
}

export async function fetchUserIncidents(): Promise<IncidentResponse[]> {
  const res = await apiClient.get("/incident/my-incidents");

  return res.data;
}
