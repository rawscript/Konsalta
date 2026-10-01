"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  EnvelopeSimple,
  Phone,
  MapPin,
  Clock,
  LinkedinLogo,
  InstagramLogo,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "@phosphor-icons/react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.message) {
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };

  const contactCards = [
    {
      title: "General Inquiries",
      detail: "hello@konsalta.org",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    },
    {
      title: "Advisory Services",
      detail: "advisory@konsalta.org",
      description: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    },
    {
      title: "Partnerships",
      detail: "partners@konsalta.org",
      description: "Ut enim ad minim veniam quis nostrud exercitation.",
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
          <span className="text-[#0b2d53] font-medium">Contact Us</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24">
        <header className="max-w-3xl mb-14">
          <span className="text-xs sm:text-sm font-bold tracking-[0.18em] text-[#1e56a0] uppercase block mb-3">
            LOREM / IPSUM / CONTACT
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-[#0b2d53] leading-tight tracking-tight mb-5">
            Lorem Ipsum Dolor Sit Amet.{" "}
            <span className="text-[#f26522] block sm:inline">
              Consectetur Adipiscing.
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 bg-[#072448] text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#f26522] rounded-full blur-3xl opacity-20 pointer-events-none" />
            <div
              className="absolute bottom-0 right-0 w-24 h-24 bg-[#f26522] pointer-events-none opacity-80"
              style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
            />

            <span className="text-xs font-bold tracking-widest text-sky-300 uppercase block mb-3">
              GET IN TOUCH
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Lorem Ipsum Dolor
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="space-y-6 pb-8 border-b border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#f26522] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <EnvelopeSimple size={20} weight="bold" />
                </div>
                <div>
                  <span className="text-xs text-blue-200 block">Email us</span>
                  <a
                    href="mailto:hello@konsalta.org"
                    className="text-sm sm:text-base font-semibold text-white hover:text-[#f26522] transition-colors"
                  >
                    hello@konsalta.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#f26522] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Phone size={20} weight="bold" />
                </div>
                <div>
                  <span className="text-xs text-blue-200 block">Call us</span>
                  <a
                    href="tel:+254700000000"
                    className="text-sm sm:text-base font-semibold text-white hover:text-[#f26522] transition-colors"
                  >
                    +254 700 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#f26522] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <MapPin size={20} weight="bold" />
                </div>
                <div>
                  <span className="text-xs text-blue-200 block">Location</span>
                  <span className="text-sm sm:text-base font-semibold text-white block">
                    Nairobi, Kenya • Lagos, Nigeria
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#f26522] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Clock size={20} weight="bold" />
                </div>
                <div>
                  <span className="text-xs text-blue-200 block">Working Hours</span>
                  <span className="text-sm sm:text-base font-semibold text-white block">
                    Monday - Friday: 8:00 AM - 5:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-4">
                Connect with our network
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f26522] text-white flex items-center justify-center transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinLogo size={18} weight="fill" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f26522] text-white flex items-center justify-center transition-all"
                  aria-label="Instagram"
                >
                  <InstagramLogo size={18} weight="fill" />
                </a>
                <a
                  href="https://www.konsaltahub.org"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f26522] text-white flex items-center justify-center transition-all"
                  aria-label="Website"
                >
                  <Globe size={18} weight="regular" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            <span className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#1e56a0] uppercase block mb-2">
              SEND A MESSAGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b2d53] mb-3">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
                <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
                <span>Lorem ipsum dolor sit amet! Your message has been sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Lorem"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#f26522] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Ipsum"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#f26522] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="lorem@example.com"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#f26522] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Subject / Area of Interest
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Lorem ipsum advisory"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#f26522] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Your Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#f26522] focus:bg-white transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#f26522] hover:bg-[#d95316] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Send Message</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 pt-14 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200/80"
              >
                <h3 className="text-base font-bold text-[#0b2d53] mb-1">
                  {card.title}
                </h3>
                <span className="text-sm font-semibold text-[#f26522] block mb-2">
                  {card.detail}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
