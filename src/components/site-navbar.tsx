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

export function SiteNavbar() {
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
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
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "text-purple-700"
                    : "text-gray-600 hover:text-purple-700"
                )}
              >
                {item.label}
              </Link>
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
                  "text-left transition-colors",
                  isActiveRoute(item.href)
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

