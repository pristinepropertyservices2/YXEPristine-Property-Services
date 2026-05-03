"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
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

const SCROLL_THRESHOLD_PX = 16;

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isHome = pathname === "/";
  const heroNav = isHome && !scrolled;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] w-full border-b transition-[background-color,backdrop-filter,border-color] duration-300",
          heroNav
            ? "border-white/20 bg-black/22 backdrop-blur-md backdrop-brightness-125"
            : "border-border bg-white/95 backdrop-blur-sm"
        )}
      >
        <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative flex shrink-0 items-center gap-3 outline-offset-4">
            <Image
              src="/images/logo.png"
              alt="YXE Pristine Property Services"
              width={2638}
              height={1089}
              className="h-12 w-auto md:h-[3.5rem] lg:h-[3.75rem]"
              priority
              quality={96}
              sizes="(max-width: 768px) 196px, 236px"
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
                      heroNav
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
                    heroNav
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

          <div className="hidden items-center gap-2 md:flex md:gap-3">
            <Link
              href="/auth/signin"
              prefetch
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                heroNav
                  ? "border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
                  : "border-purple-700 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
              )}
            >
              Login
            </Link>
            <Link
              href="/auth/signin?mode=signup"
              prefetch
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-purple-700 text-white hover:bg-purple-800"
              )}
            >
              Sign Up
            </Link>
          </div>

          <button
            className={cn("p-2 md:hidden text-foreground", heroNav && "text-white")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div
          className={cn(
            "mt-4 border-t pt-4 md:hidden",
            heroNav ? "border-white/20" : "border-gray-200",
            !mobileOpen && "hidden"
          )}
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-left text-base transition-colors",
                  heroNav
                    ? "font-bold text-white hover:text-white/85"
                    : isActiveRoute(item.href)
                      ? "font-medium text-purple-700"
                      : "text-gray-600 hover:text-purple-700"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div
              className={cn(
                "flex flex-col gap-2 border-t pt-4",
                heroNav ? "border-white/20" : "border-gray-200"
              )}
            >
              <>
                <Link
                  href="/auth/signin"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-center text-center",
                    heroNav
                      ? "border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
                      : "border-purple-700 text-purple-700 hover:bg-purple-50"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signin?mode=signup"
                  prefetch
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants(),
                    "w-full justify-center bg-purple-700 text-white hover:bg-purple-800"
                  )}
                >
                  Sign Up
                </Link>
              </>
            </div>
          </div>
        </div>
        </nav>
      </header>
      {!isHome ? (
        <div className="h-[4.5rem] shrink-0 md:h-[5rem] lg:h-[5.25rem]" aria-hidden />
      ) : null}
    </>
  );
}

