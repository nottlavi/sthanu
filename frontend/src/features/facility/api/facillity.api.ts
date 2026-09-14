import { apiClient } from "@/lib/api/client";
import { GetNearestFacilitiesRequest } from "@/types/facility.types";

export async function fetchFacilites(payload: GetNearestFacilitiesRequest) {
  const res = await apiClient.post("/facility/get-nearest", payload);

  return res.data;
}
