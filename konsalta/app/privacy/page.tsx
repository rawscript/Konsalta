"use client";

import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Eye,
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle,
  EnvelopeSimple,
} from "@phosphor-icons/react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "collection",
      title: "Lorem Ipsum Collection",
      icon: Eye,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      points: [
        "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore.",
        "Ut enim ad minim veniam quis nostrud exercitation ullamco.",
        "Duis aute irure dolor in reprehenderit in voluptate velit.",
      ],
    },
    {
      id: "usage",
      title: "Dolor Sit Amet Usage",
      icon: FileText,
      content:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
      points: [
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur.",
        "Neque porro quisquam est qui dolorem ipsum quia dolor.",
        "Ut enim ad minima veniam quis nostrum exercitationem ullam.",
        "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
      ],
    },
    {
      id: "security",
      title: "Adipiscing Elit Security",
      icon: ShieldCheck,
      content:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.",
      points: [
        "Temporibus autem quibusdam et aut officiis debitis aut.",
        "Itaque earum rerum hic tenetur a sapiente delectus.",
        "Nam libero tempore cum soluta nobis est eligendi optio.",
        "Omnis dolor repellendus temporibus autem quibusdam et.",
      ],
    },
    {
      id: "rights",
      title: "Tempor Incididunt Rights",
      icon: Lock,
      content:
        "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
      points: [
        "Voluptatibus maiores alias consequatur aut perferendis doloribus.",
        "Maiores alias consequatur aut perferendis doloribus asperiores.",
        "Eligendi optio cumque nihil impedit quo minus id quod.",
        "Placeat facere possimus omnis voluptas assumenda est omnis.",
      ],
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc]">
      <div className="bg-gradient-to-br from-[#0b2d53] via-[#123b6b] to-[#061d38] py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f26522] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-48 bg-[#1e56a0] opacity-20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Lorem Ipsum / Home</span>
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300">
              <Lock size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              LOREM / PRIVACY POLICY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Lorem Ipsum Dolor.{" "}
            <span className="text-[#f26522]">Privacy Policy.</span>
          </h1>

          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/70 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              <span>Lorem Ipsum: Oct 2026</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>Dolor Sit Consectetur</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#0b2d53] uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                Lorem Sections
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm text-slate-600 hover:text-[#f26522] hover:bg-slate-50 transition-colors"
                    >
                      <section.icon size={16} weight="bold" className="text-slate-400 shrink-0" />
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Lorem Inquiries
                </span>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.
                </p>
                <a
                  href="mailto:privacy@konsalta.com"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#f26522] hover:text-[#d95316] transition-colors"
                >
                  <EnvelopeSimple size={15} weight="bold" />
                  <span>privacy@konsalta.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8">
              <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-2">
                LOREM OVERVIEW
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53] mb-4">
                Lorem Ipsum Dolor Sit Amet
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>

            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] shrink-0">
                    <section.icon size={22} weight="bold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block">
                      LOREM SECTION
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0b2d53]">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5">
                  {section.content}
                </p>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                      <CheckCircle
                        size={16}
                        weight="fill"
                        className="text-[#f26522] shrink-0 mt-0.5"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
