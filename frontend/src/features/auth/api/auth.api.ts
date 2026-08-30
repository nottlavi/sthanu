import { apiClient } from "@/lib/api/client";

import type { SendOtpReq, VerifyOtpReq } from "@/types/auth.types";

export async function sendOTPReq(payload: SendOtpReq) {
  const response = await apiClient.post("/api/auth/send-otp", payload);

  return response.data;
}

export async function verifyOTPReq(payload: VerifyOtpReq) {
  const response = await apiClient.post("/api/auth/verify-otp", payload);

  return response.data;
}
