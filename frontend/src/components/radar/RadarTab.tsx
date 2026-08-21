"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AddressData } from "@/components/address/AddressModal";
import CreateIncidentModal from "./CreateIncidentModal";

interface RadarTabProps {
  savedAddress: AddressData | null;
}

interface RawFacility {
  facilityName: string;
  city: string;
  distanceKm: number;
}

type LocationStatus = "gps" | "home" | "none";

interface ActiveIncident {
  id: string;
  userId: string;
  incidentType: 1 | 2;
  locationName: string;
  latitude: number;
  longitude: number;
  bloodGroup?: number;
  unitsRequired?: number;
  vialsRequired?: number;
  shareCode: string;
  status: number | string;
  participants?: any[];
}

const ANGLES = [0.62, 2.35, 3.84, 5.12, 1.25];

const BLOOD_GROUP_NAMES: Record<number, string> = {
  1: "A+", 2: "A-", 3: "B+", 4: "B-", 5: "AB+", 6: "AB-", 7: "O+", 8: "O-"
};

export default function RadarTab({ savedAddress }: RadarTabProps) {
  const { user, token } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [status, setStatus] = useState<LocationStatus>("none");
  const [facilities, setFacilities] = useState<RawFacility[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeIncidents, setActiveIncidents] = useState<ActiveIncident[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchActiveIncidents = async () => {
    if (!token) return;
    const map = new Map<string, ActiveIncident>();

    try {
      const resMy = await fetch("http://localhost:5289/api/incident/my-incidents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resMy.ok) {
        const list: ActiveIncident[] = await resMy.json();
        list
          .filter((i) => i.status === 1 || i.status === "Active")
          .forEach((i) => map.set(i.id, i));
      }

      const resFam = await fetch("http://localhost:5289/api/family/get-family", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resFam.ok) {
        const famData = await resFam.json();
        const famList: ActiveIncident[] = famData.familyIncidents || [];
        famList
          .filter((i) => i.status === 1 || i.status === "Active")
          .forEach((i) => map.set(i.id, i));
      }

      setActiveIncidents(Array.from(map.values()));
    } catch { }
  };

  const copyShareCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const fetchFacilities = async (lat: number, lng: number) => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5289/api/facility/get-raw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawList: RawFacility[] = data.facilties || [];
        setFacilities(rawList.slice(0, 5));
      }
    } catch { }
  };

  useEffect(() => {
    fetchActiveIncidents();

    if (!navigator.geolocation) {
      if (savedAddress) {
        setStatus("home");
        fetchFacilities(savedAddress.latitude, savedAddress.longitude);
      } else {
        setStatus("none");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("gps");
        fetchFacilities(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        if (savedAddress) {
          setStatus("home");
          fetchFacilities(savedAddress.latitude, savedAddress.longitude);
        } else {
          setStatus("none");
        }
      },
      { timeout: 5000, maximumAge: 60000 }
    );
  }, [savedAddress, token]);

  const hasOwnActive = Boolean(
    user && activeIncidents.some((i) => i.userId === user.id)
  );

  return (
    <div className="space-y-4 py-2">
      {activeIncidents.length > 0 && (
        <div className="space-y-3">
          {activeIncidents.map((incident) => {
            const isOwner = Boolean(user && incident.userId === user.id);

            return (
              <div
                key={incident.id}
                className="p-4 bg-red-950/40 border border-red-800/80 rounded-3xl space-y-4 shadow-2xl animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-red-300 bg-red-950 px-2.5 py-1 rounded-full border border-red-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    {isOwner ? "Your Emergency" : " Family Emergency"}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                    {incident.shareCode}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-extrabold text-white">
                    {incident.incidentType === 1
                      ? `🩸 Blood Needed (${BLOOD_GROUP_NAMES[incident.bloodGroup || 7] || "O+"})`
                      : `🐍 Snakebite Polyvalent ASV`}
                  </h2>
                  <p className="text-xs font-semibold text-red-200">
                    {incident.incidentType === 1
                      ? `Required: ${incident.unitsRequired || 1} Blood Units`
                      : `Required: ${incident.vialsRequired || 1} ASV Vials`}
                  </p>
                  <p className="text-xs text-zinc-400 pt-1">
                    📍 {incident.locationName}
                  </p>
                </div>

                <div className="pt-3 border-t border-red-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Broadcast Active • {incident.participants?.length || 0} Responded</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyShareCode(incident.shareCode)}
                    className="text-xs font-bold text-red-300 hover:text-white bg-red-900/50 hover:bg-red-900 px-3 py-1.5 rounded-xl border border-red-800 transition-colors"
                  >
                    {copiedCode === incident.shareCode ? "✓ Copied!" : "📋 Share Code"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!hasOwnActive && (
        <>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-extrabold rounded-2xl text-xs tracking-wider uppercase shadow-xl shadow-red-950/80 border border-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span>🚨 Declare Emergency Dispatch</span>
          </button>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-100">Live Radar</h2>
                <p className="text-[11px] text-zinc-400">
                  {status === "gps" &&
                    `Standby mode • ${facilities.length} Facilities within 25km radius`}
                  {status === "home" &&
                    `Standby mode • ${facilities.length} Facilities within 25km radius`}
                  {status === "none" &&
                    "Location unavailable • Tap top bar to set home location"}
                </p>
              </div>
              {status === "gps" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live GPS Active
                </span>
              )}
              {status === "home" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Home Active
                </span>
              )}
              {status === "none" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 flex items-center gap-1">
                  <span>⚠️</span>
                  Offline
                </span>
              )}
            </div>

            <div className="relative w-full aspect-square max-w-[290px] mx-auto bg-zinc-950 border border-zinc-800/80 rounded-full p-4 flex items-center justify-center overflow-hidden shadow-inner">
              {status !== "none" && (
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                  <div className="w-full h-full origin-center animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.35)_0deg,rgba(16,185,129,0.05)_45deg,transparent_90deg)]" />
                </div>
              )}
              <div className="absolute inset-3 rounded-full border border-zinc-800/60" />
              <div className="absolute inset-12 rounded-full border border-zinc-800/50" />
              <div className="absolute inset-20 rounded-full border border-zinc-800/40" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-zinc-800/50" />
                <div className="h-full w-[1px] bg-zinc-800/50" />
              </div>

              <div
                className={`z-10 w-4 h-4 rounded-full flex items-center justify-center ${status !== "none"
                  ? "bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)] animate-pulse"
                  : "bg-zinc-700"
                  }`}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>

              {status !== "none" &&
                facilities.map((facility, idx) => {
                  const angle = ANGLES[idx % ANGLES.length];
                  const radiusPct = Math.min(
                    40,
                    Math.max(10, (facility.distanceKm / 25) * 40)
                  );
                  const leftPct = 50 + radiusPct * Math.cos(angle);
                  const topPct = 50 + radiusPct * Math.sin(angle);
                  const isSelected = selectedIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedIndex(isSelected ? null : idx)
                      }
                      style={{
                        top: `${topPct}%`,
                        left: `${leftPct}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${isSelected ? "scale-125 z-30" : "scale-100 z-20"
                        }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-300 animate-ping absolute" />
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold shadow-md ${isSelected
                            ? "bg-red-500 border-white text-white"
                            : "bg-red-950 border-red-500 text-red-300"
                            }`}
                        >
                          •
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>

            {selectedIndex !== null && facilities[selectedIndex] && (
              <div className="p-3 bg-zinc-950 border border-red-500/60 rounded-xl text-center shadow-lg animate-in fade-in duration-150 mt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Nearby Facility
                </span>
                <h4 className="text-xs font-bold text-zinc-100 mt-1">
                  {facilities[selectedIndex].facilityName}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  📍 {facilities[selectedIndex].city} •{" "}
                  {facilities[selectedIndex].distanceKm} km away
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        savedAddress={savedAddress}
        onIncidentCreated={fetchActiveIncidents}
      />
    </div>
  );
}
