"use client";

import { useState, useRef, useEffect } from "react";
import useVoice from "@/hooks/useVoice";
import { useSpeech } from "@/hooks/useSpeech";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const saveHistory = (msg) => {
    try {
      let h = JSON.parse(localStorage.getItem("omnix_chat_history") || "[]");
      h.unshift({ id: Date.now(), title: msg });
      localStorage.setItem("omnix_chat_history", JSON.stringify(h.slice(0, 50)));
    } catch {}
  };

  const { listening, startListening, stopListening } = useVoice((t) => {
    if (!t.trim()) return;
    onSend(`You said: "${t}"`);
  });
  const { stop } = useSpeech();

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  const handleSend = () => {
    const t = text.trim();
    if (!t || loading) return;
    stop(); onSend(t); saveHistory(t); setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleMic = () => {
    if (listening) { stopListening(); return; }
    stop(); startListening();
    setTimeout(() => stopListening(), 5000);
  };

  const isEmpty = !text.trim();

  return (
    <div className="input-container">
      {/* Animated gradient top edge when focused */}
      <div className="absolute top-0 inset-x-4 h-px rounded-full opacity-0 pointer-events-none transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #ec4899, #06b6d4, transparent)", backgroundSize: "200% 100%", animation: "aurora-shift 3s ease infinite" }}
        id="input-top-line" />

      {/* Text area row */}
      <div className="flex items-start gap-3 px-4 pt-4">
        {/* Sparkle prefix */}
        <div className="mt-1 shrink-0">
          <div className="h-5 w-5 rounded-md gradient-fill flex items-center justify-center text-white" style={{ fontSize: 10, fontWeight: 900, boxShadow: "0 2px 8px rgba(124,58,237,0.4)" }}>✦</div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); if (typeof window !== "undefined") window.speechSynthesis.cancel(); }}
          onFocus={() => { if (typeof window !== "undefined") window.speechSynthesis.cancel(); document.getElementById("input-top-line")?.style && (document.getElementById("input-top-line").style.opacity = "1"); }}
          onBlur={() => { document.getElementById("input-top-line")?.style && (document.getElementById("input-top-line").style.opacity = "0"); }}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "OMNIX is thinking…" : "Message OMNIX… (Shift+Enter for new line)"}
          rows={1}
          disabled={loading}
          className="w-full bg-transparent outline-none resize-none text-[14.5px] leading-relaxed"
          style={{
            color: "var(--t1)",
            fontFamily: "inherit",
            caretColor: "#a78bfa",
            minHeight: 28,
            maxHeight: 160,
          }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-2">
        {/* Left: hint */}
        <span style={{ fontSize: 11, color: "var(--t3)" }}>
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-ring"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 0 6px rgba(168,85,247,0.7)" }} />
              Generating response…
            </span>
          ) : isEmpty ? "Ask anything · Enter to send" : `${text.length} chars · Shift+Enter for new line`}
        </span>

        {/* Right: buttons */}
        <div className="flex items-center gap-2">

          {/* Mic */}
          <button onClick={handleMic} aria-label={listening ? "Stop" : "Voice input"}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-250"
            style={{
              background: listening
                ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.2))"
                : "rgba(99,102,241,0.07)",
              border: `1px solid ${listening ? "rgba(168,85,247,0.45)" : "rgba(99,102,241,0.15)"}`,
              color: listening ? "#c4b5fd" : "var(--t3)",
              boxShadow: listening ? "0 0 20px rgba(168,85,247,0.25)" : "none",
            }}
            onMouseEnter={e => { if (!listening) { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#a78bfa"; } }}
            onMouseLeave={e => { if (!listening) { e.currentTarget.style.background = "rgba(99,102,241,0.07)"; e.currentTarget.style.color = "var(--t3)"; } }}
          >
            {listening && (
              <span className="absolute inset-0 rounded-xl border border-purple-400 opacity-50"
                style={{ animation: "pulse-ring 1.2s ease-in-out infinite" }} />
            )}
            <svg className="relative z-10 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm5-3a1 1 0 10-2 0 3 3 0 11-6 0 1 1 0 10-2 0 5 5 0 0010 0zm-5 9a1 1 0 001-1v-3h-2v3a1 1 0 001 1z" />
            </svg>
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={isEmpty || loading}
            aria-label="Send message"
            className="gradient-btn flex h-9 items-center gap-2 rounded-xl px-5 text-[13px] font-bold tracking-wide text-white"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                Send
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
