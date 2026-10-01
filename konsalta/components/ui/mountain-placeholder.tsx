import React from "react";

export default function MountainPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[540px] overflow-hidden select-none">
      <div
        className="absolute top-0 right-0 w-full h-[51%] overflow-hidden"
        style={{
          clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 68% 100%)",
        }}
      >
        <img
          src="/halfChevron.jpg"
          alt="Landscape"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#f4f7fa]/70 to-transparent pointer-events-none" />
      </div>

      <div
        className="absolute bottom-0 right-0 w-full h-[51%] bg-[#f26522] shadow-sm"
        style={{
          clipPath: "polygon(68% 0%, 100% 0%, 100% 100%, 15% 100%)",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#f4f7fa]/70 to-transparent pointer-events-none" />
      </div>

      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f4f7fa] to-transparent pointer-events-none" />
    </div>
  );
}
