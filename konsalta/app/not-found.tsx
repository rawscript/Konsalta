import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[#f8fafc] py-16">
      <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#1e56a0]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-[#f26522]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-12">
        <span className="mb-4 block text-sm font-bold uppercase tracking-[0.18em] text-[#1e56a0]">
          404 — Page not found
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-[#0b2d53] sm:text-5xl lg:text-6xl">
          This page is not part of the <span className="text-[#f26522]">picture.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          The link may be out of date, or the page may have moved. Return home to explore Konsalta&apos;s work.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex items-center rounded-full bg-[#f26522] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#d95316] hover:shadow-md active:scale-95"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
