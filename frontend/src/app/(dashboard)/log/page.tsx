export default function LogPage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-wider uppercase text-white">
          Donation Log
        </h2>
        <p className="text-xs text-neutral-500">
          Verified e-RaktKosh donations & 90-day cooldown status
        </p>
      </div>
    </div>
  );
}
