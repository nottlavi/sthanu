export interface SendOtpReq {
  phoneNumber: string;
}

export interface VerifyOtpReq {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifyOtpRes {
  token: string;
  isProfileComplete: boolean;
}

export type AuthStep = "PHONE" | "VERIFY" | "PROFILE";
