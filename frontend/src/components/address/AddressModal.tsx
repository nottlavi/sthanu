"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface AddressData {
  id?: string;
  addressLine: string;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSaved?: (address: AddressData) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  onAddressSaved,
}: AddressModalProps) {
  const { token } = useAuth();
  const [placeName, setPlaceName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFetchGpsLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setError("");

    const onGpsSuccess = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setLatitude(lat);
      setLongitude(lng);

      try {
        const res = await fetch(
          "http://localhost:5289/api/location/reverse-geocode",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude: lat, longitude: lng }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setPlaceName(data.placeName || "Current Location");
          setCity(data.city || "");
          setState(data.state || "");
          if (data.pincode) {
            setPincode(data.pincode);
          }
        }
      } catch {
        setPlaceName("Detected GPS Location");
      } finally {
        setGpsLoading(false);
      }
    };

    const onGpsError = () => {
      navigator.geolocation.getCurrentPosition(
        onGpsSuccess,
        (fallbackErr) => {
          setGpsLoading(false);
          if (fallbackErr.code === 1) {
            setError(
              "Location permission denied. Please allow location access in your browser."
            );
          } else {
            setError(
              "Unable to retrieve GPS coordinates. Please ensure device location is enabled."
            );
          }
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, {
      enableHighAccuracy: true,
      timeout: 8000,
    });
  };

  const handleSaveAddress = async () => {
    if (latitude === null || longitude === null) {
      setError("Please lock your GPS location first.");
      return;
    }

    if (!pincode.trim()) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setSaving(true);
    setError("");

    const payload: AddressData = {
      addressLine: placeName || `${city}, ${state}`,
      landmark: null,
      city: city || "Unknown City",
      state: state || "Unknown State",
      pincode: pincode.trim(),
      latitude,
      longitude,
    };

    try {
      const res = await fetch("http://localhost:5289/api/address/set-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save address.");
      }

      if (onAddressSaved) {
        onAddressSaved(data);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <h2 className="text-base font-bold text-zinc-100">
              Set Permanent Location
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Lock your permanent emergency location to enable instant 2 AM dispatch and PostGIS blood radar calculation.
        </p>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleFetchGpsLocation}
          disabled={gpsLoading}
          className="w-full bg-red-950/40 border border-red-800/80 hover:bg-red-950/60 disabled:opacity-50 text-red-300 py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          {gpsLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              <span>Locking Satellite GPS...</span>
            </>
          ) : (
            <>
              <span>🎯</span>
              <span>{latitude !== null ? "Re-Lock GPS Location" : "Lock Current GPS Location"}</span>
            </>
          )}
        </button>

        {latitude !== null && longitude !== null && (
          <div className="space-y-3 pt-1 animate-in fade-in duration-200">
            <div className="p-3.5 bg-zinc-950 border border-emerald-800/60 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  GPS Locked
                </span>
                <span className="font-mono text-[11px] text-zinc-400">
                  {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-100 block">
                  {placeName}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {[city, state].filter(Boolean).join(", ")}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-mono"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center min-h-[42px] shadow-lg shadow-red-950 active:scale-[0.99]"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Permanent Location"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
