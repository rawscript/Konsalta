"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "@phosphor-icons/react";
import {
  CookiePreferences,
  hasUserConsented,
  savePreferences,
} from "@/lib/cookies";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasUserConsented()) {
      setIsVisible(true);
    }

    const handleConsentChange = () => {
      setIsVisible(false);
    };

    window.addEventListener("konsalta_cookie_consent_updated", handleConsentChange);
    return () => {
      window.removeEventListener("konsalta_cookie_consent_updated", handleConsentChange);
    };
  }, []);

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    savePreferences(allEnabled);
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    savePreferences(onlyEssential);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 bg-[#041a33]/95 backdrop-blur-md text-white p-5 rounded-2xl border border-slate-700/80 shadow-2xl transition-all"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#0b2d53] text-[#f26522] flex items-center justify-center shrink-0 mt-0.5 border border-slate-700/60">
          <Cookie size={20} weight="bold" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-1">
            Lorem Cookie Notice
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRejectNonEssential}
          aria-label="Dismiss cookie notice"
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X size={16} weight="bold" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <Link
          href="/cookies"
          className="text-xs text-[#f26522] hover:underline font-semibold"
        >
          Manage Preferences
        </Link>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f26522] hover:bg-[#d95316] text-white transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
