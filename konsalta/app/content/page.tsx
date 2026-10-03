import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Konsalta Insights will share research, practical learning and strategic thinking that turns evidence into impact.",
};

const upcomingThemes = [
  {
    number: "01",
    title: "Evidence-informed public services",
    accent: "bg-[#1e56a0]",
  },
  {
    number: "02",
    title: "Learning that strengthens programmes",
    accent: "bg-[#f26522]",
  },
  {
    number: "03",
    title: "Strategy, markets and ESG",
    accent: "bg-[#0b2d53]",
  },
];

export default function ContentPage() {
  return (
    <div className="w-full bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2d53] via-[#123b6b] to-[#061d38] py-20 lg:py-28">
        <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#f26522] opacity-15 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 h-40 w-96 rounded-full bg-[#1e56a0] opacity-30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-sky-300 sm:text-sm">
            Konsalta Insights
          </span>
          <h1 className="mb-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
            Ideas for better <span className="text-[#f26522]">decisions.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-blue-100/85 sm:text-lg">
            Our first perspectives are in development. Here, we will share research,
            practical learning and strategic thinking that helps turn evidence into impact.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-14">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#1e56a0] sm:text-sm">
              On the editorial desk
            </span>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#0b2d53] sm:text-4xl">
              Perspectives taking shape.
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full border border-[#f26522]/35 bg-[#fff8f4] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#d95316]">
            Publishing soon
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {upcomingThemes.map((theme) => (
            <article
              key={theme.number}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 overflow-hidden bg-[#f7f9fc] p-6">
                <div className={`absolute left-0 top-0 h-1 w-full ${theme.accent}`} />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.18em] text-slate-400">{theme.number}</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Coming soon
                  </span>
                </div>
                <div className="absolute bottom-7 left-6 right-6 space-y-3" aria-hidden="true">
                  <div className="h-2 w-11/12 rounded-full bg-slate-200/80" />
                  <div className="h-2 w-8/12 rounded-full bg-slate-200/55" />
                  <div className="mt-5 h-1.5 w-5/12 rounded-full bg-[#f26522]/40" />
                </div>
              </div>
              <div className="min-h-36 p-6">
                <h3 className="text-lg font-bold leading-snug text-[#0b2d53]">{theme.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  A forthcoming Konsalta perspective.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-100 bg-[#f8fafc]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-6 py-14 sm:flex-row sm:items-center lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#1e56a0]">
              Work with us
            </span>
            <h2 className="text-2xl font-bold text-[#0b2d53] sm:text-3xl">Have a question worth exploring?</h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f26522] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d95316] hover:shadow-md active:scale-95"
          >
            Start a conversation
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
