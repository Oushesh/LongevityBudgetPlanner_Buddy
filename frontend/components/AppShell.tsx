"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Bell, BarChart3, Wifi, BatteryMedium, Signal } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      href: "/analyse",
      icon: Home,
    },
    {
      name: "For you",
      href: "/water",
      icon: Star,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2EC] p-0 md:p-8 font-sans antialiased text-zinc-900">
      {/* Phone Mockup Wrapper */}
      <div className="relative flex h-full min-h-screen w-full flex-col bg-[#F9F9F6] shadow-none md:h-[844px] md:min-h-[844px] md:w-[390px] md:rounded-[40px] md:border-8 md:border-zinc-800 md:shadow-2xl md:overflow-hidden transition-all duration-300">
        
        {/* Mock Phone Status Bar */}
        <div className="flex h-11 items-center justify-between px-6 py-2 select-none bg-[#F9F9F6] text-xs font-semibold text-zinc-800 shrink-0">
          <span className="tracking-tight">9:57</span>
          <div className="flex items-center gap-2">
            <Signal className="h-3.5 w-3.5 text-zinc-800" strokeWidth={2.5} />
            <Wifi className="h-3.5 w-3.5 text-zinc-800" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-medium mr-0.5">18%</span>
              <BatteryMedium className="h-4 w-4 text-zinc-800" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
          {children}
        </div>

        {/* Bottom Tab Bar Navigation */}
        <div className="absolute bottom-0 left-0 right-0 flex h-20 items-center justify-around border-t border-zinc-200/60 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-md select-none shrink-0 md:rounded-b-[32px]">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || 
              (tab.href === "/analyse" && pathname === "/") ||
              (tab.href === "/alerts" && pathname === "/alerts");
            const Icon = tab.icon;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-1 w-16 text-center cursor-pointer group active:scale-95 transition-transform"
              >
                <div
                  className={`flex items-center justify-center p-1 rounded-full transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-500 scale-105"
                      : "text-zinc-400 group-hover:text-zinc-600"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide transition-colors ${
                    isActive ? "text-zinc-800 font-bold" : "text-zinc-400 group-hover:text-zinc-500"
                  }`}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Home Indicator Bar (iOS style) */}
        <div className="absolute bottom-1 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-zinc-300 pointer-events-none hidden md:block" />
      </div>
    </div>
  );
}
