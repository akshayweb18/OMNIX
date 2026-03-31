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

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
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
