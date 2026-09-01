interface PhoneFormProps {
  onProfileComplete: () => void;
}

import { completeProfile } from "@/features/auth/api/auth.api";
import { useState } from "react";

export default function CompleteProfileForm({
  onProfileComplete,
}: PhoneFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const completeProfileCP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("First Name & Last Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { firstName, lastName };

      await completeProfile(payload);
      onProfileComplete();
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs flex flex-col gap-8">
      {/* Branding with Context Subtitle */}
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold tracking-widest uppercase">STHANU</h1>
        <p className="text-xs text-neutral-400">
          Complete your profile to continue
        </p>
      </div>

      {/* Minimal Form */}
      <form className="flex flex-col gap-4" onSubmit={completeProfileCP}>
        {/* First Name Input */}
        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
          <input
            type="text"
            placeholder="First name"
            required
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name Input */}
        <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
          <input
            type="text"
            placeholder="Last name"
            required
            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 active:scale-[0.99] transition-all"
        >
          Get Started
        </button>
      </form>
    </div>
  );
}
