"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  loggedTime: string;
  score: number;
  imageType: "fiji" | "dyson" | "water-filter" | "shower-filter" | "water-delivery" | "house-filter" | "travel-filter" | "energy-drink" | "flavored-water" | "sports-drink";
  toxins: number;
  benefits: number;
  risks: number;
  description?: string;
}

export interface LocationData {
  city: string;
  state: string;
  airQuality: number;
  airQualityStatus: "Excellent" | "Moderate" | "Poor";
  waterQuality: number; // out of 100
  waterQualityStatus: "Excellent" | "Moderate" | "Poor";
  pollutants: {
    name: string;
    value: string;
    description: string;
    limit: string;
  }[];
}

interface AppContextType {
  location: string;
  setLocation: (loc: string) => void;
  locationDetails: LocationData;
  activeProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  healthScore: number;
  toxinsCount: number;
  benefitsCount: number;
  risksCount: number;
  availableProducts: Product[];
}

const ALL_MOCK_PRODUCTS: Product[] = [
  // Bottled Water
  {
    id: "fiji-water",
    name: "Fiji Natural Artesian Water",
    brand: "Fiji",
    category: "Bottled water",
    loggedTime: "Just now",
    score: 82,
    imageType: "fiji",
    toxins: 1,
    benefits: 3,
    risks: 1,
    description: "Natural artesian water bottled at the source in Viti Levu, Fiji. Rich in natural silica, calcium, and magnesium."
  },
  {
    id: "san-pellegrino",
    name: "San Pellegrino Sparkling Natural Mineral Water",
    brand: "Sanpellegrino",
    category: "Bottled water",
    loggedTime: "3 days ago",
    score: 59,
    imageType: "fiji", // Fallback to fiji/bottle shape
    toxins: 3,
    benefits: 4,
    risks: 2,
    description: "Natural sparkling mineral water from the Italian Alps. Medium mineralization with refreshing carbonation."
  },
  // Air Purifiers
  {
    id: "dyson-purifier",
    name: "Dyson Purifier Hot+Cool HP07",
    brand: "Dyson",
    category: "Air purifiers",
    loggedTime: "5 days ago",
    score: 88,
    imageType: "dyson",
    toxins: 0,
    benefits: 6,
    risks: 0,
    description: "HEPA H13 filtration removes 99.97% of particles as small as 0.3 microns, including VOCs and gases."
  },
  // Water Filters
  {
    id: "zerowater-filter",
    name: "ZeroWater 5-stage filter",
    brand: "Zero Water",
    category: "Water filters",
    loggedTime: "1 day ago",
    score: 27,
    imageType: "water-filter",
    toxins: 1,
    benefits: 2,
    risks: 3,
    description: "5-stage ion exchange filter removes virtually all dissolved solids. Ideal for extreme TDS reduction."
  },
  // Shower Filters
  {
    id: "jolie-shower",
    name: "Jolie Shower Filter",
    brand: "Jolie",
    category: "Shower filters",
    loggedTime: "1 day ago",
    score: 48,
    imageType: "shower-filter",
    toxins: 3,
    benefits: 1,
    risks: 1,
    description: "High-performance shower filter removing chlorine, heavy metals, and sediment to protect skin and hair."
  },
  // Water Delivery
  {
    id: "5gal-delivery",
    name: "Oasis 5-Gallon Spring Water",
    brand: "Oasis Delivery",
    category: "Water delivery",
    loggedTime: "2 days ago",
    score: 75,
    imageType: "water-delivery",
    toxins: 2,
    benefits: 4,
    risks: 1,
    description: "Pure local spring water delivered in reusable, BPA-free glass or polycarbonate carboys."
  },
  // House Filters
  {
    id: "house-filter-1",
    name: "SpringWell Whole House Filter",
    brand: "SpringWell",
    category: "House filters",
    loggedTime: "10 days ago",
    score: 91,
    imageType: "house-filter",
    toxins: 0,
    benefits: 7,
    risks: 0,
    description: "Whole home carbon filtration system removing chloramines, PFAS, and herbicides from all taps."
  },
  // Travel Filters
  {
    id: "grayl-travel",
    name: "Grayl Geopress Purifier",
    brand: "Grayl",
    category: "Travel filters",
    loggedTime: "4 days ago",
    score: 84,
    imageType: "travel-filter",
    toxins: 1,
    benefits: 5,
    risks: 1,
    description: "Press-style travel purifier. Instant defense against viruses, protozoa, chemicals, and microplastics."
  },
  // Energy Drinks
  {
    id: "celsius-peach",
    name: "Celsius Peach Vibe Energy",
    brand: "Celsius",
    category: "Energy drinks",
    loggedTime: "Just now",
    score: 34,
    imageType: "energy-drink",
    toxins: 4,
    benefits: 2,
    risks: 4,
    description: "Thermogentic energy formula. Contains high caffeine (200mg) and sucralose artificial sweetener."
  },
  // Flavored Waters
  {
    id: "lacroix-can",
    name: "LaCroix Grapefruit Sparkling",
    brand: "LaCroix",
    category: "Flavored waters",
    loggedTime: "1 day ago",
    score: 68,
    imageType: "flavored-water",
    toxins: 2,
    benefits: 1,
    risks: 1,
    description: "Calorie-free carbonated water flavored with natural essences derived from grapefruit oil."
  },
  // Sports Drinks
  {
    id: "prime-sports",
    name: "Prime Hydration Sports Drink",
    brand: "Prime",
    category: "Sports drinks",
    loggedTime: "Just now",
    score: 41,
    imageType: "sports-drink",
    toxins: 3,
    benefits: 2,
    risks: 3,
    description: "Coconut water-based hydration drink. High in potassium but contains artificial sweeteners and lacks sodium."
  }
];

const LOCATION_DATABASE: Record<string, LocationData> = {
  "Santa Monica, CA": {
    city: "Santa Monica",
    state: "CA",
    airQuality: 71,
    airQualityStatus: "Moderate",
    waterQuality: 13,
    waterQualityStatus: "Poor",
    pollutants: [
      {
        name: "Carbon monoxide",
        value: "245.33 ppb",
        description: "A colorless, odorless gas that can be deadly in high concentrations.",
        limit: "9 ppm limit"
      },
      {
        name: "Nitrogen dioxide",
        value: "13.2 ppb",
        description: "A reddish-brown gas that irritates the lungs and causes respiratory issues.",
        limit: "53 ppb limit"
      },
      {
        name: "Particulate Matter (PM2.5)",
        value: "18.4 µg/m³",
        description: "Fine inhalable particles that can penetrate deep into lungs and enter the bloodstream.",
        limit: "12 µg/m³ limit"
      },
      {
        name: "Ozone (O3)",
        value: "42.1 ppb",
        description: "Ground-level ozone formed by chemical reactions of pollutants in sunlight, causing breathing difficulties.",
        limit: "70 ppb limit"
      }
    ]
  },
  "Munich, Germany": {
    city: "Munich",
    state: "Germany",
    airQuality: 28,
    airQualityStatus: "Excellent",
    waterQuality: 92,
    waterQualityStatus: "Excellent",
    pollutants: [
      {
        name: "Carbon monoxide",
        value: "85.2 ppb",
        description: "A colorless, odorless gas. Exceptionally low concentrations in suburban Bavaria.",
        limit: "9 ppm limit"
      },
      {
        name: "Nitrogen dioxide",
        value: "6.1 ppb",
        description: "Extremely low nitrogen levels due to city transit electrification.",
        limit: "53 ppb limit"
      },
      {
        name: "Particulate Matter (PM2.5)",
        value: "4.8 µg/m³",
        description: "Excellent air filtration due to nearby alpine currents.",
        limit: "12 µg/m³ limit"
      }
    ]
  },
  "Berlin, Germany": {
    city: "Berlin",
    state: "Germany",
    airQuality: 52,
    airQualityStatus: "Moderate",
    waterQuality: 65,
    waterQualityStatus: "Moderate",
    pollutants: [
      {
        name: "Carbon monoxide",
        value: "180.1 ppb",
        description: "Moderate levels standard in European metropolitan hubs.",
        limit: "9 ppm limit"
      },
      {
        name: "Nitrogen dioxide",
        value: "15.4 ppb",
        description: "Elevated near city ring roads due to diesel emissions.",
        limit: "53 ppb limit"
      },
      {
        name: "Particulate Matter (PM2.5)",
        value: "11.2 µg/m³",
        description: "Just below limits, influenced by regional industrial centers.",
        limit: "12 µg/m³ limit"
      }
    ]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<string>("Santa Monica, CA");
  
  // Set default active products as seen in AppOasis003.webp
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Populate defaults on initial load
    const defaults = ALL_MOCK_PRODUCTS.filter(p => 
      p.id === "san-pellegrino" || p.id === "zerowater-filter" || p.id === "jolie-shower"
    );
    setActiveProducts(defaults);
  }, []);

  const setLocation = (loc: string) => {
    if (LOCATION_DATABASE[loc]) {
      setLocationState(loc);
    } else {
      // Fallback or add dynamically
      setLocationState(loc);
    }
  };

  const addProduct = (product: Product) => {
    if (activeProducts.some(p => p.id === product.id)) return;
    setActiveProducts(prev => [
      { ...product, loggedTime: "Just now" },
      ...prev
    ]);
  };

  const removeProduct = (productId: string) => {
    setActiveProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Derive Location details
  const locationDetails = LOCATION_DATABASE[location] || {
    city: location.split(",")[0],
    state: location.split(",")[1]?.trim() || "",
    airQuality: 45,
    airQualityStatus: "Moderate" as const,
    waterQuality: 50,
    waterQualityStatus: "Moderate" as const,
    pollutants: [
      {
        name: "Carbon monoxide",
        value: "150 ppb",
        description: "Typical urban baseline levels.",
        limit: "9 ppm limit"
      }
    ]
  };

  // Health Score is average of active products (or baseline if none)
  const healthScore = activeProducts.length > 0 
    ? Math.round(activeProducts.reduce((sum, p) => sum + p.score, 0) / activeProducts.length)
    : 0;

  // Aggregate stats
  const toxinsCount = activeProducts.reduce((sum, p) => sum + p.toxins, 0);
  const benefitsCount = activeProducts.reduce((sum, p) => sum + p.benefits, 0);
  const risksCount = activeProducts.reduce((sum, p) => sum + p.risks, 0);

  return (
    <AppContext.Provider
      value={{
        location,
        setLocation,
        locationDetails,
        activeProducts,
        addProduct,
        removeProduct,
        healthScore,
        toxinsCount,
        benefitsCount,
        risksCount,
        availableProducts: ALL_MOCK_PRODUCTS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
