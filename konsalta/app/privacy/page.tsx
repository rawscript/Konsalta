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
      title: "Information We Collect",
      icon: Eye,
      content:
        "Konsalta collects only the information necessary to provide our services and improve your experience on this site. This includes information you provide directly — such as through our contact form or newsletter — and limited technical data collected automatically when you visit.",
      points: [
        "Contact details you submit via forms (name, email, subject, message).",
        "Newsletter subscription email addresses.",
        "Technical data including browser type, device, and anonymised IP address.",
        "Usage data such as pages visited and time spent on site (via analytics cookies, if consented).",
      ],
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: FileText,
      content:
        "We use the information we collect solely for the purposes for which it was provided, or for closely related purposes you would reasonably expect. We do not sell, rent, or trade personal data to any third party. Your data is used to respond to your enquiries, send communications you have opted into, and improve our website.",
      points: [
        "To respond to enquiries and service requests submitted via our contact form.",
        "To send newsletters and updates to subscribers who have opted in.",
        "To understand how our site is used and identify areas for improvement.",
        "To comply with legal and regulatory obligations where applicable.",
      ],
    },
    {
      id: "security",
      title: "Data Security",
      icon: ShieldCheck,
      content:
        "Konsalta takes the security of your personal data seriously. We implement appropriate technical and organisational measures to protect your information against unauthorised access, loss, or disclosure. No method of transmission over the internet is completely secure, but we maintain industry-standard protections.",
      points: [
        "All data transmissions are encrypted using HTTPS/TLS protocols.",
        "Access to personal data is restricted to authorised personnel only.",
        "We conduct periodic reviews of our data handling and security practices.",
        "In the event of a data breach, we will notify affected individuals as required by law.",
      ],
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: Lock,
      content:
        "You have rights over your personal data. Depending on your location, these may include the right to access, correct, delete, or restrict processing of your data. You may also have the right to data portability and to withdraw consent at any time. To exercise any of these rights, contact us at privacy@konsalta.org.",
      points: [
        "Right to access the personal data we hold about you.",
        "Right to correct any inaccurate or incomplete data.",
        "Right to request deletion of your data where no legal basis exists for retention.",
        "Right to withdraw consent for marketing or optional data processing at any time.",
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
              <Lock size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              KONSALTA / PRIVACY POLICY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Your Data,{" "}
            <span className="text-[#f26522]">Handled with Care.</span>
          </h1>

          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Konsalta is committed to protecting your privacy. This policy explains
            what personal information we collect, how we use it, and your rights
            regarding your data.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/70 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              <span>Last updated: October 2026</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>GDPR & Kenya DPA Aligned</span>
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
                  Privacy Enquiries
                </span>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Questions about your data or this policy? Reach out directly.
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
                OVERVIEW
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53] mb-4">
                Our Commitment to Your Privacy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                Konsalta respects your privacy and is committed to protecting your
                personal data. This policy applies to information collected through
                our website and any direct communications with our team.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We process personal data in accordance with applicable data
                protection laws, including Kenya&apos;s Data Protection Act (2019)
                and, where applicable, the EU General Data Protection Regulation
                (GDPR). If you have questions, contact us at privacy@konsalta.org.
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
                      PRIVACY
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
