export interface SendOtpReq {
  phoneNumber: string;
}

export interface VerifyOtpReq {
  phoneNumber: string;
  otpCode: string;
}

//we haven't attached this anywhere so why write this?
export interface VerifyOtpRes {
  token: string;
  isProfileComplete: boolean;
}

export interface CompleteProfileReq {
  firstName: string;
  lastName: string;
}

export type AuthStep = "PHONE" | "VERIFY" | "PROFILE";
