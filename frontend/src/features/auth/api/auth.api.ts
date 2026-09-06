import { apiClient } from "@/lib/api/client";

import type {
  CompleteProfileReq,
  SendOtpReq,
  User,
  VerifyOtpReq,
} from "@/types/auth.types";
import axios from "axios";

export async function sendOTPReq(payload: SendOtpReq) {
  const response = await apiClient.post("/auth/send-otp", payload);

  return response.data;
}

export async function verifyOTPReq(payload: VerifyOtpReq) {
  const response = await axios.post("/api/auth/verify-otp", payload);

  return response.data;
}

export async function completeProfile(payload: CompleteProfileReq) {
  const response = await apiClient.post("/auth/complete-profile", payload);

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}
