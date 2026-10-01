import React from "react";

export default function LeavesPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[260px] lg:min-h-[300px] overflow-hidden select-none">
      <div
        className="w-full h-full"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 68% 100%, 0% 100%)",
        }}
      >
        <svg
          viewBox="0 0 320 300"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="leafGrad1" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#065f46" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            <linearGradient id="leafGrad2" x1="50" y1="20" x2="250" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="leafGrad3" x1="20" y1="150" x2="280" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>

            <linearGradient id="sunbeam" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="320" height="300" fill="#022c22" />

          <path
            d="M 10 320 Q 80 140 220 70 Q 280 180 150 290 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M 50 10 Q 180 40 260 170 Q 180 260 100 160 Z"
            fill="url(#leafGrad2)"
            opacity="0.9"
          />
          <path
            d="M 0 100 Q 120 120 190 260 Q 90 310 10 230 Z"
            fill="url(#leafGrad3)"
            opacity="0.85"
          />

          <g stroke="#a7f3d0" strokeWidth="1.5" strokeOpacity="0.6" fill="none">
            <path d="M 50 10 Q 180 110 260 170" />
            <path d="M 120 70 Q 160 60 190 65" />
            <path d="M 150 100 Q 190 105 220 110" />
            <path d="M 180 130 Q 210 145 235 155" />
          </g>

          <polygon points="0,0 120,0 240,300 0,300" fill="url(#sunbeam)" />
        </svg>
      </div>
    </div>
  );
}
