"use client";

interface VerifyFormProps {
  phoneNumber: string;
  onSuccess: (isProfileComplete: boolean) => void;
}

import { verifyOTPReq } from "@/features/auth/api/auth.api";
import React, { useState } from "react";

export default function VerifyForm({
  phoneNumber,
  onSuccess,
}: VerifyFormProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtpPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyOTPReq({ phoneNumber, otpCode: otp });
      onSuccess(res.isProfileComplete);
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, "");

    if (numericValue.length <= 6) {
      setOtp(numericValue);
      if (error) setError("");
    }
  };

  const isButtonDisabled = loading || otp.length !== 6;

  return (
    <div className="w-full max-w-xs flex flex-col gap-8">
      {/* Branding with Context Subtitle */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase">
          STHANU
        </h1>
        <p className="text-xs text-neutral-400">
          Code sent to {phoneNumber}
        </p>
      </div>

      {/* Minimal Form */}
      <form className="flex flex-col gap-4" onSubmit={verifyOtpPost}>
        <div>
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              autoFocus
              required
              disabled={loading}
              className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none tracking-widest text-center disabled:opacity-50"
              value={otp}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 mt-2 font-medium text-center">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
