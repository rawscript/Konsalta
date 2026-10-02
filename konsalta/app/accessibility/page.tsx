"use client";

import Link from "next/link";
import {
  PersonSimple,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  ArrowLeft,
  EnvelopeSimple,
  Globe,
} from "@phosphor-icons/react";

export default function AccessibilityPage() {
  const standards = [
    {
      title: "Lorem Visual Contrast & Typography",
      icon: Eye,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      features: [
        "Lorem ipsum dolor sit amet contrast ratio compliance.",
        "Sed do eiusmod tempor scalable font definitions.",
        "Ut enim ad minim distinguishable visual elements.",
      ],
    },
    {
      title: "Dolor Keyboard Navigation & Focus",
      icon: CheckCircle,
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
      features: [
        "Excepteur sint occaecat logical tab ordering.",
        "Duis aute irure visible focus state indicators.",
        "Sunt in culpa skip links for primary landmark regions.",
      ],
    },
    {
      title: "Consectetur Assistive Compatibility",
      icon: SlidersHorizontal,
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.",
      features: [
        "Nemo enim ipsam semantic landmark structuring.",
        "Neque porro quisquam aria-label descriptions.",
        "Quis nostrum alternative descriptions for visuals.",
      ],
    },
    {
      title: "Adipiscing Responsive Zoom & Scaling",
      icon: ShieldCheck,
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate.",
      features: [
        "Temporibus autem responsive scaling up to 200%.",
        "Itaque earum dynamic fluid layout structures.",
        "Nam libero mobile touch targets exceeding 44px.",
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
              <PersonSimple size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              LOREM / ACCESSIBILITY STATEMENT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Lorem Ipsum Dolor.{" "}
            <span className="text-[#f26522]">Accessibility Statement.</span>
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
              <Globe size={14} weight="bold" />
              <span>WCAG 2.1 AA Conformity</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-10 shadow-xs">
          <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-2">
            LOREM COMMITMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53] mb-4">
            Digital Inclusion & Universal Access
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
            omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam eaque ipsa quae.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {standards.map((std) => (
            <div
              key={std.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] shrink-0">
                    <std.icon size={22} weight="bold" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0b2d53]">
                    {std.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {std.description}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                {std.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-xs text-slate-600"
                  >
                    <CheckCircle
                      size={15}
                      weight="fill"
                      className="text-[#f26522] shrink-0 mt-0.5"
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0b2d53] rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f26522] opacity-15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#f26522] uppercase block mb-2">
              LOREM ASSISTANCE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Lorem Feedback & Accessibility Inquiries
            </h3>
            <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco.
            </p>
            <a
              href="mailto:accessibility@konsalta.com"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#f26522] hover:bg-[#d95316] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <EnvelopeSimple size={16} weight="bold" />
              <span>accessibility@konsalta.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
