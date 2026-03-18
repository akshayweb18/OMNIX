export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-lg text-gray-200 text-[15px]">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse" />

        <span className="font-medium text-white/80">Omnix is typing</span>

        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
