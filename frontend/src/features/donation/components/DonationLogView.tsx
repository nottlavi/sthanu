"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  X,
  Lock,
} from "lucide-react";
import { uploadCert } from "../api/donation.api";

export default function DonationLogView() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DUMMY STATE for previewing medical cooldown (Replace with real data later)
  const isCooldownActive = false;
  const cooldownDaysRemaining = 42;

  // DUMMY SUBMISSIONS for UI preview (Replace with real history later)
  const dummyHistory = [
    {
      id: "1",
      din: "ERK/2026/89412",
      donorName: "John Doe",
      donatedAt: "2026-08-14",
      license: "AFMC-PUNE-01",
      status: "SUCCESS",
      message: "Success: Logged Donation",
    },
    {
      id: "2",
      din: "ERK/2026/72019",
      donorName: "John Doe",
      donatedAt: "2026-07-02",
      license: null,
      status: "FAILED",
      message:
        "Medical Cooldown Active: Next eligible donation date is 2026-09-30.",
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const res = await uploadCert(selectedFile);

    console.log(res);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] font-mono text-left select-none max-w-xl mx-auto w-full gap-5 pb-24">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">
              DONATION REGISTRY
            </h1>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              e-RaktKosh cryptographic validation & cooldown tracking
            </p>
          </div>
        </div>
      </div>

      {/* 90-Day Medical Cooldown Banner */}
      <div className="w-full p-4 rounded-2xl border border-neutral-800 bg-[#0A0A0A] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isCooldownActive ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isCooldownActive ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {isCooldownActive
                ? `COOLDOWN ACTIVE (${cooldownDaysRemaining} DAYS REMAINING)`
                : "STATUS: ELIGIBLE TO DONATE"}
            </span>
          </div>

          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
              isCooldownActive
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>90-DAY PROTOCOL</span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          {isCooldownActive
            ? `Your body is replenishing iron and hemoglobin. You will be eligible to log your next whole-blood donation in ${cooldownDaysRemaining} days.`
            : "You have completed your mandatory 90-day medical interval. You are clear to log any recent verified donation."}
        </p>
      </div>

      {/* Certificate Upload Dropzone */}
      <div className="w-full flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1">
          SUBMIT OFFICIAL CERTIFICATE
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
            dragActive
              ? "border-rose-500 bg-rose-500/[0.06]"
              : "border-neutral-800 hover:border-neutral-700 bg-[#0A0A0A]"
          }`}
        >
          <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400">
            <UploadCloud className="w-7 h-7 text-rose-400" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-white tracking-wide uppercase">
              DRAG & DROP e-RAKTKOSH CERTIFICATE
            </p>
            <p className="text-[11px] text-neutral-500">
              or click to browse PDF files from your device
            </p>
          </div>

          {/* Security Protocols Notice */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-neutral-900/80 mt-1">
            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-neutral-600" />
              <span>PKCS#7 Cryptographic Check</span>
            </span>
            <span className="text-[10px] text-neutral-700">•</span>
            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-cyan-500" />
              <span>e-RaktKosh Authority Verified</span>
            </span>
            <span className="text-[10px] text-neutral-700">•</span>
            <span className="text-[10px] text-neutral-500">
              Official PDF format only
            </span>
          </div>
        </div>

        {/* Selected File Card & Verification CTA */}
        {selectedFile && (
          <div className="w-full p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.04] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <FileCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-bold text-white truncate">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-neutral-500 shrink-0">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
              onClick={handleUpload}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFY & LOG DONATION</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent Submissions Feed */}
      <div className="w-full flex flex-col gap-2.5 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1">
          SUBMISSION LOG
        </span>

        {dummyHistory.map((log) => {
          const isSuccess = log.status === "SUCCESS";
          return (
            <div
              key={log.id}
              className={`w-full p-4 rounded-xl border bg-[#0A0A0A] flex flex-col gap-2 transition-all ${
                isSuccess
                  ? "border-neutral-800/80 hover:border-neutral-700"
                  : "border-rose-500/20 bg-rose-500/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span className="text-xs font-bold text-white tracking-wide">
                    {log.din}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isSuccess
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  {isSuccess ? "+1 CREDIT AWARDED" : "CLAIM REJECTED"}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-900">
                <span>DONOR: {log.donorName.toUpperCase()}</span>
                <span>DATE: {log.donatedAt}</span>
              </div>

              {!isSuccess && (
                <div className="flex items-start gap-1.5 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px]">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <span>{log.message}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
