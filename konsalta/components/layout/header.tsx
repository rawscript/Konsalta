"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";
import { ArrowRight, List, X } from "@phosphor-icons/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "About Konsalta", href: pathname === "/" ? "#about" : "/#about" },
    { label: "Our Services", href: pathname === "/" ? "#who-we-serve" : "/#who-we-serve" },
    { label: "Our Insights", href: "/insights" },
    { label: "Engage with us", href: pathname === "/" ? "#clients" : "/#clients" },
  ];

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo variant="dark" iconSize={32} />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isInternalAnchor = link.href.startsWith("#");
            if (isInternalAnchor) {
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-[15px] font-medium text-slate-700 hover:text-[#f26522] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-slate-700 hover:text-[#f26522] transition-colors"
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#f26522] hover:bg-[#d95316] text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer ml-3"
          >
            <span>Contact Us</span>
            <ArrowRight size={15} weight="bold" />
          </Link>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-[#f26522] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? <X size={26} weight="bold" /> : <List size={26} weight="bold" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isInternalAnchor = link.href.startsWith("#");
              if (isInternalAnchor) {
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link.href)}
                    className="text-left text-[16px] font-medium text-slate-700 hover:text-[#f26522] py-1 transition-colors"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left text-[16px] font-medium text-slate-700 hover:text-[#f26522] py-1 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f26522] hover:bg-[#d95316] text-white text-[15px] font-medium px-5 py-3 rounded-full transition-all shadow-sm"
              >
                <span>Contact Us</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
