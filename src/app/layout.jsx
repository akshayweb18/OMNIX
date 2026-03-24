import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OMNIX — AI Assistant",
  description: "OMNIX is a world-class AI assistant powered by Gemini. Ask anything, build anything.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          font-sans antialiased
        `}
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
