import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Skyline Estates — Under Development",
  description:
    "A premium real estate destination is rising. Experience the timelapse from untouched terrain to a luminous skyline by Skyline Estates Development Group.",
  openGraph: {
    title: "Skyline Estates — Under Development",
    description:
      "A premium real estate destination is rising. Experience the timelapse from untouched terrain to a luminous skyline by Skyline Estates Development Group.",
    url: "https://agentic-2a5ffa90.vercel.app",
    siteName: "Skyline Estates",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skyline Estates — Under Development",
    description:
      "An immersive construction timelapse leading to a premium urban destination by Skyline Estates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
