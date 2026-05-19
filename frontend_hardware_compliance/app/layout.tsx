import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Nav } from "@/components/Nav";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compliance Buddy — Hardware clearance in weeks",
  description:
    "Map standards, draft lab-ready documentation, and match testing partners for hardware teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
        <DisclaimerBanner />
        <Nav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
