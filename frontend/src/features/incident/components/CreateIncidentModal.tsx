"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Droplet,
  Syringe,
  Radio,
  MapPin,
  Navigation,
  History,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useGeoLocation } from "@/features/address/hooks/useGeoLocation";
import { useUserAddress } from "@/features/address/hooks/useUserAddress";
import { reverseGeoCode } from "@/features/address/api/address.api";
import { CreateIncident } from "../api/incident.api";
import {
  BLOOD_GROUP_MAP,
  BloodGroup,
  createIncidentRequest,
  INCIDENT_TYPE_MAP,
} from "@/types/incident.types";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export default function CreateIncidentModal({
  isOpen,
  onClose,
}: CreateIncidentModalProps) {
  const { getLocation, latitude, longitude, error, loading: isGpsLoading } =
    useGeoLocation();
  const { data: address } = useUserAddress();

  // Pure UI state for switching views
  const [incidentType, setIncidentType] = useState<"BLOOD" | "VENOM">("BLOOD");
  const [selectedBloodGroup, setSelectedBloodGroup] =
    useState<BloodGroup>("O+");
  const [locationSource, setLocationSource] = useState<
    "HOME" | "GPS" | "RECENT"
  >();
  const [sendLat, setSendLat] = useState<number | undefined>();
  const [sendLong, setSendLong] = useState<number | undefined>();
  const [locationName, setLocationName] = useState<string | undefined>();
  const [unitsRequired, setUnitsRequired] = useState<number | undefined>();
  const [vialsRequired, setVialsRequired] = useState<number | undefined>();

  const handleSelectHome = () => {
    setLocationSource("HOME");
    if (address) {
      setLocationName(address?.addressLine);
      setSendLat(address?.latitude);
      setSendLong(address?.longitude);
    }
  };

  const handleSelectGPS = async () => {
    setLocationSource("GPS");
    getLocation();
  };

  useEffect(() => {
    if (locationSource === "GPS" && latitude && longitude) {
      setSendLat(latitude);
      setSendLong(longitude);

      reverseGeoCode({ latitude, longitude }).then((res) => {
        if (res?.placeName) {
          setLocationName(res.placeName);
        }
      });
    }
  }, [latitude, longitude, locationSource]);

  // Fall back to HOME address when GPS error occurs
  useEffect(() => {
    if (error) {
      handleSelectHome();
    }
  }, [error]);

  const isFormReady = Boolean(
    sendLat &&
      sendLong &&
      locationName?.trim() &&
      (incidentType === "BLOOD"
        ? (unitsRequired ?? 0) > 0
        : (vialsRequired ?? 0) > 0)
  );

  const handleSubmit = () => {
    if (!isFormReady || !sendLat || !sendLong || !locationName) return;
    const payload: createIncidentRequest = {
      incidentType: INCIDENT_TYPE_MAP[incidentType],
      locationName,
      latitude: sendLat,
      longitude: sendLong,
      ...(incidentType === "BLOOD"
        ? {
            bloodGroup: BLOOD_GROUP_MAP[selectedBloodGroup],
            unitsRequired: Number(unitsRequired),
          }
        : {
            vialsRequired: Number(vialsRequired),
          }),
    };

    const res = CreateIncident(payload);
    console.log(res);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-2xl p-5 shadow-2xl shadow-black flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <div>
              <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-white">
                DECLARE EMERGENCY INCIDENT
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                BROADCAST TO EMERGENCY RADAR UNITS
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

        {/* Form Body */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 1. Incident Type Selector */}
          <div className="flex flex-col gap-1.5 font-mono">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400">
              INCIDENT TYPE *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl border border-neutral-800 bg-neutral-950">
              <button
                type="button"
                onClick={() => setIncidentType("BLOOD")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  incidentType === "BLOOD"
                    ? "bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300 border border-transparent"
                }`}
              >
                <Droplet
                  className={`w-3.5 h-3.5 ${incidentType === "BLOOD" ? "text-rose-500" : "text-neutral-500"}`}
                />
                <span>Blood</span>
              </button>

              <button
                type="button"
                onClick={() => setIncidentType("VENOM")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  incidentType === "VENOM"
                    ? "bg-rose-500/15 border border-rose-500/40 text-rose-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300 border border-transparent"
                }`}
              >
                <Syringe
                  className={`w-3.5 h-3.5 ${incidentType === "VENOM" ? "text-rose-500" : "text-neutral-500"}`}
                />
                <span>Snakebite</span>
              </button>
            </div>
          </div>

          {/* Conditional Section: BLOOD */}
          {incidentType === "BLOOD" && (
            <div className="flex flex-col gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 font-mono">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  BLOOD GROUP REQUIRED *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setSelectedBloodGroup(group)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedBloodGroup === group
                          ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                    UNITS REQUIRED (BAGS) *
                  </label>
                  <span className="text-[9px] text-neutral-500">QUICK SELECT</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {[1, 2, 3, 4].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setUnitsRequired(qty)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          unitsRequired === qty
                            ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm"
                            : "border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {qty} {qty === 1 ? "Bag" : "Bags"}
                      </button>
                    ))}
                  </div>
                  <div className="w-20 rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                    <input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={unitsRequired ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUnitsRequired(val === "" ? undefined : parseFloat(val));
                      }}
                      required
                      className="w-full bg-transparent px-2.5 py-2 text-xs text-center text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Section: VENOM */}
          {incidentType === "VENOM" && (
            <div className="flex flex-col gap-3 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 font-mono">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                    ANTI-VENOM VIALS REQUIRED *
                  </label>
                  <span className="text-[9px] text-neutral-500">QUICK SELECT</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {[2, 4, 6, 8].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setVialsRequired(qty)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          vialsRequired === qty
                            ? "bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm"
                            : "border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        {qty} Vials
                      </button>
                    ))}
                  </div>
                  <div className="w-20 rounded-xl border border-neutral-800 bg-neutral-950 focus-within:border-neutral-600 transition-colors">
                    <input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={vialsRequired ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVialsRequired(val === "" ? undefined : parseFloat(val));
                      }}
                      required
                      className="w-full bg-transparent px-2.5 py-2 text-xs text-center text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 leading-snug">
                Radar will locate and alert nearest facilities equipped with
                polyvalent anti-snake venom.
              </p>
            </div>
          )}

          {/* Tactical Location & Target Fix Card */}
          <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-950/60 font-mono">
            {/* Presets Header */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  INCIDENT LOCATION & TARGET FIX *
                </label>
                <span className="text-[9px] text-neutral-500 uppercase">
                  FAST AUTOFILL
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl border border-neutral-800 bg-neutral-900/60">
                {/* 1. Home Coords */}
                <button
                  type="button"
                  onClick={handleSelectHome}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-[10px] font-semibold tracking-wide transition-all ${
                    locationSource === "HOME"
                      ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/80"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40 border border-transparent"
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      locationSource === "HOME"
                        ? "text-emerald-400"
                        : "text-neutral-500"
                    }`}
                  />
                  <span className="truncate">Home Coords</span>
                </button>

                {/* 2. Live GPS */}
                <button
                  type="button"
                  onClick={handleSelectGPS}
                  disabled={isGpsLoading}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-[10px] font-semibold tracking-wide transition-all ${
                    locationSource === "GPS"
                      ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/80"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40 border border-transparent"
                  }`}
                >
                  {isGpsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-rose-500" />
                  ) : (
                    <Navigation
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        locationSource === "GPS"
                          ? "text-rose-500"
                          : "text-neutral-500"
                      }`}
                    />
                  )}
                  <span className="truncate">
                    {isGpsLoading ? "Acquiring..." : "Live GPS"}
                  </span>
                </button>

                {/* 3. Recent 3 */}
                <button
                  type="button"
                  onClick={() => setLocationSource("RECENT")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-[10px] font-semibold tracking-wide transition-all ${
                    locationSource === "RECENT"
                      ? "bg-neutral-800 text-white shadow-sm border border-neutral-700/80"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/40 border border-transparent"
                  }`}
                >
                  <History
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      locationSource === "RECENT"
                        ? "text-amber-400"
                        : "text-neutral-500"
                    }`}
                  />
                  <span className="truncate">Recent 3</span>
                </button>
              </div>

              {/* Error Feedback Banner */}
              {error && (
                <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] leading-tight text-center">
                  <AlertCircle className="w-3 h-3 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Location Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                LOCATION / LANDMARK *
              </label>
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 focus-within:border-neutral-600 transition-colors">
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospital ICU, Ward 4"
                  required
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none font-sans"
                  value={locationName ?? ""}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Coordinates (Latitude & Longitude) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400">
                  COORDINATES
                </label>
                <span className="text-[9px] text-neutral-500">
                  {sendLat && sendLong ? "RADAR FIX ACQUIRED" : "NO GPS FIX"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 focus-within:border-neutral-600 transition-colors">
                  <span className="text-[9px] text-neutral-500 uppercase font-semibold mr-2">
                    LAT
                  </span>
                  <input
                    type="number"
                    step="any"
                    placeholder="12.97159"
                    required
                    className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
                    value={sendLat ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSendLat(val === "" ? undefined : parseFloat(val));
                    }}
                  />
                </div>

                <div className="flex items-center px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 focus-within:border-neutral-600 transition-colors">
                  <span className="text-[9px] text-neutral-500 uppercase font-semibold mr-2">
                    LNG
                  </span>
                  <input
                    type="number"
                    step="any"
                    placeholder="77.59456"
                    required
                    className="w-full bg-transparent text-xs text-white placeholder:text-neutral-600 focus:outline-none font-mono"
                    value={sendLong ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSendLong(val === "" ? undefined : parseFloat(val));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900 font-mono">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={!isFormReady}
                className={`w-2/3 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  isFormReady
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.35)] active:scale-[0.99] cursor-pointer"
                    : "bg-neutral-900 text-neutral-600 border border-neutral-800/80 cursor-not-allowed shadow-none"
                }`}
              >
                <Radio
                  className={`w-3.5 h-3.5 ${isFormReady ? "animate-pulse" : "text-neutral-600"}`}
                />
                <span>BROADCAST INCIDENT</span>
              </button>
            </div>

            {!isFormReady && (
              <p className="text-[9px] text-center text-neutral-500 font-mono">
                {!sendLat || !sendLong
                  ? "Select a location preset or enter coordinates above"
                  : !locationName
                    ? "Please enter a location description"
                    : "Complete required quantities to broadcast"}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
