import React from "react";
import Image from "next/image";

export default function HeroVisual() {
  return (
    <div
      className="relative w-full h-full min-h-[340px] sm:min-h-[460px] lg:min-h-[660px] overflow-hidden select-none"
      role="img"
      aria-label="Konsalta Leadership Visual"
    >
      <Image
        src="/hero.jpg"
        alt="Konsalta Leadership"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-cover object-[center_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/70 via-25% to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 via-15% to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#f8fafc] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f8fafc]/40 to-transparent pointer-events-none" />
    </div>
  );
}
