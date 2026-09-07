"use client";

import React, { useState } from "react";
import { X, Droplet, Syringe, Radio } from "lucide-react";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export default function CreateIncidentModal({
  isOpen,
  onClose,
}: CreateIncidentModalProps) {
  // Pure UI state for switching views
  const [incidentType, setIncidentType] = useState<"BLOOD" | "VENOM">("BLOOD");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("O+");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 shadow-2xl shadow-black flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <div>
              <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-white">
                DECLARE EMERGENCY INCIDENT
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                BROADCAST TO EMERGENCY RADAR UNITS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* 1. Incident Type Selector */}
          <div className="flex flex-col gap-1.5 font-mono">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400">
              INCIDENT TYPE *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl border border-neutral-800 bg-neutral-950">
              <button
                type="button"
                onClick={() => setIncidentType("BLOOD")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  incidentType === "BLOOD"
                    ? "bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300 border border-transparent"
                }`}
              >
                <Droplet
                  className={`w-3.5 h-3.5 ${incidentType === "BLOOD" ? "text-rose-500" : "text-neutral-500"}`}
                />
                <span>Blood Shortage</span>
              </button>

              <button
                type="button"
                onClick={() => setIncidentType("VENOM")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  incidentType === "VENOM"
                    ? "bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300 border border-transparent"
                }`}
              >
                <Syringe
                  className={`w-3.5 h-3.5 ${incidentType === "VENOM" ? "text-rose-500" : "text-neutral-500"}`}
                />
                <span>Snakebite / Venom</span>
              </button>
            </div>
          </div>

          {/* 2. Location Name */}
          <div className="flex flex-col gap-1.5 font-mono">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400">
              LOCATION / FACILITY NAME *
            </label>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
              <input
                type="text"
                placeholder="e.g. Apollo Hospital ICU, Ward 4"
                required
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none font-sans"
              />
            </div>
          </div>

          {/* 3. Coordinates (Latitude & Longitude) */}
          <div className="flex flex-col gap-1.5 font-mono">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                TARGET COORDINATES *
              </label>
              <span className="text-[9px] text-neutral-500 uppercase">
                GPS RADAR FIX
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                <span className="text-[9px] text-neutral-500 uppercase font-semibold mr-2">
                  LAT
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="12.97159"
                  required
                  className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                <span className="text-[9px] text-neutral-500 uppercase font-semibold mr-2">
                  LNG
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="77.59456"
                  required
                  className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Conditional Section: BLOOD */}
          {incidentType === "BLOOD" && (
            <div className="flex flex-col gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  BLOOD GROUP REQUIRED *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setSelectedBloodGroup(group)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedBloodGroup === group
                          ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  UNITS REQUIRED (BAGS) *
                </label>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                  <input
                    type="number"
                    min={1}
                    defaultValue={1}
                    required
                    className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Conditional Section: VENOM */}
          {incidentType === "VENOM" && (
            <div className="flex flex-col gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  ANTI-VENOM VIALS REQUIRED *
                </label>
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                  <input
                    type="number"
                    min={1}
                    defaultValue={2}
                    required
                    placeholder="Number of vials (e.g. 4)"
                    className="w-full bg-transparent px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 leading-snug">
                Radar will locate and alert nearest facilities equipped with
                polyvalent anti-snake venom.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-900 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="w-2/3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(225,29,72,0.35)] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>BROADCAST INCIDENT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
