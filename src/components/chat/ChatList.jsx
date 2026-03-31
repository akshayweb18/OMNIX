import ChatMessage from "./ChatMessage";

export default function ChatList({ messages, user, onRegenerateLast, loading }) {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;
        const isStreaming = !!loading && isLast && msg.role === "assistant";
        return (
          <ChatMessage
            key={index}
            message={msg}
            user={user}
            isLastInThread={isLast}
            loading={!!loading}
            isStreaming={isStreaming}
            onRegenerate={onRegenerateLast}
          />
        );
      })}
    </div>
  );
}
