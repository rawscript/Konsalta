"use client";

import { useState, useEffect } from "react";
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
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import {
  CookiePreferences,
  DEFAULT_PREFERENCES,
  getStoredPreferences,
  savePreferences,
} from "@/lib/cookies";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredPreferences();
    if (stored) {
      setPreferences(stored);
      if (stored.timestamp) {
        setLastSaved(new Date(stored.timestamp).toLocaleString());
      }
    }
    setIsLoaded(true);

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookiePreferences>;
      if (customEvent.detail) {
        setPreferences(customEvent.detail);
        if (customEvent.detail.timestamp) {
          setLastSaved(new Date(customEvent.detail.timestamp).toLocaleString());
        }
      }
    };

    window.addEventListener("konsalta_cookie_consent_updated", handleConsentChange);
    return () => {
      window.removeEventListener("konsalta_cookie_consent_updated", handleConsentChange);
    };
  }, []);

  const handleToggle = (key: "analytics" | "functional" | "marketing") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
    const now = new Date().toLocaleString();
    setLastSaved(now);
    setSavedNotification("Your cookie preferences have been saved.");
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allEnabled);
    savePreferences(allEnabled);
    const now = new Date().toLocaleString();
    setLastSaved(now);
    setSavedNotification("All cookies accepted.");
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(onlyEssential);
    savePreferences(onlyEssential);
    const now = new Date().toLocaleString();
    setLastSaved(now);
    setSavedNotification("Non-essential cookies disabled.");
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    savePreferences(DEFAULT_PREFERENCES);
    const now = new Date().toLocaleString();
    setLastSaved(now);
    setSavedNotification("Preferences reset to defaults.");
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const cookieCategories = [
    {
      key: "essential",
      title: "Essential Cookies",
      badge: "Always Active",
      icon: Lock,
      required: true,
      description:
        "These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block these cookies, but parts of the site will not work.",
    },
    {
      key: "analytics",
      title: "Analytics & Performance",
      badge: "Optional",
      icon: SlidersHorizontal,
      required: false,
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to measure and improve the performance of our site — for example, understanding which pages are most visited and how people navigate between them.",
    },
    {
      key: "functional",
      title: "Functional Cookies",
      badge: "Optional",
      icon: CheckCircle,
      required: false,
      description:
        "Functional cookies enable enhanced features and personalisation, such as remembering your language preference or region. They may be set by us or by third-party providers whose services we use on our pages. Disabling these may affect the quality of the experience.",
    },
    {
      key: "marketing",
      title: "Marketing & Targeting",
      badge: "Optional",
      icon: Cookie,
      required: false,
      description:
        "These cookies may be set through our site by our advertising and content partners. They may be used to build a profile of your interests and show you relevant content on other sites. They do not store personal information directly but uniquely identify your browser and device.",
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
              <Cookie size={18} weight="bold" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-sky-300 uppercase">
              KONSALTA / COOKIE PREFERENCES
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white leading-tight tracking-tight mb-4 max-w-3xl">
            Your Privacy,{" "}
            <span className="text-[#f26522]">Your Choice.</span>
          </h1>

          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            We believe in transparency. This page lets you control exactly which
            cookies Konsalta uses on your device — and change your mind at any time.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200/70 pt-2 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} weight="bold" />
              <span>
                {lastSaved ? `Saved: ${lastSaved}` : "Not yet saved"}
              </span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} weight="bold" />
              <span>Active Cookie Storage</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div>
              <span className="text-xs font-semibold text-[#f26522] uppercase tracking-wider block mb-1">
                PREFERENCE DASHBOARD
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2d53]">
                Manage Cookie Settings
              </h2>
              {lastSaved && (
                <span className="text-xs text-slate-500 mt-1 block">
                  Last updated: {lastSaved}
                </span>
              )}
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
              <button
                type="button"
                onClick={handleReset}
                title="Reset to default"
                className="p-2 text-slate-500 hover:text-[#0b2d53] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowCounterClockwise size={16} weight="bold" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {cookieCategories.map((cat) => {
              const isChecked =
                cat.key === "essential"
                  ? true
                  : isLoaded
                  ? preferences[cat.key as "analytics" | "functional" | "marketing"]
                  : false;

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
              <span>Preferences are stored in your browser storage and cookies.</span>
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
              <span>{savedNotification}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] mb-4">
              <Cookie size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-[#0b2d53] mb-2">
              What Are Cookies?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Cookies are small text files placed on your device when you visit a
              website. They are widely used to make sites work efficiently, remember
              your preferences, and provide information to the site owners.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Konsalta only uses cookies that are necessary for the site to function
              or that you have explicitly consented to. We never sell data derived
              from your browsing to third parties.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0b2d53] mb-4">
              <SlidersHorizontal size={22} weight="bold" />
            </div>
            <h3 className="text-lg font-bold text-[#0b2d53] mb-2">
              Managing Cookies in Your Browser
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Most browsers allow you to control cookies through their settings. You
              can block all cookies, delete existing cookies, or set preferences for
              specific sites — independently of the controls on this page.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Note that blocking all cookies may affect the functionality of some
              parts of this site. Your browser settings will override the preferences
              you save here for cookies already stored on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
