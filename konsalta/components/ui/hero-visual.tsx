import React from "react";

export default function HeroVisual() {
  return (
    <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] xl:h-[750px] flex items-end justify-center lg:justify-end select-none">
      <div className="absolute inset-0 bg-radial from-sky-100/50 via-slate-50/20 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full h-full flex items-end justify-center lg:justify-end">
        <img
          src="/hero.png"
          alt="Konsalta Leadership"
          className="h-full max-h-[500px] sm:max-h-[600px] lg:max-h-[670px] xl:max-h-[740px] w-auto object-contain drop-shadow-2xl select-none"
        />
      </div>
    </div>
  );
}
