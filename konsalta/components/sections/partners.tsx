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
      title: "Governments & Public Institutions",
      description:
        "Evidence Informed Policy-Making and Effective Public Service Delivery.",
    },
    {
      icon: Handshake,
      title: "Development Partners",
      description:
        "Generating Evidence and Strengthening Learning to inform Programmes.",
    },
    {
      icon: TrendUp,
      title: "Private Sector",
      description:
        "Data-Driven Insights, Strategic Advisory, Market-Entry and ESG support",
    },
    {
      icon: UsersThree,
      title: "Civil Society",
      description:
        "Demonstrating Impact and Mobilising Resources for Change",
    },
    {
      icon: GraduationCap,
      title: "Academic & Research Institution",
      description:
        "Research Evaluation, Data Analysis and Capacity Development.",
    },
  ];

  return (
    <section id="who-we-serve" className="w-full bg-white py-20 lg:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-3">
              WHO WE SERVE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0b2d53] leading-tight">
              Partners Across The{" "}
              <span className="text-[#f26522] block sm:inline">EVIDENCE to IMPACT </span>
              <span>Cycle</span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-1">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We work with a diverse range of partners, each playing a vital role in building more resilient, inclusive and prosperous societies.
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