"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import Modal from "@/components/ui/Modal";
import BrainLogo from "@/components/ui/BrainLogo";

export default function ChatHeader({ onMenuToggle, onNewChat }) {
  const [isOpen, setIsOpen] = useState(false);
  const { resetChat } = useChat();

  const handleNew = () => { resetChat(); onNewChat?.(); };
  const copy = async () => { try { await navigator.clipboard.writeText("gemini-3-flash-preview"); } catch {} };

  return (
    <>
      <header className="relative shrink-0 h-14 flex items-center justify-between px-4 sm:px-5 gap-3"
        style={{ background: "rgba(7,1,20,0.88)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(99,102,241,0.12)" }}>

        {/* Gradient shimmer line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 30%, rgba(217,70,239,0.5) 60%, transparent 100%)", backgroundSize: "200% 100%", animation: "aurora-shift 4s ease infinite" }} />

        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu */}
          <button onClick={onMenuToggle}
            className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.15)"; }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "#a78bfa" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "rgba(14,6,35,0.9)", border: "1px solid rgba(124,58,237,0.3)" }}>
              <BrainLogo size={26} animate={false} />
            </div>
            <span className="brand-gradient text-sm font-black tracking-widest">OMNIX</span>
          </div>

          {/* Model pill */}
          <button onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", color: "var(--t2)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.14)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.color = "#c4b5fd"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)"; e.currentTarget.style.color = "var(--t2)"; }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse-ring"
              style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", boxShadow: "0 0 6px rgba(6,182,212,0.7)" }} />
            Gemini 3 Flash Preview
            <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* New chat */}
          <button onClick={handleNew}
            className="hidden sm:flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", color: "#a78bfa" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)"; e.currentTarget.style.boxShadow = "none"; }}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
          <button onClick={handleNew}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl transition-all"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: "#a78bfa" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          {/* Info */}
          <button onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", color: "var(--t3)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#c4b5fd"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--t3)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)"; }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black gradient-fill text-white"
            style={{ boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            U
          </div>
        </div>
      </header>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Model Information">
        <div className="space-y-4">
          <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.75 }}>
            OMNIX is powered by Google&apos;s{" "}
            <strong style={{ color: "#c4b5fd" }}>Gemini 3 Flash Preview</strong> — a fast,
            high-quality multimodal model built for intelligent, natural conversations.
          </p>
          <div className="rounded-xl p-4" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(139,92,246,0.18)" }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Active Model</p>
                <p style={{ fontFamily: "var(--font-geist-mono,monospace)", fontSize: 13, color: "#a78bfa" }}>gemini-3-flash-preview</p>
              </div>
              <button onClick={copy}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#c4b5fd" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}>
                Copy
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full animate-pulse-ring"
              style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", boxShadow: "0 0 8px rgba(6,182,212,0.6)" }} />
            <span style={{ fontSize: 11, color: "var(--t3)" }}>All systems operational · Model active</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
