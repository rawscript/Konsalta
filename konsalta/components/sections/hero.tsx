"use client";

import Link from "next/link";
import HeroVisual from "@/components/ui/hero-visual";
import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section id="about" className="relative w-full bg-gradient-to-b from-[#f8fafc] via-[#f1f6fd]/60 to-white overflow-hidden pt-8 lg:pt-14 pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end">
          <div className="lg:col-span-5 xl:col-span-5 z-20 pb-12 lg:pb-20">
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-[#1e56a0] uppercase block mb-4">
              LOREM / IPSUM / DOLOR
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-[#0b2d53] block">Lorem Ipsum Dolor.</span>
              <span className="text-[#f26522] block">Consectetur Adipiscing.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed max-w-xl mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#f26522] hover:bg-[#d95316] text-white text-base font-medium px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight size={17} weight="bold" />
            </Link>
          </div>

          <div className="lg:col-span-7 xl:col-span-7 relative flex items-end justify-center lg:justify-end -mr-6 lg:-mr-12">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
