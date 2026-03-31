"use client";

import { useState, useRef, useEffect } from "react";
import useVoice from "@/hooks/useVoice";
import { useSpeech } from "@/hooks/useSpeech";
import { chatHistoryKey } from "@/lib/omnixChatStorage";

export default function ChatInput({ onSend, loading, userId, onStopGenerating }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  const saveHistory = (msg) => {
    if (!userId || typeof window === "undefined") return;
    try {
      const key = chatHistoryKey(userId);
      let h = JSON.parse(window.localStorage.getItem(key) || "[]");
      h.unshift({ id: Date.now(), title: msg });
      window.localStorage.setItem(key, JSON.stringify(h.slice(0, 50)));
    } catch {
      /* ignore */
    }
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
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  const handleSend = () => {
    const t = text.trim();
    if (!t || loading) return;
    stop(); onSend(t); saveHistory(t); setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleStop = () => {
    stop();
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
    if (loading) onStopGenerating?.();
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
  const glowActive = focused || listening;

  return (
    <div className="omnix-input-wrapper" style={{ position: "relative", borderRadius: 18, padding: 1.5 }}>

      {/* Spinning gradient border */}
      <div className={`omnix-input-ring ${glowActive ? "omnix-input-ring-active" : ""}`} />

      {/* Inner container */}
      <div style={{
        position: "relative",
        borderRadius: 16.5,
        background: "linear-gradient(145deg, rgba(10,14,40,0.95), rgba(14,18,50,0.92))",
        zIndex: 1,
      }}>

        {/* Textarea row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 10px 14px" }}>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); if (typeof window !== "undefined") window.speechSynthesis.cancel(); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={loading ? "AI is thinking…" : listening ? "Listening..." : "Message OMNIX..."}
            rows={1}
            disabled={loading}
            style={{
              flex: 1, minWidth: 0,
              background: "transparent", outline: "none", resize: "none", border: "none",
              color: "var(--t1)", fontFamily: "inherit",
              fontSize: 14, lineHeight: 1.5,
              minHeight: 22, maxHeight: 120,
              padding: "4px 0",
              verticalAlign: "middle",
            }}
          />

          {/* Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

            {/* Voice button — glowing orb style */}
            <button onClick={handleMic} aria-label={listening ? "Stop recording" : "Voice input"}
              className={`omnix-mic-btn ${listening ? "omnix-mic-btn-active" : ""}`}>
              {/* Pulse rings when listening */}
              {listening && (
                <>
                  <span className="omnix-mic-pulse" style={{ animationDelay: "0s" }} />
                  <span className="omnix-mic-pulse" style={{ animationDelay: "0.6s" }} />
                </>
              )}
              <svg style={{ width: 16, height: 16, position: "relative", zIndex: 2 }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm5-3a1 1 0 10-2 0 3 3 0 11-6 0 1 1 0 10-2 0 5 5 0 0010 0zm-5 9a1 1 0 001-1v-3h-2v3a1 1 0 001 1z" />
              </svg>
            </button>

            {/* Stop */}
            {loading && (
              <button onClick={handleStop} aria-label="Stop generating"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 12,
                  background: "rgba(248,113,113,0.12)",
                  border: "1px solid rgba(248,113,113,0.25)",
                  color: "#fca5a5", cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.22)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.12)"}>
                <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              </button>
            )}

            {/* Send */}
            {!loading && (
              <button onClick={handleSend} disabled={isEmpty} aria-label="Send message"
                className={`omnix-send-btn ${isEmpty ? "" : "omnix-send-btn-active"}`}>
                <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Status line */}
        {(loading || listening || !isEmpty) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "0 14px 8px",
            fontSize: 10, color: "var(--t3)",
            animation: "fade-in 200ms ease",
          }}>
            {loading ? (
              <>
                <span className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#c4b5fd", flexShrink: 0 }} />
                <span>AI is thinking…</span>
              </>
            ) : listening ? (
              <>
                <span className="animate-pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#22d3ee", flexShrink: 0 }} />
                <span>Listening — speak now</span>
              </>
            ) : (
              <span><span style={{ color: "#a5b4fc", fontWeight: 600 }}>{text.length}</span> chars · Enter to send</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
