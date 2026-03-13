import React from "react";

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="mb-8 animate-pulse">
        {/* Futuristic Brain SVG */}
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6e56cf" />
              <stop offset="50%" stopColor="#ff6ecf" />
              <stop offset="100%" stopColor="#56cfff" />
            </radialGradient>
          </defs>
          <ellipse cx="32" cy="32" rx="28" ry="20" fill="url(#brainGlow)" />
          <path d="M20 32c0-8 8-12 12-12s12 4 12 12-8 12-12 12-12-4-12-12z" stroke="#fff" strokeWidth="2" fill="none" />
          <path d="M32 20v24" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 28c4 4 12 4 16 0" stroke="#fff" strokeWidth="2" fill="none" />
          <path d="M24 36c4-4 12-4 16 0" stroke="#fff" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-2">Hello, I'm Futuristic</h1>
      <p className="text-lg mb-6">Your AI digital partner. What would you like to build today?</p>
      <div className="flex gap-4">
        <button className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-lg transition">Start Chat</button>
        <button className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold shadow-lg transition">Explore Prompts</button>
      </div>
    </div>
  );
}
