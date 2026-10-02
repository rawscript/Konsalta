import React from "react";
import Image from "next/image";

export default function MountainPlaceholder() {
  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      role="img"
      aria-label="Konsalta decorative chevron visual"
    >
      <div
        className="absolute top-0 right-0 w-full h-[51%] overflow-hidden"
        style={{
          clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 68% 100%)",
        }}
      >
        <Image
          src="/halfChevron.jpg"
          alt="Landscape"
          fill
          sizes="(max-width: 1024px) 100vw, 460px"
          className="object-cover object-center"
        />
        <div className="absolute inset-y-0 left-0 w-20 sm:w-28 lg:w-36 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-10 sm:h-14 lg:h-16 bg-gradient-to-b from-[#f4f7fa]/70 to-transparent pointer-events-none" />
      </div>

      <div
        className="absolute bottom-0 right-0 w-full h-[51%] bg-[#f26522] shadow-sm transition-all"
        style={{
          clipPath: "polygon(68% 0%, 100% 0%, 100% 100%, 15% 100%)",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-20 sm:w-28 lg:w-36 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-10 sm:h-14 lg:h-16 bg-gradient-to-t from-[#f4f7fa]/70 to-transparent pointer-events-none" />
      </div>

      <div className="absolute inset-y-0 left-0 w-16 sm:w-24 lg:w-32 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
    </div>
  );
}
