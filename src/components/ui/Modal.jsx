"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75" style={{ backdropFilter: "blur(12px)" }} onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl animate-scale-in"
        style={{
          background: "rgba(10,4,28,0.98)",
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 0 60px rgba(109,40,217,0.2), 0 40px 80px rgba(0,0,0,0.8)",
          backdropFilter: "blur(24px)",
        }}>

        {/* Gradient top edge */}
        <div className="absolute top-0 left-6 right-6 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(236,72,153,0.6), transparent)", backgroundSize: "200% 100%", animation: "aurora-shift 4s ease infinite" }} />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4"
          style={{ borderBottom: "1px solid rgba(99,102,241,0.12)" }}>
          <div>
            <h2 className="font-bold text-base" style={{ color: "var(--t1)" }}>{title}</h2>
            <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>Powered by Google Gemini</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold transition-all"
            style={{ color: "var(--t3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f472b6"; e.currentTarget.style.background = "rgba(236,72,153,0.08)"; e.currentTarget.style.borderColor = "rgba(236,72,153,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--t3)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
            ✕
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        <div className="flex justify-end px-6 py-4" style={{ borderTop: "1px solid rgba(99,102,241,0.10)" }}>
          <button onClick={onClose}
            className="gradient-btn rounded-xl px-5 py-2 text-sm font-bold text-white"
            style={{ borderRadius: 10 }}>
            Close
          </button>
        </div>

        {/* Gradient bottom edge */}
        <div className="absolute bottom-0 left-6 right-6 h-px rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(217,70,239,0.4), transparent)" }} />
      </div>
    </div>
  );
}
