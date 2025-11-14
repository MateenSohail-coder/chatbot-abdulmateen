"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: accumulatedContent,
          };
          return updated;
        });
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Error: Could not get response. Try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* HEADER */}
      <header className="w-full border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl py-5 px-8 shadow-lg flex items-center justify-between sticky top-0 z-50">
        <h1 className="sm:text-xl text-1xl md:text-3xl font-extrabold font-mono tracking-wide bg-clip-text text-transparent mx-1 bg-gradient-to-r from-blue-300 to-blue-600">
          ❍ Mateen's ChatBot
        </h1>
        <button className="bg-gradient-to-r from-blue-300 to-blue-600 text-xs md:text-1xl hover:scale-120 cursor-pointer p-2 px-3 md:px-5 rounded-2xl active:scale-[0.96] transition-all">
          <a
            href="https://myportfolio-abdulmateen.vercel.app/"
            target="_blank"
            className="font-bold gap-2 flex font-mono"
          >
            Portfolio <p className="hidden md:block">➔</p>
          </a>
        </button>
      </header>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {!messages.length && (
          <div className="text-center flex items-center justify-center text-[#1f6fe77a] mt-10">
            <p className="md:text-4xl text-3xl font-mono font-extrabold ">
              Start the conversation!
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl px-5 py-4 rounded-4xl font-mono text-[15px] leading-relaxed shadow-lg backdrop-blur-md border ${
                message.role === "user"
                  ? "bg-blue-600/90 text-white border-blue-500/40 rounded-br-none"
                  : "bg-neutral-900/60 text-neutral-200 border-neutral-700 rounded-bl-none"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900/60 px-4 py-3 rounded-2xl border border-neutral-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <footer className="border-t border-neutral-800 bg-neutral-900/60 backdrop-blur-2xl p-5 shadow-xl">
        <div className="flex space-x-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a message..."
            className="flex-1 px-5 py-4 bg-neutral-800/80 text-white rounded-2xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500/60 shadow-inner placeholder-neutral-400"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 md:px-7 text-2xl md:text-xl flex  gap-2 py-3 md:py-3.5 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-blue-700/30 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <p className="hidden md:block">Send </p> <p>➣</p>
          </button>
        </div>
      </footer>
    </div>
  );
}
