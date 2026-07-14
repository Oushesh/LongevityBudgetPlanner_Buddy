"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useAppState } from "@/lib/AppContext";
import { Bell, AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export default function AlertsPage() {
  const { location, locationDetails } = useAppState();
  const [readAlerts, setReadAlerts] = useState<string[]>([]);

  const mockAlerts = [
    {
      id: "alert-water-1",
      type: "critical",
      title: "Critical Water Contamination",
      message: `Water Quality in ${locationDetails.city} is graded Poor (${locationDetails.waterQuality}/100). Lead trace amounts and TDS exceed standard health safety thresholds. Use a 5-stage filter immediately.`,
      time: "2h ago",
      icon: AlertOctagon,
    },
    {
      id: "alert-air-1",
      type: "warning",
      title: "Moderate Air Quality Warning",
      message: `Air Quality is currently ${locationDetails.airQuality} AQI (${locationDetails.airQualityStatus}). Fine particulate matter PM2.5 is slightly elevated. Sensitive individuals should avoid outdoor cardio.`,
      time: "5h ago",
      icon: AlertTriangle,
    },
    {
      id: "alert-product-1",
      type: "info",
      title: "Purity Score Verified",
      message: "ZeroWater 5-stage filter logged in your profile successfully reduces TDS to 0 ppm. Bioavailability-aware protocol updated.",
      time: "1d ago",
      icon: CheckCircle2,
    }
  ];

  const handleToggleRead = (id: string) => {
    if (readAlerts.includes(id)) {
      setReadAlerts(prev => prev.filter(aId => aId !== id));
    } else {
      setReadAlerts(prev => [...prev, id]);
    }
  };

  const getAlertColors = (type: string, isRead: boolean) => {
    if (isRead) {
      return {
        bg: "bg-zinc-50 border-zinc-200/50 opacity-60",
        iconText: "text-zinc-400",
        title: "text-zinc-500",
      };
    }
    switch (type) {
      case "critical":
        return {
          bg: "bg-rose-50 border-rose-200/80 shadow-xs",
          iconText: "text-rose-600 animate-pulse",
          title: "text-rose-950 font-bold",
        };
      case "warning":
        return {
          bg: "bg-[#FFFDF4] border-[#F1E0A0]/80 shadow-xs",
          iconText: "text-[#B28900]",
          title: "text-[#4A3B00] font-bold",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200/80 shadow-xs",
          iconText: "text-blue-600",
          title: "text-blue-950 font-bold",
        };
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-5 pb-6">
        
        {/* Header */}
        <div className="flex items-center justify-between py-2">
          <div className="w-10" /> {/* Spacer */}
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Alerts</h1>
          {readAlerts.length < mockAlerts.length ? (
            <button 
              onClick={() => setReadAlerts(mockAlerts.map(a => a.id))}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 active:scale-95 transition-transform"
            >
              Mark all read
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-3.5">
          {mockAlerts.map((alert) => {
            const isRead = readAlerts.includes(alert.id);
            const colors = getAlertColors(alert.type, isRead);
            const AlertIcon = alert.icon;

            return (
              <div
                key={alert.id}
                onClick={() => handleToggleRead(alert.id)}
                className={`relative flex items-start gap-3.5 cursor-pointer rounded-3xl border-2 p-4.5 transition-all duration-200 select-none ${colors.bg}`}
              >
                {/* Left side Status Icon */}
                <div className={`mt-0.5 rounded-full p-1 shrink-0 ${colors.iconText}`}>
                  <AlertIcon className="h-5 w-5" />
                </div>

                {/* Middle details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className={`text-sm tracking-tight leading-snug truncate ${colors.title}`}>
                      {alert.title}
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-400 shrink-0">
                      {alert.time}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium mt-1.5">
                    {alert.message}
                  </p>

                  {!isRead && (
                    <div className="mt-3.5 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600">Tap to dismiss</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Longevity Shield Callout */}
        <div className="rounded-3xl border border-zinc-200/60 bg-white p-5 shadow-xs flex flex-col gap-3">
          <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5">
            <ShieldAlert className="h-4.5 w-4.5 text-blue-600" />
            Active Longevity Shield
          </h4>
          <p className="text-xs leading-relaxed text-zinc-500 font-medium">
            Your profile monitors pollutants relative to custom biomarkers and filter capabilities. Ensure your water purifiers are replaced according to filter logs for continuous protection.
          </p>
        </div>

      </div>
    </AppShell>
  );
}
