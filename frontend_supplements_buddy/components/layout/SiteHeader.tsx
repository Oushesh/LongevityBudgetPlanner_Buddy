import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[#1558a8] bg-[#1a6fd1] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Supplements Buddy
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="opacity-90 hover:opacity-100">
            Reviews
          </Link>
          <Link href="/compare" className="opacity-90 hover:opacity-100">
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
