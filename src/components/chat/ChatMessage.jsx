"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} animate-chat-entry`}
    >
      <div
        className={`flex items-start gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`
            w-9 h-9 rounded-full flex items-center justify-center
            text-xs font-semibold text-white shadow-md flex-shrink-0
            ${
              isUser
                ? "bg-gray-400"
                : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
            }
          `}
        >
          {isUser ? "U" : "AI"}
        </div>

        {/* Message Container */}
        <div className="group relative max-w-[650px]">

          {/* Bubble */}
          <div
            className={`
              px-5 py-3 rounded-lg text-[15px] leading-relaxed
              transition-all duration-300
              ${
                isUser
                  ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg transform-gpu"
                  : "assistant-bubble-gradient text-white border-transparent backdrop-blur-xl ring-1 ring-purple-500/12 hover:shadow-[0_18px_40px_-18px_rgba(99,102,241,0.25)] transition"
              }
            `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                code({ inline, children }) {
                  return inline ? (
                    <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-3">
                      <code>{children}</code>
                    </pre>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Hover Copy Button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="absolute -bottom-6 left-2 text-xs text-gray-200/80 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-white"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}









