"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { getAccessToken } from "@/lib/auth-storage";

export function Nav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getAccessToken());
  }, [pathname]);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="text-fuchsia-400">Compliance</span> Buddy
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/demo"
            className={
              pathname === "/demo"
                ? "text-fuchsia-300"
                : "text-zinc-400 hover:text-zinc-200"
            }
          >
            Demo
          </Link>
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={
                  pathname.startsWith("/dashboard") ||
                  pathname.startsWith("/projects")
                    ? "text-fuchsia-300"
                    : "text-zinc-400 hover:text-zinc-200"
                }
              >
                Dashboard
              </Link>
              <Link
                href="/projects/new"
                className="rounded-md bg-fuchsia-600 px-3 py-1.5 font-medium text-white hover:bg-fuchsia-500"
              >
                New project
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-zinc-200"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-fuchsia-600 px-3 py-1.5 font-medium text-white hover:bg-fuchsia-500"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
