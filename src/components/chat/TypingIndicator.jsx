import BrainLogo from "@/components/ui/BrainLogo";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-chat-enter">
      <div className="flex items-start gap-3 max-w-[80%]">

        {/* Avatar */}
        <div className="relative h-8 w-8 rounded-xl flex items-center justify-center overflow-hidden shrink-0 mt-0.5"
          style={{ background: "rgba(14,6,35,0.9)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 4px 16px rgba(109,40,217,0.2)" }}>
          <div className="absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(circle at center, rgba(168,85,247,0.4), transparent)" }} />
          <BrainLogo size={26} animate={false} />
        </div>

        {/* Bubble */}
        <div>
          <p className="mb-1.5 text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{ color: "rgba(192,132,252,0.55)" }}>OMNIX</p>

          <div className="bubble-ai rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-3"
            style={{ color: "var(--t1)" }}>

            {/* Gradient shimmer top edge */}
            <div className="absolute top-0 left-4 right-4 h-px rounded-full opacity-40"
              style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), rgba(232,121,249,0.5), transparent)" }} />

            <span style={{ fontSize: 13, color: "var(--t2)" }}>Thinking</span>

            <div className="flex items-end gap-1.5">
              <span className="h-2 w-2 rounded-full dot-1"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 8px rgba(124,58,237,0.7)" }} />
              <span className="h-2 w-2 rounded-full dot-2"
                style={{ background: "linear-gradient(135deg, #c026d3, #9333ea)", boxShadow: "0 0 8px rgba(217,70,239,0.7)" }} />
              <span className="h-2 w-2 rounded-full dot-3"
                style={{ background: "linear-gradient(135deg, #ec4899, #f97316)", boxShadow: "0 0 8px rgba(236,72,153,0.7)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
