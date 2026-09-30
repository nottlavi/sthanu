"use client";

import React from "react";

interface LoadingProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

export default function Loading({
  message = "CALIBRATING RADAR TELEMETRY",
  subMessage = "SYNCING SENSOR NODES & SATELLITE FIX...",
  compact = false,
}: LoadingProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950/80 font-mono text-xs text-neutral-400 select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <span className="tracking-wide uppercase text-[10px]">{message}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-6 select-none font-mono">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Bezel Ring */}
        <div className="absolute inset-0 rounded-full border border-neutral-800 bg-[#060606] shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
        <div className="absolute inset-[25%] rounded-full border border-neutral-800/60" />
        <div className="absolute inset-[50%] rounded-full border border-neutral-800/40" />

        {/* Sweeping Radar Beam */}
        <div
          className="absolute inset-0 rounded-full animate-spin [animation-duration:2.5s]"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(244,63,94,0.2) 0deg, rgba(244,63,94,0.02) 40deg, transparent 60deg, transparent 360deg)",
          }}
        />

        {/* Center Beacon Ping */}
        <div className="relative flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-rose-500/20 animate-ping absolute" />
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
          {message}
        </span>
        {subMessage && (
          <span className="text-[10px] text-neutral-600 tracking-wider">
            {subMessage}
          </span>
        )}
      </div>
    </div>
  );
}
