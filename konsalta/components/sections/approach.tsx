"use client";

import ApproachDiagram from "@/components/ui/approach-diagram";
import MountainPlaceholder from "@/components/ui/mountain-placeholder";

export default function Approach() {
  return (
    <section id="our-approach" className="w-full bg-[#f4f7fa] py-20 lg:py-24 relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          <div className="lg:col-span-4 max-w-lg">
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

          <div className="lg:col-span-5 flex items-center justify-center">
            <ApproachDiagram />
          </div>

          <div className="lg:col-span-3 h-full hidden lg:block -mr-6 lg:-mr-12">
            <MountainPlaceholder />
          </div>
        </div>
      </div>

      <div className="lg:hidden w-full h-48 mt-8">
        <MountainPlaceholder />
      </div>
    </section>
  );
}