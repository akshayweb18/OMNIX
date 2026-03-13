"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "@/hooks/useChat";
import { useSpeech } from "@/hooks/useSpeech";

export default function ChatLayout() {
  const { messages, sendMessage, loading, resetChat } = useChat();
  const { speak } = useSpeech();
  const bottomRef = useRef(null);

  const [activeChatId, setActiveChatId] = useState(1);
  const [recentChats] = useState([
    { id: 1, title: "Drafting welcome email" },
    { id: 2, title: "Market research GPT" },
    { id: 3, title: "Product launch plan" },
  ]);

  useEffect(() => {
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === "assistant") {
      speak(lastMessage.content);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages, speak]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="relative min-h-screen h-screen bg-[#03040B] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-72 -left-72 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-transparent blur-3xl animate-spin-slow" />
        <div className="absolute -bottom-72 -right-72 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-pink-500/30 via-sky-400/20 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-[45%] h-[420px] w-[420px] rounded-full bg-indigo-500/30 blur-2xl opacity-80 animate-float duration-[18s]" />
        <div className="absolute top-4 right-10 h-24 w-24 rounded-full bg-pink-400/30 blur-2xl opacity-70 animate-float duration-[16s]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative flex min-h-screen h-screen w-full flex-col lg:flex-row items-start gap-0 px-3 py-3 md:px-6 md:py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex w-[260px] h-full flex-col overflow-visible pr-4">
          <div className="relative flex h-full flex-col overflow-visible rounded-3xl border border-white/10 bg-white/5/20 p-4 backdrop-blur-2xl shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-500/10 to-transparent blur-2xl" />
            <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full bg-pink-500/15 blur-2xl" />

            <div className="relative flex flex-col h-full">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    Recent Chats
                  </p>
                  <h2 className="text-sm font-semibold text-white">
                    My Chats
                  </h2>
                </div>

                <button
                  onClick={() => {
                    resetChat();
                    setActiveChatId(Date.now());
                  }}
                  className="h-10 w-10 rounded-xl bg-white/10 text-white/80 transition hover:bg-white/15"
                  aria-label="New chat"
                >
                  +
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto overflow-x-visible pr-1 pb-2">
                <div className="space-y-2">
                  {recentChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChatId(chat.id)}
                      className={`group relative w-full cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-400/60 ${
                        activeChatId === chat.id
                          ? "bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/15 text-white shadow-[0_10px_30px_-15px_rgba(99,102,241,0.4)]"
                          : "text-white/70 hover:bg-white/10 hover:text-white hover:shadow-md"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition-all ${
                          activeChatId === chat.id
                            ? "bg-gradient-to-b from-indigo-400 to-fuchsia-400"
                            : "bg-transparent group-hover:bg-indigo-400/50"
                        }`}
                      />

                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold text-white/70">
                          {chat.title[0]}
                        </span>
                        <span className="block truncate text-sm font-medium">{chat.title}</span>
                      </div>

                      {activeChatId === chat.id && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-400/80 shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  resetChat();
                  setActiveChatId(Date.now());
                }}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15"
              >
                <span className="text-lg">+</span>
                New Chat
              </button>

              <div className="mt-3 text-xs text-white/40">
                • Gemini • AI Chat
              </div>

              {/* AI Todo Assistant in Sidebar */}
              <div className="mt-6">
              </div>
            </div>
          </div>
        </aside>

        {/* Main card */}
        <div className="flex-1 max-w-[1800px] mx-auto h-full w-full">
          <div className="mx-0 flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/40 p-3 md:p-6 backdrop-blur-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
            <ChatHeader
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              recentChats={recentChats}
              onNewChat={() => {
                resetChat();
                setActiveChatId(Date.now());
              }}
            />

            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pb-2">
                <div className="w-full space-y-6 px-4 lg:px-6">
                  {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center text-center mt-14">
                      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-60 animate-pulse" />
                        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black/30">
                          <span className="text-lg font-semibold text-white/90">AI</span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-semibold">I can help you with anything from coding to creative writing.</h2>
                      <p className="mt-3 text-sm text-white/70 max-w-lg">
                        What would you like to build today?
                      </p>
                    </div>
                  )}

                  <ChatList messages={messages} />
                  {loading && <TypingIndicator />}

                  <div ref={bottomRef} />
                </div>
              </div>
            </div>

            <ChatInput onSend={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
