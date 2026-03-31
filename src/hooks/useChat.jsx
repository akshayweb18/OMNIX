"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { matchesOmnixCreatorQuestion, OMNIX_CREATOR_REPLY } from "@/lib/omnixCreatorQuestion";

const MAX_MESSAGES_FOR_API = 48;

function trimForApi(messages) {
  if (messages.length <= MAX_MESSAGES_FOR_API) return messages;
  let sliced = messages.slice(-MAX_MESSAGES_FOR_API);
  while (sliced.length > 1 && sliced[0].role === "assistant") {
    sliced = sliced.slice(1);
  }
  return sliced;
}

export function useChat() {
  const { messages, setMessages, loading, setLoading } = useChatContext();
  const messagesRef = useRef(messages);
  const abortRef = useRef(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const runCompletion = useCallback(
    async (conversation) => {
      const trimmed = trimForApi(conversation);
      if (!trimmed.length || trimmed[trimmed.length - 1].role !== "user") {
        setLoading(false);
        return;
      }

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({ messages: trimmed }),
        });

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          let errMsg = "Server error";
          try {
            const errData = await res.json();
            errMsg = errData.error || errMsg;
          } catch {
            /* ignore */
          }
          throw new Error(errMsg);
        }

        if (contentType.includes("application/json")) {
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data?.content || "No response." },
          ]);
        } else {
          const reader = res.body?.getReader();
          if (!reader) throw new Error("No response body");

          const decoder = new TextDecoder();
          let accumulated = "";
          let started = false;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            accumulated += decoder.decode(value, { stream: true });

            if (!started) {
              if (!accumulated) continue;
              started = true;
              setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
              continue;
            }

            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "assistant") {
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
              }
              return updated;
            });
          }

          if (!accumulated.trim()) {
            if (!started) {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "No response received." },
              ]);
            } else {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: "No response received.",
                  };
                }
                return updated;
              });
            }
          }
        }
      } catch (err) {
        if (err?.name === "AbortError") {
          setMessages((prev) => {
            if (!prev.length) return prev;
            const last = prev[prev.length - 1];
            if (last.role !== "assistant") return prev;
            if (!last.content?.trim()) return prev.slice(0, -1);
            return [
              ...prev.slice(0, -1),
              { role: "assistant", content: `${last.content}\n\n*— Stopped.*` },
            ];
          });
          return;
        }
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Something went wrong: ${err.message || "Unknown error"}. Please try again.`,
          },
        ]);
      } finally {
        if (abortRef.current === ac) abortRef.current = null;
        setLoading(false);
      }
    },
    [setMessages, setLoading]
  );

  const sendMessage = async (text) => {
    const t = text.trim();
    if (!t || loading) return;

    if (matchesOmnixCreatorQuestion(t)) {
      const userMessage = { role: "user", content: t };
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: "assistant", content: OMNIX_CREATOR_REPLY },
      ]);
      return;
    }

    const userMessage = { role: "user", content: t };
    const nextConversation = [...messagesRef.current, userMessage];
    setMessages(nextConversation);
    setLoading(true);
    await runCompletion(nextConversation);
  };

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const regenerateLastAssistant = useCallback(async () => {
    if (loading) return;
    const prev = messagesRef.current;
    if (!prev.length || prev[prev.length - 1].role !== "assistant") return;
    const withoutAssistant = prev.slice(0, -1);
    if (!withoutAssistant.length || withoutAssistant[withoutAssistant.length - 1].role !== "user") {
      return;
    }

    abortRef.current?.abort();
    setMessages(withoutAssistant);
    setLoading(true);
    await runCompletion(withoutAssistant);
  }, [loading, runCompletion, setMessages, setLoading]);

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([]);
  };

  const loadChat = (msgs) => {
    abortRef.current?.abort();
    setMessages(msgs || []);
  };

  return {
    messages,
    sendMessage,
    loading,
    resetChat,
    loadChat,
    stopGeneration,
    regenerateLastAssistant,
  };
}
