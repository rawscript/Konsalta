"use client";

import Link from "next/link";
import HeroVisual from "@/components/ui/hero-visual";
import { ArrowRight } from "@phosphor-icons/react";

export default function Hero() {
  return (
    <section id="about" className="relative w-full bg-[#f8fafc] overflow-hidden">
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%] xl:w-[58%] h-full z-0 pointer-events-none">
        <HeroVisual />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px] lg:min-h-[660px] py-14 lg:py-24">
          <div className="lg:col-span-6 xl:col-span-5 max-w-xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-[#1e56a0] uppercase block mb-4">
              RESEARCH / CONSULTING / ADVISORY
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.85rem] font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-[#0b2d53] block">Better Decisions.</span>
              <span className="text-[#f26522] block">Greater Impact.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-[17px] leading-relaxed mb-8">
Konsalta is a women-led, Africa-focused research, consulting and advisory firm. We are built to move past the slow overhead-heavy structures of traditional consulting - Operating instead as an agile, network driven collective, shaped around each client's needs to deliver sustained value </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#f26522] hover:bg-[#d95316] text-white text-base font-medium px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Contact Us</span>
              <ArrowRight size={17} weight="bold" />
            </Link>
          </div>

          <div className="lg:hidden w-full h-[360px] sm:h-[460px] rounded-2xl overflow-hidden mt-4 shadow-sm">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
