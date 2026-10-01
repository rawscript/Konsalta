"use client";

import Link from "next/link";
import {
  CalendarBlank,
  Clock,
  ArrowRight,
  MagnifyingGlass,
  Funnel,
} from "@phosphor-icons/react";

const articles = [
  {
    tag: "LOREM",
    date: "Oct 2026",
    readTime: "6 min read",
    title: "Lorem ipsum dolor sit amet consectetur adipiscing elit",
    excerpt:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    featured: true,
  },
  {
    tag: "IPSUM",
    date: "Sep 2026",
    readTime: "4 min read",
    title: "Consectetur adipiscing elit sed do eiusmod tempor",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
    featured: false,
  },
  {
    tag: "DOLOR",
    date: "Sep 2026",
    readTime: "7 min read",
    title: "Tempor incididunt ut labore et dolore magna aliqua",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.",
    featured: false,
  },
  {
    tag: "LOREM",
    date: "Aug 2026",
    readTime: "5 min read",
    title: "Labore et dolore magna aliqua ut enim ad minim",
    excerpt:
      "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    featured: false,
  },
  {
    tag: "ADIPISCING",
    date: "Aug 2026",
    readTime: "8 min read",
    title: "Minim veniam quis nostrud exercitation ullamco laboris",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis.",
    featured: false,
  },
  {
    tag: "IPSUM",
    date: "Jul 2026",
    readTime: "3 min read",
    title: "Nostrud exercitation ullamco laboris nisi ut aliquip",
    excerpt:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui.",
    featured: false,
  },
];

const categories = [
  "All Insights",
  "Lorem Ipsum",
  "Dolor Sit",
  "Consectetur",
  "Adipiscing",
];

export default function ContentPage() {
  return (
    <div className="w-full bg-white">
      <div className="bg-gradient-to-br from-[#0b2d53] via-[#123b6b] to-[#061d38] py-20 lg:py-28 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-[#f26522] opacity-15 rounded-full blur-3xl pointer-events-none"
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-40 bg-[#1e56a0] opacity-25 rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase block mb-3">
            LOREM / IPSUM / INSIGHTS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-white leading-tight tracking-tight mb-5 max-w-3xl">
            Lorem Ipsum Dolor Sit Amet.{" "}
            <span className="text-[#f26522]">Consectetur Adipiscing.</span>
          </h1>
          <p className="text-blue-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>

          <div className="flex items-center gap-3 max-w-lg">
            <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-5 py-3">
              <MagnifyingGlass size={17} className="text-blue-200 shrink-0" />
              <input
                type="text"
                placeholder="Search lorem ipsum..."
                className="bg-transparent text-sm text-white placeholder-blue-300 focus:outline-none flex-1"
              />
            </div>
            <button
              aria-label="Filter insights"
              className="w-12 h-12 rounded-full bg-[#f26522] hover:bg-[#d95316] flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer shadow-md"
            >
              <Funnel size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`shrink-0 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer ${
                i === 0
                  ? "bg-[#f26522] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 space-y-12">
        {articles[0] && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm group hover:shadow-lg transition-all">
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0b2d53] to-[#1e56a0] min-h-[260px] lg:min-h-[340px] p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#f26522] rotate-45 transform translate-x-20 -translate-y-20 opacity-80" />
              <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start">
                {articles[0].tag}
              </span>
              <div className="z-10">
                <span className="text-xs text-sky-200 font-medium block mb-1">Featured</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {articles[0].title}
                </h2>
              </div>
            </div>
            <div className="lg:col-span-7 bg-white p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <CalendarBlank size={13} className="text-[#1e56a0]" />
                    {articles[0].date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[#f26522]" />
                    {articles[0].readTime}
                  </span>
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {articles[0].excerpt}
                </p>
              </div>
              <Link
                href="/insights"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#f26522] hover:text-[#d95316] transition-colors mt-6"
              >
                <span>Read Full Article</span>
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <div
              key={article.title}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#f26522]/40 transition-all flex flex-col"
            >
              <div className="h-44 bg-gradient-to-br from-[#0b2d53] to-[#1e56a0] p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f26522] rotate-45 transform translate-x-16 -translate-y-16 opacity-80" />
                <span className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start">
                  {article.tag}
                </span>
                <div className="flex items-center justify-between text-xs text-blue-100 z-10">
                  <span className="flex items-center gap-1.5">
                    <CalendarBlank size={12} />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {article.readTime}
                  </span>
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
                  href="/insights"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f26522] hover:text-[#d95316] transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button className="inline-flex items-center gap-2 border border-slate-300 hover:border-[#f26522] hover:text-[#f26522] text-sm font-semibold text-slate-600 px-8 py-3 rounded-full transition-all cursor-pointer">
            <span>Load More Articles</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </section>
    </div>
  );
}
