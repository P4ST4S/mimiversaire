"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Centre = 88. Bougie du milieu plus haute pour l'effet classique.
const CANDLES = [
  { x: 68,  candleY: 20, candleH: 22, flameY: 7 },
  { x: 88,  candleY: 15, candleH: 27, flameY: 2 },
  { x: 108, candleY: 20, candleH: 22, flameY: 7 },
];

export default function BirthdayCake() {
  const flamesRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    const flames = flamesRef.current?.querySelectorAll(".flame-inner");
    if (!flames) return;

    flames.forEach((flame, i) => {
      gsap.to(flame, {
        skewX: 9,
        scaleX: 0.8,
        scaleY: 1.15,
        duration: 0.12 + i * 0.04,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });
      gsap.to(flame, {
        opacity: 0.72,
        duration: 0.20 + i * 0.06,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: i * 0.08,
      });
      gsap.to(flame, {
        y: -2.5,
        duration: 0.32 + i * 0.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    });
  });

  return (
    <svg
      viewBox="0 0 176 155"
      width="auto"
      height="1em"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.3em" }}
    >
      <defs>
        <radialGradient id="glowA" cx="50%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#fff9b0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowB" cx="50%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#fff9b0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Étage BAS ── */}
      <rect x="5"  y="105" width="166" height="46" rx="8" fill="#c8a0d8" />
      <rect x="5"  y="120" width="166" height="7"  fill="#b078c8" opacity="0.45" />
      {[20, 46, 72, 98, 124, 150].map((cx) => (
        <circle key={cx} cx={cx} cy="138" r="3.5" fill="white" opacity="0.45" />
      ))}
      {/* Glaçage étage bas */}
      <path
        d="M5 110 Q18 121 31 110 Q44 99 57 110 Q70 121 83 110 Q96 99 109 110 Q122 121 135 110 Q148 99 161 110 Q168 116 171 110 L171 105 Q158 94 145 105 Q132 116 119 105 Q106 94 93 105 Q80 116 67 105 Q54 94 41 105 Q28 116 15 105 Q8 99 5 105 Z"
        fill="white" opacity="0.8"
      />

      {/* ── Étage MILIEU ── */}
      <rect x="22" y="66"  width="132" height="43" rx="7" fill="#e0aaee" />
      <rect x="22" y="80"  width="132" height="6"  fill="#c880e0" opacity="0.4" />
      {[36, 62, 88, 114, 140].map((cx) => (
        <circle key={cx} cx={cx} cy="98" r="3" fill="white" opacity="0.45" />
      ))}
      {/* Glaçage étage milieu */}
      <path
        d="M22 71 Q35 82 48 71 Q61 60 74 71 Q87 82 100 71 Q113 60 126 71 Q139 82 148 71 Q152 66 154 66 L22 66 Z"
        fill="white" opacity="0.8"
      />

      {/* ── Étage HAUT ── */}
      <rect x="44" y="38"  width="88"  height="32" rx="6" fill="#f0c8ff" />
      <rect x="44" y="50"  width="88"  height="5"  fill="#d898e8" opacity="0.4" />
      {/* Glaçage étage haut */}
      <path
        d="M44 43 Q55 53 66 43 Q77 33 88 43 Q99 53 110 43 Q121 33 132 43 L132 38 L44 38 Z"
        fill="white" opacity="0.8"
      />

      {/* ── Bougies ── */}
      {CANDLES.map(({ x, candleY, candleH }) => (
        <rect
          key={x}
          x={x - 5}
          y={candleY}
          width="10"
          height={candleH}
          rx="3"
          fill="#88a2ee"
        />
      ))}

      {/* Mèches */}
      {CANDLES.map(({ x, candleY }) => (
        <line
          key={`wick-${x}`}
          x1={x} y1={candleY}
          x2={x} y2={candleY - 4}
          stroke="#555"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* ── Flammes ── */}
      <g ref={flamesRef}>
        {CANDLES.map(({ x, flameY }, i) => (
          <g key={`flame-${i}`}>
            {/* halo */}
            <ellipse cx={x} cy={flameY + 9} rx="11" ry="11"
              fill={`url(#glow${i % 2 === 0 ? "A" : "B"})`} />
            {/* flamme extérieure */}
            <path
              className="flame-inner"
              d={`M${x} ${flameY - 2} C${x+7} ${flameY+5} ${x+6} ${flameY+14} ${x} ${flameY+16} C${x-6} ${flameY+14} ${x-7} ${flameY+5} ${x} ${flameY-2}Z`}
              fill="#ffb347"
              style={{ transformOrigin: `${x}px ${flameY + 16}px` }}
            />
            {/* cœur */}
            <path
              className="flame-inner"
              d={`M${x} ${flameY+3} C${x+3} ${flameY+7} ${x+3} ${flameY+13} ${x} ${flameY+15} C${x-3} ${flameY+13} ${x-3} ${flameY+7} ${x} ${flameY+3}Z`}
              fill="#fff176"
              style={{ transformOrigin: `${x}px ${flameY + 15}px` }}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
