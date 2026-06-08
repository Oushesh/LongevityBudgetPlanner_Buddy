type Seller = {
  name: string;
  url: string;
  priceLabel?: string;
};

type BuyingOptionsProps = {
  sellers: Seller[];
};

export function BuyingOptions({ sellers }: BuyingOptionsProps) {
  if (sellers.length === 0) return null;

  return (
    <section id="buy-now" className="mt-10 scroll-mt-24">
      <h2 className="border-b border-slate-200 pb-3 text-sm font-bold tracking-[0.15em] text-slate-700">
        BUY FROM THESE SELLERS
      </h2>
      <p className="mt-2 text-xs text-slate-500">
        Affiliate links may earn us a fee at no extra cost to you.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {sellers.map((seller) => (
          <a
            key={seller.name}
            href={seller.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-4 transition hover:border-[#1a6fd1] hover:shadow-sm"
          >
            <span className="font-medium text-slate-800">{seller.name}</span>
            <span className="text-sm font-semibold text-[#1a6fd1]">
              {seller.priceLabel ?? "Shop now →"}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function BuyingOptionsButton() {
  return (
    <a
      href="#buy-now"
      className="inline-flex items-center justify-center rounded bg-[#1a6fd1] px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-[#1558a8]"
    >
      BUYING OPTIONS
    </a>
  );
}
