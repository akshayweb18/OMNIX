import ChatMessage from "./ChatMessage";

export default function ChatList({ messages }) {
  return (
    <div className="flex flex-col gap-6">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
    </div>
  );
}
