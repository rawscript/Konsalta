"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import {
  ArrowRight,
  LinkedinLogo,
  InstagramLogo,
  Globe,
  Lock,
  Cookie,
  FileText,
  PersonSimple,
} from "@phosphor-icons/react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const pathname = usePathname();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const navLinks = [
    { label: "About Konsalta", href: pathname === "/" ? "#about" : "/#about" },
    { label: "Our Services", href: pathname === "/" ? "#who-we-serve" : "/#who-we-serve" },
    { label: "Our Insights", href: "/insights" },
    { label: "Engage with us", href: pathname === "/" ? "#clients" : "/#clients" },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" className="w-full bg-[#041a33] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14">
          <div className="lg:col-span-4 flex items-start">
            <Link href="/" className="inline-block">
              <Logo variant="light" iconSize={34} />
            </Link>
          </div>

          <div className="lg:col-span-3">
            <ul className="space-y-3">
              {navLinks.map((link) => {
                const isInternalAnchor = link.href.startsWith("#");
                return (
                  <li key={link.label}>
                    {isInternalAnchor ? (
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-[14px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[14px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <span className="text-[14px] font-medium text-slate-200 block mb-3">
              Subscribe to out Newsletter
            </span>
            <form onSubmit={handleSubmit} className="flex items-center max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Coming Soon..."
                required
                className="bg-[#092242] border border-slate-700/80 rounded-l-md px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#f26522] flex-1"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-[#f26522] hover:bg-[#d95316] text-white px-3.5 py-2.5 rounded-r-md transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-emerald-400 mt-2 block">
                You&apos;re subscribed. We&apos;ll be in touch soon.
              </span>
            )}
          </div>

          <div className="lg:col-span-2">
            <ul className="space-y-3.5 text-[14px] text-slate-300">
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <LinkedinLogo size={18} weight="fill" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <InstagramLogo size={18} weight="fill" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.konsaltahub.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Globe size={18} weight="regular" />
                  <span>www.konsaltahub.org</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Lock size={13} weight="bold" />
              <span>Privacy Policy</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link
              href="/cookies"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <Cookie size={13} weight="bold" />
              <span>Cookies Preferences</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <FileText size={13} weight="bold" />
              <span>Terms of Use</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link
              href="/accessibility"
              className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"
            >
              <PersonSimple size={14} weight="bold" />
              <span>Accessibility Statement</span>
            </Link>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            <span>© Konsalta 2026. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
