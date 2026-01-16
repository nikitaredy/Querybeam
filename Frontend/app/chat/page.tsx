"use client";

import { useState } from "react";
import { askQuestion } from "@/lib/api";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await askQuestion(input);

    const botMsg = { role: "assistant", text: res.answer };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">QueryBeam Chat</h1>

      <div className="space-y-3 mb-6 bg-gray-100 p-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
