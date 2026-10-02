"use client";

import ApproachDiagram from "@/components/ui/approach-diagram";
import MountainPlaceholder from "@/components/ui/mountain-placeholder";

export default function Approach() {
  return (
    <section id="our-approach" className="relative w-full bg-[#f4f7fa] py-20 lg:py-28 overflow-hidden border-t border-slate-100">
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[320px] xl:w-[400px] 2xl:w-[460px] pointer-events-none z-0" aria-hidden="true">
        <MountainPlaceholder />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-5 max-w-xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-3">
              LOREM IPSUM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0b2d53] leading-tight mb-6">
              Lorem ipsum dolor,{" "}
              <span className="text-[#f26522] block sm:inline">sit amet consectetur.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
            </p>
          </div>

          <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center lg:justify-start lg:pl-4 xl:pl-8">
            <ApproachDiagram />
          </div>
        </div>

        <div className="lg:hidden w-full h-72 sm:h-80 md:h-96 mt-12 relative overflow-hidden rounded-2xl shadow-sm border border-slate-200/60 bg-white/40" aria-hidden="true">
          <MountainPlaceholder />
        </div>
      </div>
    </section>
  );
}