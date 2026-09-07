"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Navigation, Loader2, Check } from "lucide-react";
import { useUserAddress } from "../hooks/useUserAddress";
import { saveUserAddress, reverseGeoCode } from "../api/address.api";
import { useGeoLocation } from "../hooks/useGeoLocation";

interface SetAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetAddressModal({
  isOpen,
  onClose,
}: SetAddressModalProps) {
  const queryClient = useQueryClient();
  const { data: address, isLoading } = useUserAddress();
  const {
    getLocation,
    latitude,
    longitude,
    loading: isGpsLoading,
    error: geoError,
  } = useGeoLocation();

  const [addressLine, setAddressLine] = useState(address?.addressLine || "");
  const [landMark, setLandMark] = useState(address?.landmark || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [pincode, setPincode] = useState(address?.pincode || "");
  const [error, setError] = useState("");

  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isTrackingLocation = isGpsLoading || isReverseGeocoding;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pincode?.length !== 6) {
      setError("Please enter a 6-digit numeric pincode");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        addressLine,
        landmark: landMark,
        city,
        state,
        pincode,
        latitude: latitude || address?.latitude || 0,
        longitude: longitude || address?.longitude || 0,
      };

      await saveUserAddress(payload);
      await queryClient.invalidateQueries({ queryKey: ["userAddress"] });

      // UX: Give clear visual success feedback without closing the modal
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2200);
    } catch (err: any) {
      setError(err?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGpsAct = () => {
    setError("");
    getLocation();
  };

  useEffect(() => {
    if (geoError) {
      setError(geoError);
    }
  }, [geoError]);

  useEffect(() => {
    if (latitude === null || longitude === null) return;

    const payload = { latitude, longitude };

    const reverseGeoCodeAsync = async () => {
      setIsReverseGeocoding(true);
      setError("");
      try {
        const res = await reverseGeoCode(payload);
        if (res) {
          setAddressLine(res?.placeName || "");
          setCity(res?.city || "");
          setPincode(res?.pincode || "");
          setState(res?.state || "");
        }
      } catch (err: any) {
        setError("Failed to resolve address from GPS coordinates");
      } finally {
        setIsReverseGeocoding(false);
      }
    };

    reverseGeoCodeAsync();
  }, [latitude, longitude]);

  useEffect(() => {
    if (address) {
      setAddressLine(address.addressLine || "");
      setLandMark(address.landmark || "");
      setCity(address.city || "");
      setState(address.state || "");
      setPincode(address.pincode || "");
    }
  }, [address]);

  const isUnchanged =
    (addressLine || "") === (address?.addressLine || "") &&
    (landMark || "") === (address?.landmark || "") &&
    (city || "") === (address?.city || "") &&
    (state || "") === (address?.state || "") &&
    (pincode || "") === (address?.pincode || "");

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Floating Card anchored directly to the right, below the header */}
      <div className="absolute right-0 top-full mt-3.5 z-50 w-80 sm:w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-800 bg-[#0A0A0A] p-4 shadow-2xl shadow-black flex flex-col gap-3.5 select-none">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-white">
              SET HOME LOCATION
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-neutral-400 -mt-1 leading-snug">
          Saved base for rapid emergency dispatch and local radar alerts.
        </p>

        {/* Use GPS Button */}
        <button
          type="button"
          disabled={isTrackingLocation || isSaving}
          onClick={handleGpsAct}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
            isTrackingLocation
              ? "border-neutral-800 bg-neutral-900/90 text-neutral-300 cursor-not-allowed"
              : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200 hover:text-white active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {isTrackingLocation ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
              <span className="tracking-wide">Tracking location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 text-rose-500" />
              <span>Use GPS</span>
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-[#0A0A0A] px-2 text-[10px] uppercase tracking-wider text-neutral-500">
            or enter manually
          </span>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] leading-snug">
            {error}
          </div>
        )}

        {/* Minimal Inputs */}
        <form className="flex flex-col gap-2.5" onSubmit={handleSave}>
          {/* Street Address */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
            <input
              value={addressLine || ""}
              onChange={(e) => setAddressLine(e.target.value)}
              disabled={isTrackingLocation || isSaving}
              type="text"
              placeholder="Flat, House no., Street address"
              required
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Landmark */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
            <input
              value={landMark || ""}
              onChange={(e) => setLandMark(e.target.value)}
              disabled={isTrackingLocation || isSaving}
              type="text"
              placeholder="Landmark (optional)"
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* City & State (Row) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
              <input
                value={city || ""}
                onChange={(e) => setCity(e.target.value)}
                disabled={isTrackingLocation || isSaving}
                type="text"
                placeholder="City"
                required
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
              <input
                value={state || ""}
                onChange={(e) => setState(e.target.value)}
                disabled={isTrackingLocation || isSaving}
                type="text"
                placeholder="State"
                required
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Pincode */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 focus-within:border-neutral-500 transition-colors">
            <input
              type="text"
              value={pincode || ""}
              onChange={(e) => setPincode(e.target.value)}
              disabled={isTrackingLocation || isSaving}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit Pincode"
              required
              className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none tracking-wider disabled:opacity-50"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isUnchanged || isSaving || isTrackingLocation || isSaved}
            className={`w-full mt-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isSaved
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default"
                : isSaving
                  ? "bg-neutral-200 text-neutral-800 cursor-not-allowed opacity-90"
                  : "bg-white text-black hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Location Saved</span>
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-800" />
                <span>Saving Location...</span>
              </>
            ) : (
              <span>Save Location</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
