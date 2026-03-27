"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import GalaxyLogo from "@/components/ui/GalaxyLogo";
import { useChat } from "@/hooks/useChat";
import { useSpeech } from "@/hooks/useSpeech";
import { useAuth } from "@/context/AuthContext";

const SK = "omnix_sessions", AK = "omnix_active";
const readS  = () => { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } };
const writeS = (s) => { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} };
const readA  = () => { try { return localStorage.getItem(AK) || null; } catch { return null; } };
const writeA = (id) => { try { localStorage.setItem(AK, String(id)); } catch {} };

function timeAgo(ts) {
  const d = Date.now() - Number(ts);
  if (d < 60000)    return "now";
  if (d < 3600000)  return `${Math.floor(d / 60000)}m`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h`;
  return `${Math.floor(d / 86400000)}d`;
}

function groupSessions(sessions) {
  const now = Date.now(), DAY = 86400000;
  return {
    today:     sessions.filter(s => now - Number(s.id) < DAY),
    yesterday: sessions.filter(s => { const a = now - Number(s.id); return a >= DAY && a < 2 * DAY; }),
    older:     sessions.filter(s => now - Number(s.id) >= 2 * DAY),
  };
}

const PROMPTS = [
  { icon: "🚀", label: "Launch Plan",   text: "Help me create a product launch plan with timeline, milestones and KPIs.", accent: "#818cf8", bg: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.1))" },
  { icon: "💡", label: "Explain AI",    text: "Explain how neural networks learn, in simple terms a student would understand.", accent: "#a78bfa", bg: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(139,92,246,0.1))" },
  { icon: "🧬", label: "Write Code",    text: "Write a Python function to sort a list of dictionaries by a specific key.", accent: "#c084fc", bg: "linear-gradient(135deg, rgba(192,132,252,0.2), rgba(147,51,234,0.1))" },
  { icon: "🌍", label: "Brainstorm",    text: "Give me 10 creative AI startup ideas with unique market angles.", accent: "#f0abfc", bg: "linear-gradient(135deg, rgba(240,171,252,0.2), rgba(192,38,211,0.1))" },
];

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const IconSearch = () => <svg style={{width:14,height:14}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>;
const IconPlus = () => <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>;
const IconClose = () => <svg style={{width:14,height:14}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconMsg = () => <svg style={{width:12,height:12}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>;
const IconBolt = () => <svg style={{width:14,height:14}} fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2z"/></svg>;
const IconLogout = () => <svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;

/* ─── Session Group ────────────────────────────────────────── */
function SessionGroup({ label, dotColor, sessions, activeChatId, onSelect, onDelete, onClose }) {
  if (!sessions.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="sidebar-section-label" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: dotColor, boxShadow: `0 0 4px ${dotColor}` }} />
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sessions.map((s, i) => {
          const active = activeChatId === s.id;
          const n = s.messages?.length || 0;
          return (
            <div key={s.id} style={{ position: "relative", animation: `slide-from-left 0.3s ease ${i * 0.04}s both` }}>
              <button onClick={() => { onSelect(s.id); onClose?.(); }} className={`session-card ${active ? "session-card-active" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", paddingRight: 24 }}>
                  <span className={`session-avatar ${active ? "session-avatar-active" : "session-avatar-default"}`}>
                    {s.title.slice(0, 1).toUpperCase()}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: active ? "#e0e7ff" : "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--t3)", fontSize: 10 }}><IconMsg /> {n} msg{n !== 1 ? "s" : ""}</span>
                      <span style={{ color: "var(--t3)", fontSize: 10 }}>·</span>
                      <span style={{ color: "var(--t3)", fontSize: 10 }}>{timeAgo(s.id)}</span>
                    </div>
                  </div>
                </div>
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                className="session-delete-btn"
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", opacity: 0 }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <IconClose />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Sidebar Content ──────────────────────────────────────── */
function SidebarContent({ activeChatId, sessions, onSelect, onNew, onDelete, onClose, user, onSignOut }) {
  const [search, setSearch] = useState("");
  const filtered = search.trim() ? sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase())) : null;
  const { today, yesterday, older } = groupSessions(sessions);
  const totalMsgs = sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.06)", color: "var(--t3)", border: "none", cursor: "pointer" }}>
          <IconClose />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "rgba(6,3,22,0.95)", border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 4px 20px rgba(99,102,241,0.25)" }}>
              <GalaxyLogo size={32} animate={false} />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <span className="brand-gradient" style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.12em", display: "block", lineHeight: 1.2 }}>OMNIX</span>
            <div className="model-badge" style={{ marginTop: 2 }}><IconBolt /> Omnix 3 Flash</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {[{ n: sessions.length, l: "chats" }, { n: totalMsgs, l: "messages" }].map(({ n, l }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc" }}>{n}</span>
              <span style={{ fontSize: 11, color: "var(--t3)" }}>{l}</span>
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <span className="animate-pulse-ring" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }} />
            <span style={{ fontSize: 10, color: "rgba(103,232,249,0.7)", letterSpacing: "0.06em" }}>ONLINE</span>
          </div>
        </div>
      </div>

      {/* New chat */}
      <div style={{ padding: "16px 12px 12px" }}>
        <button onClick={() => { onNew(); onClose?.(); }} className="new-chat-btn">
          <span style={{ display: "flex", width: 24, height: 24, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(255,255,255,0.15)" }}><IconPlus /></span>
          <span style={{ flex: 1 }}>New Conversation</span>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "0 12px 12px" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--t3)" }}><IconSearch /></span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" className="sidebar-search" />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--t3)", background: "none", border: "none", cursor: "pointer" }}>✕</button>}
        </div>
      </div>

      {/* Sessions */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 8px", overscrollBehavior: "contain" }}>
        {sessions.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 160, gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.12)" }}>
              <GalaxyLogo size={28} animate />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "var(--t2)", fontWeight: 600 }}>No conversations yet</p>
              <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 3 }}>Start a new one above</p>
            </div>
          </div>
        ) : filtered ? (
          filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0" }}><p style={{ fontSize: 12, color: "var(--t3)" }}>No results for &ldquo;{search}&rdquo;</p></div>
            : <SessionGroup label="Results" dotColor="#a5b4fc" sessions={filtered} activeChatId={activeChatId} onSelect={onSelect} onDelete={onDelete} onClose={onClose} />
        ) : (
          <>
            <SessionGroup label="Today" dotColor="#22d3ee" sessions={today} activeChatId={activeChatId} onSelect={onSelect} onDelete={onDelete} onClose={onClose} />
            <SessionGroup label="Yesterday" dotColor="#a5b4fc" sessions={yesterday} activeChatId={activeChatId} onSelect={onSelect} onDelete={onDelete} onClose={onClose} />
            <SessionGroup label="Older" dotColor="#c084fc" sessions={older} activeChatId={activeChatId} onSelect={onSelect} onDelete={onDelete} onClose={onClose} />
          </>
        )}
      </div>

      {/* User footer */}
      <div style={{ padding: "8px 12px 16px", borderTop: "1px solid var(--border)" }}>
        <div className="sidebar-user-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, objectFit: "cover", boxShadow: "0 4px 16px rgba(99,102,241,0.45)", border: "1px solid rgba(129,140,248,0.3)" }} />
            ) : (
              <div className="gradient-fill" style={{ width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "white", flexShrink: 0, boxShadow: "0 4px 16px rgba(99,102,241,0.45)" }}>
                {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--t1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </p>
              <p style={{ fontSize: 10, color: "var(--t3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                {user?.email || ""}
              </p>
            </div>
            <button onClick={onSignOut} className="sidebar-quick-btn" style={{ flexShrink: 0 }} title="Sign out"><IconLogout /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Welcome Screen ───────────────────────────────────────── */
function WelcomeScreen({ onSend, user }) {
  const firstName = (user?.displayName || user?.email?.split("@")[0] || "").split(" ")[0];
  const greeting = getTimeGreeting();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "24px 0" }}>
      {/* Avatar */}
      <div className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
        {user?.photoURL ? (
          <div className="avatar-glow-ring" style={{ marginBottom: 16, display: "inline-block", borderRadius: 16 }}>
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", boxShadow: "0 24px 60px -18px rgba(67,56,202,0.7)" }} />
          </div>
        ) : (
          <div className="animate-float" style={{ marginBottom: 16, display: "inline-flex", width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 16, background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 55%, #7e22ce 100%)", boxShadow: "0 24px 60px -18px rgba(67,56,202,0.8)", fontSize: 24, fontWeight: 900, color: "white" }}>
            {(firstName || "O").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Greeting */}
      <div className="animate-greeting" style={{ animationDelay: "0.2s" }}>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "var(--t3)" }}>
          <span className="animate-wave" style={{ fontSize: 18, marginRight: 4 }}>👋</span> {greeting}
        </p>
        <h1 className="brand-gradient" style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, letterSpacing: "0.02em", lineHeight: 1 }}>
          {firstName || "Explorer"}
        </h1>
      </div>

      <p className="animate-greeting" style={{ marginTop: 12, fontSize: "clamp(14px, 3vw, 18px)", fontWeight: 500, color: "var(--t2)", animationDelay: "0.35s" }}>
        Where should we start today?
      </p>

      {/* Prompt cards */}
      <div style={{ marginTop: 24, display: "grid", width: "100%", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {PROMPTS.map((p, i) => (
          <button key={p.label} onClick={() => onSend(p.text)}
            className="prompt-card-creative"
            style={{ padding: 16, textAlign: "left", cursor: "pointer", animation: `slide-up 0.6s cubic-bezier(.22,1,.36,1) ${0.3 + i * 0.08}s both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="prompt-icon-wrap" style={{ background: p.bg, border: `1px solid ${p.accent}33`, "--icon-shadow": `${p.accent}66` }}>
                {p.icon}
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0" }}>{p.label}</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--t2)" }}>{p.text}</p>
          </button>
        ))}
      </div>

      <p className="animate-greeting" style={{ marginTop: 24, fontSize: 10, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--t3)", animationDelay: "0.7s" }}>
        Powered by Omnix
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LAYOUT — rebuilt from scratch, mobile-first
   ═══════════════════════════════════════════════════════════════ */
export default function ChatLayout() {
  const { messages, sendMessage, loading, resetChat, loadChat } = useChat();
  const { speak } = useSpeech();
  const { user, signOut } = useAuth();
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);

  const [activeChatId, setActiveChatId] = useState(null);
  const [sessions, setSessions]         = useState([]);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const isFirstMsg = useRef(true);

  useEffect(() => {
    const saved = readS(); setSessions(saved);
    const lid = readA();
    if (lid) {
      const s = saved.find(x => x.id === lid);
      if (s) { setActiveChatId(lid); loadChat(s.messages); isFirstMsg.current = false; }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeChatId || messages.length === 0) return;
    setSessions(prev => { const u = prev.map(s => s.id === activeChatId ? { ...s, messages } : s); writeS(u); return u; });
  }, [messages, activeChatId]);

  useEffect(() => {
    if (!messages.length) return;
    const last = messages[messages.length - 1];
    if (last.role === "assistant") speak(last.content);
    return () => { if (typeof window !== "undefined") window.speechSynthesis.cancel(); };
  }, [messages, speak]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); return; }
    if (el.scrollHeight - el.clientHeight - el.scrollTop < 220) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const fn = e => e.key === "Escape" && setSidebarOpen(false);
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return;
    if (isFirstMsg.current) {
      const id = String(Date.now()), title = text.slice(0, 50) + (text.length > 50 ? "…" : "");
      setSessions(prev => { const u = [{ id, title, messages: [] }, ...prev]; writeS(u); return u; });
      setActiveChatId(id); writeA(id); isFirstMsg.current = false;
    }
    sendMessage(text);
  }, [sendMessage]);

  const handleNewChat = useCallback(() => {
    resetChat(); setActiveChatId(null); writeA(""); isFirstMsg.current = true;
  }, [resetChat]);

  const handleSelectChat = useCallback((id) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    resetChat(); loadChat(s.messages); setActiveChatId(id); writeA(id); isFirstMsg.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, resetChat, loadChat]);

  const handleDeleteChat = useCallback((id) => {
    setSessions(prev => { const u = prev.filter(s => s.id !== id); writeS(u); return u; });
    if (activeChatId === id) handleNewChat();
  }, [activeChatId, handleNewChat]);

  const sp = { activeChatId, sessions, onSelect: handleSelectChat, onNew: handleNewChat, onDelete: handleDeleteChat, user, onSignOut: signOut };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: "var(--bg)", position: "relative" }}>

      {/* ═══ SIDEBAR — desktop: inline, mobile: absolute overlay ═══ */}

      {/* Desktop sidebar (only shown >=1024px via media query class) */}
      <div className="omnix-desktop-sidebar" style={{ width: 272, flexShrink: 0, height: "100%" }}>
        <div className="glass-sidebar" style={{ height: "100%" }}>
          <SidebarContent {...sp} onClose={() => {}} />
        </div>
      </div>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "absolute", inset: 0, zIndex: 40,
            background: "rgba(2,6,23,0.72)",
            animation: "fade-in 200ms ease both",
          }}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div className="omnix-mobile-sidebar" style={{
        position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 50,
        width: 280,
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 300ms cubic-bezier(.32,.72,0,1)",
      }}>
        <div className="glass-sidebar" style={{ height: "100%" }}>
          <SidebarContent {...sp} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* ═══ MAIN CHAT AREA — always visible ═══ */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100%" }}>

        {/* Header */}
        <ChatHeader onMenuToggle={() => setSidebarOpen(v => !v)} onNewChat={handleNewChat} />

        {/* Messages area */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <div ref={scrollRef} style={{ height: "100%", overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
            {messages.length === 0 && !loading ? (
              <div style={{ display: "flex", minHeight: "100%", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
                <div style={{ width: "100%", maxWidth: 720 }}>
                  <WelcomeScreen onSend={handleSend} user={user} />
                </div>
              </div>
            ) : (
              <div style={{ margin: "0 auto", width: "100%", maxWidth: 720, padding: "24px 16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 16 }}>
                  <ChatList messages={messages} user={user} />
                  {loading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input bar — compact floating style */}
        <div className="pb-safe" style={{ flexShrink: 0, background: "transparent", padding: "0 16px 12px" }}>
          <div style={{ margin: "0 auto", width: "100%", maxWidth: 720 }}>
            <ChatInput onSend={handleSend} loading={loading} />
            <p style={{ marginTop: 6, textAlign: "center", fontSize: 9, color: "var(--t3)", letterSpacing: "0.06em", opacity: 0.7 }}>
              OMNIX may produce inaccurate results · Verify important info
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
