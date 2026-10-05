import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CookieBanner from "@/components/ui/cookie-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  applicationName: "Konsalta",
  title: {
    default: "Konsalta | Better Decisions. Greater Impact.",
    template: "%s | Konsalta",
  },
  description:
    "Konsalta is a women-led, Africa-focused research, consulting and advisory firm delivering evidence-informed decisions and lasting impact.",
  keywords: [
    "research",
    "consulting",
    "advisory",
    "Africa",
    "evidence-informed policy",
    "monitoring and evaluation",
    "strategy",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Konsalta",
    title: "Konsalta | Better Decisions. Greater Impact.",
    description:
      "A women-led, Africa-focused research, consulting and advisory firm.",
  },
  twitter: {
    card: "summary",
    title: "Konsalta | Better Decisions. Greater Impact.",
    description:
      "A women-led, Africa-focused research, consulting and advisory firm.",
  },
  robots: {
    index: true,
    follow: true,
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-[#4a5568]"
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
