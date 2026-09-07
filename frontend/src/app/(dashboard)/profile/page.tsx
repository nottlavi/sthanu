export default function ProfilePage() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-wider uppercase text-white">
          User Profile
        </h2>
        <p className="text-xs text-neutral-500">
          Personal details, home address & emergency contacts
        </p>
      </div>
    </div>
  );
}
