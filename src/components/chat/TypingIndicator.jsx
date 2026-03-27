import GalaxyLogo from "@/components/ui/GalaxyLogo";

export default function TypingIndicator() {
  return (
    <div className="w-full flex justify-start animate-chat-enter">
      <div className="flex items-start gap-3 max-w-[80%]">

        {/* Avatar */}
        <div className="shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(12,16,44,0.98), rgba(21,26,62,0.95))",
              border: "1.5px solid rgba(129,140,248,0.25)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
            }}>
            <GalaxyLogo size={18} animate={false} />
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wide" style={{ color: "rgba(192,132,252,0.65)" }}>OMNIX</span>
          </div>

          <div className="bubble-ai rounded-2xl rounded-tl-md px-5 py-3.5 flex items-center gap-3">
            <span className="text-[13px] font-medium" style={{ color: "var(--t2)" }}>Thinking</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full dot-1" style={{ background: "#818cf8" }} />
              <span className="h-1.5 w-1.5 rounded-full dot-2" style={{ background: "#a78bfa" }} />
              <span className="h-1.5 w-1.5 rounded-full dot-3" style={{ background: "#c084fc" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
