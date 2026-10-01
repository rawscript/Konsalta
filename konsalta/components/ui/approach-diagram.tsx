"use client";

import React from "react";

export default function ApproachDiagram() {
  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto flex items-center justify-center select-none">
      <svg
        viewBox="0 0 560 560"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="280"
          cy="280"
          r="150"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          fill="none"
        />

        <g filter="drop-shadow(0 6px 14px rgba(11, 45, 83, 0.08))">
          <circle cx="280" cy="280" r="46" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          <text
            x="280"
            y="273"
            textAnchor="middle"
            fill="#0b2d53"
            fontSize="14"
            fontWeight="700"
            fontFamily="inherit"
          >
            Lorem
          </text>
          <text
            x="280"
            y="292"
            textAnchor="middle"
            fill="#0b2d53"
            fontSize="14"
            fontWeight="700"
            fontFamily="inherit"
          >
            Ipsum
          </text>
        </g>

        <g>
          <circle cx="280" cy="130" r="21" fill="#0b2d53" />
          <g transform="translate(269, 119)" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="9" cy="9" r="6" />
            <line x1="13.5" y1="13.5" x2="19" y2="19" />
          </g>
          <text x="280" y="80" textAnchor="middle" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            1. Lorem ipsum
          </text>
          <text x="280" y="94" textAnchor="middle" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            dolor
          </text>
        </g>

        <g>
          <circle cx="397" cy="186" r="21" fill="#f26522" />
          <g transform="translate(386, 175)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M16 17v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 15.5V17" />
            <circle cx="10" cy="6.5" r="3.5" />
            <path d="M18 14.5a3 3 0 0 0-2-2.8" />
            <path d="M15 4a3 3 0 0 1 0 5" />
          </g>
          <text x="430" y="182" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            2. Consectetur
          </text>
          <text x="430" y="196" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            adipiscing
          </text>
        </g>

        <g>
          <circle cx="426" cy="313" r="21" fill="#0b2d53" />
          <g transform="translate(415, 302)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M5 3h8l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
            <polyline points="13 3 13 8 18 8" />
            <line x1="7" y1="12" x2="15" y2="12" />
            <line x1="7" y1="16" x2="13" y2="16" />
          </g>
          <text x="458" y="311" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            3. Tempor
          </text>
          <text x="458" y="325" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            incididunt
          </text>
        </g>

        <g>
          <circle cx="345" cy="415" r="21" fill="#f26522" />
          <g transform="translate(334, 404)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </g>
          <text x="375" y="420" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            4. Labore et
          </text>
          <text x="375" y="434" textAnchor="start" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            dolore
          </text>
        </g>

        <g>
          <circle cx="215" cy="415" r="21" fill="#0b2d53" />
          <g transform="translate(204, 404)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <circle cx="11" cy="11" r="3" />
            <path d="M11 2v2m0 14v2m-9-9h2m14 0h2m-2.8-6.2l-1.4 1.4m-9.6 9.6l-1.4 1.4m0-12.4l1.4 1.4m9.6 9.6l1.4 1.4" />
          </g>
          <text x="215" y="458" textAnchor="middle" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            5. Magna aliqua
          </text>
          <text x="215" y="472" textAnchor="middle" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            enim
          </text>
        </g>

        <g>
          <circle cx="134" cy="313" r="21" fill="#f26522" />
          <g transform="translate(123, 302)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <line x1="18" y1="18" x2="18" y2="9" />
            <line x1="12" y1="18" x2="12" y2="13" />
            <line x1="6" y1="18" x2="6" y2="16" />
            <path d="M4 11l4-4 4 3 6-6" />
            <polyline points="14 4 18 4 18 8" />
          </g>
          <text x="104" y="311" textAnchor="end" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            6. Minim veniam
          </text>
          <text x="104" y="325" textAnchor="end" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            quis
          </text>
        </g>

        <g>
          <circle cx="163" cy="186" r="21" fill="#0b2d53" />
          <g transform="translate(152, 175)" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M17 10.5a5.5 5.5 0 0 0-11 0c0 1.5.6 2.9 1.6 3.9L7 17l3.2-1.3c.6.2 1.2.3 1.8.3a5.5 5.5 0 0 0 5-5.5z" />
            <line x1="9" y1="9.5" x2="13" y2="9.5" />
            <line x1="9" y1="12" x2="12" y2="12" />
          </g>
          <text x="133" y="182" textAnchor="end" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            7. Nostrud
          </text>
          <text x="133" y="196" textAnchor="end" fill="#0b2d53" fontSize="11" fontWeight="700" fontFamily="inherit">
            ullamco
          </text>
        </g>
      </svg>
    </div>
  );
}
