"use client";

import { useState } from "react";
import { AuthStep } from "@/types/auth.types";
import VerifyForm from "./VerifyForm";
import PhoneForm from "./PhoneForm";
import CompleteProfileForm from "./CompleteProfileForm";
import { useRouter, useSearchParams } from "next/navigation";

export default function Onboard() {
  const [currentState, setCurrentCurrentState] = useState<AuthStep>("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOtpSent = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentCurrentState("VERIFY");
  };

  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleVerifyOtp = (isProfileComplete: boolean) => {
    if (isProfileComplete) {
      router.push(returnUrl);
    } else {
      setCurrentCurrentState("PROFILE");
    }
  };

  const onProfileComplete = () => {
    router.push(returnUrl);
  };

  return (
    <>
      {currentState === "PHONE" && <PhoneForm onOtpSent={handleOtpSent} />}

      {currentState === "VERIFY" && (
        <VerifyForm phoneNumber={phoneNumber} onSuccess={handleVerifyOtp} />
      )}

      {currentState === "PROFILE" && (
        <CompleteProfileForm onProfileComplete={onProfileComplete} />
      )}
    </>
  );
}
