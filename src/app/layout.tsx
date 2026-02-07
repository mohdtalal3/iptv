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
  title: "IPTV Streaming App - Watch Live TV",
  description: "Stream live IPTV channels with HLS support. Watch Pakistan TV, PTV Home, News, and Sports in HD.",
  keywords: ["IPTV", "streaming", "live TV", "HLS", "PTV"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* App Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b border-blue-700 shadow-lg">
          <div className="px-4 py-3 md:py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <h1 className="text-white font-bold text-lg md:text-2xl flex items-center gap-2">
                <span className="text-2xl md:text-3xl">📡</span>
                <span>IPTV Stream</span>
              </h1>
              <div className="flex items-center gap-2 text-blue-200 text-xs md:text-sm">
                <span className="hidden sm:inline">Live Streaming</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-4 md:py-6 mt-auto">
          <div className="px-4 max-w-7xl mx-auto">
            <p className="text-slate-400 text-xs md:text-sm text-center">
              © {new Date().getFullYear()} IPTV Stream. Built with Next.js & hls.js
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
