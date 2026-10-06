import styles from "./hero-visual.module.css";

type Signal = readonly [number, number, number];
type Outcome = readonly [number, number, number];

const SIGNALS: readonly Signal[] = [
  [82, 198, 0], [126, 292, 0.7], [72, 408, 1.4], [134, 498, 2.1],
];

const OUTCOMES: readonly Outcome[] = [
  [468, 212, 0.4], [496, 330, 1.1], [456, 454, 1.8], [382, 550, 2.5],
];

export default function HeroVisual() {
  return (
    <div className={`${styles.visual} relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[660px] overflow-hidden select-none bg-[#f8fafc]`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/65 via-[18%] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/25 via-[8%] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#f8fafc] to-transparent z-20 pointer-events-none" />

      <svg viewBox="0 0 560 680" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <circle cx="300" cy="355" r="238" fill="#1e56a0" opacity="0.045" />
        <circle cx="300" cy="355" r="178" fill="none" stroke="#1e56a0" strokeWidth="1" strokeDasharray="3 9" opacity="0.16" />
        <circle cx="300" cy="355" r="260" fill="none" stroke="#0b2d53" strokeWidth="1" strokeDasharray="2 13" opacity="0.1" />

        {SIGNALS.map(([x, y, delay], index) => (
          <g key={`${x}-${y}`} className={styles.signal} style={{ animationDelay: `${delay}s` }}>
            <rect x={x - 22} y={y - 16} width="44" height="32" rx="7" fill="#ffffff" stroke="#d8e1ec" />
            <rect x={x - 12} y={y - 6} width={index % 2 === 0 ? 24 : 17} height="3" rx="1.5" fill="#1e56a0" opacity="0.72" />
            <rect x={x - 12} y={y + 2} width={index % 3 === 0 ? 15 : 22} height="3" rx="1.5" fill="#f26522" opacity="0.75" />
          </g>
        ))}

        {SIGNALS.map(([x, y, delay], index) => {
          const endY = 270 + index * 49;
          const length = Math.hypot(188 - x, endY - y);
          return (
            <path key={`in-${x}-${y}`} d={`M ${x + 22} ${y} C 142 ${y}, 152 ${endY}, 188 ${endY}`}
              className={styles.inputPath} fill="none" stroke="#1e56a0" strokeWidth="1.15"
              strokeDasharray={length} strokeDashoffset={length} style={{ animationDelay: `${delay}s` }} />
          );
        })}



        <g className={styles.brief}>
          <rect x="188" y="213" width="218" height="274" rx="22" fill="#0b2d53" opacity="0.1" transform="translate(7 10)" />
          <rect x="188" y="213" width="218" height="274" rx="22" fill="#ffffff" stroke="#dce5ee" />
          <rect x="212" y="239" width="72" height="8" rx="4" fill="#1e56a0" opacity="0.9" />
          <rect x="212" y="259" width="132" height="5" rx="2.5" fill="#cad6e3" />
          <rect x="212" y="270" width="105" height="5" rx="2.5" fill="#e2e9f0" />
          <rect x="212" y="301" width="170" height="70" rx="12" fill="#f1f6fb" />
          <path d="M228 350 C247 338 253 343 267 326 S293 337 308 317 S334 325 354 306" fill="none" stroke="#f26522" strokeWidth="3" strokeLinecap="round" />
          <circle cx="267" cy="326" r="4" fill="#f26522" />
          <circle cx="308" cy="317" r="4" fill="#f26522" />
          <circle cx="354" cy="306" r="4" fill="#f26522" />
          <rect x="212" y="396" width="118" height="5" rx="2.5" fill="#cad6e3" />
          <rect x="212" y="407" width="151" height="5" rx="2.5" fill="#e2e9f0" />
          <rect x="212" y="438" width="84" height="24" rx="12" fill="#f26522" />
          <circle cx="312" cy="450" r="7" fill="#1e56a0" opacity="0.85" />
          <circle cx="333" cy="450" r="7" fill="#1e56a0" opacity="0.55" />
          <circle cx="354" cy="450" r="7" fill="#1e56a0" opacity="0.3" />
        </g>

        {OUTCOMES.map(([x, y, delay], index) => {
          const startX = 406;
          const startY = 276 + index * 53;
          const length = Math.hypot(x - startX, y - startY);
          return (
            <path key={`out-${x}-${y}`} d={`M ${startX} ${startY} C 438 ${startY}, 432 ${y}, ${x - 19} ${y}`}
              className={styles.outcomePath} fill="none" stroke={index === 1 ? "#f26522" : "#1e56a0"} strokeWidth="1.35"
              strokeDasharray={length} strokeDashoffset={length} style={{ animationDelay: `${delay}s` }} />
          );
        })}

        {OUTCOMES.map(([x, y, delay], index) => (
          <g key={`outcome-${x}-${y}`} className={styles.outcome} style={{ animationDelay: `${delay}s` }}>
            <circle cx={x} cy={y} r="20" fill="#ffffff" stroke={index === 1 ? "#f26522" : "#b9cce0"} strokeWidth="1.3" />
            <circle cx={x} cy={y} r="9" fill={index === 1 ? "#f26522" : "#1e56a0"} opacity="0.9" />
            {index === 0 && <path d={`M ${x - 4} ${y + 3} l 4 4 l 7 -9`} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {index === 1 && <path d={`M ${x - 6} ${y + 5} l 5 -6 l 4 3 l 7 -9`} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
            {index === 2 && <circle cx={x} cy={y} r="3" fill="#ffffff" />}
            {index === 3 && <path d={`M ${x - 5} ${y} h 10 M ${x} ${y - 5} v 10`} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />}
          </g>
        ))}

        <g className={styles.accents}>
          <circle cx="132" cy="122" r="4" fill="#f26522" />
          <circle cx="455" cy="112" r="5" fill="none" stroke="#1e56a0" strokeWidth="1.2" />
          <path d="M454 575 l10 10 l-10 10 l-10 -10 Z" fill="none" stroke="#f26522" strokeWidth="1.2" />
          <path d="M95 560 l8 8 l-8 8 l-8 -8 Z" fill="#1e56a0" opacity="0.55" />
        </g>
      </svg>
    </div>
  );
}
