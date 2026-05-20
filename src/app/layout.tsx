import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth/next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { SiteNavbar } from "@/components/site-navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { Toaster } from "@/components/ui/toaster";
import { authOptions } from "@/lib/auth-options";
import { BUSINESS, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site-seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.name} | Professional Cleaning in Saskatoon, SK`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.description,
  keywords: [
    "cleaning services Saskatoon",
    "carpet cleaning Saskatoon",
    "upholstery cleaning",
    "air duct cleaning SK",
    "tile grout cleaning",
    "dryer vent cleaning",
    "post construction cleaning",
    "YXE Pristine",
  ],
  authors: [{ name: BUSINESS.name, url: SITE_URL }],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    siteName: BUSINESS.name,
    locale: "en_CA",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: BUSINESS.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.name,
    description: BUSINESS.description,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning className="scroll-pt-20 md:scroll-pt-24">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider session={session}>
          <SiteNavbar />
          {children}
          <ScrollToTopButton />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
