"use client";

import React, { useState } from "react";
import { Radio, Droplet, Syringe, ChevronRight, Activity } from "lucide-react";

export interface FacilityBlip {
  id: string;
  name: string;
  type: "blood_bank" | "venom_center" | "dual";
  distanceKm: number;
  stockStatus: string;
  top: string;
  left: string;
  bearing?: string;
}

interface RadarScannerProps {
  facilities?: FacilityBlip[];
}

export default function RadarScanner({ facilities = [] }: RadarScannerProps) {
  const [selectedFacility, setSelectedFacility] = useState<FacilityBlip | null>(
    null,
  );
  const [activeRange, setActiveRange] = useState<"5KM" | "15KM" | "30KM">(
    "15KM",
  );
  const [filterType, setFilterType] = useState<"ALL" | "BLOOD" | "VENOM">(
    "ALL",
  );

  const filteredFacilities = facilities.filter((fac) => {
    if (filterType === "BLOOD")
      return fac.type === "blood_bank" || fac.type === "dual";
    if (filterType === "VENOM")
      return fac.type === "venom_center" || fac.type === "dual";
    return true;
  });

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-5 select-none">
      {/* Top Tactical HUD Header */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-widest text-white uppercase flex items-center gap-1.5 font-mono">
              RADAR // 360° ACTIVE
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              SCANNING RANGE: {activeRange}
            </span>
          </div>
        </div>

        {/* Range Selector Toggles */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-800 bg-neutral-950 text-[10px] font-mono">
          {(["5KM", "15KM", "30KM"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeRange === range
                  ? "bg-neutral-800 text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Screen Container */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[26rem] md:h-[26rem] flex items-center justify-center">
        {/* Outer Circular Bezel */}
        <div className="absolute inset-0 rounded-full border border-neutral-800 bg-[#060606] shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_0_50px_rgba(0,0,0,0.85)] overflow-hidden" />

        {/* Subtle Ambient Radial Glow from User Center */}
        <div className="absolute w-44 h-44 rounded-full bg-emerald-500/[0.04] blur-2xl pointer-events-none" />

        {/* Spider's Web Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-neutral-800/80 pointer-events-none" />
        <div className="absolute inset-[15%] rounded-full border border-neutral-800/60 pointer-events-none" />
        <div className="absolute inset-[32%] rounded-full border border-neutral-800/50 pointer-events-none" />
        <div className="absolute inset-[48%] rounded-full border border-neutral-800/40 pointer-events-none" />

        {/* Spider's Web Radial Spokes (Axes & Diagonal Spiders Web Lines) */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/70 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800/70 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/40 rotate-45 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800/40 -rotate-45 pointer-events-none" />

        {/* Cardinal Direction Ticks */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-neutral-600 tracking-wider">
          N
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-neutral-600 tracking-wider">
          S
        </span>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-neutral-600 tracking-wider">
          E
        </span>
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-neutral-600 tracking-wider">
          W
        </span>

        {/* Distance Range Ring Labels along North Axis */}
        <span className="absolute top-[17%] left-1/2 ml-1.5 text-[8px] font-mono text-neutral-600 pointer-events-none">
          {activeRange === "5KM"
            ? "3.5k"
            : activeRange === "15KM"
              ? "10k"
              : "20k"}
        </span>
        <span className="absolute top-[34%] left-1/2 ml-1.5 text-[8px] font-mono text-neutral-600 pointer-events-none">
          {activeRange === "5KM"
            ? "1.8k"
            : activeRange === "15KM"
              ? "5k"
              : "10k"}
        </span>

        {/* 360° Radial Scanner Sweep Beam */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-spin [animation-duration:4s]"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(244, 63, 94, 0.22) 0deg, rgba(244, 63, 94, 0.05) 30deg, transparent 55deg, transparent 360deg)",
          }}
        >
          {/* High-intensity Leading Edge Line */}
          <div className="absolute top-0 left-1/2 w-[1.5px] h-1/2 -translate-x-1/2 bg-gradient-to-t from-rose-500/70 via-rose-400 to-rose-300 shadow-[0_0_8px_#f43f5e]" />
        </div>

        {/* Scattered Red Facility Dots (Pests on the Spider's Web) */}
        {filteredFacilities.map((fac) => {
          const isSelected = selectedFacility?.id === fac.id;

          return (
            <div
              key={fac.id}
              onClick={() => setSelectedFacility(fac)}
              style={{ top: fac.top, left: fac.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Pulsing Radar Echo Halo */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`absolute rounded-full transition-all duration-300 ${
                    isSelected
                      ? "w-7 h-7 bg-rose-500/30 animate-ping"
                      : "w-5 h-5 bg-rose-500/20 group-hover:scale-150"
                  }`}
                />

                {/* Core Red Dot */}
                <span
                  className={`rounded-full transition-all duration-200 ${
                    isSelected
                      ? "w-3 h-3 bg-rose-500 shadow-[0_0_12px_#f43f5e,0_0_20px_#e11d48] ring-2 ring-white"
                      : "w-2 h-2 bg-rose-500 shadow-[0_0_8px_#f43f5e] group-hover:scale-125"
                  }`}
                />

                {/* Micro Hover Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                  <div className="px-2 py-1 rounded bg-[#0A0A0A] border border-neutral-800 text-[10px] text-white flex items-center gap-1.5 shadow-xl shadow-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="font-semibold">{fac.name}</span>
                    <span className="text-neutral-400 font-mono">
                      ({fac.distanceKm} km)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Center Green Dot (User's Exact Location) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Green Halo */}
            <span className="absolute w-8 h-8 rounded-full bg-emerald-500/25 animate-ping" />
            <span className="absolute w-5 h-5 rounded-full bg-emerald-500/30" />

            {/* Core Green Dot */}
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399,0_0_24px_#10b981] ring-2 ring-black" />
          </div>

          {/* Tiny "YOU" Tactical Beacon Tag */}
          <span className="mt-1.5 px-1.5 py-0.5 rounded bg-black/90 border border-emerald-500/40 text-[8px] font-mono font-bold tracking-widest text-emerald-400 uppercase shadow-md">
            YOU
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${
            filterType === "ALL"
              ? "border-neutral-700 bg-neutral-900 text-white"
              : "border-neutral-800 bg-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Activity className="w-3 h-3 text-rose-500" />
          <span>All Units ({filteredFacilities.length})</span>
        </button>

        <button
          onClick={() => setFilterType("VENOM")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${
            filterType === "VENOM"
              ? "border-neutral-700 bg-neutral-900 text-white"
              : "border-neutral-800 bg-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Syringe className="w-3 h-3 text-rose-400" />
          <span>Snakebite Centers</span>
        </button>

        <button
          onClick={() => setFilterType("BLOOD")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${
            filterType === "BLOOD"
              ? "border-neutral-700 bg-neutral-900 text-white"
              : "border-neutral-800 bg-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Droplet className="w-3 h-3 text-rose-500" />
          <span>Blood Banks</span>
        </button>
      </div>

      {/* Selected Facility Tactical Card */}
      {selectedFacility && (
        <div className="w-full rounded-xl border border-neutral-800 bg-[#0A0A0A] p-3.5 shadow-xl shadow-black flex items-center justify-between text-left transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-rose-500 shrink-0 mt-0.5">
              {selectedFacility.type === "venom_center" ? (
                <Syringe className="w-4 h-4" />
              ) : (
                <Droplet className="w-4 h-4" />
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {selectedFacility.name}
                </h4>
                <span className="text-[9px] font-mono text-neutral-500">
                  {selectedFacility.bearing}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                <span className="text-rose-400 font-semibold">
                  {selectedFacility.distanceKm} km away
                </span>
                <span>•</span>
                <span className="text-neutral-300">
                  {selectedFacility.stockStatus}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors ml-2 shrink-0"
            title="View Route"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Legend & Radar Stats */}
      <div className="w-full flex items-center justify-around py-2 border-t border-neutral-900 text-[10px] text-neutral-500 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>User Base</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
          <span>Emergency Units</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-neutral-400 animate-pulse" />
          <span>360° Live Scan</span>
        </div>
      </div>
    </div>
  );
}
