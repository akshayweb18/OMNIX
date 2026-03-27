"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router, mounted]);

  const showChat = mounted && !loading && !!user;

  return (
    <div style={{ height: "100vh", width: "100%", overflow: showChat ? "hidden" : "visible", background: "#050816" }}>
      {showChat ? (
        <ChatProvider>
          <ChatLayout />
        </ChatProvider>
      ) : (
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
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
