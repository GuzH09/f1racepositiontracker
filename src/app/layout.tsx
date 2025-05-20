import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Race Position Tracker - By GuzH",
  description: "F1 Race Position Tracker, Made By GuzH",
  keywords: ["F1", "Formula 1", "Race", "Position", "Tracker", "GuzH"],
  authors: [{ name: "Hernan Agustin Otero", url: "https://guzhotero.dev/" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "F1 Race Position Tracker - By GuzH",
    description: "F1 Race Position Tracker, Made By GuzH",
    url: "https://f1racepositiontracker.vercel.app/",
    siteName: "F1 Race Position Tracker",
    type: "website",
    images: [
      {
        url: "https://f1racepositiontracker.vercel.app/banner.png",
        width: 1200,
        height: 675,
        alt: "F1 Race Position Tracker by GuzH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "F1 Race Position Tracker - By GuzH",
    description: "F1 Race Position Tracker, Made By GuzH",
    creator: "@guzhotero",
    images: ["https://f1racepositiontracker.vercel.app/banner.png"],
  },
  alternates: { canonical: "https://f1racepositiontracker.vercel.app/" },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark`}>{children}</body>
    </html>
  );
}
