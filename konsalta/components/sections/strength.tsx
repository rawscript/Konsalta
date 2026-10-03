"use client";

import Image from "next/image";
import { Lightning, ShareNetwork, Target, UsersFour } from "@phosphor-icons/react";

export default function Strength() {
  const strengths = [
    {
      icon: Lightning,
      label: "Flexible\nand responsive",
    },
    {
      icon: ShareNetwork,
      label: "Network-driven\ncollective",
    },
    {
      icon: Target,
      label: "Bespoke\nSolutions",
    },
    {
      icon: UsersFour,
      label: "Lasting\nImpact",
    },
  ];

  return (
    <section className="w-full bg-[#072448] py-16 lg:py-20 relative overflow-hidden">
      <div
        className="absolute top-0 bottom-0 left-0 w-32 sm:w-64 lg:w-80 xl:w-96 overflow-hidden pointer-events-none z-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 68% 100%, 0 100%)",
        }}
        aria-hidden="true"
      >
        <Image
          src="/macro.jpg"
          alt="Macro leaves detail"
          fill
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 384px"
          className="object-cover scale-150 origin-center"
        />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#072448] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#072448]/25 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pl-20 sm:pl-52 lg:pl-64">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-sky-300 uppercase block mb-2">
              OUR STRENGTH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Agility
            </h2>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-md">
              We move quickly, think deeply and build the right solutions—because impact shouldn&apos;t take years.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-start">
              {strengths.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-13 h-13 rounded-full border border-[#f26522]/60 flex items-center justify-center text-[#f26522] mb-3 group-hover:bg-[#f26522] group-hover:text-white transition-all shadow-sm">
                      <Icon size={24} weight="regular" />
                    </div>
                    <span className="text-xs text-white/90 font-medium whitespace-pre-line leading-tight">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
