"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Droplet,
  Syringe,
  Copy,
  Check,
  Users,
  ExternalLink,
  Phone,
  Building2,
  Navigation,
  Compass,
  Radio,
} from "lucide-react";
import {
  IncidentResponse,
  BLOOD_GROUP_REVERSE_MAP,
} from "@/types/incident.types";
import { Facility, FacilityType } from "@/types/facility.types";
import { fetchFacilites } from "@/features/facility/api/facillity.api";
import { useGeoLocation } from "@/features/address/hooks/useGeoLocation";
import { useUserAddress } from "@/features/address/hooks/useUserAddress";
import { useNearestFacilites } from "@/features/facility/hooks/useNearestFacilities";

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentResponse | null;
  onResolve?: (incidentId: string) => void;
}

export default function IncidentDetailModal({
  isOpen,
  onClose,
  incident,
  onResolve,
}: IncidentDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeOrigin, setActiveOrigin] = useState<"INCIDENT" | "GPS" | "HOME">(
    "INCIDENT",
  );

  if (!isOpen || !incident) return null;

  const isBlood = incident.incidentType === 1;
  const bloodName = incident.bloodGroup
    ? BLOOD_GROUP_REVERSE_MAP[incident.bloodGroup]
    : "UNKNOWN";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(incident.shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const {
    latitude: gpsLat,
    longitude: gpsLng,
    error,
    loading,
    getLocation,
  } = useGeoLocation();

  const { data: address } = useUserAddress();

  const targetCoords =
    activeOrigin === "GPS"
      ? { lat: gpsLat, lng: gpsLng }
      : activeOrigin === "HOME"
        ? { lat: address?.latitude, lng: address?.longitude }
        : { lat: incident?.latitude, lng: incident?.longitude };

  useEffect(() => {
    if (error && activeOrigin === "GPS") {
      setActiveOrigin("INCIDENT");
    }
  }, [error, activeOrigin]);

  const { data: facilities, isLoading: isFacilitiesLoading } =
    useNearestFacilites(targetCoords.lat, targetCoords.lng, incident?.id);

  const facilityList = Array.isArray(facilities)
    ? facilities
    : ((facilities as any)?.facilities ?? []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono text-left">
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* 1. Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            </span>
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-white">
                EMERGENCY INCIDENT DOSSIER
              </h3>
              <p className="text-[10px] text-neutral-500">
                ACTIVE BROADCAST REF #{incident.shareCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Emergency Telemetry Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-rose-500/30 bg-rose-500/[0.04]">
          <div className="flex items-center gap-2 flex-wrap">
            {isBlood ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                <Droplet className="w-3.5 h-3.5 fill-rose-500/40" />
                <span>{bloodName} BLOOD</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Syringe className="w-3.5 h-3.5" />
                <span>ANTI-VENOM</span>
              </span>
            )}

            <span className="text-xs text-white font-semibold">
              {isBlood
                ? `${incident.unitsRequired ?? 1} Bag${(incident.unitsRequired ?? 1) > 1 ? "s" : ""} Required`
                : `${incident.vialsRequired ?? 2} Vials Required`}
            </span>
          </div>

          <span className="text-[10px] text-neutral-400">
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

        {/* 3. Incident Location & Target Navigation */}
        <div className="flex flex-col gap-2 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>INCIDENT LOCATION</span>
            </span>
            <span className="text-[9px] text-neutral-500">TARGET FIX</span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white font-sans">
                {incident.locationName}
              </span>
              <span className="text-[10px] text-neutral-500">
                LAT: {incident.latitude.toFixed(5)} // LNG:{" "}
                {incident.longitude.toFixed(5)}
              </span>
            </div>

            <a
              href={`https://maps.google.com/?q=${incident.latitude},${incident.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-[10px] text-white transition-colors shrink-0"
            >
              <span>Navigate Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 4. Responder Share Code & Participant Roster */}
        <div className="flex flex-col gap-2.5 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>COORDINATION & RESPONDERS</span>
            </span>

            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-[9px] text-neutral-300 hover:text-white transition-colors"
            >
              <span className="text-neutral-500">CODE:</span>
              <span className="font-bold text-emerald-400">
                {incident.shareCode}
              </span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
              ) : (
                <Copy className="w-3 h-3 text-neutral-500 ml-0.5" />
              )}
            </button>
          </div>

          {/* Connected Responders List */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[9px] text-neutral-500 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                {incident.participants?.length || 0} Connected Responder
                {(incident.participants?.length || 0) === 1 ? "" : "s"}:
              </span>
            </span>

            {incident.participants && incident.participants.length > 0 ? (
              <div className="flex flex-col gap-1">
                {incident.participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-neutral-900 bg-neutral-900/50 text-[10px]"
                  >
                    <span className="text-white font-semibold font-sans">
                      {p.firstName} {p.lastName}
                    </span>

                    <a
                      href={`tel:${p.phoneNumber}`}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-semibold hover:bg-emerald-500/20 transition-colors"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{p.phoneNumber}</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-neutral-900/30 border border-neutral-900 text-[10px] text-neutral-600 italic text-center">
                Awaiting first responder to connect via code #
                {incident.shareCode}
              </div>
            )}
          </div>
        </div>

        {/* 5. Nearest Equipped Facilities Directory */}
        <div className="flex flex-col gap-2.5 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-cyan-400" />
              <span>EQUIPPED FACILITIES WITH STOCK</span>
            </span>
            <span className="text-[9px] text-neutral-500">LIVE DIRECTORY</span>
          </div>

          {/* Origin Perspective Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border border-neutral-800 bg-neutral-900/60 text-[10px]">
            <button
              type="button"
              onClick={() => setActiveOrigin("INCIDENT")}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-colors ${
                activeOrigin === "INCIDENT"
                  ? "bg-neutral-800 text-white font-semibold border border-neutral-700/80 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Compass className="w-3 h-3 shrink-0" />
              <span className="truncate">Near Incident</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveOrigin("GPS");
                if (!gpsLng || !gpsLat) {
                  getLocation();
                }
              }}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-colors ${
                activeOrigin === "GPS"
                  ? "bg-neutral-800 text-white font-semibold border border-neutral-700/80 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Navigation className="w-3 h-3 shrink-0" />
              <span className="truncate">Near My GPS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOrigin("HOME")}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg transition-colors ${
                activeOrigin === "HOME"
                  ? "bg-neutral-800 text-white font-semibold border border-neutral-700/80 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">Near Home</span>
            </button>
          </div>

          {/* Facility Cards List */}
          <div className="flex flex-col gap-2 mt-1">
            {isFacilitiesLoading ? (
              <div className="space-y-2">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="p-2.5 rounded-xl border border-neutral-800/70 bg-neutral-900/40 animate-pulse flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-36 bg-neutral-800 rounded" />
                      <div className="h-3 w-16 bg-neutral-800 rounded" />
                    </div>
                    <div className="h-2 w-48 bg-neutral-800/60 rounded" />
                    <div className="h-6 w-full bg-neutral-800/40 rounded mt-1" />
                  </div>
                ))}
              </div>
            ) : facilityList.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {facilityList.map((f: any, idx: number) => {
                  const typeLabel =
                    f.type === 1 || f.facilityType === 1
                      ? "HOSPITAL"
                      : f.type === 2 || f.facilityType === 2
                        ? "BLOOD BANK"
                        : "BSU";

                  const typeColor =
                    f.type === 1 || f.facilityType === 1
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                      : f.type === 2 || f.facilityType === 2
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400";

                  const bloodUnits = f.bloodUnits ?? f.bloodStockDto ?? [];

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
                    >
                      {/* Top row: Name, Badge, Distance */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-semibold text-white font-sans truncate">
                              {f.facilityName}
                            </h4>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${typeColor}`}
                            >
                              {typeLabel}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {f.address}, {f.city}
                          </p>
                        </div>

                        {f.distanceKm != null && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[9px] font-bold text-neutral-300">
                            {f.distanceKm} KM
                          </span>
                        )}
                      </div>

                      {/* Stock Details */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                        {incident.incidentType === 1 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">
                            <Droplet className="w-3 h-3 shrink-0" />
                            <span>
                              {bloodUnits.length > 0
                                ? `${bloodUnits.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0)} Units Available`
                                : "Stock In Transit / Zero Units"}
                            </span>
                          </div>
                        )}

                        {incident.incidentType === 2 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                            <Syringe className="w-3 h-3 shrink-0" />
                            <span>
                              {f.venomVialsCount ?? 0} Antivenom Vials Ready
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Links (1-Tap Call & Directions) */}
                      <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800/60">
                        <a
                          href={`tel:${f.contactPhone}`}
                          className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-semibold transition-colors"
                        >
                          <Phone className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Call {f.contactPhone}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg border border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:text-white text-[10px] transition-colors"
                        >
                          <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Route</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-neutral-800/60 bg-neutral-900/30 text-center flex flex-col items-center justify-center gap-1 text-neutral-500">
                <Building2 className="w-4 h-4 text-neutral-600" />
                <span className="text-[10px] uppercase tracking-wider">
                  No equipped facilities found within search radius
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 6. Footer Actions */}
        <div className="pt-2 border-t border-neutral-900">
          {onResolve ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={() => onResolve(incident.id)}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>RESOLVE INCIDENT</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
