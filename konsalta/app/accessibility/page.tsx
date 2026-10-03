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
      title: "Visual Contrast & Typography",
      icon: Eye,
      description:
        "We maintain sufficient colour contrast across all text and interactive elements, and use scalable type definitions so content remains readable at any zoom level. Decorative elements are marked appropriately so they do not distract assistive technology users.",
      features: [
        "Minimum 4.5:1 contrast ratio for body text, 3:1 for large text.",
        "All font sizes defined in relative units to support browser zoom.",
        "Decorative images use empty alt attributes; informative images have descriptive alt text.",
      ],
    },
    {
      title: "Keyboard Navigation & Focus",
      icon: CheckCircle,
      description:
        "All interactive elements on the Konsalta site are reachable and operable via keyboard alone. Focus states are clearly visible, tab order follows a logical reading sequence, and skip links allow keyboard users to bypass repeated navigation.",
      features: [
        "All links, buttons, and form fields are keyboard accessible.",
        "Visible, high-contrast focus indicators on all interactive elements.",
        "Skip-to-main-content link available at the top of every page.",
      ],
    },
    {
      title: "Assistive Technology Compatibility",
      icon: SlidersHorizontal,
      description:
        "Pages are structured using semantic HTML landmarks so screen readers can navigate efficiently. ARIA labels and roles are applied where native semantics are insufficient, and all dynamic content changes are communicated to assistive technologies.",
      features: [
        "Semantic landmark regions (header, main, nav, footer) on every page.",
        "ARIA labels applied to icon-only buttons and interactive controls.",
        "Dynamic UI updates announced via ARIA live regions where relevant.",
      ],
    },
    {
      title: "Responsive Zoom & Scaling",
      icon: ShieldCheck,
      description:
        "The site is fully responsive and designed to reflow at up to 400% zoom without loss of content or functionality. Touch targets meet minimum size requirements, and no content is lost or obscured when text spacing is adjusted.",
      features: [
        "Content reflows correctly at 400% zoom without horizontal scrolling.",
        "All touch targets meet a minimum size of 44×44px.",
        "No loss of content when text spacing is overridden by the user.",
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
            <span>Konsalta / Home</span>
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300">
              <PersonSimple size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              KONSALTA / ACCESSIBILITY STATEMENT
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Built for Everyone.{" "}
            <span className="text-[#f26522]">Accessibility Statement.</span>
          </h1>

          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Konsalta is committed to making this website accessible to all users,
            regardless of ability or technology. We aim to conform to WCAG 2.1
            Level AA and continue to improve the accessibility of our site.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/70 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              <span>Last reviewed: October 2026</span>
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
            OUR COMMITMENT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53] mb-4">
            Digital Inclusion & Universal Access
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            Konsalta believes that access to information should not be limited by
            disability or the technology a person uses. We are committed to ensuring
            our website is perceivable, operable, understandable, and robust for all
            users — the four principles that underpin the Web Content Accessibility
            Guidelines (WCAG) 2.1 at Level AA.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Accessibility is an ongoing commitment, not a one-time checklist. We
            regularly review our site against WCAG criteria and act on any issues
            identified. We welcome feedback from users who encounter barriers on
            this site.
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
              ACCESSIBILITY FEEDBACK
            </span>
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Encountered a Barrier? Let Us Know.
            </h3>
            <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
              If you experience any difficulty accessing content on this site, we
              want to hear from you. Contact our team and we will work to resolve
              the issue or provide content in an alternative format.
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
