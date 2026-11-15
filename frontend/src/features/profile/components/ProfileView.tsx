"use client";

import React from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Users,
  Droplet,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useUserFamily } from "@/features/family/hooks/useUserFamily";
import { useUserAddress } from "@/features/address/hooks/useUserAddress";
import { useLogout } from "@/features/auth/hooks/useLogout";

export default function ProfileView() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: family } = useUserFamily();
  const { data: address } = useUserAddress();
  const { logout } = useLogout();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "OP";

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] font-mono text-left select-none max-w-xl mx-auto w-full gap-5 pb-20">
      {/* Header (No badges) */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">
              OPERATOR DOSSIER
            </h1>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Personal credentials, coordinates & family status
            </p>
          </div>
        </div>
      </div>

      {/* Operator Identity Card */}
      <div className="w-full p-5 rounded-2xl border border-neutral-800 bg-[#0A0A0A] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/80 flex items-center justify-center text-white text-sm font-bold tracking-widest shadow-inner">
            {initials}
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">
              {user
                ? `${user.firstName} ${user.lastName}`
                : isUserLoading
                  ? "LOADING..."
                  : "OPERATOR"}
            </span>
            <span className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
              <Phone className="w-3 h-3 text-neutral-500" />
              <span>{user?.phoneNumber ?? "---"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Family Network Status (Redirects to /family if exists, otherwise prompts) */}
      <div className="w-full flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1">
          FAMILY NETWORK
        </span>

        {family ? (
          <Link
            href="/family"
            className="w-full p-4 rounded-xl border border-rose-500/30 hover:border-rose-500/50 bg-rose-500/[0.04] hover:bg-rose-500/[0.08] flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-rose-400 font-semibold tracking-wider">
                  LINKED FAMILY
                </span>
                <span className="text-xs font-bold text-white tracking-wide mt-0.5">
                  {family.familyName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span className="text-[11px] uppercase tracking-wider">VIEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ) : (
          <Link
            href="/family"
            className="w-full p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/60 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">
                  FAMILY STATUS
                </span>
                <span className="text-xs font-semibold text-neutral-400 mt-0.5">
                  NO FAMILY
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase tracking-wider">
              <span>CONNECT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        )}
      </div>

      {/* Vital Stats Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Blood Donations Counter */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0A0A0A] flex flex-col gap-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              DONATION RECORD
            </span>
            <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-white">
              {user?.totalDonations ?? 0}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
              VERIFIED DONATIONS
            </span>
          </div>
        </div>

        {/* Registered Home Base */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-[#0A0A0A] flex flex-col gap-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              HOME BASE
            </span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-xs font-bold text-white truncate mt-1">
            {address?.city
              ? `${address.city}, ${address.state ?? ""}`
              : "NO CITY REGISTERED"}
          </span>
          <span className="text-[10px] text-neutral-500 truncate">
            {address?.addressLine ?? "Coordinates not set"}
          </span>
        </div>
      </div>

      {/* Logout Button */}
      <div className="w-full pt-4">
        <button
          type="button"
          onClick={logout}
          className="w-full py-3 rounded-xl border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/[0.04] hover:bg-rose-500/[0.08] text-rose-400 text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </div>
    </div>
  );
}
