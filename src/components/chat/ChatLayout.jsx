"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import BrainLogo from "@/components/ui/BrainLogo";
import { useChat } from "@/hooks/useChat";
import { useSpeech } from "@/hooks/useSpeech";

/* ─── LocalStorage ─────────────────────────────────────────── */
const SK = "omnix_sessions", AK = "omnix_active";
const readS  = () => { try { return JSON.parse(localStorage.getItem(SK) || "[]"); } catch { return []; } };
const writeS = (s) => { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} };
const readA  = () => { try { return localStorage.getItem(AK) || null; } catch { return null; } };
const writeA = (id) => { try { localStorage.setItem(AK, String(id)); } catch {} };

/* ─── Time helpers ──────────────────────────────────────────── */
function timeAgo(ts) {
  const d = Date.now() - Number(ts);
  if (d < 60000)   return "just now";
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
}
function groupSessions(sessions) {
  const now = Date.now(), DAY = 86400000;
  const today     = sessions.filter(s => now - Number(s.id) < DAY);
  const yesterday = sessions.filter(s => { const a = now - Number(s.id); return a >= DAY && a < 2*DAY; });
  const older     = sessions.filter(s => now - Number(s.id) >= 2*DAY);
  return { today, yesterday, older };
}

/* ─── Prompt cards ──────────────────────────────────────────── */
const PROMPTS = [
  { icon: "✦", label: "Draft Email",  text: "Draft a professional email requesting a meeting with a potential client.", accent: "#a78bfa" },
  { icon: "⬡", label: "Explain AI",   text: "Explain how neural networks learn, in simple terms.",                     accent: "#e879f9" },
  { icon: "◈", label: "Write Code",   text: "Write a Python function to sort a list of dictionaries by a specific key.", accent: "#22d3ee" },
  { icon: "◎", label: "Brainstorm",   text: "Give me 10 creative AI startup ideas with unique angles.",                  accent: "#f472b6" },
];

/* ─── SVG Icons ─────────────────────────────────────────────── */
const Icon = {
  search:   <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>,
  settings: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  help:     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>,
  star:     <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  msg:      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>,
  plus:     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>,
  trash:    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  bolt:     <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22l9.5-12H14L13 2z"/></svg>,
  chevron:  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>,
};

/* ─── Session Group Section ─────────────────────────────────── */
function SessionGroup({ label, dot, sessions, activeChatId, onSelectChat, onDeleteChat, onClose }) {
  if (!sessions.length) return null;
  return (
    <div className="mb-3">
      <div className="sidebar-section-label flex items-center gap-1.5 mb-2">
        <span className="h-1 w-1 rounded-full" style={{ background: dot, boxShadow: `0 0 4px ${dot}` }} />
        {label}
      </div>
      <div className="space-y-1">
        {sessions.map((s, i) => {
          const isActive = activeChatId === s.id;
          const msgCount = s.messages?.length || 0;
          return (
            <div key={s.id} className="group relative"
              style={{ animation: `slide-from-left 0.3s ease ${i * 0.04}s both` }}>
              <button
                onClick={() => { onSelectChat(s.id); onClose?.(); }}
                className={`session-card ${isActive ? "session-card-active" : ""}`}
              >
                <div className="flex items-center gap-2.5 pr-6">
                  {/* Letter avatar */}
                  <span className={`session-avatar ${isActive ? "session-avatar-active" : "session-avatar-default"}`}>
                    {s.title.slice(0,1).toUpperCase()}
                  </span>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-tight"
                      style={{ color: isActive ? "#e9d5ff" : "var(--t1)" }}>
                      {s.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1" style={{ color: "var(--t3)", fontSize: 10 }}>
                        {Icon.msg} {msgCount} msg{msgCount !== 1 ? "s" : ""}
                      </span>
                      <span style={{ color: "var(--t3)", fontSize: 10 }}>·</span>
                      <span style={{ color: "var(--t3)", fontSize: 10 }}>{timeAgo(s.id)}</span>
                    </div>
                  </div>

                  {/* Active dot */}
                  {isActive && (
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full animate-pulse-ring"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", boxShadow: "0 0 8px rgba(168,85,247,0.9)", flexShrink: 0 }} />
                  )}
                </div>
              </button>

              {/* Delete button */}
              <button
                onClick={e => { e.stopPropagation(); onDeleteChat(s.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ color: "var(--t3)", background: "rgba(255,255,255,0.04)", border: "1px solid transparent" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f472b6"; e.currentTarget.style.background = "rgba(236,72,153,0.12)"; e.currentTarget.style.borderColor = "rgba(236,72,153,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--t3)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                {Icon.trash}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Fancy Sidebar ─────────────────────────────────────────── */
function Sidebar({ activeChatId, sessions, onSelectChat, onNewChat, onDeleteChat, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? sessions.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    : null;
  const { today, yesterday, older } = groupSessions(sessions);
  const totalMsgs = sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0);

  return (
    <div className="relative flex h-full flex-col overflow-hidden">

      {/* Left accent line */}
      <div className="sidebar-inner-edge" />

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-24 -right-12 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22), transparent)", opacity: 0.8 }} />
      <div className="pointer-events-none absolute bottom-16 -left-10 h-44 w-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.18), transparent)", opacity: 0.7 }} />
      <div className="pointer-events-none absolute top-1/2 right-0 h-32 w-32 rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10), transparent)", opacity: 0.6 }} />

      {/* ── HEADER ── */}
      <div className="relative px-4 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(99,102,241,0.10)" }}>

        {/* Close button (mobile) */}
        <button onClick={onClose}
          className="lg:hidden absolute top-4 right-4 sidebar-quick-btn"
          style={{ width: 28, height: 28 }}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Logo row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Animated logo with glow rings */}
          <div className="relative shrink-0">
            {/* Outer pulsing ring */}
            <div className="absolute rounded-2xl animate-pulse-ring pointer-events-none"
              style={{ inset: -4, background: "conic-gradient(from 45deg, #7c3aed, #ec4899, #06b6d4, #7c3aed)", borderRadius: 16, opacity: 0.3, filter: "blur(3px)" }} />
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(236,72,153,0.4))", borderRadius: 12, filter: "blur(6px)", opacity: 0.6 }} />
            <div className="relative h-11 w-11 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "rgba(10,4,28,0.95)", border: "1px solid rgba(124,58,237,0.35)", boxShadow: "0 4px 20px rgba(124,58,237,0.25)" }}>
              <BrainLogo size={32} animate={false} />
            </div>
          </div>

          {/* Brand text */}
          <div className="min-w-0">
            <span className="brand-gradient text-lg font-black tracking-widest block leading-tight">OMNIX</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="model-badge">
                {Icon.bolt} Gemini 3 Flash
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          {[
            { n: sessions.length, l: "chats" },
            { n: totalMsgs, l: "messages" },
          ].map(({ n, l }) => (
            <div key={l} className="flex items-center gap-1">
              <span className="text-[13px] font-bold" style={{ color: "#c4b5fd" }}>{n}</span>
              <span style={{ fontSize: 11, color: "var(--t3)" }}>{l}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse-ring"
              style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee" }} />
            <span style={{ fontSize: 10, color: "rgba(103,232,249,0.7)", letterSpacing: "0.06em" }}>ONLINE</span>
          </div>
        </div>
      </div>

      {/* ── NEW CHAT BUTTON ── */}
      <div className="px-3 pt-4 pb-3">
        <button onClick={() => { onNewChat(); onClose?.(); }} className="new-chat-btn">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
            {Icon.plus}
          </span>
          <span className="flex-1">New Conversation</span>
          <kbd className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
            ⌘ N
          </kbd>
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="px-3 pb-3">
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--t3)" }}>
            {Icon.search}
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="sidebar-search"
          />
          {search && (
            <button onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px]"
              style={{ color: "var(--t3)" }}>✕</button>
          )}
        </div>
      </div>

      {/* ── SESSION LIST ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-2" style={{ overscrollBehavior: "contain" }}>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.12)" }}>
              <svg className="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "#a78bfa" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
              </svg>
            </div>
            <div className="text-center">
              <p style={{ fontSize: 13, color: "var(--t2)", fontWeight: 600 }}>No conversations yet</p>
              <p style={{ fontSize: 11, color: "var(--t3)", marginTop: 3 }}>Start a new one above</p>
            </div>
          </div>
        ) : filtered ? (
          // Search results
          filtered.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ fontSize: 12, color: "var(--t3)" }}>No results for &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <SessionGroup label="Results" dot="#a78bfa" sessions={filtered} activeChatId={activeChatId}
              onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose} />
          )
        ) : (
          <>
            <SessionGroup label="Today" dot="#22d3ee" sessions={today} activeChatId={activeChatId}
              onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose} />
            <SessionGroup label="Yesterday" dot="#a78bfa" sessions={yesterday} activeChatId={activeChatId}
              onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose} />
            <SessionGroup label="Older" dot="#f472b6" sessions={older} activeChatId={activeChatId}
              onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onClose={onClose} />
          </>
        )}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="px-3 pb-3" style={{ borderTop: "1px solid rgba(99,102,241,0.08)" }}>
        <div className="flex items-center justify-between pt-3">
          <span style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Quick Actions</span>
          <div className="flex items-center gap-1">
            {[
              { icon: Icon.settings, tip: "Settings" },
              { icon: Icon.help, tip: "Help" },
              { icon: Icon.star, tip: "Favorites" },
            ].map(({ icon, tip }) => (
              <button key={tip} title={tip} className="sidebar-quick-btn">{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── USER FOOTER ── */}
      <div className="px-3 pb-4">
        <div className="sidebar-user-card">
          <div className="flex items-center gap-3">
            {/* Avatar with gradient ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", borderRadius: 12, padding: 1.5, opacity: 0.8 }} />
              <div className="relative h-9 w-9 rounded-xl gradient-fill flex items-center justify-center text-sm font-black text-white"
                style={{ boxShadow: "0 4px 14px rgba(124,58,237,0.45)" }}>U</div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold truncate" style={{ color: "var(--t1)" }}>Neural User</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse-ring"
                  style={{ background: "#22d3ee", boxShadow: "0 0 5px #22d3ee" }} />
                <span style={{ fontSize: 10, color: "rgba(103,232,249,0.75)" }}>Active Session</span>
              </div>
            </div>

            {/* Settings gear */}
            <button className="sidebar-quick-btn shrink-0" title="Account settings">
              {Icon.settings}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Welcome Screen ────────────────────────────────────────── */
function WelcomeScreen({ onSend }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-10 px-4 text-center animate-fade-in">
      {/* Brain with glow rings */}
      <div className="relative mb-6 inline-block">
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ inset: -32, background: "radial-gradient(circle, rgba(124,58,237,0.28), rgba(236,72,153,0.14), transparent 65%)", borderRadius: "50%", filter: "blur(12px)" }} />
        <div className="relative animate-float-logo">
          <BrainLogo size={140} animate />
        </div>
      </div>

      <h1 className="brand-gradient text-5xl sm:text-6xl font-black tracking-widest mb-2 leading-none">OMNIX</h1>
      <p style={{ fontSize: 11, color: "var(--t3)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>◈ Advanced Neural Intelligence ◈</p>
      <p style={{ color: "var(--t2)", fontSize: 15, maxWidth: 360, marginBottom: 10, lineHeight: 1.7 }}>
        Your AI partner — designed to think, create, and build alongside you.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        {[{ l: "Model Online", c: "#22d3ee" }, { l: "Gemini 3 Flash", c: "#a78bfa" }, { l: "Neural Ready", c: "#f472b6" }].map(({ l, c }) => (
          <div key={l} className="gradient-tag flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse-ring" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
            <span>{l}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {PROMPTS.map((p) => (
          <button key={p.label} onClick={() => onSend(p.text)} className="prompt-card flex flex-col items-start gap-3 p-4 text-left group">
            <div className="flex items-center gap-3 w-full">
              <span className="text-2xl leading-none" style={{ color: p.accent }}>{p.icon}</span>
              <p className="font-bold text-sm" style={{ color: p.accent }}>{p.label}</p>
              <svg className="ml-auto h-3.5 w-3.5 opacity-25 group-hover:opacity-60 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: p.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5V15.75" />
              </svg>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--t2)", lineHeight: 1.6 }} className="line-clamp-2">{p.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Layout ───────────────────────────────────────────── */
export default function ChatLayout() {
  const { messages, sendMessage, loading, resetChat, loadChat } = useChat();
  const { speak } = useSpeech();
  const bottomRef = useRef(null);
  const scrollRef  = useRef(null);

  const [activeChatId, setActiveChatId] = useState(null);
  const [sessions, setSessions]         = useState([]);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const isFirstMsg = useRef(true);

  useEffect(() => {
    const saved = readS(); setSessions(saved);
    const lid = readA();
    if (lid) { const s = saved.find(x => x.id === lid); if (s) { setActiveChatId(lid); loadChat(s.messages); isFirstMsg.current = false; } }
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
      const entry = { id, title, messages: [] };
      setSessions(prev => { const u = [entry, ...prev]; writeS(u); return u; });
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

  const sp = { activeChatId, sessions, onSelectChat: handleSelectChat, onNewChat: handleNewChat, onDeleteChat: handleDeleteChat };

  return (
    <div className="relative h-dvh overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── Aurora orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full blur-[130px]"
          style={{ width: 750, height: 750, top: -220, left: -200, background: "radial-gradient(circle, rgba(124,58,237,0.20), rgba(109,40,217,0.12), transparent 70%)", animation: "drift-1 24s ease-in-out infinite" }} />
        <div className="absolute rounded-full blur-[150px]"
          style={{ width: 650, height: 650, bottom: -180, right: -160, background: "radial-gradient(circle, rgba(217,70,239,0.18), rgba(236,72,153,0.12), transparent 70%)", animation: "drift-2 30s ease-in-out infinite" }} />
        <div className="absolute rounded-full blur-[110px]"
          style={{ width: 500, height: 500, top: "38%", left: "38%", background: "radial-gradient(circle, rgba(79,70,229,0.14), rgba(6,182,212,0.07), transparent 70%)", animation: "drift-3 20s ease-in-out infinite" }} />
        <div className="absolute rounded-full blur-[90px]"
          style={{ width: 320, height: 320, top: "8%", right: "8%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", animation: "drift-1 34s ease-in-out infinite reverse" }} />
        {/* Fine dot grid */}
        <div className="absolute inset-0 opacity-[0.016]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(200,190,255,0.9) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>

      {/* Mobile overlay — always in DOM, opacity-driven so close animates too */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 180ms ease",
        }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobile sidebar — GPU-accelerated, 180ms */}
      <aside
        className="fixed left-0 top-0 z-50 h-dvh w-[280px] lg:hidden glass-sidebar"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <Sidebar {...sp} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Layout */}
      <div className="relative flex h-dvh w-full">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 h-dvh flex-col glass-sidebar">
          <Sidebar {...sp} onClose={() => {}} />
        </aside>

        {/* Chat column — flex column fills remaining space, input always at bottom */}
        <div className="flex flex-1 flex-col min-w-0" style={{ height: "100%" }}>

          <ChatHeader onMenuToggle={() => setSidebarOpen(v => !v)} onNewChat={handleNewChat} />

          {/* Messages — grows, scrolls internally. overscroll-behavior:contain stops it propagating to the page */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-y-auto" style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
              <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
                {messages.length === 0 && !loading
                  ? <WelcomeScreen onSend={handleSend} />
                  : (
                    <div className="space-y-3 pb-4">
                      <ChatList messages={messages} />
                      {loading && <TypingIndicator />}
                      <div ref={bottomRef} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {/* Input — always pinned at bottom, respects safe area (iPhone home bar) */}
          <div
            className="shrink-0 pb-safe"
            style={{
              background: "rgba(7,1,15,0.94)",
              borderTop: "1px solid rgba(99,102,241,0.12)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            <div className="mx-auto w-full max-w-3xl px-4 pt-3 pb-3 sm:px-6">
              <ChatInput onSend={handleSend} loading={loading} />
              <p className="mt-2 text-center" style={{ fontSize: 10, color: "var(--t3)", letterSpacing: "0.06em" }}>
                OMNIX may produce inaccurate results · Always verify important information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
