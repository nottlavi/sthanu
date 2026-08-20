"use client";

import { useEffect, useState } from "react";
import { AddressData } from "@/components/address/AddressModal";
import CreateIncidentModal from "./CreateIncidentModal";

interface RadarTabProps {
  savedAddress: AddressData | null;
}

type LocationStatus = "gps" | "home" | "none";

export default function RadarTab({ savedAddress }: RadarTabProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [status, setStatus] = useState<LocationStatus>("none");

  useEffect(() => {
    if (!navigator.geolocation) {
      if (savedAddress) {
        setStatus("home");
      } else {
        setStatus("none");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("gps");
      },
      () => {
        if (savedAddress) {
          setStatus("home");
        } else {
          setStatus("none");
        }
      },
      { timeout: 5000, maximumAge: 60000 }
    );
  }, [savedAddress]);

  return (
    <div className="space-y-4 py-2">
      <button
        type="button"
        onClick={() => setIsCreateModalOpen(true)}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-extrabold rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-red-950/80 border border-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        <span>🚨 Declare Emergency Dispatch</span>
      </button>

      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Live Radar</h2>
            <p className="text-[11px] text-zinc-400">
              {status === "gps" && "Standby mode • 25km radius sweep of your live location"}
              {status === "home" && "Standby mode • 25km radius sweep of your home location"}
              {status === "none" && "Location unavailable • Tap top bar to set home location"}
            </p>
          </div>
          {status === "gps" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live GPS Active
            </span>
          )}
          {status === "home" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Home Active
            </span>
          )}
          {status === "none" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 flex items-center gap-1">
              <span>⚠️</span>
              Offline
            </span>
          )}
        </div>

        <div className="relative w-full aspect-square max-w-[290px] mx-auto bg-zinc-950 border border-zinc-800/80 rounded-full p-4 flex items-center justify-center overflow-hidden shadow-inner">
          {status !== "none" && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="w-full h-full origin-center animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.35)_0deg,rgba(16,185,129,0.05)_45deg,transparent_90deg)]" />
            </div>
          )}
          <div className="absolute inset-3 rounded-full border border-zinc-800/60" />
          <div className="absolute inset-12 rounded-full border border-zinc-800/50" />
          <div className="absolute inset-20 rounded-full border border-zinc-800/40" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-zinc-800/50" />
            <div className="h-full w-[1px] bg-zinc-800/50" />
          </div>

          <div
            className={`z-10 w-4 h-4 rounded-full flex items-center justify-center ${
              status !== "none"
                ? "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)] animate-pulse"
                : "bg-zinc-700"
            }`}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </div>

      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        savedAddress={savedAddress}
      />
    </div>
  );
}
