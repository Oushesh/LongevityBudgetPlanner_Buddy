import Link from "next/link";
import { Phone, MapPin, Droplet, User, Bell, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-10 px-4 py-16 text-zinc-900 font-sans">
      {/* Hero Header */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
          LongevityBuddy Demo
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Interact with your Longevity App Mockups.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600">
          We have reconstructed the screen designs from your mockup screenshots as fully interactive Next.js pages. Explore the views below inside a simulated premium mobile app container.
        </p>
      </div>

      {/* Interactive Mockups Selector */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-800 flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-600" />
          Interactive Screens
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          
          {/* Analyse Link */}
          <Link
            href="/analyse"
            className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-950">Location Analysis</span>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase mt-0.5">/analyse</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-600 transition-colors" />
          </Link>

          {/* Water Link */}
          <Link
            href="/water"
            className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                <Droplet className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-950">Top Rated Catalog</span>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase mt-0.5">/water</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-emerald-600 transition-colors" />
          </Link>

          {/* Profile Link */}
          <Link
            href="/profile"
            className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <User className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-950">Health Score Profile</span>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase mt-0.5">/profile</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-amber-600 transition-colors" />
          </Link>

          {/* Alerts Link */}
          <Link
            href="/alerts"
            className="group flex items-center justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-rose-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-950">System Notifications</span>
                <span className="text-[11px] text-zinc-400 font-semibold uppercase mt-0.5">/alerts</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-rose-600 transition-colors" />
          </Link>

        </div>
      </section>

      {/* Features Overview */}
      <section className="rounded-3xl border border-zinc-200 bg-white/70 p-6 text-sm backdrop-blur-xs shadow-xs">
        <h2 className="font-bold text-zinc-950 text-base">
          Interactive Design Specifications
        </h2>
        <ul className="mt-4 list-disc space-y-2.5 pl-5 text-zinc-600 font-medium">
          <li>
            <strong>Contextual Synchronization</strong>: Adding/removing products inside categories in `/water` dynamically updates the global health score, toxins, benefits, and risks on the `/profile` view.
          </li>
          <li>
            <strong>Location-Based AQI</strong>: Toggling between Santa Monica, CA, Munich, Germany, and Berlin, Germany on `/analyse` modifies the quality scores, status indicators, and detailed air/water pollutant levels.
          </li>
          <li>
            <strong>Settings Cog</strong>: Accessible on `/profile`, allowing custom alert preferences and layout controls.
          </li>
        </ul>
      </section>
    </div>
  );
}
