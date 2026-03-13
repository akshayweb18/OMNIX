// "use client";
"use client";
import { useState, useEffect } from "react";

export default function ChatHistory() {
	const [chats, setChats] = useState([]);
	const [activeId, setActiveId] = useState(null);

	useEffect(() => {
		const history = JSON.parse(localStorage.getItem("omnix_chat_history") || "[]");
		setChats(history);
	}, []);

	return (
		<aside className="w-72 h-screen bg-white dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-800 flex flex-col transition-colors duration-500">
			{/* Header */}
			<div className="p-4 border-b border-gray-200 dark:border-neutral-800">
				<button
					className="w-full py-2 rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-sm font-medium transition-all duration-200"
				>
					+ New Chat
				</button>
			</div>

			{/* Chat List */}
			<div className="flex-1 overflow-y-auto p-3 space-y-2">
				{chats.length === 0 ? (
					<div className="text-xs text-gray-400">No history yet.</div>
				) : (
					chats.map((chat) => (
						<div
							key={chat.id}
							onClick={() => setActiveId(chat.id)}
							className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeId === chat.id ? "bg-gray-200 dark:bg-neutral-800 font-medium" : "hover:bg-gray-100 dark:hover:bg-neutral-900"}`}
						>
							<p className="truncate">{chat.title}</p>
						</div>
					))
				)}
			</div>

			{/* Footer */}
			<div className="p-4 border-t border-gray-200 dark:border-neutral-800 text-xs text-gray-500 dark:text-gray-400">
				OMNIX AI • Gemini Clone
			</div>
		</aside>
	);
}