"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

const ChatLayout = dynamic(
  () => import("@/components/chat/ChatLayout"),
  { ssr: false }
);

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [clientError, setClientError] = useState(null);
  const showChat = mounted && !loading && !!user;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("scrollRestoration" in window.history)) return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  const pinScrollTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  /* Loading + chat handoff: document must stay at top on phones (avoids hiding the loading header). */
  useLayoutEffect(() => {
    pinScrollTop();
  }, [mounted, loading, user, showChat]);

  useEffect(() => {
    if (!mounted) return;
    pinScrollTop();
    const t = window.setTimeout(pinScrollTop, 0);
    const t2 = window.setTimeout(pinScrollTop, 150);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [mounted, loading, user]);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router, mounted]);

  useEffect(() => {
    const onError = (e) => setClientError(e.error?.message || e.message || "Unknown error");
    const onUnhandled = (e) => setClientError(e.reason?.message || String(e.reason) || "Unhandled rejection");
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  if (clientError) {
    return (
      <div style={{ padding: 32, color: "#f87171", background: "#050816", height: "100vh", fontFamily: "monospace", overflow: "auto" }}>
        <h2 style={{ fontSize: 18, marginBottom: 12, color: "#fca5a5" }}>Something went wrong:</h2>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 13, color: "#fca5a5" }}>{clientError}</pre>
        <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, background: "#4f46e5", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div
      className="omnix-app-shell"
      style={{
        width: "100%",
        height: "100dvh",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#050816",
      }}
    >
      {showChat ? (
        <ChatProvider>
          <ChatLayout />
        </ChatProvider>
      ) : (
        <div className="omnix-loading-fullscreen">
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ width: 48, height: 48, margin: "0 auto 16px", borderRadius: 12, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="3" fill="#e0e7ff" opacity="0.9" />
                <ellipse cx="20" cy="20" rx="14" ry="4" stroke="#818cf8" strokeWidth="1" strokeDasharray="3,5" fill="none" opacity="0.5" />
                <ellipse cx="20" cy="20" rx="11" ry="3" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="2,4" fill="none" opacity="0.4" transform="rotate(40 20 20)" />
              </svg>
            </div>
            <div style={{ color: "#a5b4fc", fontSize: 14, fontWeight: 600, letterSpacing: "0.05em" }}>Loading OMNIX...</div>
            <div style={{ marginTop: 12, display: "flex", gap: 6, justifyContent: "center" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", animation: "bounce-dot 1.4s ease-in-out infinite 0ms" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", animation: "bounce-dot 1.4s ease-in-out infinite 160ms" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c084fc", animation: "bounce-dot 1.4s ease-in-out infinite 320ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
