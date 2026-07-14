"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useAppState } from "@/lib/AppContext";
import { ArrowLeft, MapPin, Info, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import Image from "next/image";

export default function AnalysePage() {
  const { location, setLocation, locationDetails } = useAppState();
  const [selectedMetric, setSelectedMetric] = useState<"air" | "water" | null>(null);
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  const getStatusColor = (status: "Excellent" | "Moderate" | "Poor") => {
    switch (status) {
      case "Excellent":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          dot: "bg-emerald-500",
        };
      case "Moderate":
        return {
          bg: "bg-[#FFFDF4]",
          border: "border-[#F1E0A0]",
          text: "text-[#B28900]",
          dot: "bg-[#F3C419]",
        };
      case "Poor":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-700",
          dot: "bg-rose-500",
        };
    }
  };

  const airStyle = getStatusColor(locationDetails.airQualityStatus);
  const waterStyle = getStatusColor(locationDetails.waterQualityStatus);

  // Mock location choices
  const locations = ["Santa Monica, CA", "Munich, Germany", "Berlin, Germany"];

  // Custom water pollutants if water is selected
  const waterPollutants = [
    {
      name: "TDS (Total Dissolved Solids)",
      value: "420 ppm",
      description: "High dissolved mineral and metal content, indicating potential runoff or heavy pipe leaching.",
      limit: "500 ppm EPA limit"
    },
    {
      name: "Chlorine",
      value: "2.4 ppm",
      description: "Used as a disinfectant, but leaves a strong chemical smell and dries skin and hair.",
      limit: "4.0 ppm limit"
    },
    {
      name: "Lead",
      value: "14.2 ppb",
      description: "Heavy metal contaminant leached from aging plumbing. Neurotoxic cumulative hazard.",
      limit: "15 ppb Action Level"
    },
    {
      name: "Microplastics",
      value: "High density",
      description: "Microscopic polymer fragments detected via spectroscopic analysis.",
      limit: "0 limit target"
    }
  ];

  const activePollutants = selectedMetric === "water" ? waterPollutants : locationDetails.pollutants;

  return (
    <AppShell>
      <div className="flex flex-col gap-5 pb-6">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-200/50 shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-zinc-600" />
          </button>
          
          <h1 className="text-xl font-bold tracking-tight text-blue-700">Oasis</h1>
          
          <div className="w-10 h-10" /> {/* Spacer to center the title */}
        </div>

        {/* Santa Monica Pier Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-md">
          <Image
            src={
              location === "Santa Monica, CA"
                ? "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80"
                : location === "Munich, Germany"
                ? "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=600&q=80"
                : "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80"
            }
            alt={location}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>

        {/* Location Dropdown / Title */}
        <div className="relative">
          {isChangingLocation ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Select Location</span>
              <div className="flex flex-col gap-1">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setIsChangingLocation(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      location === loc ? "bg-blue-50 text-blue-700" : "hover:bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsChangingLocation(true)}
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <h2 className="text-2xl font-bold tracking-tight group-hover:text-blue-700 transition-colors">
                {locationDetails.city}, {locationDetails.state}
              </h2>
              <MapPin className="h-5 w-5 text-zinc-400 group-hover:text-blue-700 group-hover:animate-bounce transition-colors" />
            </div>
          )}
        </div>

        {/* Air vs Water Quality Side-by-Side Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Air Quality Card */}
          <div
            onClick={() => setSelectedMetric(selectedMetric === "air" ? null : "air")}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 shadow-sm hover:shadow ${
              selectedMetric === "air" ? "scale-[1.02] border-zinc-900 bg-white" : `${airStyle.border} ${airStyle.bg}`
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="text-[10px]">💨</span> Air Quality
              </span>
            </div>
            
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
                {locationDetails.airQuality}
              </span>
            </div>
            
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${airStyle.dot}`} />
              <span className={airStyle.text}>{locationDetails.airQualityStatus}</span>
            </div>
          </div>

          {/* Water Quality Card */}
          <div
            onClick={() => setSelectedMetric(selectedMetric === "water" ? null : "water")}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 shadow-sm hover:shadow ${
              selectedMetric === "water" ? "scale-[1.02] border-zinc-900 bg-white" : `${waterStyle.border} ${waterStyle.bg}`
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="text-[10px]">💧</span> Water Quality
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-900">
                {locationDetails.waterQuality}
              </span>
              <span className="text-xs font-semibold text-zinc-400">/100</span>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${waterStyle.dot}`} />
              <span className={waterStyle.text}>{locationDetails.waterQualityStatus}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="flex items-start gap-3 rounded-2xl bg-[#EAECE6]/50 p-4 border border-zinc-200/40">
          <Info className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-zinc-600 font-medium">
            {selectedMetric === "water" 
              ? "Water quality reports compile municipality data, tap TDS tests, and contaminants including microplastics and lead trace levels." 
              : "Air quality scores are based on AQI and do not measure all air toxins including VOCs and certain urban fire pollutants."}
          </p>
        </div>

        {/* Pollutants Section */}
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-800 mb-3 flex items-center gap-1.5">
            {selectedMetric === "water" ? "💧 Water Contaminants" : "💨 Air Pollutants"}
            {selectedMetric && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                Filtered
              </span>
            )}
          </h3>

          <div className="flex flex-col gap-3">
            {activePollutants.map((pollutant) => (
              <div 
                key={pollutant.name}
                className="flex flex-col gap-1.5 rounded-2xl bg-white border border-zinc-200/60 p-4 shadow-sm hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-950">{pollutant.name}</span>
                  <span className="text-xs font-extrabold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                    {pollutant.value}
                  </span>
                </div>
                
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {pollutant.description}
                </p>

                <div className="flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Standard Threshold</span>
                  <span className="text-[10px] font-bold text-zinc-500">{pollutant.limit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
