import { apiClient } from "@/lib/api/client";
import { createIncidentRequest } from "@/types/incident.types";

export async function CreateIncident(payload: createIncidentRequest) {
  const res = await apiClient.post("/incident/create", payload);

  return res.data;
}
