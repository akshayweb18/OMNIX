"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import Modal from "@/components/ui/Modal";

export default function ChatHeader() {
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const { resetChat } = useChat();

  const copyModelName = async () => {
    try {
      await navigator.clipboard.writeText("gemini-3-flash-preview");
    } catch {
      // ignore - clipboard may be blocked in some environments
    }
  };

  return (
    <>
      <header className="border-b border-white/10 bg-white/5/30 backdrop-blur-2xl backdrop-saturate-150 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 flex items-center justify-center text-white text-sm font-bold animate-glow">
                O
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-25 -z-10" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-white tracking-tight">
                <span className="bg-gradient-to-r from-indigo-200 via-white to-pink-200 bg-clip-text text-transparent">
                  OMNIX
                </span>
              </span>
              <span className="text-[11px] text-white/60">
                Gemini 3 Flash Preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/15 transition"
            >
              <span className="text-lg">+</span>
              New chat
            </button>

            <button
              onClick={() => setIsModelModalOpen(true)}
              className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/90 transition"
              aria-label="Model info"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-1a1 1 0 012 0v5a1 1 0 11-2 0V9zm1-3a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 6z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white/90">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      <Modal
        open={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        title="Gemini 3 Flash Preview"
      >
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
          <p>
            This chat is powered by Google’s <strong>Gemini 3 Flash Preview</strong> model.
            It provides fast, high-quality responses and is designed for broad conversational usage.
          </p>

          <div className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Current model
                </p>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  gemini-3-flash-preview
                </p>
              </div>

              <button
                onClick={copyModelName}
                className="rounded-lg bg-white/70 dark:bg-white/10 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-white dark:hover:bg-white/20 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tip: Use the copy button to paste the model identifier into scripts,
            integrations, or prompts.
          </p>
        </div>
      </Modal>
    </>
  );
}
