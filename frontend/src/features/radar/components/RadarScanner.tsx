"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { getRawFacilities } from "@/features/radar/api/radar.api";
import { useUserAddress } from "@/features/address/hooks/useUserAddress";
import { RawFacility } from "@/types/radar.types";
import { useGeoLocation } from "@/features/address/hooks/useGeoLocation";

export default function RadarScanner() {
  const { data: address } = useUserAddress();
  const { getLocation, latitude, longitude, error } = useGeoLocation();

  const [activeRange, setActiveRange] = useState<10 | 30 | 60>(10);

  const [facilities, setFacilities] = useState<RawFacility[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const [locationMode, setLocationMode] = useState<"HOME" | "GPS">("HOME");

  // Instantly filter out any facilities that exceed the selected activeRange
  // This guarantees far facilities vanish immediately when switching e.g. 60KM -> 10KM
  const visibleFacilities = facilities.filter(
    (fac) => fac.distanceKm === undefined || fac.distanceKm <= activeRange,
  );

  const activeCoords =
    locationMode === "HOME"
      ? { lat: address?.latitude, lng: address?.longitude }
      : { lat: latitude, lng: longitude };

  useEffect(() => {
    let isCurrent = true;

    const fetchFacilities = async () => {
      if (!activeCoords.lat || !activeCoords.lng) return;

      setIsScanning(true);
      try {
        const res = await getRawFacilities({
          latitude: activeCoords.lat,
          longitude: activeCoords.lng,
          distance: activeRange,
        });

        if (isCurrent) {
          setFacilities(
            Array.isArray(res) ? res : res?.facilties || res?.facilities || [],
          );
        }
      } finally {
        if (isCurrent) {
          setIsScanning(false);
        }
      }
    };
    fetchFacilities();

    return () => {
      isCurrent = false;
    };
  }, [address, activeRange, activeCoords.lat, activeCoords.lng]);

  // If GPS error occurs, automatically switch back to HOME mode
  useEffect(() => {
    if (error) {
      setLocationMode("HOME");
    }
  }, [error]);

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
              {isScanning
                ? "RECALIBRATING // SWEEPING..."
                : "RADAR // 360° ACTIVE"}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              SCANNING RANGE: {activeRange} KM
            </span>
          </div>
        </div>

        {/* Range Selector Toggles */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-neutral-800 bg-neutral-950 text-[10px] font-mono">
          {([10, 30, 60] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeRange === range
                  ? "bg-neutral-800 text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {range}KM
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

        {/* 360° Radial Scanner Sweep Beam */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none animate-spin ${
            isScanning ? "[animation-duration:2s]" : "[animation-duration:4s]"
          } transition-all`}
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(244, 63, 94, 0.22) 0deg, rgba(244, 63, 94, 0.05) 30deg, transparent 55deg, transparent 360deg)",
          }}
        >
          {/* High-intensity Leading Edge Line */}
          <div className="absolute top-0 left-1/2 w-[1.5px] h-1/2 -translate-x-1/2 bg-gradient-to-t from-rose-500/70 via-rose-400 to-rose-300 shadow-[0_0_8px_#f43f5e]" />
        </div>

        {/* Scattered Red Facility Dots from local state */}
        {visibleFacilities.map((fac, index) => {
          // Distance-proportional radius from user center (10% min to 43% max of radar canvas)
          const minRadius = 10;
          const maxRadius = 43;
          const ratio =
            fac.distanceKm !== undefined
              ? Math.min(Math.max(fac.distanceKm / activeRange, 0.05), 1)
              : 0.5;

          const radius = minRadius + ratio * (maxRadius - minRadius);

          // Angle distributed around 360° to avoid overlapping
          const angle =
            (((index * 137.5 + (fac.facilityName?.length || index) * 31) %
              360) *
              Math.PI) /
            180;

          const left = `${50 + radius * Math.cos(angle)}%`;
          const top = `${50 + radius * Math.sin(angle)}%`;

          return (
            <div
              key={fac.facilityName || index}
              style={{ top, left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group transition-all duration-500 ease-out"
            >
              <div className="relative flex items-center justify-center">
                {/* Pulsing Radar Echo Halo */}
                <span className="absolute w-5 h-5 rounded-full bg-rose-500/20 animate-pulse" />

                {/* Core Red Dot */}
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />

                {/* Micro Hover Tooltip */}
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                  <div className="px-2 py-0.5 rounded bg-[#0A0A0A] border border-neutral-800 text-[10px] text-white flex items-center gap-1 shadow-lg shadow-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span className="font-semibold">
                      {fac.facilityName} ({fac.city}){" "}
                    </span>
                    {fac.distanceKm !== undefined && (
                      <span className="text-neutral-400 font-mono">
                        ({fac.distanceKm} km)
                      </span>
                    )}
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

      {/* Location Toggle: Home Address vs GPS Live Location */}
      <div className="w-full flex flex-col items-center gap-2 py-2 border-t border-neutral-900 font-mono">
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border border-neutral-800 bg-neutral-950 w-full max-w-xs">
          <button
            type="button"
            className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wide transition-colors ${
              locationMode === "HOME"
                ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/70"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
            }`}
            onClick={() => {
              setLocationMode("HOME");
            }}
          >
            <MapPin
              className={`w-3.5 h-3.5 transition-colors ${
                locationMode === "HOME"
                  ? "text-emerald-400"
                  : "text-neutral-500"
              }`}
            />
            <span>Home Address</span>
          </button>

          <button
            type="button"
            className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-semibold tracking-wide transition-colors ${
              locationMode === "GPS"
                ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/70"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
            }`}
            onClick={() => {
              setLocationMode("GPS");
              getLocation();
            }}
          >
            <Navigation
              className={`w-3.5 h-3.5 transition-colors ${
                locationMode === "GPS" ? "text-rose-500" : "text-neutral-500"
              }`}
            />
            <span>GPS Live Location</span>
          </button>
        </div>

        {/* Error Feedback Banner */}
        {error && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] leading-tight max-w-xs text-center">
            <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
