"use client";

// Vertex positions [x, y] in a 100×100 viewBox
const N = [
  [50, 8],    // 0  apex
  [36, 14],   // 1  left bump
  [64, 14],   // 2  right bump
  [22, 29],   // 3  left shoulder
  [42, 24],   // 4  inner left
  [58, 24],   // 5  inner right
  [78, 29],   // 6  right shoulder
  [11, 47],   // 7  far left
  [26, 43],   // 8  left mid
  [44, 37],   // 9  center-left
  [50, 35],   // 10 center
  [56, 37],   // 11 center-right
  [74, 43],   // 12 right mid
  [89, 47],   // 13 far right
  [16, 62],   // 14 left lower-mid
  [32, 58],   // 15 left inner lower
  [50, 53],   // 16 center lower-mid
  [68, 58],   // 17 right inner lower
  [84, 62],   // 18 right lower-mid
  [22, 75],   // 19 left lower
  [38, 72],   // 20 left-center lower
  [50, 70],   // 21 center lower
  [62, 72],   // 22 right-center lower
  [78, 75],   // 23 right lower
  [34, 84],   // 24 bottom left
  [50, 87],   // 25 bottom center
  [66, 84],   // 26 bottom right
];

// Wire edges [from, to] — hull + internal triangulation
const EDGES = [
  // Outer hull
  [0,1],[1,3],[3,7],[7,14],[14,19],[19,24],[24,25],[25,26],[26,23],[23,18],[18,13],[13,6],[6,2],[2,0],
  // Top internal
  [0,4],[0,5],[0,10],[1,4],[2,5],[3,4],[3,8],[4,5],[4,9],[4,8],[5,6],[5,11],[5,12],[6,12],[6,13],
  // Mid
  [7,8],[7,14],[8,9],[8,15],[8,14],[9,10],[9,16],[9,15],[10,11],[10,16],[11,12],[11,17],[11,16],[12,13],[12,18],[12,17],[13,18],
  // Lower
  [14,15],[14,19],[15,16],[15,20],[15,19],[16,17],[16,21],[16,20],[17,18],[17,22],[17,21],[18,23],[18,22],
  // Base
  [19,20],[19,24],[20,21],[20,25],[20,24],[21,22],[21,25],[22,23],[22,26],[22,25],[23,26],[24,25],[25,26],
];

// Highlighted node indices with their color (bright nodes)
const BRIGHT_NODES = [
  [0, "#ffffff", 3],    // apex — white bright
  [1, "#00e5ff", 2.2],  [2, "#00e5ff", 2.2],
  [10, "#ffffff", 2.8], // center brightest
  [16, "#ff44cc", 2.2], // center lower — pink
  [25, "#00c8ff", 2.5], // bottom center
  [7, "#8b30ff", 1.8],  [13, "#8b30ff", 1.8],
  [3, "#00c8ff", 1.8],  [6, "#00c8ff", 1.8],
  [4, "#ff44cc", 1.6],  [5, "#ff44cc", 1.6],
  [9, "#00e5ff", 1.6],  [11, "#00e5ff", 1.6],
  [15, "#8b30ff", 1.5], [17, "#8b30ff", 1.5],
  [21, "#00c8ff", 1.8], [19, "#8b30ff", 1.4],
  [23, "#8b30ff", 1.4], [24, "#00c8ff", 1.4],
  [26, "#00c8ff", 1.4],
];

// All other nodes (dim)
const ALL_NODES = N.map((_, i) => i);

// Circuit PCB traces from the base, emanating downward
const TRACES = [
  // Center stem
  [[50,87],[50,100]],
  // Left branch from n24
  [[34,84],[34,95],[18,95],[18,100]],
  // Right branch from n26
  [[66,84],[66,95],[82,95],[82,100]],
  // Far left
  [[50,93],[32,93],[32,100]],
  // Far right
  [[50,93],[68,93],[68,100]],
  // Extra left
  [[18,95],[10,95]],
  // Extra right
  [[82,95],[90,95]],
  // n19 left trace
  [[22,75],[10,75],[10,93]],
  // n23 right trace
  [[78,75],[90,75],[90,93]],
];

// Node dots at circuit trace endpoints
const TRACE_DOTS = [
  [50,100],[18,100],[82,100],[32,100],[68,100],[10,95],[90,95],[10,93],[90,93],
];

export default function BrainLogo({ size = 100, className = "", animate = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Line glow */}
        <filter id="bl-line-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Node glow */}
        <filter id="bl-node-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Strong node glow for bright ones */}
        <filter id="bl-node-bright" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Ambient halo */}
        <filter id="bl-ambient" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        {/* Trace glow */}
        <filter id="bl-trace-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Gradients */}
        <linearGradient id="bl-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c8ff" />
          <stop offset="100%" stopColor="#8b30ff" />
        </linearGradient>
        <radialGradient id="bl-halo" cx="50%" cy="44%" r="50%">
          <stop offset="0%" stopColor="#00aaff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#7b2fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bl-trace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8b30ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ambient halo glow behind brain */}
      <ellipse cx="50" cy="44" rx="44" ry="38" fill="url(#bl-halo)" filter="url(#bl-ambient)" />

      {/* ── Circuit PCB Traces ── */}
      <g filter="url(#bl-trace-glow)">
        {TRACES.map((pts, i) => (
          <polyline
            key={i}
            points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
            stroke="url(#bl-trace)"
            strokeWidth="0.9"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Trace endpoint dots */}
        {TRACE_DOTS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1" fill="#8b30ff" opacity="0.6" />
        ))}
      </g>

      {/* ── Wire Edges ── */}
      <g filter="url(#bl-line-glow)">
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={N[a][0]} y1={N[a][1]}
            x2={N[b][0]} y2={N[b][1]}
            stroke="url(#bl-edge)"
            strokeWidth="0.55"
            opacity="0.45"
          />
        ))}
      </g>

      {/* ── Dim background nodes ── */}
      {ALL_NODES.map((idx) => (
        <circle
          key={idx}
          cx={N[idx][0]}
          cy={N[idx][1]}
          r="0.9"
          fill="#00c8ff"
          opacity="0.3"
        />
      ))}

      {/* ── Bright glowing nodes ── */}
      {BRIGHT_NODES.map(([idx, color, r], i) => (
        <g key={i} filter={r >= 2.5 ? "url(#bl-node-bright)" : "url(#bl-node-glow)"}>
          {/* Outer glow halo */}
          <circle cx={N[idx][0]} cy={N[idx][1]} r={r * 2.2} fill={color} opacity="0.12" />
          {/* Mid glow */}
          <circle cx={N[idx][0]} cy={N[idx][1]} r={r * 1.4} fill={color} opacity="0.3" />
          {/* Core bright dot */}
          <circle cx={N[idx][0]} cy={N[idx][1]} r={r * 0.7} fill={color} opacity="1" />
        </g>
      ))}

      {/* ── Apex pulse ring (animated) ── */}
      {animate && (
        <circle cx="50" cy="8" r="5" stroke="#00e5ff" strokeWidth="0.5" fill="none" opacity="0.5">
          <animate attributeName="r" values="4;9;4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      )}

      {/* ── Center pulse ring ── */}
      {animate && (
        <circle cx="50" cy="35" r="6" stroke="#ff44cc" strokeWidth="0.4" fill="none" opacity="0.4">
          <animate attributeName="r" values="5;12;5" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
