"use client";

import {
  Bank,
  Handshake,
  ChartLineUp,
  UsersThree,
  GraduationCap,
} from "@phosphor-icons/react";

export default function Clients() {
  const clientTypes = [
    {
      icon: Bank,
      title: "Lorem Ipsum",
    },
    {
      icon: Handshake,
      title: "Consectetur",
    },
    {
      icon: ChartLineUp,
      title: "Adipiscing",
    },
    {
      icon: UsersThree,
      title: "Tempor Incididunt",
    },
    {
      icon: GraduationCap,
      title: "Magna Aliqua",
    },
  ];

  return (
    <section id="clients" className="w-full bg-white py-16 lg:py-20 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-2">
              LOREM IPSUM
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53] leading-snug">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed.
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x divide-slate-200">
              {clientTypes.map((client, index) => {
                const Icon = client.icon;
                return (
                  <div
                    key={client.title}
                    className={`flex flex-col items-center text-center py-4 ${
                      index === 0
                        ? "lg:pr-5"
                        : index === clientTypes.length - 1
                        ? "lg:pl-5"
                        : "lg:px-5"
                    }`}
                  >
                    <div className="w-14 h-14 flex items-center justify-center text-[#1e56a0] mb-3 hover:text-[#f26522] transition-colors">
                      <Icon size={38} weight="light" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-[#0b2d53] leading-tight">
                      {client.title}
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