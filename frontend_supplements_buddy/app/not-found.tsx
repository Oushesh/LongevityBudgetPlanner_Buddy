import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Review not found</h1>
      <p className="mt-2 text-slate-600">
        This product may not have COA data in the database yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-[#1a6fd1] hover:underline"
      >
        ← Back to reviews
      </Link>
    </div>
  );
}
