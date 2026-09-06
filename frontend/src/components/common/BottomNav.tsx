"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Users, FileText, Trophy, User } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Radar", href: "/", icon: Radio },
  { label: "Family", href: "/family", icon: Users },
  { label: "Log", href: "/log", icon: FileText },
  { label: "Ranks", href: "/leaderboard", icon: Trophy },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-black/95 backdrop-blur-md border-t border-neutral-900 flex items-center justify-around px-2 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 transition-colors ${
              isActive
                ? "text-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${isActive ? "text-white stroke-[2.2]" : "stroke-[1.8]"}`}
            />
            <span className="text-[10px] font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
