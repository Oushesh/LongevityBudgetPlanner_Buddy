import Image from "next/image";
import Link from "next/link";
import { toDisplayScore } from "@/lib/score";

type FeaturedReviewCardProps = {
  href: string;
  brandName: string;
  productName: string;
  trustScore: number;
  imageSrc?: string | null;
  badge?: string;
};

export function FeaturedReviewCard({
  href,
  brandName,
  productName,
  trustScore,
  imageSrc,
  badge,
}: FeaturedReviewCardProps) {
  const score = toDisplayScore(trustScore);

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#1a6fd1] hover:shadow-md"
    >
      <div className="relative flex h-36 items-center justify-center border-b border-slate-100 bg-slate-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            width={120}
            height={120}
            className="object-contain p-4 transition group-hover:scale-105"
          />
        ) : (
          <span className="text-sm font-medium text-slate-400">No image</span>
        )}
        {badge && (
          <span className="absolute right-3 top-3 rounded bg-[#1a6fd1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {brandName}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-[#1a6fd1]">
          {productName}
        </h3>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-wide text-slate-500">TRUSTSCORE</p>
            <p className="text-3xl font-light text-slate-900">
              {score.toFixed(1)}
              <span className="text-sm text-slate-500"> /100</span>
            </p>
          </div>
          <span className="text-sm font-medium text-[#1a6fd1]">View review →</span>
        </div>
      </div>
    </Link>
  );
}
