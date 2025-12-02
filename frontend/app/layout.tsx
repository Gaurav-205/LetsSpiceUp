import type { Metadata } from "next";
import { Orbitron, Rajdhani, Exo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Optimize Google Fonts with Next.js font optimization
// This self-hosts fonts and eliminates render-blocking requests
// Optimize font loading - only load weights actually used
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"], // Reduced from 6 to 4 weights
  display: "swap",
  variable: "--font-orbitron",
  preload: true,
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Reduced from 5 to 4 weights
  display: "swap",
  variable: "--font-rajdhani",
  preload: false, // Not critical for initial render
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Reduced from 5 to 3 weights
  display: "swap",
  variable: "--font-exo2",
  preload: false, // Not critical for initial render
});

export const metadata: Metadata = {
  title: {
    default: "Prank Wizard - Plan the Perfect Prank Experience",
    template: "%s | Prank Wizard",
  },
  description: "Describe your friend, and we'll craft a personalized prank plan tailored to their personality. Free, secure, and personalized prank planning.",
  keywords: ["prank", "prank planning", "prank wizard", "prank ideas", "personalized pranks", "prank generator", "prank planner"],
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
    images: [
      {
        url: '/og-image.png', // Add this image to public folder
        width: 1200,
        height: 630,
        alt: 'Prank Wizard - Plan the Perfect Prank Experience',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prank Wizard - Plan the Perfect Prank Experience",
    description: "Describe your friend, and we'll craft a personalized prank plan tailored to their personality.",
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Prank Wizard",
    "description": "Plan the perfect prank experience tailored to your friend's personality",
    "url": siteUrl,
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    }
  };
  
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${exo2.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
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