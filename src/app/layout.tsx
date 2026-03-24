import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { AppNavBar } from "@/components/AppNavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyEcho — Dein täglicher Moment der Klarheit",
  description: "Geführte Reflexion, Mood Tracking und Quick Win Erfassung. Täglich. In 5 Minuten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <StoreProvider>
          <main className="flex-1 pb-24">{children}</main>
          <AppNavBar />
        </StoreProvider>
      </body>
    </html>
  );
}
