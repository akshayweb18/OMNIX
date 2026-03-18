"use client";

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col p-4">
      
      {/* Logo */}
      <div className="text-xl font-semibold mb-8">
        OMNIX
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-3">

        <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          🏠 Home
        </button>

        <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          💬 Chats
        </button>

        <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
          ⚙ Settings
        </button>
            {/* Logo */}
            <div className="text-2xl font-bold mb-8 tracking-wide flex items-center gap-2">
              <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">OMNIX</span>
              <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg">AI</span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-indigo-800 transition font-semibold">
                <span>🆕</span> New Chat
              </button>
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-purple-800 transition">
                <span>📜</span> Chat History
              </button>
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-pink-800 transition">
                <span>⭐</span> Favorites
              </button>
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                <span>👤</span> Profile
              </button>
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                <span>⚙️</span> Settings
              </button>
              <button className="flex items-center gap-2 text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                <span>❓</span> Help
              </button>
            </div>

        {/* ChatHistory will show sent messages */}
        <ChatHistory />
      </div>

      {/* Bottom */}
      <div className="mt-auto text-xs text-gray-400">
        Made by Akshay
      </div>

    </div>
  );
}