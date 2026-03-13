import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatPage() {
  return (
    <main className="h-screen w-full">
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
    </main>
  );
}
