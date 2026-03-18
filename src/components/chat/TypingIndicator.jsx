export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl assistant-bubble-gradient border border-white/6 backdrop-blur-lg text-white text-[15px]">
        <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse shadow-md" />

        <span className="font-medium text-white/90">Omnix is typing</span>

        <div className="flex gap-1 items-end">
          <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
