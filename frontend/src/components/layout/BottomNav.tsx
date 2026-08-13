"use client";

export type TabType = "radar" | "log" | "leaderboard" | "profile";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "radar", label: "Radar", icon: "🚨" },
    { id: "log", label: "Log", icon: "🩸" },
    { id: "leaderboard", label: "Ranks", icon: "🏆" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-red-500 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className={`text-lg transition-transform ${isActive ? "scale-110" : "opacity-80"}`}>
                {tab.icon}
              </span>
              <span className="text-[11px] tracking-wide">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 bg-red-500 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
