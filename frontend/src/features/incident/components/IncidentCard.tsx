"use client";

import React, { useState } from "react";
import {
  MapPin,
  Droplet,
  Syringe,
  Copy,
  Check,
  Users,
  ExternalLink,
} from "lucide-react";
import {
  IncidentResponse,
  BLOOD_GROUP_REVERSE_MAP,
} from "@/types/incident.types";

interface IncidentCardProps {
  incident: IncidentResponse;
  tag?: string;
  onResolve?: (incidentId: string) => void;
}

export default function IncidentCard({
  incident,
  tag,
  onResolve,
}: IncidentCardProps) {
  const [copied, setCopied] = useState(false);

  console.log(incident);

  const isBlood = incident.incidentType === 1;
  const bloodName = incident.bloodGroup
    ? BLOOD_GROUP_REVERSE_MAP[incident.bloodGroup]
    : "UNKNOWN";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(incident.shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-2 p-3 rounded-xl border border-neutral-800 bg-[#0A0A0A] shadow-lg hover:border-neutral-700 transition-colors font-mono select-none text-left">
      {/* 1. Header: Pill + Qty + Live beacon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isBlood ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
              <Droplet className="w-3 h-3 fill-rose-500/30" />
              <span>{bloodName}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
              <Syringe className="w-3 h-3" />
              <span>VENOM</span>
            </span>
          )}

          <span className="text-[10px] text-neutral-300 font-semibold">
            {isBlood
              ? `${incident.unitsRequired ?? 1} Bag${(incident.unitsRequired ?? 1) > 1 ? "s" : ""}`
              : `${incident.vialsRequired ?? 2} Vials`}
          </span>

          {tag && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[8px] text-emerald-400 uppercase font-bold">
              {tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[9px] text-neutral-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>
            {new Date(incident.createdAtUtc).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })}
            ,{" "}
            {new Date(incident.createdAtUtc).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* 2. Compact Location */}
      <div className="flex items-start gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate font-sans">
            {incident.locationName}
          </span>
          <span className="text-[9px] text-neutral-500 truncate">
            {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
          </span>
        </div>
      </div>

      {/* 3. Bottom Action Bar: Code on left, Responders & Map on right */}
      <div className="flex items-center justify-between pt-1.5 border-t border-neutral-900 text-[10px]">
        {/* Share Code Chip */}
        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-colors"
        >
          <span className="text-[9px] text-neutral-500">CODE:</span>
          <span className="font-bold text-emerald-400 tracking-wider text-[10px]">
            {incident.shareCode}
          </span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
          ) : (
            <Copy className="w-3 h-3 text-neutral-500 hover:text-white ml-0.5" />
          )}
        </button>

        {/* Responders & Map Link */}
        <div className="flex items-center gap-2 text-[9px] text-neutral-400">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-neutral-500" />
            {incident.participants?.length || 0}
          </span>

          <span className="text-neutral-700">•</span>

          <a
            href={`https://maps.google.com/?q=${incident.latitude},${incident.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-0.5 text-neutral-400 hover:text-white transition-colors"
          >
            <span>Map</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
