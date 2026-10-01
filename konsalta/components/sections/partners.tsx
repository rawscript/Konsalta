"use client";

import {
  Bank,
  Handshake,
  TrendUp,
  UsersThree,
  GraduationCap,
} from "@phosphor-icons/react";

export default function Partners() {
  const partners = [
    {
      icon: Bank,
      title: "Lorem ipsum dolor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    },
    {
      icon: Handshake,
      title: "Consectetur adipiscing",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    },
    {
      icon: TrendUp,
      title: "Tempor incididunt",
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    },
    {
      icon: UsersThree,
      title: "Labore et dolore",
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      icon: GraduationCap,
      title: "Magna aliqua enim",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
    },
  ];

  return (
    <section id="who-we-serve" className="w-full bg-white py-20 lg:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-3">
              LOREM IPSUM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0b2d53] leading-tight">
              Lorem ipsum dolor sit amet{" "}
              <span className="text-[#f26522] block sm:inline">consectetur adipiscing elit.</span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-1">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x divide-slate-200">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={partner.title}
                className={`flex flex-col ${index === 0 ? "lg:pr-8" : index === partners.length - 1 ? "lg:pl-8" : "lg:px-8"}`}
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#f26522] flex items-center justify-center text-white mb-6 shadow-sm shrink-0">
                  <Icon size={26} weight="regular" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0b2d53] leading-snug mb-3">
                  {partner.title}
                </h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {partner.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}