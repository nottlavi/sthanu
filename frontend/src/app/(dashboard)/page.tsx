import RadarScanner from "@/features/radar/components/RadarScanner";

export default function RadarPage() {
  return (
    <div className="px-4 py-4 flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] text-center gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-bold tracking-widest uppercase text-white">
          Emergency Radar
        </h1>
        <p className="text-xs text-neutral-400">
          Live blood bank and snakebite center monitoring
        </p>
      </div>

      <RadarScanner />
    </div>
  );
}
