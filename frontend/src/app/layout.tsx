import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STHANU — Emergency Logistics & Family Shield",
  description: "Real-time emergency radar for Indian blood banks and snakebite anti-venom centers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0D14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0D14] text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
