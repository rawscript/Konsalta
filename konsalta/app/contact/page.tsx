import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Konsalta about research, consulting and advisory enquiries across Africa.",
  openGraph: {
    title: "Contact Konsalta",
    description:
      "Start a conversation with Konsalta about research, consulting and advisory enquiries.",
  },
};

const engagementAreas = [
  "Research and evaluation",
  "Strategic advisory",
  "Learning and capacity development",
];

export default function ContactPage() {
  return (
    <div className="w-full bg-white">
      <div className="border-b border-slate-100 bg-[#f8fafc]/60 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 text-xs text-slate-500 sm:text-sm lg:px-12">
          <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-[#f26522]">
            <ArrowLeft size={14} weight="bold" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="font-medium text-[#0b2d53]">Contact</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-6">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[#1e56a0] sm:text-sm">
              Contact Konsalta
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#0b2d53] sm:text-5xl lg:text-[3.6rem]">
              Let&apos;s work towards <span className="text-[#f26522]">better decisions.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              For research, consulting and advisory enquiries, get in touch with our
              team directly. A dedicated enquiry form will be available here soon.
            </p>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.16em] text-[#1e56a0]">
                Areas we support
              </span>
              <ul className="space-y-3">
                {engagementAreas.map((area) => (
                  <li key={area} className="flex items-center gap-3 text-sm font-semibold text-[#0b2d53]">
                    <span className="h-2 w-2 rounded-full bg-[#f26522]" />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <aside className="relative overflow-hidden rounded-3xl bg-[#072448] p-8 text-white shadow-lg sm:p-10 lg:col-span-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#f26522] opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 bg-[#f26522] opacity-80" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />

            <div className="relative z-10">
              <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-200">
                Get in touch
              </span>
              <h2 className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">Start a conversation.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/80">
                Reach our team directly for research, consulting and advisory enquiries.
              </p>

              <a
                href="mailto:engage@konsaltahub.org"
                className="mt-7 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#f26522]"
              >
                <EnvelopeSimple size={19} weight="bold" />
                engage@konsaltahub.org
              </a>

              <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6" aria-label="Contact form preview">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Enquiry form coming soon</span>
                  <span className="h-2 w-2 rounded-full bg-[#f26522]" />
                </div>
                <div className="space-y-5" aria-hidden="true">
                  <div className="space-y-2">
                    <div className="h-2 w-20 rounded-full bg-white/25" />
                    <div className="h-11 rounded-xl border border-white/10 bg-white/[0.07]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-28 rounded-full bg-white/25" />
                    <div className="h-11 rounded-xl border border-white/10 bg-white/[0.07]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-24 rounded-full bg-white/25" />
                    <div className="h-20 rounded-xl border border-white/10 bg-white/[0.07]" />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-blue-100/65">
                Prefer email? We will be glad to hear from you at the address above.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-10 lg:mt-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#f26522] transition-colors hover:text-[#d95316]"
          >
            Explore Konsalta
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
