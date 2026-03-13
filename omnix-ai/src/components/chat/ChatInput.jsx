"use client";

import { useState } from "react";
import useVoice from "@/hooks/useVoice";
import { useSpeech } from "@/hooks/useSpeech";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  // Store history in localStorage
  const saveHistory = (msg) => {
    let history = JSON.parse(localStorage.getItem("omnix_chat_history") || "[]");
    history.unshift({ id: Date.now(), title: msg });
    localStorage.setItem("omnix_chat_history", JSON.stringify(history.slice(0, 50)));
  };

  const { listening, startListening, stopListening } = useVoice((wakeText) => {
    if (!wakeText.trim()) return;
    onSend(`You said: "${wakeText}"`);
  });

  const { stop } = useSpeech();

  const handleSend = () => {
    if (!text.trim()) return;
    stop();
    onSend(text);
    saveHistory(text);
    setText("");
  };

  const handleInputClick = () => {
    // Stop any ongoing speech when user clicks input
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    // Stop any ongoing speech when user starts typing
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
  };

  const handleMicClick = () => {
    if (listening) {
      stopListening();
      return;
    }

    // stop any ongoing TTS before starting voice input
    stop();
    startListening();

    // Auto stop after 3 seconds
    setTimeout(() => {
      stopListening();
    }, 3000);
  };

  return (
    <div className="w-full bg-white/5 border-t border-white/10 py-2 pb-3 md:pb-4 backdrop-blur-sm">
      <div className="w-full px-2 md:px-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 rounded-3xl border border-white/10 bg-white/10 px-2 md:px-4 py-2 md:py-3 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:ring-white/20 focus-within:ring-white/30">

          {/* Input */}
          <input
            value={text}
            onChange={handleInputChange}
            onFocus={handleInputClick}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Omnix anything..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base text-white placeholder-white/50 caret-indigo-300 py-2"
          />

          {/* 🎙️ Mic Button */}
          <button
            onClick={handleMicClick}
            aria-label={listening ? "Stop listening" : "Start voice input"}
            className={`
              relative ml-1 sm:ml-2 w-9 h-9 sm:w-11 sm:h-11 rounded-full
              flex items-center justify-center
              transition-all duration-500 ease-in-out
              backdrop-blur-md
              ${
                listening
                  ? "bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-purple-500 text-white shadow-[0_0_0_4px_rgba(99,102,241,0.35)]"
                  : "bg-white/10 text-white/70 border border-white/10 shadow-sm hover:bg-white/15"
              }
            `}
          >
            {/* Animated Pulse Ring */}
            {listening && (
              <span className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-75" />
            )}

            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`relative z-10 w-5 h-5 transition-all duration-700 ${
                listening ? "scale-110 opacity-100" : "scale-90 opacity-70"
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zm5-3a1 1 0 10-2 0 3 3 0 11-6 0 1 1 0 10-2 0 5 5 0 0010 0zm-5 9a1 1 0 001-1v-3h-2v3a1 1 0 001 1z" />
            </svg>
          </button>

          {/* 🚀 Send Button */}
          <button
            onClick={handleSend}
            className="
              ml-1 sm:ml-2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
              bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500
              text-white
              shadow-[0_15px_25px_-15px_rgba(99,102,241,0.55)]
              transition-all duration-300
              hover:scale-105 hover:shadow-[0_18px_35px_-15px_rgba(99,102,241,0.65)]
              active:scale-95
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
}