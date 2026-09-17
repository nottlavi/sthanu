"use client";

import React, { useState } from "react";
import {
  Users,
  Copy,
  Check,
  Plus,
  KeyRound,
  Coins,
  Phone,
  Heart,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useUserFamily } from "../hooks/useUserFamily";
import Loading from "@/components/common/Loading";
import IncidentCard from "@/features/incident/components/IncidentCard";
import IncidentDetailModal from "@/features/incident/components/IncidentDetailModal";
import { IncidentResponse, IncidentType } from "@/types/incident.types";
import { joinFamily } from "../api/family.api";
import { useQueryClient } from "@tanstack/react-query";

export default function FamilyView() {
  const { data: family, isLoading } = useUserFamily();

  // Pure UI state for the No-Family onboarding tab & copy feedback
  const [activeTab, setActiveTab] = useState<"CREATE" | "JOIN">("CREATE");
  const [copied, setCopied] = useState(false);
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentResponse | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [familyName, setFamilyName] = useState("");

  const queryClient = useQueryClient();

  const handleJoinFamily = async () => {
    if (inviteCode.trim() === "") return;

    try {
      const res = await joinFamily({ inviteCode });

      await queryClient.invalidateQueries({ queryKey: ["userFamily"] });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to join family";
      console.error(errorMessage);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loading
          message="CONNECTING TO FAMILY NETWORK"
          subMessage="VERIFYING POOLED CREDITS & EMERGENCY STATUS"
        />
      </div>
    );
  }

  // 2. State A: No Family (Onboarding / Create / Join)
  if (!family) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] font-mono text-left">
        <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 shadow-2xl shadow-black flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-900">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-white">
                FAMILY NETWORK
              </h2>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Coordinate emergency alerts & pool mutual blood credits
              </p>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("CREATE")}
              className={`py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "CREATE"
                  ? "bg-neutral-800 text-white border border-neutral-700/80 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Family</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("JOIN")}
              className={`py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "JOIN"
                  ? "bg-neutral-800 text-white border border-neutral-700/80 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Join with Code</span>
            </button>
          </div>

          {/* Form Content */}
          {activeTab === "CREATE" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">
                  Family Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sharma Family"
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Creating a family group generates an invite code that your
                family members can use to link into the network.
              </p>
              <button
                type="button"
                className="w-full py-2.5 mt-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>CREATE FAMILY GROUP</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">
                  Family Invite Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. FAM-8492"
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 uppercase tracking-widest focus:outline-none focus:border-cyan-500/50 transition-colors"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                  }}
                />
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Enter the invite code shared by your family group admin to link
                into the network.
              </p>
              <button
                type="button"
                className="w-full py-2.5 mt-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                onClick={handleJoinFamily}
              >
                <span>JOIN FAMILY GROUP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. State B: Active Family View
  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] font-mono text-left">
      <div className="w-full max-w-lg flex flex-col gap-4">
        {/* 1. Family Overview Card */}
        <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-wider uppercase text-white">
                  {family.familyName}
                </h2>
                <span className="text-[9px] text-neutral-500 tracking-wider">
                  ACTIVE FAMILY NETWORK
                </span>
              </div>
            </div>

            {/* Invite Code Copy Pill */}
            <button
              type="button"
              onClick={() => {
                if (family.inviteCode) {
                  navigator.clipboard.writeText(family.inviteCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-[10px] font-semibold transition-colors"
            >
              <span className="text-neutral-500">CODE:</span>
              <span className="text-cyan-400 tracking-wider">
                {family.inviteCode}
              </span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-500 ml-0.5" />
              )}
            </button>
          </div>

          {/* Telemetry Metrics Strip */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900">
            <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Coins className="w-3 h-3 text-emerald-400" />
                <span>POOLED CREDITS</span>
              </span>
              <span className="text-base font-bold text-emerald-400">
                {family.pooledCredits}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col gap-1">
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>MEMBERS</span>
              </span>
              <span className="text-base font-bold text-white">
                {family.members?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Family Emergency Incidents */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>FAMILY EMERGENCY ALERTS</span>
            </span>
            <span className="text-[9px] text-neutral-500">
              {family.familyIncidents?.length || 0} ACTIVE
            </span>
          </div>

          {family.familyIncidents && family.familyIncidents.length > 0 ? (
            <div className="flex flex-col gap-2">
              {family.familyIncidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => {
                    setSelectedIncident(incident);
                  }}
                >
                  <IncidentCard incident={incident} tag="FAMILY" />
                </div>
              ))}
              {selectedIncident && (
                <IncidentDetailModal
                  incident={selectedIncident}
                  isOpen={!!selectedIncident}
                  onClose={() => setSelectedIncident(null)}
                />
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5 text-[10px] text-emerald-400/90 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ALL FAMILY MEMBERS SECURE — ZERO ACTIVE BROADCASTS</span>
            </div>
          )}
        </div>

        {/* 3. Members Roster */}
        <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-bold">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>CONNECTED FAMILY MEMBERS</span>
            </span>
            <span className="text-[9px] text-neutral-500">
              {family.members?.length || 0} TOTAL
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {family.members?.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-white uppercase border border-neutral-700">
                    {m.firstName?.[0]}
                    {m.lastName?.[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white font-sans">
                      {m.firstName} {m.lastName}
                    </h4>
                    <a
                      href={`tel:${m.phoneNumber}`}
                      className="text-[10px] text-neutral-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{m.phoneNumber}</span>
                    </a>
                  </div>
                </div>

                {/* Donations Chip */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-semibold">
                  <Heart className="w-2.5 h-2.5" />
                  <span>{m.totalDonations} Donations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
