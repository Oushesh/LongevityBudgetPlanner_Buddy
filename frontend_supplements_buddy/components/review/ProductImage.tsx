import Image from "next/image";

type ProductImageProps = {
  src: string | null;
  alt: string;
  category?: string;
};

export function ProductImage({ src, alt, category = "supplement" }: ProductImageProps) {
  if (src) {
    return (
      <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-3"
          sizes="160px"
          priority
        />
      </div>
    );
  }

  const label = category === "omega_3" ? "Omega-3" : "EVOO";

  return (
    <div className="flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
      <span className="text-xs font-semibold tracking-widest text-slate-600">
        {label}
      </span>
      <span className="mt-1 text-[10px] uppercase text-slate-400">
        Lab tested
      </span>
    </div>
  );
}
