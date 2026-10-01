"use client";

import { LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

export default function Team() {
  const members = [
    {
      name: "Lorem Ipsum",
      role: "Lorem Ipsum Dolor",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
      accent: "from-[#0b2d53] to-[#1e56a0]",
    },
    {
      name: "Dolor Sit",
      role: "Consectetur Adipiscing",
      bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      accent: "from-[#123b6b] to-[#072448]",
    },
    {
      name: "Amet Consectetur",
      role: "Sed Do Eiusmod",
      bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      accent: "from-[#0b2d53] to-[#2563eb]",
    },
    {
      name: "Adipiscing Elit",
      role: "Tempor Incididunt",
      bio: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.",
      accent: "from-[#1e56a0] to-[#0b2d53]",
    },
  ];

  return (
    <section id="team" className="w-full bg-[#f8fafc] py-20 lg:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-3">
              LOREM IPSUM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0b2d53] leading-tight">
              Lorem ipsum dolor sit amet{" "}
              <span className="text-[#f26522] block sm:inline">consectetur adipiscing.</span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-1">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md hover:border-[#f26522]/40 transition-all group"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-slate-100 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.accent} opacity-90`} />
                  <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 w-28 h-28 text-white/80"
                    aria-hidden="true"
                  >
                    <circle cx="60" cy="42" r="22" fill="currentColor" fillOpacity="0.85" />
                    <path
                      d="M20 108C20 86 38 72 60 72C82 72 100 86 100 108"
                      fill="currentColor"
                      fillOpacity="0.85"
                    />
                  </svg>
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#f26522] shadow-xs" />
                </div>

                <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-1">
                  {member.role}
                </span>
                <h3 className="text-lg font-bold text-[#0b2d53] leading-snug mb-2 group-hover:text-[#f26522] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                  {member.bio}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0b2d53] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinLogo size={16} weight="fill" />
                </a>
                <a
                  href="mailto:contact@konsalta.com"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#f26522] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="Email"
                >
                  <EnvelopeSimple size={16} weight="bold" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
