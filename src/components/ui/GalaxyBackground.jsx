"use client";

import { useMemo, forwardRef } from "react";

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; };
}

const GalaxyBackground = forwardRef(function GalaxyBackground(props, ref) {
  const stars = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 80 }, (_, i) => ({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.3 + rng() * 1.4,
      opacity: 0.3 + rng() * 0.7,
      twinkle: 3 + rng() * 5,
      delay: rng() * 8,
      bright: rng() > 0.9,
      color: rng() > 0.7
        ? `hsl(${30 + rng() * 30}, 90%, 80%)`
        : rng() > 0.4
        ? `hsl(${210 + rng() * 60}, 80%, 85%)`
        : "#e8e6f0",
    }));
  }, []);

  const constellations = useMemo(() => {
    const rng = seededRandom(99);
    const lines = [];
    for (let i = 0; i < 6; i++) {
      const cx = 10 + rng() * 80;
      const cy = 10 + rng() * 80;
      const pts = Array.from({ length: 3 + Math.floor(rng() * 2) }, () => ({
        x: cx + (rng() - 0.5) * 18,
        y: cy + (rng() - 0.5) * 18,
      }));
      for (let j = 0; j < pts.length - 1; j++) {
        lines.push({ x1: pts[j].x, y1: pts[j].y, x2: pts[j + 1].x, y2: pts[j + 1].y });
      }
      pts.forEach(p => {
        lines.push({ dot: true, x: p.x, y: p.y });
      });
    }
    return lines;
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0, willChange: "transform", contain: "layout style" }}>

      {/* Base gradient — single div, no blur needed */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 120% 80% at 20% 20%, rgba(15,25,80,0.9) 0%, transparent 55%),
          radial-gradient(ellipse 100% 90% at 80% 80%, rgba(20,10,60,0.85) 0%, transparent 50%),
          radial-gradient(ellipse 80% 60% at 60% 30%, rgba(8,20,65,0.7) 0%, transparent 50%),
          linear-gradient(180deg, #040818 0%, #060a1f 30%, #0a0620 60%, #030014 100%)
        `,
      }} />

      {/* Nebula clouds — using contain for paint isolation */}
      <div className="absolute inset-0" style={{ contain: "strict" }}>
        <div className="absolute rounded-full" style={{
          width: 900, height: 700, top: -180, left: -200,
          background: "radial-gradient(ellipse at 45% 55%, rgba(30,80,180,0.35) 0%, rgba(20,50,140,0.2) 35%, transparent 65%)",
          filter: "blur(80px)",
          animation: "nebula-drift-1 30s ease-in-out infinite",
          willChange: "transform",
        }} />

        <div className="absolute rounded-full" style={{
          width: 800, height: 600, top: "20%", left: "25%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(90,40,160,0.3) 0%, rgba(60,20,120,0.15) 40%, transparent 65%)",
          filter: "blur(90px)",
          animation: "nebula-drift-3 25s ease-in-out infinite",
          willChange: "transform",
        }} />

        <div className="absolute rounded-full" style={{
          width: 700, height: 550, top: "30%", right: -120,
          background: "radial-gradient(ellipse at 40% 50%, rgba(200,120,40,0.28) 0%, rgba(180,80,30,0.15) 35%, rgba(140,50,20,0.06) 55%, transparent 70%)",
          filter: "blur(70px)",
          animation: "nebula-drift-2 28s ease-in-out infinite",
          willChange: "transform",
        }} />

        <div className="absolute rounded-full" style={{
          width: 650, height: 500, bottom: -100, left: "5%",
          background: "radial-gradient(ellipse at 50% 40%, rgba(20,60,150,0.3) 0%, rgba(15,40,100,0.15) 40%, transparent 65%)",
          filter: "blur(85px)",
          animation: "nebula-drift-1 35s ease-in-out infinite reverse",
          willChange: "transform",
        }} />

        <div className="absolute rounded-full" style={{
          width: 400, height: 350, top: "5%", right: "15%",
          background: "radial-gradient(circle, rgba(180,60,160,0.2) 0%, rgba(120,30,120,0.08) 45%, transparent 70%)",
          filter: "blur(60px)",
          animation: "nebula-drift-3 32s ease-in-out infinite reverse",
          willChange: "transform",
        }} />

        <div className="absolute rounded-full" style={{
          width: 500, height: 400, bottom: "10%", right: "5%",
          background: "radial-gradient(circle, rgba(20,130,200,0.18) 0%, rgba(10,80,160,0.08) 40%, transparent 65%)",
          filter: "blur(75px)",
          animation: "nebula-drift-2 38s ease-in-out infinite",
          willChange: "transform",
        }} />
      </div>

      {/* Star SVG layer — lighter filters, fewer elements */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <filter id="sg">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {constellations.map((c, i) =>
          c.dot ? (
            <circle key={`cd-${i}`} cx={`${c.x}%`} cy={`${c.y}%`} r="1.2" fill="rgba(180,200,255,0.35)" />
          ) : (
            <line key={`cl-${i}`} x1={`${c.x1}%`} y1={`${c.y1}%`} x2={`${c.x2}%`} y2={`${c.y2}%`}
              stroke="rgba(120,160,255,0.1)" strokeWidth="0.5" />
          )
        )}

        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={s.color}
            opacity={s.opacity}
            filter={s.bright ? "url(#sg)" : undefined}
          >
            <animate
              attributeName="opacity"
              values={`${s.opacity * 0.35};${s.opacity};${s.opacity * 0.35}`}
              dur={`${s.twinkle}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {stars.filter(s => s.bright).map((s, i) => (
          <g key={`f-${i}`} opacity={s.opacity * 0.5}>
            <line x1={`${s.x - 0.35}%`} y1={`${s.y}%`} x2={`${s.x + 0.35}%`} y2={`${s.y}%`}
              stroke={s.color} strokeWidth="0.3" filter="url(#sg)" />
            <line x1={`${s.x}%`} y1={`${s.y - 0.35}%`} x2={`${s.x}%`} y2={`${s.y + 0.35}%`}
              stroke={s.color} strokeWidth="0.3" filter="url(#sg)" />
          </g>
        ))}
      </svg>

      {/* Fine dust */}
      <div className="absolute inset-0" style={{
        opacity: 0.02,
        backgroundImage: "radial-gradient(circle, rgba(200,200,255,0.8) 0.5px, transparent 0.5px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Shooting stars */}
      {[
        { top: "12%", left: "15%", delay: "0s",   dur: "9s"  },
        { top: "28%", left: "55%", delay: "4s",   dur: "11s" },
        { top: "8%",  left: "72%", delay: "7s",   dur: "13s" },
        { top: "45%", left: "30%", delay: "11s",  dur: "10s" },
      ].map((s, i) => (
        <div key={`ss-${i}`} className="shooting-star"
          style={{
            top: s.top, left: s.left,
            animation: `shooting-star ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
});

export default GalaxyBackground;
