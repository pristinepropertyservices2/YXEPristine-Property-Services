import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { SiteNavbar } from "@/components/site-navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YXE Pristine Property Services | Professional Cleaning in Saskatoon",
  description: "YXE Pristine Property Services - Professional, eco-friendly cleaning services in Saskatoon. Carpet cleaning, upholstery, air duct, tile & grout, and more. Clean. Protect. Maintain.",
  keywords: ["cleaning services", "Saskatoon", "carpet cleaning", "upholstery cleaning", "air duct cleaning", "eco-friendly cleaning", "YXE Pristine"],
  authors: [{ name: "YXE Pristine Property Services" }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "YXE Pristine Property Services",
    description: "Professional, eco-friendly cleaning services in Saskatoon and surrounding areas.",
    url: "https://yxepristinepropertyservices.ca",
    siteName: "YXE Pristine Property Services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YXE Pristine Property Services",
    description: "Professional, eco-friendly cleaning services in Saskatoon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SiteNavbar />
          {children}
          <ScrollToTopButton />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
