import { FUCHSIA_DEMO_VIDEO } from "@/lib/demo-workspace-data";

export function FuchsiaHeroVideo() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-fuchsia-950/30">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-2 text-xs text-zinc-500">
        <span>Reference demo — workflow inspired by Fuchsia</span>
        <a
          href="https://getfuchsia.ai/"
          target="_blank"
          rel="noreferrer"
          className="text-fuchsia-400 hover:underline"
        >
          getfuchsia.ai
        </a>
      </div>
      <video
        className="aspect-video w-full object-cover pt-9"
        autoPlay
        loop
        muted
        playsInline
        poster="/demo-workspace-poster.svg"
      >
        <source src={FUCHSIA_DEMO_VIDEO} type="video/mp4" />
        Your browser does not support embedded video.
      </video>
    </div>
  );
}
