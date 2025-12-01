import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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