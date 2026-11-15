"use client";

import React, { useState } from "react";
import {
  Trophy,
  Globe,
  MapPin,
  Building2,
  Medal,
  Flame,
  UserCheck,
} from "lucide-react";
import { ReqModeType } from "@/types/leaderboard.types";
import { useLeaderBoard } from "../hooks/useLeaderBoard";

export default function LeaderboardView() {
  const [mode, setMode] = useState<ReqModeType>("ALL");
  const { data, isLoading } = useLeaderBoard(mode);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-[0_0_12px_rgba(251,191,36,0.15)]">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-400/10 border border-slate-400/30 text-slate-300 text-xs font-bold">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-700/10 border border-amber-700/30 text-amber-600 text-xs font-bold">
          3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs font-medium">
        {rank}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] font-mono text-left select-none max-w-xl mx-auto w-full gap-5 pb-24">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">
              COMMUNITY LEADERBOARD
            </h1>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Top verified donors & active emergency responders
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Mode Switcher */}
      <div className="w-full grid grid-cols-3 gap-1 p-1 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
        <button
          type="button"
          onClick={() => setMode("ALL")}
          className={`py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            mode === "ALL"
              ? "bg-neutral-800 text-white border border-neutral-700/80 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>GLOBAL</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("CITY")}
          className={`py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            mode === "CITY"
              ? "bg-neutral-800 text-white border border-neutral-700/80 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>CITY</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("INSTITUTE")}
          className={`py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            mode === "INSTITUTE"
              ? "bg-neutral-800 text-white border border-neutral-700/80 shadow-sm"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>INSTITUTE</span>
        </button>
      </div>

      {/* Leaderboard Stack */}
      <div className="w-full flex flex-col gap-2">
        {isLoading ? (
          /* Loading Skeletons */
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full p-3.5 rounded-xl border border-neutral-800/60 bg-[#0A0A0A] flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-neutral-900 border border-neutral-800" />
                <div className="h-3.5 w-32 bg-neutral-900 rounded" />
              </div>
              <div className="h-4 w-20 bg-neutral-900 rounded-lg" />
            </div>
          ))
        ) : data?.list && data.list.length > 0 ? (
          /* Real Ranking Rows */
          data.list.map((donor: any, index: number) => {
            const rank = index + 1;
            return (
              <div
                key={index}
                className="w-full p-3.5 rounded-xl border border-neutral-800/80 hover:border-neutral-700 bg-[#0A0A0A] flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  {getRankBadge(rank)}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-neutral-200 tracking-wide">
                      {donor.firstName} {donor.lastName}
                    </span>
                    {donor.city && (
                      <span className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-neutral-600" />
                        <span>{donor.city}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{donor.score} DONATIONS</span>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="p-8 rounded-2xl border border-neutral-800 bg-[#0A0A0A] text-center flex flex-col items-center justify-center gap-2 text-neutral-500">
            <Medal className="w-8 h-8 text-neutral-600 mb-1" />
            <p className="text-xs font-semibold text-neutral-400">
              No donors ranked in this view yet
            </p>
            <p className="text-[11px] text-neutral-600">
              Verified blood donations will appear here automatically.
            </p>
          </div>
        )}
      </div>

      {/* Sticky User Position Banner */}
      {data?.userRank && (
        <div className="fixed bottom-20 max-w-xl w-[calc(100%-2rem)] sm:w-full mx-auto p-3 rounded-2xl border border-amber-500/30 bg-[#0A0A0A]/95 backdrop-blur-md shadow-2xl shadow-black flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              YOUR STANDING
            </span>
          </div>

          <span className="text-xs text-amber-400 font-bold tracking-wider px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.1)]">
            RANK #{data.userRank}
          </span>
        </div>
      )}
    </div>
  );
}
