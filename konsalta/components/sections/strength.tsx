"use client";

import LeavesPlaceholder from "@/components/ui/leaves-placeholder";
import { Lightning, ShareNetwork, Target, UsersFour } from "@phosphor-icons/react";

export default function Strength() {
  const strengths = [
    {
      icon: Lightning,
      label: "Lorem\nipsum",
    },
    {
      icon: ShareNetwork,
      label: "Dolor sit\namet",
    },
    {
      icon: Target,
      label: "Consectetur\nadipiscing",
    },
    {
      icon: UsersFour,
      label: "Tempor\nincididunt",
    },
  ];

  return (
    <section className="w-full bg-[#072448] py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute top-0 bottom-0 left-0 w-36 sm:w-56 lg:w-72 pointer-events-none">
        <LeavesPlaceholder />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pl-28 sm:pl-48 lg:pl-56">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-sky-300 uppercase block mb-2">
              LOREM IPSUM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Lorem Ipsum
            </h2>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation.
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
