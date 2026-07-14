"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useAppState, Product } from "@/lib/AppContext";
import { Settings, Shield, Sparkles, AlertTriangle, Trash2, X, Check, Bell, Moon } from "lucide-react";

export default function ProfilePage() {
  const { 
    activeProducts, 
    removeProduct, 
    healthScore, 
    toxinsCount, 
    benefitsCount, 
    risksCount 
  } = useAppState();

  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Radial progress calculations
  const calculateDashOffset = (score: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    return circumference - (score / 100) * circumference;
  };

  // Color coding for score rings
  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 50) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  // Mini custom SVGs for the product list items to fit the layout
  const renderProductListIcon = (type: string) => {
    switch (type) {
      case "fiji":
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <rect x="35" y="30" width="30" height="60" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <rect x="42" y="15" width="16" height="15" fill="#0284C7" />
            <circle cx="50" cy="65" r="8" fill="#FB7185" />
          </svg>
        );
      case "dyson":
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <rect x="40" y="15" width="20" height="45" rx="8" fill="#F4F4F5" stroke="#94A3B8" strokeWidth="2" />
            <rect x="38" y="60" width="24" height="30" rx="4" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        );
      case "water-filter":
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <path d="M35 25C35 20 65 20 65 25V75C65 85 60 90 50 90C40 90 35 85 35 75V25Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            <rect x="25" y="45" width="10" height="35" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            <rect x="42" y="35" width="16" height="25" fill="#94A3B8" />
          </svg>
        );
      case "shower-filter":
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <rect x="35" y="25" width="30" height="30" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <path d="M50 55V85" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d="M30 85C30 80 70 80 70 85V95H30V85Z" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          </svg>
        );
      case "water-delivery":
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <path d="M32 35C32 30 40 28 50 28C60 28 68 30 68 35V85C68 90 60 92 50 92C40 92 32 90 32 85V35Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
            <rect x="44" y="15" width="12" height="13" fill="#0284C7" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="25" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <path d="M40 50H60" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-5 pb-6">
        
        {/* Header with Gear Settings Icon */}
        <div className="flex items-center justify-between">
          <div className="w-10" /> {/* Spacer to align title */}
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Profile</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-200/50 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <Settings className="h-5 w-5 text-zinc-600" />
          </button>
        </div>

        {/* Health Score Main Card */}
        <div className="rounded-3xl bg-white border border-zinc-200/60 p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-5xl font-black tracking-tighter text-zinc-950 leading-none">
              {healthScore}
            </span>
            <span className="text-sm font-bold text-zinc-400 mt-2 tracking-wide">
              Health score
            </span>
          </div>

          {/* SVG Progress Gauge */}
          <div className="relative flex items-center justify-center h-20 w-20">
            <svg className="h-full w-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r="30"
                className="stroke-zinc-100"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Dynamic progress circle */}
              <circle
                cx="40"
                cy="40"
                r="30"
                className={`transition-all duration-500 ease-out ${getScoreColor(healthScore)}`}
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 30}
                strokeDashoffset={calculateDashOffset(healthScore, 30)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500 fill-blue-500 animate-pulse" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sub-Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Toxins Card */}
          <div className="rounded-2xl bg-white border border-zinc-200/60 p-3 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-zinc-900 leading-none mb-1">
              {toxinsCount}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              🦠 Toxins
            </span>
          </div>

          {/* Benefits Card */}
          <div className="rounded-2xl bg-white border border-zinc-200/60 p-3 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-zinc-900 leading-none mb-1">
              {benefitsCount}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              🌿 Benefits
            </span>
          </div>

          {/* Risks Card */}
          <div className="rounded-2xl bg-white border border-zinc-200/60 p-3 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-zinc-900 leading-none mb-1">
              {risksCount}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              🚨 Risks
            </span>
          </div>
        </div>

        {/* My Products Section */}
        <div>
          <h3 className="text-lg font-bold tracking-tight text-zinc-950 mb-3">
            My products
          </h3>

          <div className="flex flex-col gap-3">
            {activeProducts.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-3xl bg-white border border-zinc-150 text-zinc-400">
                <p className="text-sm font-medium">No products logged in profile.</p>
                <p className="text-xs mt-1">Go to the For You tab to browse and add water products.</p>
              </div>
            ) : (
              activeProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group relative flex items-center justify-between rounded-3xl bg-white border border-zinc-200/60 p-4 shadow-xs hover:border-zinc-300 transition-all duration-200"
                >
                  {/* Left: Mini Illustration */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 mr-3">
                    {renderProductListIcon(product.imageType)}
                  </div>

                  {/* Middle: Text details */}
                  <div className="flex-1 min-w-0 mr-4">
                    <h4 className="font-bold text-sm text-zinc-900 truncate leading-snug">
                      {product.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-zinc-400 truncate mt-0.5 uppercase">
                      {product.brand}
                    </p>
                    <span className="inline-block mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                      {product.loggedTime}
                    </span>
                  </div>

                  {/* Right: Small Score Gauge or Trash on Hover */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="hidden group-hover:flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-150 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                    
                    <div className="relative flex h-10 w-10 items-center justify-center group-hover:opacity-30 transition-opacity">
                      <svg className="h-full w-full transform -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          className="stroke-zinc-100"
                          strokeWidth="3.5"
                          fill="transparent"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="15"
                          className={`${getScoreColor(product.score)}`}
                          strokeWidth="3.5"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={calculateDashOffset(product.score, 15)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-zinc-800">
                        {product.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Settings Dialog */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="w-full max-w-[340px] rounded-3xl bg-[#FAFAF8] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-zinc-500" />
                  Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5 text-zinc-500" />
                </button>
              </div>

              {/* Settings Fields */}
              <div className="flex flex-col gap-4">
                
                {/* Notifications toggle */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-800">Purity Alerts</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">Notify when water score drops</span>
                  </div>
                  <button 
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      notifications ? "bg-blue-600" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        notifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Mode toggle (aesthetic simulation) */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-800">Dark Mode</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">Simulate interface dark colors</span>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      darkMode ? "bg-blue-600" : "bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        darkMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="text-center text-[10px] text-zinc-400 mt-4 leading-normal">
                  Longevity Buddy App v1.0.0<br />
                  Data refresh intervals: 24h
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSettings(false)}
                className="mt-6 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
