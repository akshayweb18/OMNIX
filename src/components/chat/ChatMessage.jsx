"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GalaxyLogo from "@/components/ui/GalaxyLogo";

const LANG_COLORS = {
  javascript: "#f7df1e", js: "#f7df1e", typescript: "#3178c6", ts: "#3178c6",
  python: "#3776ab", py: "#3776ab", css: "#1572b6", html: "#e34f26",
  json: "#8bc34a", bash: "#4eaa25", shell: "#4eaa25", sql: "#f29111",
  rust: "#ce422b", go: "#00add8", java: "#ed8b00", ruby: "#cc342d",
  swift: "#f05138", kotlin: "#7f52ff", php: "#777bb4", yaml: "#cb171e",
  dockerfile: "#0db7ed", graphql: "#e10098",
};

function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const go = () => { navigator.clipboard.writeText(text).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <button onClick={go} className={`copy-btn ${copied ? "copy-btn-done" : ""}`}>
      {copied ? (
        <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> Copied</>
      ) : (
        <><svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg> {label}</>
      )}
    </button>
  );
}

function CodeBlock({ children, className }) {
  const lang = className?.replace("language-", "") || "code";
  const color = LANG_COLORS[lang.toLowerCase()] || "#a5b4fc";
  const code = String(children).replace(/\n$/, "");
  return (
    <div className="code-block my-4">
      <div className="code-block-header">
        <div className="flex items-center gap-1.5">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <span className="flex items-center gap-1.5 font-bold tracking-wider" style={{ fontSize: 10, color }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, boxShadow: `0 0 5px ${color}88` }} />
          {lang.toUpperCase()}
        </span>
        <CopyBtn text={code} />
      </div>
      <div className="overflow-x-auto">
        <pre style={{ margin: 0, padding: "16px 18px", color: "#ddd6fe", fontSize: 13, lineHeight: 1.75, fontFamily: "var(--font-geist-mono,'Fira Code',monospace)" }}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, active, activeColor = "#22d3ee", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="action-btn"
      style={
        disabled
          ? { opacity: 0.35, cursor: "not-allowed" }
          : active
            ? { color: activeColor, background: `${activeColor}18`, borderColor: `${activeColor}30` }
            : undefined
      }
    >
      {icon}
    </button>
  );
}

const ThumbUp = () => <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>;
const ThumbDown = () => <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>;
const Regen = () => <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;

export default function ChatMessage({ message, user, isLastInThread, loading, isStreaming, onRegenerate }) {
  const isUser = message.role === "user";
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const canRegenerate =
    !isUser &&
    isLastInThread &&
    typeof onRegenerate === "function" &&
    !loading &&
    !!(message.content && String(message.content).trim());

  const userInitial = (user?.displayName || user?.email || "U").charAt(0).toUpperCase();
  const userName = user?.displayName?.split(" ")[0] || "You";

  return (
    <div className={`w-full flex animate-chat-enter ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-start gap-3 max-w-[88%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>

        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            user?.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover"
                style={{ border: "2px solid rgba(129,140,248,0.3)", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }} />
            ) : (
              <div className="h-8 w-8 rounded-full gradient-fill flex items-center justify-center text-[11px] font-black text-white"
                style={{ boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
                {userInitial}
              </div>
            )
          ) : (
            <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(12,16,44,0.98), rgba(21,26,62,0.95))",
                border: "1.5px solid rgba(129,140,248,0.25)",
                boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
              }}>
              <GalaxyLogo size={18} animate={false} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="group relative min-w-0 flex-1">

          {/* Name + time */}
          <div className={`flex items-center gap-2 mb-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-[11px] font-bold tracking-wide"
              style={{ color: isUser ? "rgba(165,180,252,0.7)" : "rgba(192,132,252,0.65)" }}>
              {isUser ? userName : "OMNIX"}
            </span>
          </div>

          {/* Bubble */}
          {isUser ? (
            <div className="bubble-user bubble-user-send rounded-2xl rounded-tr-md px-4 py-3 text-[14px] leading-relaxed text-white/95">
              <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{message.content}</p>
            </div>
          ) : (
            <div className="bubble-ai rounded-2xl rounded-tl-md px-5 py-4 text-[14px] leading-relaxed" style={{ color: "var(--t1)" }}>
              <div className="prose-omnix" style={{ wordBreak: "break-word" }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <div className="mb-[0.6em] last:mb-0">{children}</div>,
                    ul: ({ children }) => <ul>{children}</ul>,
                    ol: ({ children }) => <ol>{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    strong: ({ children }) => <strong>{children}</strong>,
                    em: ({ children }) => <em>{children}</em>,
                    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                    h1: ({ children }) => <h1>{children}</h1>,
                    h2: ({ children }) => <h2>{children}</h2>,
                    h3: ({ children }) => <h3>{children}</h3>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                    table: ({ children }) => <div className="overflow-x-auto my-3"><table>{children}</table></div>,
                    th: ({ children }) => <th>{children}</th>,
                    td: ({ children }) => <td>{children}</td>,
                    code({ inline, className, children }) {
                      return inline
                        ? <code style={{ background: "rgba(99,102,241,0.14)", color: "#c4b5fd", border: "1px solid rgba(99,102,241,0.22)", borderRadius: 6, padding: "2px 7px", fontSize: "0.87em", fontFamily: "var(--font-geist-mono,'Fira Code',monospace)" }}>{children}</code>
                        : <CodeBlock className={className}>{children}</CodeBlock>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Actions — AI messages */}
          {!isUser && (
            <div className="mt-2 flex flex-wrap items-center gap-1 chat-message-actions">
              <CopyBtn text={message.content} label="Copy" />
              <ActionBtn icon={<ThumbUp />} label="Helpful" onClick={() => { setLiked(v => !v); setDisliked(false); }} active={liked} activeColor="#22d3ee" />
              <ActionBtn icon={<ThumbDown />} label="Not helpful" onClick={() => { setDisliked(v => !v); setLiked(false); }} active={disliked} activeColor="#f87171" />
              <ActionBtn
                icon={<Regen />}
                label="Regenerate"
                onClick={() => onRegenerate?.()}
                active={false}
                activeColor="#a78bfa"
                disabled={!canRegenerate}
              />
            </div>
          )}

          {/* Actions — User messages */}
          {isUser && (
            <div className="mt-1.5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyBtn text={message.content} label="Copy" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
