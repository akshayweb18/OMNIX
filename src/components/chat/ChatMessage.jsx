"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BrainLogo from "@/components/ui/BrainLogo";

function CopyBtn({ text, small }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <button onClick={copy}
      className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all"
      style={{
        background: copied ? "rgba(34,197,94,0.12)" : "rgba(99,102,241,0.08)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(139,92,246,0.18)"}`,
        color: copied ? "#4ade80" : "#a78bfa",
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = "rgba(99,102,241,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; } }}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.18)"; } }}
    >
      {copied ? "✓ Copied" : small ? "Copy" : "Copy response"}
    </button>
  );
}

function CodeBlock({ children, className }) {
  const lang = className?.replace("language-", "") || "code";
  const code = String(children).replace(/\n$/, "");
  return (
    <div className="code-block my-3">
      <div className="code-block-header">
        <span>◈ {lang}</span>
        <CopyBtn text={code} />
      </div>
      <div className="overflow-x-auto">
        <pre style={{ margin: 0, padding: "16px 18px", color: "#c4b5fd", fontSize: 13, lineHeight: 1.7 }}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`w-full flex animate-chat-enter ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-3 max-w-[88%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>

        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="relative h-8 w-8 rounded-xl gradient-fill flex items-center justify-center text-[11px] font-black text-white"
              style={{ boxShadow: "0 4px 16px rgba(124,58,237,0.45)" }}>
              U
            </div>
          ) : (
            <div className="relative h-8 w-8 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ background: "rgba(14,6,35,0.9)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 4px 16px rgba(109,40,217,0.2)" }}>
              {/* Subtle glow behind avatar */}
              <div className="absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.4), transparent)" }} />
              <BrainLogo size={26} animate={false} />
            </div>
          )}
        </div>

        {/* Message */}
        <div className="group relative min-w-0">
          {/* Role label */}
          <p className="mb-1.5 text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: isUser ? "rgba(167,139,250,0.6)" : "rgba(192,132,252,0.55)", textAlign: isUser ? "right" : "left" }}>
            {isUser ? "You" : "OMNIX"}
          </p>

          {/* Bubble */}
          <div
            className={`relative rounded-2xl px-4 py-3.5 text-[14.5px] leading-relaxed ${isUser ? "bubble-user text-white rounded-tr-sm" : "bubble-ai rounded-tl-sm"}`}
            style={isUser ? {} : { color: "var(--t1)" }}
          >
            {/* AI bubble: subtle gradient shimmer on top edge */}
            {!isUser && (
              <div className="absolute top-0 left-4 right-4 h-px rounded-full opacity-40"
                style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), rgba(232,121,249,0.5), transparent)" }} />
            )}

            {isUser ? (
              <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.content}</p>
            ) : (
              <div className="prose-omnix" style={{ wordBreak: "break-word" }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p:          ({ children }) => <div className="mb-[0.65em] last:mb-0">{children}</div>,
                    ul:         ({ children }) => <ul>{children}</ul>,
                    ol:         ({ children }) => <ol>{children}</ol>,
                    li:         ({ children }) => <li>{children}</li>,
                    strong:     ({ children }) => <strong>{children}</strong>,
                    em:         ({ children }) => <em>{children}</em>,
                    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                    h1:         ({ children }) => <h1>{children}</h1>,
                    h2:         ({ children }) => <h2>{children}</h2>,
                    h3:         ({ children }) => <h3>{children}</h3>,
                    a:          ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                    table:      ({ children }) => <div className="overflow-x-auto my-3"><table>{children}</table></div>,
                    th:         ({ children }) => <th>{children}</th>,
                    td:         ({ children }) => <td>{children}</td>,
                    code({ inline, className, children }) {
                      return inline
                        ? (
                          <code style={{
                            background: "rgba(99,102,241,0.15)",
                            color: "#c4b5fd",
                            border: "1px solid rgba(139,92,246,0.22)",
                            borderRadius: 6,
                            padding: "2px 7px",
                            fontSize: "0.88em",
                            fontFamily: "var(--font-geist-mono, monospace)",
                          }}>{children}</code>
                        )
                        : <CodeBlock className={className}>{children}</CodeBlock>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Hover actions (AI only) */}
          {!isUser && (
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-250">
              <CopyBtn text={message.content} small />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
