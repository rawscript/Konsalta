import React from "react";

export default function ContentVisual() {
  return (
    <div className="relative w-full aspect-21/9 min-h-[300px] sm:min-h-[420px] rounded-2xl overflow-hidden select-none border border-slate-200/80 shadow-sm">
      <svg
        viewBox="0 0 1000 440"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgCanvas" x1="0" y1="0" x2="1000" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0b2d53" />
            <stop offset="45%" stopColor="#123b6b" />
            <stop offset="100%" stopColor="#061d38" />
          </linearGradient>

          <linearGradient id="curveGrad1" x1="200" y1="0" x2="800" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f26522" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1e56a0" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="curveGrad2" x1="100" y1="440" x2="900" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f26522" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="glowPoint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f26522" />
          </linearGradient>
        </defs>

        <rect width="1000" height="440" fill="url(#bgCanvas)" />

        <g opacity="0.15" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 6">
          <line x1="0" y1="80" x2="1000" y2="80" />
          <line x1="0" y1="160" x2="1000" y2="160" />
          <line x1="0" y1="240" x2="1000" y2="240" />
          <line x1="0" y1="320" x2="1000" y2="320" />
          <line x1="0" y1="400" x2="1000" y2="400" />
          <line x1="200" y1="0" x2="200" y2="440" />
          <line x1="400" y1="0" x2="400" y2="440" />
          <line x1="600" y1="0" x2="600" y2="440" />
          <line x1="800" y1="0" x2="800" y2="440" />
        </g>

        <path
          d="M -50 400 Q 250 120 500 240 T 1050 80 L 1050 440 L -50 440 Z"
          fill="url(#curveGrad1)"
          opacity="0.75"
        />

        <path
          d="M -50 440 Q 300 280 600 360 T 1050 200 L 1050 440 L -50 440 Z"
          fill="url(#curveGrad2)"
          opacity="0.85"
        />

        <g stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" fill="none">
          <circle cx="340" cy="180" r="8" />
          <circle cx="580" cy="270" r="10" />
          <circle cx="750" cy="190" r="6" />
          <line x1="340" y1="180" x2="580" y2="270" strokeDasharray="4 4" />
          <line x1="580" y1="270" x2="750" y2="190" strokeDasharray="4 4" />
        </g>

        <circle cx="340" cy="180" r="4" fill="#f26522" />
        <circle cx="580" cy="270" r="5" fill="#38bdf8" />
        <circle cx="750" cy="190" r="3.5" fill="#f26522" />

        <polygon points="880,0 1000,0 1000,120" fill="#f26522" opacity="0.9" />
      </svg>

      <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-medium">
        Lorem ipsum dolor sit amet • Consectetur adipiscing
      </div>
    </div>
  );
}
