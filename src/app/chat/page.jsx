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
        display: showChat ? "flex" : "block",
        flexDirection: showChat ? "column" : undefined,
        minHeight: 0,
        overflow: "hidden",
        background: "#050816",
      }}
    >
      {showChat ? (
        <ChatProvider>
          <ChatLayout />
        </ChatProvider>
      ) : (
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "max(20px, env(safe-area-inset-top))",
            paddingLeft: 16,
            paddingRight: 16,
            boxSizing: "border-box",
          }}
        >
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ color: "#a5b4fc", fontSize: 14, fontWeight: 600 }}>Loading OMNIX...</div>
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
