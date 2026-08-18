"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface IncidentParticipant {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface FamilyIncident {
  id: string;
  userId: string;
  incidentType: number;
  locationName: string;
  latitude: number;
  longitude: number;
  bloodGroup: number | null;
  unitsRequired: number | null;
  vialsRequired: number | null;
  shareCode: string;
  status: number;
  createdAtUtc: string;
  participants: IncidentParticipant[];
}

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalDonations: number;
}

interface FamilyGroup {
  id: string;
  familyName: string;
  inviteCode: string;
  pooledCredits: number;
  members: FamilyMember[];
  familyIncidents?: FamilyIncident[];
}

const BLOOD_GROUP_MAP: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

export default function FamilyTab() {
  const { token } = useAuth();
  const [family, setFamily] = useState<FamilyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [familyNameInput, setFamilyNameInput] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFamily = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5289/api/family/get-family", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setFamily(data);
        } else {
          setFamily(null);
        }
      } catch (err) {
        setFamily(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [token]);

  const handleCopyCode = () => {
    if (!family) return;
    navigator.clipboard.writeText(family.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyNameInput.trim()) {
      setError("Please enter a family name.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5289/api/family/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ familyName: familyNameInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create family group.");
      }

      setFamily(data);
      setFamilyNameInput("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      setError("Please enter a 6-character invite code.");
      return;
    }

    setJoining(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5289/api/family/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode: inviteCodeInput.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to join family.");
      }

      setFamily(data);
      setInviteCodeInput("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setJoining(false);
    }
  };

  const getCreatorName = (userId: string) => {
    if (!family) return "Family Member";
    const member = family.members.find((m) => m.id === userId);
    return member ? `${member.firstName} ${member.lastName}` : "Family Member";
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-zinc-500">Checking Family Shield status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      {!family ? (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-2">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              🛡️
            </div>
            <h2 className="text-base font-bold text-zinc-100">Family Health Shield</h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Link your family to automatically share emergency radar dispatches, pooled blood units, and instant emergency alerts.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreateFamily} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Create New Family Group
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                disabled={creating}
                placeholder="e.g. Sharma Family"
                value={familyNameInput}
                onChange={(e) => setFamilyNameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={creating}
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center min-h-[38px] active:scale-[0.99]"
              >
                {creating ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Family Group"
                )}
              </button>
            </div>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-zinc-500">
              OR JOIN EXISTING
            </span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <form onSubmit={handleJoinFamily} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Have an Invite Code?
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                disabled={joining}
                placeholder="Enter 6-char code"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-mono disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={joining}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 font-medium px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center min-w-[70px] active:scale-[0.99]"
              >
                {joining ? (
                  <span className="w-3.5 h-3.5 border-2 border-zinc-200 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Join"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                  Active
                </span>
                <h2 className="text-lg font-bold text-zinc-100 mt-1">
                  {family.familyName}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-zinc-400">Pooled Credits</span>
                <p className="text-xs font-bold text-emerald-400">{family.pooledCredits} pts</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider block">
                  Family Invite Code
                </span>
                <span className="font-mono text-sm font-bold tracking-widest text-zinc-100">
                  {family.inviteCode}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5 active:scale-95"
              >
                {copied ? "✓ Copied" : "📋 Share Code"}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Members ({family.members.length})
              </h3>
            </div>

            {family.members.map((member) => (
              <div
                key={member.id}
                className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between transition-all hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200 text-xs">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-100">
                      {member.firstName} {member.lastName}
                    </span>
                    <p className="text-[11px] text-zinc-400">{member.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    🩸 {member.totalDonations} Donations
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Live Family Emergencies
              </h3>
              {family.familyIncidents && family.familyIncidents.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  {family.familyIncidents.length} Active
                </span>
              )}
            </div>

            {family.familyIncidents && family.familyIncidents.length > 0 ? (
              family.familyIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 bg-red-950/20 border border-red-800/60 rounded-2xl space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                        {incident.incidentType === 1 ? "🩸 Blood Emergency" : "🐍 Snakebite Emergency"}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-100 mt-1.5">
                        {getCreatorName(incident.userId)}
                      </h4>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      #{incident.shareCode}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-medium">Required:</span>
                      <span className="font-bold text-zinc-100">
                        {incident.incidentType === 1
                          ? `${incident.bloodGroup ? BLOOD_GROUP_MAP[incident.bloodGroup] : "Blood"} (${incident.unitsRequired ?? 1} Units)`
                          : `Polyvalent ASV (${incident.vialsRequired ?? 1} Vials)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-medium">Location:</span>
                      <span className="text-zinc-200 truncate">
                        📍 {incident.locationName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-zinc-500 font-medium">Helpers:</span>
                      <span className="text-emerald-400 font-semibold">
                        🏃 {incident.participants?.length ?? 0} Joined
                      </span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>📡 Open Emergency Radar</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-base">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    All Family Members Safe
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    No active emergency incidents reported.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
