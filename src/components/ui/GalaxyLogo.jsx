"use client";

import { useMemo } from "react";

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

const p4 = (n) => Math.round(n * 1e4) / 1e4;

export default function GalaxyLogo({ size = 40, animate = true }) {
  const r = size / 2;
  const cx = r, cy = r;

  const RINGS = [
    { rx: p4(r * 0.72), ry: p4(r * 0.18), rot: -25, color: "#818cf8", w: 1.2, dash: "3,5" },
    { rx: p4(r * 0.60), ry: p4(r * 0.14), rot: 15,  color: "#a78bfa", w: 1.0, dash: "2,4" },
    { rx: p4(r * 0.85), ry: p4(r * 0.22), rot: -55, color: "#c084fc", w: 0.8, dash: "4,6" },
  ];

  const STARS = useMemo(() => {
    const rng = seededRandom(71);
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + i * 0.3;
      const dist = r * (0.25 + rng() * 0.62);
      return {
        x: p4(cx + Math.cos(angle) * dist * (0.7 + 0.3 * Math.cos(i))),
        y: p4(cy + Math.sin(angle) * dist * (0.6 + 0.4 * Math.sin(i * 0.7))),
        r: p4(0.5 + rng() * 1.2),
        color: ["#e0e7ff", "#c7d2fe", "#ddd6fe", "#fbcfe8", "#a5f3fc"][i % 5],
        delay: i * 0.3,
      };
    });
  }, [r, cx, cy]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gl-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="1" />
          <stop offset="30%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gl-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter id="gl-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="gl-star-glow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer halo */}
      <circle cx={cx} cy={cy} r={p4(r * 0.9)} fill="url(#gl-halo)" opacity={0.5}>
        {animate && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="40s" repeatCount="indefinite" />}
      </circle>

      {/* Orbital rings */}
      {RINGS.map((ring, i) => (
        <ellipse
          key={i}
          cx={cx} cy={cy}
          rx={ring.rx} ry={ring.ry}
          stroke={ring.color}
          strokeWidth={ring.w}
          strokeDasharray={ring.dash}
          fill="none"
          opacity={0.55}
          transform={`rotate(${ring.rot} ${cx} ${cy})`}
          filter="url(#gl-star-glow)"
        >
          {animate && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`${ring.rot} ${cx} ${cy}`}
              to={`${ring.rot + (i % 2 === 0 ? 360 : -360)} ${cx} ${cy}`}
              dur={`${18 + i * 6}s`}
              repeatCount="indefinite"
            />
          )}
        </ellipse>
      ))}

      {/* Stars scattered around */}
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.color} opacity={0.7} filter="url(#gl-star-glow)">
          {animate && (
            <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + s.delay * 0.2}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          )}
        </circle>
      ))}

      {/* Core glow */}
      <circle cx={cx} cy={cy} r={p4(r * 0.22)} fill="url(#gl-core)" filter="url(#gl-glow)">
        {animate && <animate attributeName="r" values={`${p4(r * 0.18)};${p4(r * 0.25)};${p4(r * 0.18)}`} dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Bright center dot */}
      <circle cx={cx} cy={cy} r={p4(r * 0.06)} fill="#e0e7ff" opacity={0.95} />
    </svg>
  );
}
