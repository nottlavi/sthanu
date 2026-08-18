"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthPage from "./auth/page";
import BottomNav, { TabType } from "@/components/layout/BottomNav";
import FamilyTab from "@/components/family/FamilyTab";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("radar");

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-20 font-sans">
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-red-500 uppercase">Sthanu</h1>
          <p className="text-[11px] text-zinc-400">📍 Near Swargate, {user.city}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            2 AM Active
          </span>
          <button
            onClick={logout}
            className="text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </header>

      <section className="flex-1 p-4 max-w-md mx-auto w-full">
        {activeTab === "radar" && (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <h2 className="text-base font-semibold text-zinc-100 mb-1">🚨 Emergency Radar Feed</h2>
              <p className="text-xs text-zinc-400">
                Searching real-time inventory within 15km of your location.
              </p>
            </div>
          </div>
        )}

        {activeTab === "family" && <FamilyTab />}

        {activeTab === "log" && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h2 className="text-base font-semibold text-zinc-100 mb-1">🩸 e-RaktKosh Certificate Log</h2>
            <p className="text-xs text-zinc-400">
              Upload donation certificate to earn Blood Credits & verification badge.
            </p>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h2 className="text-base font-semibold text-zinc-100 mb-1">🏆 Campus & City Leaderboard</h2>
            <p className="text-xs text-zinc-400">
              Community Rankings for {user.city} & University Shields.
            </p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
            <h2 className="text-base font-semibold text-zinc-100">👤 Donor Profile</h2>
            <div className="text-xs text-zinc-300 space-y-1">
              <p><span className="text-zinc-500">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="text-zinc-500">Phone:</span> {user.phoneNumber}</p>
              <p><span className="text-zinc-500">City:</span> {user.city}</p>
              <p><span className="text-zinc-500">Total Donations:</span> {user.totalDonations}</p>
            </div>
          </div>
        )}
      </section>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
