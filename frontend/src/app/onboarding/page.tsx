import Onboard from "@/components/auth/Onboard";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
      <Suspense fallback={null}>
        <Onboard />
      </Suspense>
    </main>
  );
}
