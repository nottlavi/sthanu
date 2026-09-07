import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Sticky Top Header */}
      <Header />

      {/* Main Page Canvas (padded at the bottom so content never gets hidden behind BottomNav) */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
