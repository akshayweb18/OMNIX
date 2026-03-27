import ChatMessage from "./ChatMessage";

export default function ChatList({ messages, user }) {
  return (
    <div className="flex flex-col gap-5">
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} user={user} />
      ))}
    </div>
  );
}
