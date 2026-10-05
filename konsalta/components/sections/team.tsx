"use client";

import Image from "next/image";
import { LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

export default function Team() {
  const members = [
    {
      name: "Simie",
      role: "Lorem Ipsum Dolor",
      image: "/1.jpeg",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
      accent: "from-[#0b2d53] to-[#1e56a0]",
      linkedin: "https://linkedin.com",
      email: "mailto:contact@konsalta.com",
    },
    {
      name: "Dolor Sit",
      role: "Consectetur Adipiscing",
      image: "/2.jpeg",
      bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      accent: "from-[#123b6b] to-[#072448]",
      linkedin: "https://linkedin.com",
      email: "mailto:contact@konsalta.com",
    },
    {
      name: "Amet Consectetur",
      role: "Sed Do Eiusmod",
      image: "/3.jpeg",
      bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      accent: "from-[#0b2d53] to-[#2563eb]",
      linkedin: "https://linkedin.com",
      email: "mailto:contact@konsalta.com",
    },
    {
      name: "Adipiscing Elit",
      role: "Tempor Incididunt",
      image: "/4.jpeg",
      bio: "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.",
      accent: "from-[#1e56a0] to-[#0b2d53]",
      linkedin: "https://linkedin.com",
      email: "mailto:contact@konsalta.com",
    },
  ];

  return (
    <section
      id="team"
      className="w-full bg-[#f8fafc] py-20 lg:py-24 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-3">
              OUR TEAM
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-[#0b2d53] leading-tight">
              The people behind{" "}
              <span className="text-[#f26522] block sm:inline">
                every engagement.
              </span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-1">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A women-led core team with deep regional expertise, backed by a wider multidisciplinary network assembled around each client&apos;s specific needs.
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
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-slate-100">
                  {/* Gradient fallback — visible only if image fails to load */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${member.accent}`}
                    aria-hidden="true"
                  />
                  <Image
                    src={member.image}
                    alt={`Photo of ${member.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top relative z-10"
                  />
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#f26522] shadow-xs z-20" />
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
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0b2d53] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <LinkedinLogo size={16} weight="fill" />
                </a>
                <a
                  href={member.email}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#f26522] hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                  aria-label={`Email ${member.name}`}
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
