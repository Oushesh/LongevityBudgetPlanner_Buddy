"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { useAppState, Product } from "@/lib/AppContext";
import { X, Check, Plus, Minus, Star, ShieldCheck, Heart } from "lucide-react";

export default function WaterPage() {
  const { availableProducts, activeProducts, addProduct, removeProduct } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "Bottled water", imageType: "fiji" },
    { name: "Air purifiers", imageType: "dyson" },
    { name: "Water filters", imageType: "water-filter" },
    { name: "Shower filters", imageType: "shower-filter" },
    { name: "Water delivery", imageType: "water-delivery" },
    { name: "House filters", imageType: "house-filter" },
    { name: "Travel filters", imageType: "travel-filter" },
    { name: "Energy drinks", imageType: "energy-drink" },
    { name: "Flavored waters", imageType: "flavored-water" },
    { name: "Sports drinks", imageType: "sports-drink" },
  ];

  // Helper to render inline custom SVG illustrations matching the screenshots
  const renderCategorySvg = (type: string) => {
    switch (type) {
      case "fiji":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="45" width="50" height="135" rx="12" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <rect x="35" y="15" width="30" height="30" rx="4" fill="#0284C7" />
            <rect x="25" y="70" width="50" height="45" fill="#38BDF8" opacity="0.6" />
            <rect x="32" y="78" width="36" height="8" rx="2" fill="#0369A1" />
            <circle cx="50" cy="130" r="14" fill="#FB7185" />
            <path d="M43 130C46 120 54 120 57 130C54 140 46 140 43 130Z" fill="#F43F5E" />
            <circle cx="48" cy="126" r="3" fill="#FFE4E6" />
          </svg>
        );
      case "dyson":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="32" y="15" width="36" height="95" rx="18" fill="#F4F4F5" stroke="#94A3B8" strokeWidth="4" />
            <rect x="42" y="27" width="16" height="71" rx="8" fill="#E2E8F0" />
            <rect x="28" y="110" width="44" height="65" rx="12" fill="#D1D5DB" stroke="#94A3B8" strokeWidth="4" />
            <circle cx="50" cy="130" r="14" fill="#94A3B8" />
            <circle cx="50" cy="130" r="6" fill="#F4F4F5" />
            <rect x="35" y="155" width="30" height="4" fill="#4B5563" />
          </svg>
        );
      case "water-filter":
        return (
          <svg className="w-20 h-28 drop-shadow-md mx-auto" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40C30 30 90 30 90 40V140C90 160 80 175 60 175C40 175 30 160 30 140V40Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="4" />
            <rect x="42" y="55" width="36" height="50" rx="4" fill="#94A3B8" />
            <rect x="20" y="80" width="10" height="70" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
            <rect x="48" y="115" width="24" height="45" rx="4" fill="#38BDF8" opacity="0.7" />
          </svg>
        );
      case "shower-filter":
        return (
          <svg className="w-20 h-28 drop-shadow-md mx-auto" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="40" width="40" height="45" rx="10" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
            <path d="M60 85V145" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
            <path d="M30 145C30 135 90 135 90 145V165H30V145Z" fill="#CBD5E1" stroke="#475569" strokeWidth="4" />
            <line x1="40" y1="175" x2="40" y2="185" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="175" x2="60" y2="188" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="80" y1="175" x2="80" y2="185" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case "water-delivery":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 55C25 45 40 40 50 40C60 40 75 45 75 55V165C75 175 65 180 50 180C35 180 25 175 25 165V55Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <rect x="42" y="15" width="16" height="25" rx="2" fill="#0284C7" />
            <line x1="32" y1="80" x2="68" y2="80" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="32" y1="110" x2="68" y2="110" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="32" y1="140" x2="68" y2="140" stroke="#38BDF8" strokeWidth="2.5" />
          </svg>
        );
      case "house-filter":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="25" width="30" height="150" rx="10" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <rect x="25" y="45" width="50" height="20" rx="4" fill="#475569" />
            <circle cx="50" cy="55" r="4" fill="#38BDF8" />
            <rect x="45" y="15" width="10" height="10" fill="#475569" />
          </svg>
        );
      case "travel-filter":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="45" width="40" height="130" rx="20" fill="#78350F" stroke="#451A03" strokeWidth="3.5" />
            <rect x="38" y="20" width="24" height="25" rx="6" fill="#451A03" />
            <rect x="45" y="10" width="10" height="10" rx="2" fill="#D97706" />
            <rect x="35" y="85" width="30" height="70" rx="8" fill="#F59E0B" opacity="0.8" />
          </svg>
        );
      case "energy-drink":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="25" width="40" height="145" rx="8" fill="#F4F4F5" stroke="#71717A" strokeWidth="3" />
            <rect x="35" y="40" width="30" height="80" fill="#FDA4AF" opacity="0.6" />
            <text x="50" y="85" fill="#E11D48" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 85)">CELSIUS</text>
            <circle cx="50" cy="140" r="10" fill="#F43F5E" />
          </svg>
        );
      case "flavored-water":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="25" width="40" height="145" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            <path d="M32 50 C40 40, 60 60, 68 50" stroke="#F472B6" strokeWidth="4" fill="none" />
            <path d="M32 90 C40 80, 60 100, 68 90" stroke="#10B981" strokeWidth="4" fill="none" />
            <text x="50" y="135" fill="#0369A1" fontSize="12" fontWeight="extrabold" textAnchor="middle">La Croix</text>
          </svg>
        );
      case "sports-drink":
        return (
          <svg className="w-16 h-28 drop-shadow-md mx-auto" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 45 C30 35, 70 35, 70 45 V165 C70 175, 60 178, 50 178 C40 178, 30 175, 30 165 V45 Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
            <rect x="38" y="20" width="24" height="25" rx="3" fill="#EF4444" />
            <rect x="30" y="70" width="40" height="40" fill="#EF4444" />
            <text x="50" y="95" fill="#FFFFFF" fontSize="11" fontWeight="black" textAnchor="middle">PRIME</text>
          </svg>
        );
      default:
        return null;
    }
  };

  const getCategoryProducts = (catName: string) => {
    return availableProducts.filter((p) => p.category === catName);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 pb-6">
        {/* Title Section */}
        <div className="text-center py-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
            Top rated for you
          </h1>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catProds = getCategoryProducts(cat.name);
            const activeInCat = catProds.filter(p => activeProducts.some(ap => ap.id === p.id));
            
            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="relative cursor-pointer rounded-3xl bg-[#E2E4DF]/90 border border-transparent p-4 flex flex-col justify-between h-48 select-none hover:bg-[#D4D7D1] active:scale-[0.98] hover:shadow-sm transition-all duration-200"
              >
                {/* Category Label */}
                <span className="font-bold text-sm text-[#1A1A1A] leading-tight">
                  {cat.name}
                </span>

                {/* Illustration Container */}
                <div className="flex items-center justify-center flex-1 py-1">
                  {renderCategorySvg(cat.imageType)}
                </div>

                {/* Badge if item in category is active */}
                {activeInCat.length > 0 && (
                  <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                    {activeInCat.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Category Drawer / Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs transition-opacity duration-300">
            <div className="relative w-full max-w-[390px] rounded-t-[32px] bg-[#FAFAF8] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
              
              {/* Drag line */}
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-300" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold tracking-tight text-zinc-950">
                  {selectedCategory}
                </h3>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
                >
                  <X className="h-4.5 w-4.5 text-zinc-500" />
                </button>
              </div>

              {/* Products in Category */}
              <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                {getCategoryProducts(selectedCategory).length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-6">
                    No products tested in this category yet.
                  </p>
                ) : (
                  getCategoryProducts(selectedCategory).map((product) => {
                    const isActive = activeProducts.some((p) => p.id === product.id);
                    
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-2xl bg-white border border-zinc-200/60 p-3.5 shadow-sm hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex-1 mr-4">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-zinc-900 leading-tight">
                              {product.name}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                              by {product.brand}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              Purity: <strong className="text-zinc-700">{product.score}/100</strong>
                            </span>
                            <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3 text-emerald-500" />
                              Benefits: <strong className="text-emerald-600">+{product.benefits}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => {
                            if (isActive) {
                              removeProduct(product.id);
                            } else {
                              addProduct(product);
                            }
                          }}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                            isActive
                              ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                              : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          {isActive ? (
                            <Minus className="h-5 w-5" strokeWidth={2.5} />
                          ) : (
                            <Plus className="h-5 w-5" strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
