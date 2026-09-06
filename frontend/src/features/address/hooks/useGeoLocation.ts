"use client";
import { useState } from "react";
import { Location } from "@/types/address.types";

export function useGeoLocation() {
  const [state, setState] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setState((prev) => ({ ...prev, error: "Geolocation not supported" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },

      (error) => {
        let friendlyMessage = "Failed to get location";
        if (error.code === error.PERMISSION_DENIED) {
          friendlyMessage =
            "Please allow location access in your browser settings.";
        } else if (error.code === error.TIMEOUT) {
          friendlyMessage = "Location request timed out. Please try again.";
        }
        setState((prev) => ({
          ...prev,
          error: friendlyMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: true, // Use GPS hardware if available
        timeout: 10000, // Give up after 10 seconds (prevents infinite loading)
        maximumAge: 60000, // Accept a cached location if it is under 1 minute old
      },
    );
  };

  return { ...state, getLocation };
}
