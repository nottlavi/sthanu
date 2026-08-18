"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { setAuthData } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [token, setToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5289/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to send OTP");

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5289/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Invalid OTP");

      setToken(data.token);

      if (data.isProfileComplete && data.user) {
        setAuthData(data.token, data.user);
      } else {
        localStorage.setItem("auth_token", data.token);
        setStep(3);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const activeToken = token || localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:5289/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to complete profile");

      if (activeToken) {
        setAuthData(activeToken, data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 tracking-wide uppercase">Sthanu</h1>
          <p className="text-xs text-zinc-400 mt-1">Emergency Blood & Anti-Venom Radar</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-medium text-zinc-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-red-600/20"
            >
              {loading ? "Sending OTP..." : "Send Verification OTP"}
            </button>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-medium text-zinc-400 mb-1">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors text-center tracking-widest font-mono text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-red-600/20"
            >
              {loading ? "Verifying..." : "Verify OTP Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCompleteProfile} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-medium text-zinc-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-zinc-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-red-600/20"
            >
              {loading ? "Registering..." : "Complete Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
