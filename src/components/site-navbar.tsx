"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, Loader2, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/contact" },
] as const;

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
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
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
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const linkClass = (href: string) =>
    cn(
      "inline-flex items-center gap-1 text-sm font-medium transition-colors lg:text-base",
      heroNav
        ? "font-bold text-white hover:text-white/85"
        : isActiveRoute(href)
          ? "text-purple-700"
          : "text-gray-600 hover:text-purple-700"
    );

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
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="relative flex shrink-0 items-center gap-3 outline-offset-4">
              <Image
                src="/images/logo.png"
                alt="YXE Pristine Property Services"
                width={2638}
                height={1089}
                className="h-[4.5rem] w-auto md:h-[5.25rem] lg:h-[5.75rem]"
                priority
                quality={75}
                sizes="(max-width: 768px) 260px, 300px"
              />
            </Link>

            <div className="hidden items-center gap-4 xl:gap-6 lg:flex">
              {navItems.map((item) =>
                "hasDropdown" in item && item.hasDropdown ? (
                  <div key={item.href} className="group relative">
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                      <ChevronDown
                        className="h-4 w-4 transition-transform group-hover:rotate-180"
                        aria-hidden
                      />
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
                  <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <div className="hidden items-center gap-2 lg:flex lg:gap-3">
              <Link
                href="/book"
                prefetch={false}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-amber-500 font-semibold text-neutral-950 hover:bg-amber-400"
                )}
              >
                Book Online
              </Link>
              {status === "loading" ? (
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-md",
                    heroNav ? "text-white" : "text-purple-700"
                  )}
                  aria-label="Loading account"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    prefetch
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      heroNav
                        ? "border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
                        : "border-purple-700 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                    )}
                  >
                    Dashboard
                  </Link>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      prefetch
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        heroNav
                          ? "border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
                          : "border-purple-700 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                      )}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      heroNav
                        ? "border-white bg-transparent text-white hover:bg-white/15 hover:text-white"
                        : "border-purple-700 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                    )}
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign out
                  </button>
                </>
              ) : (
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
              )}
            </div>

            <button
              className={cn("p-2 text-foreground lg:hidden", heroNav && "text-white")}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div
            className={cn(
              "mt-4 border-t pt-4 lg:hidden",
              heroNav ? "border-white/20" : "border-gray-200",
              !mobileOpen && "hidden"
            )}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                "hasDropdown" in item && item.hasDropdown ? (
                  <div key={item.href} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className={cn(
                        "flex w-full items-center justify-between py-2 text-left text-base transition-colors",
                        heroNav
                          ? "font-bold text-white"
                          : isActiveRoute(item.href)
                            ? "font-medium text-purple-700"
                            : "text-gray-600"
                      )}
                      aria-expanded={mobileServicesOpen}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          mobileServicesOpen && "rotate-180"
                        )}
                        aria-hidden
                      />
                    </button>
                    {mobileServicesOpen ? (
                      <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-white/20 pl-3">
                        <Link
                          href="/services"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "py-1.5 text-sm",
                            heroNav ? "text-white/90" : "text-gray-600 hover:text-purple-700"
                          )}
                        >
                          All Services
                        </Link>
                        {serviceItems.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "py-1.5 text-sm",
                              heroNav ? "text-white/90" : "text-gray-600 hover:text-purple-700"
                            )}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "py-2 text-left text-base transition-colors",
                      heroNav
                        ? "font-bold text-white hover:text-white/85"
                        : isActiveRoute(item.href)
                          ? "font-medium text-purple-700"
                          : "text-gray-600 hover:text-purple-700"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}

              <div
                className={cn(
                  "mt-3 flex flex-col gap-2 border-t pt-4",
                  heroNav ? "border-white/20" : "border-gray-200"
                )}
              >
                <Link
                  href="/book"
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    buttonVariants(),
                    "w-full justify-center bg-amber-500 font-semibold text-neutral-950 hover:bg-amber-400"
                  )}
                >
                  Book Online
                </Link>
                {status === "loading" ? (
                  <span
                    className={cn(
                      "flex h-11 items-center justify-center rounded-md",
                      heroNav ? "text-white" : "text-purple-700"
                    )}
                  >
                    <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
                  </span>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      prefetch
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center text-center",
                        heroNav
                          ? "border-white bg-transparent text-white hover:bg-white/15"
                          : "border-purple-700 text-purple-700 hover:bg-purple-50"
                      )}
                    >
                      Dashboard
                    </Link>
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        prefetch
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "w-full justify-center text-center",
                          heroNav
                            ? "border-white bg-transparent text-white hover:bg-white/15"
                            : "border-purple-700 text-purple-700 hover:bg-purple-50"
                        )}
                      >
                        Admin
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center text-center",
                        heroNav
                          ? "border-white bg-transparent text-white hover:bg-white/15"
                          : "border-purple-700 text-purple-700 hover:bg-purple-50"
                      )}
                      onClick={() => {
                        setMobileOpen(false);
                        void signOut({ callbackUrl: "/" });
                      }}
                    >
                      Sign out
                    </button>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      {!isHome ? (
        <div className="h-[6rem] shrink-0 md:h-[6.75rem] lg:h-[7rem]" aria-hidden />
      ) : null}
    </>
  );
}
