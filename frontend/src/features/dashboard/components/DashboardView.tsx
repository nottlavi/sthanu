"use client";

import CreateIncidentButton from "@/features/incident/components/CreateIncidentButton";
import RadarScanner from "@/features/radar/components/RadarScanner";
import { useUserIncidents } from "@/features/incident/hooks/useUserIncidents";
import Loading from "@/components/common/Loading";
import IncidentCard from "@/features/incident/components/IncidentCard";

export default function DashboardView() {
  const { data: incidents, isLoading } = useUserIncidents();

  const activeIncidents = incidents?.filter((inc) => inc.status === 1) ?? [];
  const hasActiveIncident = activeIncidents.length > 0;

  if (isLoading) {
    return <Loading />;
  }

  if (hasActiveIncident) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-3 px-3 py-4 select-none font-mono">
        {/* Compact Mission Status Badge */}
        <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/[0.04] text-[10px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            </span>
            <span className="font-bold tracking-wider text-white uppercase">
              ACTIVE BROADCAST ({activeIncidents.length})
            </span>
          </div>

          <span className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">
            RADAR LOCKED
          </span>
        </div>

        {/* Compact Cards Stack */}
        <div className="w-full flex flex-col gap-2.5">
          {activeIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] text-center gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold tracking-widest uppercase text-white">
          Emergency Radar
        </h1>
        <p className="text-xs text-neutral-400">
          Live blood bank and snakebite center monitoring
        </p>
      </div>

      <CreateIncidentButton />
      <RadarScanner />
    </div>
  );
}
