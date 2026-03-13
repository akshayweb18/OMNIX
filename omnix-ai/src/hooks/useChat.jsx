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

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.content || "Server busy. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]); // 🔥 THIS IS NEW CHAT
  };

  return { messages, sendMessage, loading, resetChat };
}