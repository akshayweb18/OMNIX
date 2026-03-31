import GalaxyLogo from "@/components/ui/GalaxyLogo";

export default function TypingIndicator() {
  return (
    <div className="w-full flex justify-start animate-chat-enter thinking-row" aria-live="polite" aria-busy="true">
      <div className="flex items-start gap-3 max-w-[88%] sm:max-w-[80%]">

        <div className="shrink-0 mt-1">
          <div className="thinking-avatar-glow h-8 w-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(12,16,44,0.98), rgba(21,26,62,0.95))",
              border: "1.5px solid rgba(129,140,248,0.35)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            }}>
            <GalaxyLogo size={18} animate />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wide" style={{ color: "rgba(192,132,252,0.65)" }}>
              OMNIX
            </span>
          </div>

          <div className="bubble-ai thinking-bubble rounded-2xl rounded-tl-md px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="thinking-shimmer text-[14px] font-medium tracking-tight" style={{ color: "var(--t1)" }}>
                AI is thinking…
              </span>
            </div>
            <div className="thinking-bar" aria-hidden>
              <div className="thinking-bar-inner" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full thinking-dot-1" style={{ background: "linear-gradient(180deg, #818cf8, #6366f1)" }} />
              <span className="h-2 w-2 rounded-full thinking-dot-2" style={{ background: "linear-gradient(180deg, #a78bfa, #8b5cf6)" }} />
              <span className="h-2 w-2 rounded-full thinking-dot-3" style={{ background: "linear-gradient(180deg, #c084fc, #a855f7)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
