"use client";

import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-gray-900 py-12 text-white md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-white p-2">
                  <Image
                    src="/images/logo.png"
                    alt="YXE Pristine Property Services logo"
                    width={2638}
                    height={1089}
                    className="h-12 w-auto"
                    sizes="160px"
                    quality={75}
                  />
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Professional, eco-friendly cleaning for homes and businesses in Saskatoon and surrounding areas.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-amber-600"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-11 min-w-11 items-center justify-center rounded-lg bg-gray-800 transition-colors hover:bg-amber-600"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-amber-400">Carpet cleaning</a></li>
              <li><a href="#services" className="hover:text-amber-400">Upholstery cleaning</a></li>
              <li><a href="#services" className="hover:text-amber-400">Air duct cleaning</a></li>
              <li><a href="#services" className="hover:text-amber-400">Tile & grout</a></li>
              <li><a href="#services" className="hover:text-amber-400">Dryer vent</a></li>
              <li><a href="#services" className="hover:text-amber-400">Post-construction</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#about" className="hover:text-amber-400">About us</a></li>
              <li><a href="#reviews" className="hover:text-amber-400">Reviews</a></li>
              <li><a href="#pricing" className="hover:text-amber-400">Pricing</a></li>
              <li><a href="#contact" className="hover:text-amber-400">Contact</a></li>
              <li><a href="#" className="hover:text-amber-400">Privacy</a></li>
              <li><a href="#" className="hover:text-amber-400">Terms</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Service areas</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Saskatoon</li>
              <li>Martensville</li>
              <li>Warman</li>
              <li>Osler</li>
              <li>Langham</li>
              <li>Surrounding towns</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">© {year} YXE Pristine Property Services. All rights reserved.</p>
          <p className="text-sm text-gray-400">Made with care in Saskatoon, SK</p>
        </div>
      </div>
    </footer>
  );
}
