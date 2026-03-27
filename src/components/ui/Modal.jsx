"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0" style={{ background: "rgba(3,0,14,0.7)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }} onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "rgba(12,8,38,0.95)", border: "1px solid rgba(99,102,241,0.18)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7), 0 0 60px -10px rgba(99,102,241,0.15)" }}>

        {/* Top gradient edge */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.4), transparent)" }} />

        <div className="flex items-start justify-between gap-4 px-6 py-4" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--t1)" }}>{title}</h2>
            <p style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>Details about the active model.</p>
          </div>
          <button onClick={onClose} aria-label="Close modal"
            className="rounded-xl p-2 transition-all"
            style={{ color: "var(--t3)", background: "rgba(99,102,241,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#c4b5fd"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.06)"; e.currentTarget.style.color = "var(--t3)"; }}>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        <div className="flex justify-end gap-2 px-6 py-4" style={{ borderTop: "1px solid rgba(99,102,241,0.1)" }}>
          <button onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.16)", color: "#a5b4fc" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}>
            Close
          </button>
        </div>

        {/* Bottom gradient edge */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />
      </div>
    </div>
  );
}
