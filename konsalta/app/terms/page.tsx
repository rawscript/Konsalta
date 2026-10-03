"use client";

import Link from "next/link";
import {
  FileText,
  Scales,
  ShieldCheck,
  WarningCircle,
  Lock,
  Clock,
  ArrowLeft,
  CheckCircle,
  EnvelopeSimple,
} from "@phosphor-icons/react";

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content:
        "By accessing or using the Konsalta website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use this site. These terms apply to all visitors, users, and anyone who accesses the site.",
      points: [
        "Access to this site constitutes acceptance of these terms in full.",
        "Konsalta reserves the right to update these terms at any time without prior notice.",
        "Continued use of the site following any changes constitutes acceptance of the revised terms.",
        "These terms apply to all content, services, and materials available on this site.",
      ],
    },
    {
      id: "property",
      title: "Intellectual Property",
      icon: Scales,
      content:
        "All content on this website — including but not limited to text, graphics, logos, reports, methodologies, and data — is the property of Konsalta or its content partners and is protected by applicable intellectual property laws. Unauthorised use, reproduction, or distribution is strictly prohibited.",
      points: [
        "All original content is owned by Konsalta and protected under copyright law.",
        "Trademarks, logos, and service marks displayed on this site belong to Konsalta.",
        "You may not reproduce, distribute, or create derivative works without written permission.",
        "Limited quotation with proper attribution is permitted for non-commercial purposes.",
      ],
    },
    {
      id: "conduct",
      title: "User Conduct",
      icon: ShieldCheck,
      content:
        "Users of this site agree to engage in a manner that is lawful, respectful, and consistent with Konsalta's values. Any conduct that is harmful, deceptive, or disruptive to the site or its users is strictly prohibited. Konsalta reserves the right to restrict access for violations of these standards.",
      points: [
        "You may not use this site for any unlawful or unauthorised purpose.",
        "You may not attempt to gain unauthorised access to any part of the site or its systems.",
        "You may not transmit any content that is harmful, offensive, or in breach of any law.",
        "Scraping, data mining, or automated access without written consent is not permitted.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: WarningCircle,
      content:
        "Konsalta provides this website on an 'as is' basis and makes no representations or warranties of any kind regarding its accuracy, completeness, or fitness for a particular purpose. To the fullest extent permitted by law, Konsalta excludes all liability for any direct or indirect loss arising from use of this site.",
      points: [
        "Konsalta does not warrant that the site will be error-free or uninterrupted.",
        "We are not liable for any loss or damage arising from reliance on site content.",
        "Third-party links are provided for convenience only — we do not endorse their content.",
        "Nothing in these terms limits liability for fraud or death caused by negligence.",
      ],
    },
    {
      id: "governance",
      title: "Governing Law",
      icon: Lock,
      content:
        "These Terms of Use are governed by and construed in accordance with the laws of Kenya. Any disputes arising from or related to your use of this site shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya, unless otherwise required by applicable law in your jurisdiction.",
      points: [
        "These terms are governed by the laws of Kenya.",
        "Disputes will be resolved in the courts of Nairobi, Kenya.",
        "If any provision of these terms is found unlawful, the remaining terms remain in effect.",
        "Failure to enforce any provision does not constitute a waiver of that right.",
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
              <FileText size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              KONSALTA / TERMS OF USE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Our Terms,{" "}
            <span className="text-[#f26522]">Clearly Stated.</span>
          </h1>

          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            These terms govern your use of the Konsalta website. Please read them
            carefully. By using this site, you agree to be bound by these terms.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/70 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              <span>Last updated: October 2026</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Scales size={14} weight="bold" />
              <span>Legal Documentation</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#0b2d53] uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                Contents
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
                  Legal Queries
                </span>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Questions about these terms? Contact our team directly.
                </p>
                <a
                  href="mailto:legal@konsalta.com"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#f26522] hover:text-[#d95316] transition-colors"
                >
                  <EnvelopeSimple size={15} weight="bold" />
                  <span>legal@konsalta.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8">
              <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-2">
                INTRODUCTION
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53] mb-4">
                Agreement to These Terms
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                These Terms of Use govern your access to and use of the Konsalta
                website at www.konsaltahub.org. Konsalta is a women-led,
                Africa-focused research, consulting and advisory firm registered
                in Kenya and Nigeria.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                By using this site you confirm that you have read, understood, and
                agree to be bound by these terms and our Privacy Policy. If you
                are using this site on behalf of an organisation, you represent
                that you have authority to bind that organisation to these terms.
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
                      TERMS
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
