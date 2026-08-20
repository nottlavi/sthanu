"use client";

import { useState } from "react";
import { AddressData } from "@/components/address/AddressModal";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAddress: AddressData | null;
}

const BLOOD_GROUPS: { id: number; label: string }[] = [
  { id: 1, label: "A+" },
  { id: 2, label: "A-" },
  { id: 3, label: "B+" },
  { id: 4, label: "B-" },
  { id: 5, label: "AB+" },
  { id: 6, label: "AB-" },
  { id: 7, label: "O+" },
  { id: 8, label: "O-" },
];

export default function CreateIncidentModal({
  isOpen,
  onClose,
  savedAddress,
}: CreateIncidentModalProps) {
  const [incidentType, setIncidentType] = useState<1 | 2>(1);
  const [bloodGroup, setBloodGroup] = useState<number>(7);
  const [unitsRequired, setUnitsRequired] = useState<number>(1);
  const [vialsRequired, setVialsRequired] = useState<number>(1);
  const [locationChoice, setLocationChoice] = useState<"home" | "gps" | "recent">(
    "home"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <h2 className="text-base font-bold text-zinc-100">
              Declare Emergency Dispatch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setIncidentType(1)}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              incidentType === 1
                ? "bg-red-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>🩸</span>
            <span>Blood Emergency</span>
          </button>
          <button
            type="button"
            onClick={() => setIncidentType(2)}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              incidentType === 2
                ? "bg-purple-600 text-white shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>🐍</span>
            <span>Snakebite ASV</span>
          </button>
        </div>

        {incidentType === 1 ? (
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">
                Select Required Blood Group
              </label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBloodGroup(bg.id)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      bloodGroup === bg.id
                        ? "bg-red-950/80 border-red-500 text-red-300 shadow-sm"
                        : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">
                Units Required
              </label>
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setUnitsRequired(Math.max(1, unitsRequired - 1))}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-zinc-100">
                  {unitsRequired} {unitsRequired === 1 ? "Unit" : "Units"}
                </span>
                <button
                  type="button"
                  onClick={() => setUnitsRequired(unitsRequired + 1)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="p-3 bg-purple-950/30 border border-purple-800/60 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                India Standard Antivenom
              </span>
              <p className="text-xs font-semibold text-zinc-200">
                Polyvalent Anti-Snake Venom Serum (ASV)
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">
                ASV Vials Required
              </label>
              <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setVialsRequired(Math.max(1, vialsRequired - 1))}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors"
                >
                  -
                </button>
                <span className="font-mono text-sm font-bold text-purple-300">
                  {vialsRequired} {vialsRequired === 1 ? "Vial" : "Vials"}
                </span>
                <button
                  type="button"
                  onClick={() => setVialsRequired(vialsRequired + 1)}
                  className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-1">
          <label className="text-[11px] text-zinc-400 font-medium">
            Emergency Dispatch Location
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setLocationChoice("home")}
              className={`py-2 rounded-lg font-semibold transition-all ${
                locationChoice === "home"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Saved Home
            </button>
            <button
              type="button"
              onClick={() => setLocationChoice("gps")}
              className={`py-2 rounded-lg font-semibold transition-all ${
                locationChoice === "gps"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Current GPS
            </button>
            <button
              type="button"
              onClick={() => setLocationChoice("recent")}
              className={`py-2 rounded-lg font-semibold transition-all ${
                locationChoice === "recent"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Recents
            </button>
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 flex items-center justify-between">
            <span className="truncate">
              📍 {savedAddress ? `${savedAddress.addressLine}, ${savedAddress.city}` : "Home Location"}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase shrink-0">
              Active
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-2xl text-xs transition-colors shadow-xl shadow-red-950/80 uppercase tracking-wider active:scale-[0.99]"
          >
            📡 Dispatch Emergency Alert
          </button>
        </div>
      </div>
    </div>
  );
}
