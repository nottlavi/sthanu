import { apiClient } from "@/lib/api/client";
import {
  createFamReq,
  FamilyGroupResponse,
  JoinFamilyReq,
} from "@/types/family.types";
import axios from "axios";

export async function getFamily(): Promise<FamilyGroupResponse | null> {
  try {
    const res = await apiClient.get("/family/get-family");

    console.log(res);

    return res.data;
  } catch (err: any) {
    if (err.resposne?.status === 400) {
      return null;
    }
    throw err;
  }
}

export async function createFamily(payload: createFamReq) {
  const res = await apiClient.post("/family/create", payload);

  return res.data;
}

export async function joinFamily(payload: JoinFamilyReq) {
  const res = await apiClient.post("/family/join", payload);
  return res.data;
}
