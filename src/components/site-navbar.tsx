"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const serviceItems = [
  { label: "Carpet Cleaning", href: "/services/carpet" },
  { label: "Upholstery Cleaning", href: "/services/upholstery" },
  { label: "Air Duct Cleaning", href: "/services/airduct" },
  { label: "Tile & Grout Cleaning", href: "/services/tile" },
  { label: "Dryer Vent Cleaning", href: "/services/dryervent" },
  { label: "Mattress Cleaning", href: "/services/mattress" },
  { label: "Wood Floor Cleaning", href: "/services/wood" },
  { label: "Post-Construction Cleaning", href: "/services/postconstruction" },
];

export function SiteNavbar() {
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-50 border-b",
        isHome
          ? "absolute left-0 right-0 top-0 border-transparent bg-transparent backdrop-blur-none"
          : "sticky top-0 border-border bg-white/75 backdrop-blur-sm"
      )}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="YXE Pristine Property Services"
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              item.href === "/services" ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "text-base transition-colors",
                      isHome
                        ? "font-bold text-white hover:text-white/85"
                        : isActiveRoute(item.href)
                          ? "font-medium text-purple-700"
                          : "font-medium text-gray-600 hover:text-purple-700"
                    )}
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 mt-3 w-72 rounded-xl border border-purple-100 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-base transition-colors",
                    isHome
                      ? "font-bold text-white hover:text-white/85"
                      : isActiveRoute(item.href)
                        ? "font-medium text-purple-700"
                        : "font-medium text-gray-600 hover:text-purple-700"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {status === "authenticated" ? (
              <Button size="sm" className="bg-purple-700 hover:bg-purple-800" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" className="bg-purple-700 hover:bg-purple-800" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>

          <button
            className="p-2 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className={cn("mt-4 border-t pt-4 md:hidden", !mobileOpen && "hidden")}>
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-left text-base transition-colors",
                  isHome
                    ? "font-bold text-white hover:text-white/85"
                    : isActiveRoute(item.href)
                      ? "font-medium text-purple-700"
                      : "text-gray-600 hover:text-purple-700"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t pt-4">
              {status === "authenticated" ? (
                <Button className="w-full bg-purple-700 hover:bg-purple-800" asChild>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button className="w-full bg-purple-700 hover:bg-purple-800" asChild>
                  <Link href="/auth/signin" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

