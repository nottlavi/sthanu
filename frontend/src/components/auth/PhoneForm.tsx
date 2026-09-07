"use client";

interface PhoneFormProps {
  onOtpSent: (phone: string) => void;
}

import { sendOTPReq } from "@/features/auth/api/auth.api";
import { useState } from "react";

export default function PhoneForm({ onOtpSent }: PhoneFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendOTPPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullPhone = `+91${phoneNumber}`;
      await sendOTPReq({ phoneNumber: fullPhone });
      onOtpSent(fullPhone);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, "");

    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
      if (error) setError(null);
    }
  };

  const isButtonDisabled = isLoading || phoneNumber.length !== 10;

  return (
    <div className="w-full max-w-xs flex flex-col gap-8">
      {/* Branding */}
      <h1 className="text-2xl font-bold tracking-widest text-center uppercase">
        STHANU
      </h1>

      {/* Minimal Form */}
      <form className="flex flex-col gap-4" onSubmit={sendOTPPost}>
        <div>
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
            <span className="px-3 text-sm text-neutral-400 select-none border-r border-neutral-800">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Phone number"
              required
              disabled={isLoading}
              className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
              value={phoneNumber}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending code..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
