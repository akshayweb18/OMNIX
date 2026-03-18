import ChatMessage from "./ChatMessage";

export default function ChatList({ messages }) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, index) => (
        <div key={index} className="relative">
          <ChatMessage message={msg} />
          {/* subtle separator */}
          <div className="absolute left-0 right-0 -bottom-3 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>
      ))}
    </div>
  );
}
