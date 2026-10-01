import React from "react";

export default function MountainPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] overflow-hidden select-none">
      <div
        className="w-full h-full"
        style={{
          clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      >
        <svg
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="65%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>

            <linearGradient id="mountainBack" x1="100" y1="180" x2="300" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="mountainFront" x1="50" y1="260" x2="350" y2="520" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="plainGrad" x1="0" y1="420" x2="0" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a37848" />
              <stop offset="40%" stopColor="#825c34" />
              <stop offset="100%" stopColor="#5c3f1d" />
            </linearGradient>
          </defs>

          <rect width="400" height="600" fill="url(#skyGradient)" />

          <path
            d="M 50 350 L 160 210 L 220 270 L 320 180 L 410 320 L 410 450 L 50 450 Z"
            fill="url(#mountainBack)"
            opacity="0.8"
          />

          <path
            d="M 20 420 L 140 280 L 230 350 L 340 240 L 420 380 L 420 520 L 20 520 Z"
            fill="url(#mountainFront)"
          />

          <path
            d="M 0 450 Q 150 430 400 460 L 400 600 L 0 600 Z"
            fill="url(#plainGrad)"
          />

          <g fill="#2d3748" opacity="0.6">
            <ellipse cx="260" cy="460" rx="35" ry="12" />
            <rect x="256" y="460" width="8" height="24" />
            <ellipse cx="140" cy="490" rx="45" ry="15" />
            <rect x="136" y="490" width="8" height="30" />
            <ellipse cx="330" cy="510" rx="30" ry="10" />
            <rect x="327" y="510" width="6" height="20" />
          </g>
        </svg>
      </div>

      <div
        className="absolute bottom-0 right-0 w-36 h-36 sm:w-48 sm:h-48 bg-[#f26522] pointer-events-none"
        style={{
          clipPath: "polygon(35% 100%, 100% 20%, 100% 100%)",
        }}
      />
    </div>
  );
}
