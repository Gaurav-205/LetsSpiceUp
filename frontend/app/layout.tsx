import type { Metadata } from "next";
import { Orbitron, Rajdhani, Exo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Optimize Google Fonts with Next.js font optimization
// This self-hosts fonts and eliminates render-blocking requests
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rajdhani",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: {
    default: "Prank Wizard - Plan the Perfect Prank Experience",
    template: "%s | Prank Wizard",
  },
  description: "Describe your friend, and we'll craft a personalized prank plan tailored to their personality. Free, secure, and personalized prank planning.",
  keywords: ["prank", "prank planning", "prank wizard", "prank ideas", "personalized pranks"],
  authors: [{ name: "Prank Wizard" }],
  creator: "Prank Wizard",
  publisher: "Prank Wizard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://prankwizard.com",
    siteName: "Prank Wizard",
    title: "Prank Wizard - Plan the Perfect Prank Experience",
    description: "Describe your friend, and we'll craft a personalized prank plan tailored to their personality.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prank Wizard - Plan the Perfect Prank Experience",
    description: "Describe your friend, and we'll craft a personalized prank plan tailored to their personality.",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${exo2.variable}`}>
      <body className="antialiased font-body" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}