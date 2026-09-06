export default function LeaderboardPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-wider uppercase text-white">
          Leaderboard
        </h2>
        <p className="text-xs text-neutral-500">
          Top community blood donors & active emergency responders
        </p>
      </div>
    </div>
  );
}
