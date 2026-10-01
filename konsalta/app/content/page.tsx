"use client";

import Link from "next/link";
import ContentVisual from "@/components/ui/content-visual";
import {
  CalendarBlank,
  Clock,
  ShareNetwork,
  BookmarkSimple,
  ArrowRight,
  ArrowLeft,
  Quotes,
  CheckCircle,
  TrendUp,
  LinkedinLogo,
} from "@phosphor-icons/react";

export default function ContentPage() {
  const tableOfContents = [
    { id: "section-1", title: "1. Lorem ipsum dolor" },
    { id: "section-2", title: "2. Consectetur adipiscing" },
    { id: "section-3", title: "3. Tempor incididunt" },
    { id: "section-4", title: "4. Magna aliqua enim" },
  ];

  const metrics = [
    { value: "+84%", label: "Lorem ipsum dolor", detail: "Consectetur adipiscing elit" },
    { value: "3.5x", label: "Dolor sit amet", detail: "Sed do eiusmod tempor" },
    { value: "120+", label: "Magna aliqua enim", detail: "Ut enim ad minim veniam" },
  ];

  const keyPoints = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  ];

  const relatedArticles = [
    {
      tag: "LOREM",
      title: "Lorem ipsum dolor sit amet consectetur",
      excerpt: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud.",
      date: "Oct 2026",
      readTime: "4 min read",
    },
    {
      tag: "IPSUM",
      title: "Consectetur adipiscing elit sed do eiusmod",
      excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
      date: "Sep 2026",
      readTime: "7 min read",
    },
    {
      tag: "DOLOR",
      title: "Tempor incididunt ut labore et dolore",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
      date: "Sep 2026",
      readTime: "5 min read",
    },
  ];

  return (
    <div className="w-full bg-white">
      <div className="border-b border-slate-100 bg-[#f8fafc]/60 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-[#f26522] transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} weight="bold" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <Link href="/content" className="hover:text-[#f26522] transition-colors">
            Insights
          </Link>
          <span>/</span>
          <span className="text-[#0b2d53] font-medium truncate max-w-xs sm:max-w-md">
            Lorem ipsum dolor sit amet
          </span>
        </div>
      </div>

      <article className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-20">
        <header className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-[#1e56a0] uppercase block mb-4">
            LOREM / IPSUM / INSIGHTS
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-[#0b2d53] leading-tight tracking-tight mb-6">
            Lorem Ipsum Dolor Sit Amet.{" "}
            <span className="text-[#f26522] block sm:inline">
              Consectetur Adipiscing Elit.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0b2d53] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#f26522]/30">
                LI
              </div>
              <div className="text-left">
                <span className="font-semibold text-[#0b2d53] block leading-tight">
                  Lorem Ipsum
                </span>
                <span className="text-xs text-slate-400">Dolor Specialist</span>
              </div>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <CalendarBlank size={16} className="text-[#1e56a0]" />
              <span>October 1, 2026</span>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#f26522]" />
              <span>6 min read</span>
            </div>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-3">
              <button
                aria-label="Share insight"
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#f26522] transition-colors"
              >
                <ShareNetwork size={17} weight="bold" />
              </button>
              <button
                aria-label="Save bookmark"
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#f26522] transition-colors"
              >
                <BookmarkSimple size={17} weight="bold" />
              </button>
            </div>
          </div>
        </header>

        <div className="mb-14">
          <ContentVisual />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <section id="section-1" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53] leading-snug">
                Lorem ipsum dolor sit amet
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
              </p>
            </section>

            <div className="bg-gradient-to-br from-[#f8fafc] via-[#f1f6fd] to-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendUp size={20} weight="bold" className="text-[#f26522]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1e56a0]">
                  Key Metrics & Takeaways
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                  <div key={metric.value} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
                    <span className="text-3xl font-extrabold text-[#f26522] block mb-1">
                      {metric.value}
                    </span>
                    <span className="text-sm font-bold text-[#0b2d53] block mb-1">
                      {metric.label}
                    </span>
                    <span className="text-xs text-slate-500 leading-tight block">
                      {metric.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <section id="section-2" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53] leading-snug">
                Consectetur adipiscing elit sed do eiusmod
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
              </p>

              <div className="my-8 pl-6 border-l-4 border-[#f26522] bg-[#f8fafc] p-6 rounded-r-xl relative">
                <Quotes size={36} weight="fill" className="text-[#f26522]/30 mb-2" />
                <p className="text-lg italic text-[#0b2d53] font-medium leading-relaxed mb-3">
                  &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.&rdquo;
                </p>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lorem Ipsum • Dolor Sit Amet
                </span>
              </div>

              <p className="text-slate-600 text-base leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>
            </section>

            <section id="section-3" className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0b2d53] leading-snug">
                Tempor incididunt ut labore et dolore
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {keyPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle size={20} weight="fill" className="text-[#f26522] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-4" className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53] leading-snug">
                Magna aliqua enim ad minim veniam
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                Tags:
              </span>
              {["Lorem", "Ipsum", "Dolor", "Consectetur", "Adipiscing"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-[#f26522]/10 hover:text-[#f26522] text-slate-600 rounded-full transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1e56a0] block mb-4">
                  Table of Contents
                </span>
                <nav className="space-y-2.5">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm font-medium text-slate-600 hover:text-[#f26522] transition-colors py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center">
                <div className="w-16 h-16 rounded-full bg-[#0b2d53] text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 ring-4 ring-[#f26522]/20">
                  LI
                </div>
                <h3 className="text-base font-bold text-[#0b2d53] mb-1">
                  Lorem Ipsum
                </h3>
                <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-3">
                  Advisory Specialist
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                <div className="flex justify-center">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#0b2d53] hover:text-[#f26522] font-semibold transition-colors"
                  >
                    <LinkedinLogo size={16} weight="fill" />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </div>

              <div className="bg-[#072448] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f26522] rounded-full blur-2xl opacity-20 pointer-events-none" />
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-2">
                  Stay Informed
                </span>
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  Lorem Ipsum Dolor
                </h3>
                <p className="text-xs text-blue-100/80 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="space-y-2.5"
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    required
                    className="w-full bg-[#0b2d53] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f26522]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#f26522] hover:bg-[#d95316] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} weight="bold" />
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-20 pt-14 border-t border-slate-200">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-2">
              RELATED CONTENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53]">
              Lorem ipsum dolor sit amet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((article) => (
              <div
                key={article.title}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#f26522]/40 transition-all flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-[#0b2d53] to-[#1e56a0] p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-[#f26522] rotate-45 transform translate-x-14 -translate-y-14 opacity-80" />
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start">
                    {article.tag}
                  </span>
                  <div className="flex items-center justify-between text-xs text-blue-100 z-10">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0b2d53] group-hover:text-[#f26522] transition-colors leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <Link
                    href="/content"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f26522] hover:text-[#d95316] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
