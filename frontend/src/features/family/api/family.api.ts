import { apiClient } from "@/lib/api/client";
import { FamilyGroupResponse } from "@/types/family.types";

export async function getFamily(): Promise<FamilyGroupResponse | null> {
  try {
    const res = await apiClient.get("/family/get-family");

    return res.data;
  } catch (err: any) {
    if (err.resposne?.status === 400) {
      return null;
    }
    throw err;
  }
}
