"use client";

import { useChatContext } from "@/context/ChatContext";

export function useChat() {
  const { messages, setMessages, loading, setLoading } = useChatContext();

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const lowerText = text.toLowerCase().trim();
    if (
      lowerText.includes("who made you") ||
      lowerText.includes("who developed you") ||
      lowerText.includes("your creator")
    ) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I was made by Akshay Chaudhari." },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Server error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accumulated };
          return updated;
        });
      }

      if (!accumulated.trim()) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: "Server busy. Please try again." };
          return updated;
        });
      }

    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
  };

  const loadChat = (msgs) => {
    setMessages(msgs || []);
  };

  return { messages, sendMessage, loading, resetChat, loadChat };
}
