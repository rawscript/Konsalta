"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cookie,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Check,
  Info,
  Lock,
} from "@phosphor-icons/react";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    functional: false,
    marketing: false,
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const handleToggle = (key: "analytics" | "functional" | "marketing") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleRejectAll = () => {
    setPreferences({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const cookieCategories = [
    {
      key: "essential",
      title: "Lorem Essential Cookies",
      badge: "Always Active",
      icon: Lock,
      required: true,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
    {
      key: "analytics",
      title: "Dolor Analytics & Performance",
      badge: "Optional",
      icon: SlidersHorizontal,
      required: false,
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
    },
    {
      key: "functional",
      title: "Adipiscing Functional Cookies",
      badge: "Optional",
      icon: CheckCircle,
      required: false,
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.",
    },
    {
      key: "marketing",
      title: "Tempor Marketing & Targeting",
      badge: "Optional",
      icon: Cookie,
      required: false,
      description:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.",
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
              <Cookie size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              LOREM / COOKIES PREFERENCES
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Lorem Ipsum Dolor.{" "}
            <span className="text-[#f26522]">Cookies Preferences.</span>
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
              <span>Consectetur Adipiscing</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-1">
                LOREM PREFERENCE DASHBOARD
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53]">
                Lorem Cookies Management
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#0b2d53] text-white hover:bg-[#123b6b] transition-colors cursor-pointer"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {cookieCategories.map((cat) => {
              const isChecked =
                cat.key === "essential"
                  ? true
                  : preferences[cat.key as "analytics" | "functional" | "marketing"];

              return (
                <div
                  key={cat.key}
                  className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0b2d53] shrink-0 mt-0.5">
                      <cat.icon size={20} weight="bold" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <h3 className="text-base font-bold text-[#0b2d53]">
                          {cat.title}
                        </h3>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            cat.required
                              ? "bg-slate-200 text-slate-700"
                              : isChecked
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200/60 text-slate-500"
                          }`}
                        >
                          {cat.required ? "Always Active" : isChecked ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1 md:pt-0 self-end md:self-auto">
                    {cat.required ? (
                      <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center px-1 cursor-not-allowed opacity-80">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-xs flex items-center justify-center">
                          <Lock size={10} weight="bold" className="text-slate-500" />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(cat.key as "analytics" | "functional" | "marketing")
                        }
                        aria-label={`Toggle ${cat.title}`}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                          isChecked ? "bg-[#f26522]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                            isChecked ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info size={16} weight="bold" className="text-[#0b2d53] shrink-0" />
              <span>Lorem ipsum dolor sit amet preferences stored locally.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#f26522] hover:bg-[#d95316] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check size={14} weight="bold" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>

          {savedNotification && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-emerald-600" />
              <span>Lorem ipsum dolor sit amet preferences saved successfully.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] mb-4">
              <Cookie size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-[#0b2d53] mb-2">
              Lorem Ipsum What Are Cookies
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur excepteur sint occaecat.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] mb-4">
              <SlidersHorizontal size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-[#0b2d53] mb-2">
              Dolor Sit Browser Controls
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae
              ab illo inventore veritatis.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
              fugit sed quia consequuntur magni dolores eos qui ratione.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
