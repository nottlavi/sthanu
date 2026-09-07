"use client";

import { Siren } from "lucide-react";
import { useState } from "react";
import CreateIncidentModal from "./CreateIncidentModal";

export default function CreateIncidentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(225,29,72,0.35)] hover:shadow-[0_0_35px_rgba(225,29,72,0.5)] active:scale-[0.98]"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <Siren className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span>Report Emergency Incident</span>
      </button>

      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
