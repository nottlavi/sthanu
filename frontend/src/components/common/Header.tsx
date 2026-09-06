"use client";

import { useState } from "react";
import { useUserAddress } from "@/features/address/hooks/useUserAddress";
import SetAddressModal from "@/features/address/components/SetAddressModal";
import { MapPin, ChevronDown } from "lucide-react";

export default function Header() {
  const { data: address, isLoading } = useUserAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full h-14 border-b border-neutral-900 flex items-center justify-between px-6 select-none">
      {/* Background layer with blur isolated so it doesn't clip child popovers */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md -z-10 pointer-events-none" />

      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <span className="text-base font-bold tracking-widest text-white uppercase">
          STHANU
        </span>
      </div>

      {/* Right Section: Location Trigger & Anchored Dropdown */}
      <div className="relative">
        {isLoading ? (
          <span className="text-xs text-neutral-600 animate-pulse">
            Locating...
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setIsModalOpen((prev) => !prev)}
            className="group flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-transparent hover:border-neutral-800 hover:bg-neutral-900/60 transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span
              className={`text-xs font-medium transition-colors ${
                address
                  ? "text-neutral-300 group-hover:text-white"
                  : "text-rose-500 group-hover:text-rose-400"
              }`}
            >
              {address
                ? `${address.city}, ${address.state}`
                : "Set Home Address"}
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-150 ${
                isModalOpen
                  ? "rotate-180 text-white"
                  : "text-neutral-600 group-hover:text-neutral-400"
              }`}
            />
          </button>
        )}

        {/* Anchored Popover directly beneath the button on the right */}
        <SetAddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </header>
  );
}
