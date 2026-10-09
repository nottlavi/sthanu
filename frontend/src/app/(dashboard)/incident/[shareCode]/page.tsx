"use client";
import React from "react";
import Link from "next/link";
import { Radio, ArrowRight, Shield } from "lucide-react";
import { participateIncident } from "@/features/incident/api/incident.api";
import { useUserIncidents } from "@/features/incident/hooks/useUserIncidents";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface IncidentJoinPageProps {
  params: { shareCode: string };
}

export default function IncidentJoinPage({ params }: IncidentJoinPageProps) {
  const { shareCode } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleJoin = async () => {
    try {
      await participateIncident(shareCode);

      await queryClient.invalidateQueries({ queryKey: ["my-incidents"] });

      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] font-mono text-left select-none">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black flex flex-col gap-5">
        {/* Header with pulsating live beacon */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            </span>
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-white">
                EMERGENCY BROADCAST DETECTED
              </h2>
              <p className="text-[10px] text-neutral-500 tracking-wider mt-0.5">
                ACTIVE REF #{shareCode?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-rose-400">
            <Radio className="w-4 h-4" />
          </div>
        </div>

        {/* Telemetry Notice */}
        <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>RESPONDER COORDINATION PROTOCOL</span>
          </span>
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            You are connecting as a verified emergency responder for Broadcast{" "}
            <span className="text-emerald-400 font-bold">
              #{shareCode?.toUpperCase()}
            </span>
            . Connecting will add this emergency to your active radar and share
            your contact coordinates with the coordinator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleJoin}
            type="button"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <span>CONFIRM & CONNECT RADAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/"
            className="w-full py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors text-center"
          >
            DECLINE / CANCEL
          </Link>
        </div>
      </div>
    </div>
  );
}
