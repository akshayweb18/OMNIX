"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";
import GalaxyLogo from "@/components/ui/GalaxyLogo";

export default function ChatHeader({ onMenuToggle, onNewChat }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { resetChat } = useChat();
  const { user, signOut } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const handleNew = () => { resetChat(); onNewChat?.(); };
  const copy = async () => { try { await navigator.clipboard.writeText("gemini-3-flash-preview"); } catch {} };

  return (
    <>
      <header style={{
        position: "relative", zIndex: 100, flexShrink: 0, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", gap: 12,
        background: "rgba(6,10,35,0.72)",
        borderBottom: "1px solid rgba(129,140,248,0.16)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        {/* Bottom gradient line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.42), rgba(192,132,252,0.36), transparent)" }} />

        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Hamburger — mobile only */}
          <button onClick={onMenuToggle} className="omnix-mobile-only header-btn header-btn-ghost" style={{ width: 36, height: 36, flexShrink: 0 }}>
            <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          {/* Logo — mobile only */}
          <div className="omnix-mobile-only" style={{ alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "rgba(12,16,44,0.96)", border: "1px solid rgba(129,140,248,0.3)", boxShadow: "0 8px 24px -12px rgba(99,102,241,0.8)" }}>
              <GalaxyLogo size={24} animate={false} />
            </div>
            <span className="brand-gradient" style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.12em" }}>OMNIX</span>
          </div>

          {/* Model pill — desktop only */}
          <button onClick={() => setIsOpen(true)} className="omnix-desktop-only header-model-pill" style={{ alignItems: "center", gap: 8, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 500 }}>
            <span className="animate-pulse-ring" style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#6366f1)", boxShadow: "0 0 6px rgba(6,182,212,0.7)" }} />
            Gemini 3 Flash Preview
            <svg style={{width:12,height:12,opacity:0.5}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Right side — high z-index so profile / logout menu stays above scroll content */}
        <div style={{ position: "relative", zIndex: 110, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* New Chat — desktop text button */}
          <button onClick={handleNew} className="omnix-desktop-only header-btn header-btn-ghost" style={{ alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em" }}>
            <svg style={{width:14,height:14}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>

          {/* New Chat — mobile icon button */}
          <button onClick={handleNew} className="omnix-mobile-only header-btn header-btn-ghost" style={{ width: 36, height: 36 }}>
            <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          {/* Info */}
          <button onClick={() => setIsOpen(true)} className="header-btn header-btn-subtle" style={{ width: 36, height: 36 }}>
            <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </button>

          {/* User avatar dropdown */}
          <div style={{ position: "relative", zIndex: 120 }} ref={menuRef}>
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative", zIndex: 1 }}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 36, height: 36, borderRadius: 12, objectFit: "cover", boxShadow: "0 8px 20px -10px rgba(99,102,241,0.65)", border: "1.5px solid rgba(129,140,248,0.35)" }} />
              ) : (
                <div className="gradient-fill" style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "white", boxShadow: "0 8px 20px -10px rgba(99,102,241,0.65)" }}>
                  {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#22d3ee", border: "2px solid rgba(6,10,35,0.9)", boxShadow: "0 0 6px #22d3ee" }} />
            </button>

            {menuOpen && (
              <div className="animate-fade-in" style={{
                position: "absolute", right: 0, top: 48, zIndex: 200, width: 240, borderRadius: 12, padding: 4,
                background: "linear-gradient(155deg, rgba(13,19,47,0.96), rgba(14,18,40,0.94))",
                border: "1px solid rgba(129,140,248,0.22)",
                boxShadow: "0 20px 50px -12px rgba(0,0,0,0.7), 0 0 30px -8px rgba(99,102,241,0.25)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              }}>
                <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(129,140,248,0.12)" }}>
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 40, height: 40, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "1.5px solid rgba(129,140,248,0.3)" }} />
                  ) : (
                    <div className="gradient-fill" style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "white", flexShrink: 0 }}>
                      {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.displayName || user?.email?.split("@")[0] || "User"}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--t3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                      {user?.email || ""}
                    </p>
                  </div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 500, color: "#f87171", background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Model Information">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.75 }}>
            OMNIX is powered by Google&apos;s{" "}
            <strong style={{ color: "#c4b5fd" }}>Gemini 3 Flash Preview</strong> — a fast,
            high-quality multimodal model for intelligent conversations.
          </p>
          <div style={{ borderRadius: 12, padding: 16, background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.16)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Active Model</p>
                <p style={{ fontFamily: "var(--font-geist-mono,monospace)", fontSize: 13, color: "#a5b4fc" }}>gemini-3-flash-preview</p>
              </div>
              <button onClick={copy} className="header-btn header-btn-ghost" style={{ padding: "6px 12px", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                Copy
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="animate-pulse-ring" style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#6366f1)", boxShadow: "0 0 8px rgba(6,182,212,0.6)" }} />
            <span style={{ fontSize: 11, color: "var(--t3)" }}>All systems operational · Model active</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
