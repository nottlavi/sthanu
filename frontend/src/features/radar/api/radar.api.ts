import { apiClient } from "@/lib/api/client";
import { getRawReq } from "@/types/radar.types";

export async function getRawFacilities(payload: getRawReq) {
  const res = await apiClient.post("/facility/get-raw", payload);

  return res.data;
}
