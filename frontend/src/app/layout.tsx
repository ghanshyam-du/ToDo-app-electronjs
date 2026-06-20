import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Todo & Weather App",
  description: "Manage your tasks and check the weather",
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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center h-16 items-center gap-8">
              <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white hover:text-shadow transition-colors">
                Tasks
              </Link>
              <Link href="/weather" className="text-sm font-medium text-slate-300 hover:text-white hover:text-shadow transition-colors">
                Weather
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
