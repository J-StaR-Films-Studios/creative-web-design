import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
  themeColor: '#0a0a0b',
};

export const metadata: Metadata = {
  title: "THE LIVING ARCHIVE — Preserving Humanity's Creative Artifacts",
  description: "A private digital archive dedicated to preserving humanity's most important creative artifacts across photography, film, music, architecture, typography, and experimental digital works.",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#0a0a0b] text-[#e5e9ec]">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#f5f0e8] focus:text-[#0a0a0b] focus:font-mono focus:text-xs"
        >
          Skip to main archival sequence
        </a>
        {children}
      </body>
    </html>
  );
}
