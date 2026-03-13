import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/ChatContext";

export default function Page() {
  return (
    <main className="h-screen w-full">
      <ChatProvider>
        <ChatLayout />
      </ChatProvider>
    </main>
  );
}
