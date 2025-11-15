// Enhanced and professional chat UI with customization options
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Sun,
  Moon,
  Palette,
  MessageSquarePlus,
  Trash2,
  Download,
  Edit2,
  Copy,
  Heart,
  Bot,
  User,
  Send,
  X,
  Check,
  Smile,
  Info,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// Dialog Components
const Dialog = ({ isOpen, onClose, title, children, theme, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full ${sizeClasses[size]} rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-neutral-900 border border-neutral-700"
              : "bg-white border border-neutral-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  theme,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  const iconProps = {
    warning: { icon: AlertTriangle, color: "text-amber-500" },
    danger: { icon: AlertTriangle, color: "text-red-500" },
    info: { icon: Info, color: "text-blue-500" },
  };

  const { icon: Icon, color } = iconProps[type];

  const buttonColors = {
    warning: "bg-amber-500 hover:bg-amber-600",
    danger: "bg-red-500 hover:bg-red-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} theme={theme} size="sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
            <Icon size={20} />
          </div>
          <h3
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            {title}
          </h3>
        </div>

        <p
          className={`mb-6 ${
            theme === "dark" ? "text-neutral-300" : "text-neutral-600"
          }`}
        >
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              theme === "dark"
                ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const Toast = ({ message, type = "success", onClose, theme }) => {
  const typeStyles = {
    success:
      theme === "dark"
        ? "bg-emerald-600 text-white"
        : "bg-emerald-500 text-white",
    error: theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white",
    info:
      theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white",
    warning:
      theme === "dark" ? "bg-amber-600 text-white" : "bg-amber-500 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${typeStyles[type]} flex items-center gap-3 min-w-[200px]`}
    >
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="hover:opacity-70 transition">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Settings Dialog
const SettingsDialog = ({
  isOpen,
  onClose,
  theme,
  accent,
  fontSize,
  onAccentChange,
  onFontSizeChange,
  onSave,
  accentColors,
}) => {
  const fontSizes = {
    "text-sm": "Small",
    "text-[15px]": "Normal",
    "text-lg": "Large",
    "text-xl": "Extra Large",
  };

  const dropdownClass = `w-full px-3 py-2 rounded-lg border focus:outline-none transition ${
    theme === "dark"
      ? "bg-neutral-800 text-white border-neutral-700"
      : "bg-white text-neutral-900 border-neutral-300"
  }`;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} theme={theme} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-bold ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            Chat Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-20 transition ${
              theme === "dark" ? "hover:bg-white" : "hover:bg-neutral-200"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              Accent Color
            </label>
            <select
              value={accent}
              onChange={(e) => onAccentChange(e.target.value)}
              className={dropdownClass}
            >
              {Object.keys(accentColors).map((color) => (
                <option key={color} value={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              Font Size
            </label>
            <select
              value={fontSize}
              onChange={(e) => onFontSizeChange(e.target.value)}
              className={dropdownClass}
            >
              {Object.entries(fontSizes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
            }`}
          >
            <h3
              className={`text-sm font-medium mb-2 ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-700"
              }`}
            >
              Preview
            </h3>
            <div
              className={`px-4 py-3 rounded-lg ${fontSize} ${
                theme === "dark"
                  ? "bg-neutral-700 text-white"
                  : "bg-white text-neutral-900"
              }`}
            >
              This is how your messages will look
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                theme === "dark"
                  ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                  : "bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r ${accentColors[accent]}`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

// Emoji picker component
const EmojiPicker = ({ onSelect, theme }) => (
  <div
    className={`absolute bottom-full mb-2 p-2 rounded-lg border shadow-lg z-10 ${
      theme === "dark"
        ? "bg-neutral-800 border-neutral-700"
        : "bg-white border-neutral-300"
    }`}
  >
    <div className="flex gap-1 flex-wrap max-w-[200px]">
      {["❤️", "😂", "😮", "😢", "👏", "🔥", "⭐", "👍"].map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="p-1 hover:scale-110 transition-transform text-lg"
        >
          {emoji}
        </button>
      ))}
    </div>
  </div>
);

// Message component
const MessageBubble = ({
  message,
  index,
  theme,
  accent,
  fontSize,
  editingIndex,
  onEdit,
  onSaveEdit,
  onCopy,
  onReaction,
  accentColors,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl px-5 py-4 rounded-3xl font-mono ${fontSize} leading-relaxed shadow-lg backdrop-blur-md border ${
          theme === "dark" ? "border-neutral-800" : "border-neutral-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              message.role === "user"
                ? `bg-gradient-to-r ${accentColors[accent]}`
                : theme === "dark"
                ? "bg-neutral-700"
                : "bg-neutral-300"
            }`}
          >
            {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  }`}
                >
                  {message.role.toUpperCase()}
                </span>
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-neutral-600" : "text-neutral-400"
                  }`}
                >
                  •
                </span>
                <span
                  className={`text-xs ${
                    theme === "dark" ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onCopy(message.content)}
                  title="Copy"
                  className={`p-1.5 rounded-lg transition ${
                    theme === "dark"
                      ? "hover:bg-neutral-700/60"
                      : "hover:bg-neutral-200/60"
                  }`}
                >
                  <Copy size={14} />
                </button>
                {message.role === "user" && (
                  <button
                    onClick={() => onEdit(index)}
                    title="Edit"
                    className={`p-1.5 rounded-lg transition ${
                      theme === "dark"
                        ? "hover:bg-neutral-700/60"
                        : "hover:bg-neutral-200/60"
                    }`}
                  >
                    <Edit2 size={14} />
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add Reaction"
                    className={`p-1.5 rounded-lg transition ${
                      theme === "dark"
                        ? "hover:bg-neutral-700/60"
                        : "hover:bg-neutral-200/60"
                    }`}
                  >
                    <Smile size={14} />
                  </button>
                  {showEmojiPicker && (
                    <EmojiPicker
                      onSelect={(emoji) => {
                        onReaction(index, emoji);
                        setShowEmojiPicker(false);
                      }}
                      theme={theme}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2">
              {editingIndex === index ? (
                <EditBox
                  initial={message.content}
                  onSave={(val) => onSaveEdit(index, val)}
                  onCancel={() => onEdit(null)}
                  theme={theme}
                />
              ) : (
                <div
                  className={`p-4 rounded-2xl overflow-x-auto ${
                    message.role === "user"
                      ? `bg-gradient-to-r ${accentColors[accent]} text-white`
                      : theme === "dark"
                      ? "bg-neutral-800/60 text-neutral-200"
                      : "bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <div className="relative">
                            <div
                              className={`absolute top-0 left-0 right-0 px-3 py-1 text-xs ${
                                theme === "dark"
                                  ? "bg-neutral-700"
                                  : "bg-neutral-300"
                              }`}
                            >
                              {match[1]}
                            </div>
                            <pre
                              className={`mt-6 p-4 rounded-lg overflow-x-auto ${
                                theme === "dark"
                                  ? "bg-neutral-900"
                                  : "bg-neutral-200"
                              }`}
                            >
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code
                            className={`px-1.5 py-0.5 rounded ${
                              theme === "dark"
                                ? "bg-neutral-700"
                                : "bg-neutral-300"
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => children,
                      a: ({ children, ...props }) => (
                        <a
                          className={`underline ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}

              {message.reactions && message.reactions.length > 0 && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {message.reactions.map((reaction, idx) => (
                    <span
                      key={idx}
                      className="text-sm cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => onReaction(index, reaction)}
                    >
                      {reaction}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Edit component
const EditBox = ({ initial, onSave, onCancel, theme }) => {
  const [val, setVal] = useState(initial);

  return (
    <div className="space-y-2">
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className={`w-full p-3 rounded-lg border resize-none min-h-[100px] ${
          theme === "dark"
            ? "bg-neutral-800 border-neutral-700 text-white"
            : "bg-white border-neutral-300 text-black"
        }`}
        autoFocus
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
            theme === "dark"
              ? "bg-neutral-700 hover:bg-neutral-600"
              : "bg-neutral-300 hover:bg-neutral-400"
          }`}
        >
          <X size={14} /> Cancel
        </button>
        <button
          onClick={() => onSave(val)}
          className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Check size={14} /> Save
        </button>
      </div>
    </div>
  );
};

export default function Chatbot() {
  const [messages, setMessages] = useLocalStorage("chat_messages", []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useLocalStorage("chat_theme", "dark");
  const [accent, setAccent] = useLocalStorage("chat_accent", "blue");
  const [fontSize, setFontSize] = useLocalStorage(
    "chat_fontSize",
    "text-[15px]"
  );
  const [editingIndex, setEditingIndex] = useState(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Dialog states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const accentColors = {
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    emerald: "from-emerald-400 to-emerald-600",
    rose: "from-rose-400 to-rose-600",
    amber: "from-amber-400 to-amber-600",
  };

  const fontSizes = {
    "text-sm": "Small",
    "text-[15px]": "Normal",
    "text-lg": "Large",
    "text-xl": "Extra Large",
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
      reactions: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const botMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      reactions: [],
    };
    setMessages((prev) => [...prev, botMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          theme:
            "You are a helpful AI assistant. Provide clear, concise responses with proper formatting when needed.",
        }),
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
          ...updated[updated.length - 1],
          content:
            "⚠️ **Connection Error**\n\nUnable to reach the server. Please check your connection and try again.",
        };
        return updated;
      });
      showToast("Failed to send message", "error");
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

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const clearChat = () => {
    setMessages([]);
    showToast("Chat cleared successfully", "success");
  };

  const exportChat = (format) => {
    let content, mimeType, extension;

    if (format === "json") {
      content = JSON.stringify(messages, null, 2);
      mimeType = "application/json";
      extension = "json";
    } else {
      content = messages
        .map(
          (m) =>
            `${m.role.toUpperCase()} [${new Date(
              m.createdAt
            ).toLocaleString()}]:\n${m.content}\n${"-".repeat(50)}`
        )
        .join("\n\n");
      mimeType = "text/plain";
      extension = "txt";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${
      new Date().toISOString().split("T")[0]
    }.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Chat exported as ${extension.toUpperCase()}`, "success");
  };

  const copyMessage = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      showToast("Message copied to clipboard", "success");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      showToast("Failed to copy message", "error");
    }
  };

  const toggleReaction = (idx, emoji) => {
    setMessages((prev) => {
      const updated = [...prev];
      const reactions = new Set(updated[idx].reactions || []);
      reactions.has(emoji) ? reactions.delete(emoji) : reactions.add(emoji);
      updated[idx].reactions = Array.from(reactions);
      return updated;
    });
  };

  const saveSettings = () => {
    setShowSettings(false);
    showToast("Settings saved successfully", "success");
  };

  const dropdownClass = `px-3 py-2 rounded-lg border focus:outline-none transition shadow-sm ${
    theme === "dark"
      ? "bg-neutral-800 text-white border-neutral-700"
      : "bg-white text-neutral-900 border-neutral-300"
  }`;

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white"
          : "bg-gradient-to-br from-neutral-50 via-white to-neutral-100 text-black"
      }`}
    >
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearChat}
        title="Clear Chat History"
        message="Are you sure you want to clear all messages? This action cannot be undone."
        theme={theme}
        type="warning"
        confirmText="Clear Chat"
      />

      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        accent={accent}
        fontSize={fontSize}
        onAccentChange={setAccent}
        onFontSizeChange={setFontSize}
        onSave={saveSettings}
        accentColors={accentColors}
      />

      {/* HEADER */}
      <header
        className={`w-full border-b px-6 py-4 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40 ${
          theme === "dark"
            ? "border-neutral-800 bg-neutral-900/80"
            : "border-neutral-300 bg-white/80"
        }`}
      >
        <h1
          className={`text-sm sm:text-1xl md:text-3xl font-extrabold font-mono tracking-wide bg-clip-text text-transparent bg-gradient-to-r ${accentColors[accent]}`}
        >
          ❍ Mateen's ChatBot
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-xl hover:scale-110 transition ${
              theme === "dark" ? "bg-neutral-700/30" : "bg-neutral-100/60"
            }`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl hover:scale-110 transition ${
              theme === "dark" ? "bg-neutral-700/30" : "bg-neutral-100/60"
            }`}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className={`p-2 rounded-xl hover:scale-110 transition ${
              theme === "dark" ? "bg-neutral-700/30" : "bg-neutral-100/60"
            }`}
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
          <button
            className={`p-2 rounded-xl hover:scale-110 transition ${
              theme === "dark" ? "bg-neutral-700/30" : "bg-neutral-100/60"
            }`}
          >
            <a
              href="https://myportfolio-abdulmateen.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold gap-2 flex font-mono text-sm"
            >
              Portfolio ➔
            </a>
          </button>
        </div>
      </header>

      {/* CUSTOMIZATION PANEL */}
      <div
        className={`px-6 py-3 flex flex-wrap gap-4 items-center border-b ${
          theme === "dark"
            ? "border-neutral-800/40 bg-neutral-900/30"
            : "border-neutral-200/40 bg-white/40"
        }`}
      >
        <div className="flex items-center gap-2">
          <Palette size={16} />
          <select
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className={dropdownClass}
          >
            {Object.keys(accentColors).map((color) => (
              <option
                key={color}
                value={color}
                className={theme === "dark" ? "bg-neutral-800" : "bg-white"}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <MessageSquarePlus size={16} />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={dropdownClass}
          >
            {Object.entries(fontSizes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => exportChat("txt")}
            className={`px-3 py-2 rounded-lg text-sm ${
              theme === "dark"
                ? "bg-neutral-800/60 hover:bg-neutral-700/60"
                : "bg-neutral-100/60 hover:bg-neutral-200/60"
            }`}
          >
            Export TXT
          </button>
          <button
            onClick={() => exportChat("json")}
            className={`px-3 py-2 rounded-lg text-sm ${
              theme === "dark"
                ? "bg-neutral-800/60 hover:bg-neutral-700/60"
                : "bg-neutral-100/60 hover:bg-neutral-200/60"
            }`}
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className={`flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 ${
          theme === "dark"
            ? "scrollbar-thumb-neutral-700 scrollbar-track-neutral-900"
            : "scrollbar-thumb-neutral-300 scrollbar-track-neutral-100"
        } scrollbar-thin`}
      >
        {!messages.length && (
          <div className="text-center flex flex-col items-center justify-center text-neutral-400 mt-20">
            <Bot size={64} className="mb-4 opacity-50" />
            <p className="text-2xl font-mono font-bold mb-2">
              Start a conversation
            </p>
            <p className="text-sm opacity-70">
              Ask anything and I'll help you out!
            </p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
              theme={theme}
              accent={accent}
              fontSize={fontSize}
              editingIndex={editingIndex}
              onEdit={setEditingIndex}
              onSaveEdit={(idx, content) => {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[idx] = { ...updated[idx], content };
                  return updated;
                });
                setEditingIndex(null);
                showToast("Message updated", "success");
              }}
              onCopy={(text) => copyMessage(text, message.id)}
              onReaction={toggleReaction}
              accentColors={accentColors}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`px-5 py-4 rounded-3xl shadow-lg backdrop-blur-md border ${
                theme === "dark"
                  ? "bg-neutral-800/60 border-neutral-700"
                  : "bg-neutral-100/60 border-neutral-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    theme === "dark" ? "bg-neutral-700" : "bg-neutral-300"
                  }`}
                >
                  <Bot size={16} />
                </div>
                <div className="flex space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${
                      theme === "dark" ? "bg-neutral-500" : "bg-neutral-400"
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce delay-150 ${
                      theme === "dark" ? "bg-neutral-500" : "bg-neutral-400"
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce delay-300 ${
                      theme === "dark" ? "bg-neutral-500" : "bg-neutral-400"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <footer
        className={`border-t p-4 backdrop-blur-xl ${
          theme === "dark"
            ? "border-neutral-800 bg-neutral-900/80"
            : "border-neutral-300 bg-white/80"
        }`}
      >
        <div className="flex space-x-3 items-center justify-center max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (Shift+Enter for new line)"
              className={`w-full px-4 py-3 rounded-2xl shadow-inner placeholder-neutral-400 border resize-none min-h-[60px] max-h-[200px] ${
                theme === "dark"
                  ? "bg-neutral-800/80 text-white border-neutral-700 focus:ring-2 focus:ring-blue-500/60"
                  : "bg-neutral-50 text-black border-neutral-300 focus:ring-2 focus:ring-blue-500/60"
              }`}
              rows={1}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold bg-gradient-to-r ${accentColors[accent]} hover:scale-105 active:scale-95 flex items-center gap-2`}
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        <div
          className={`text-xs text-center mt-2 ${
            theme === "dark" ? "text-neutral-500" : "text-neutral-400"
          }`}
        >
          Press Enter to send, Shift+Enter for new line
        </div>
      </footer>
    </div>
  );
}
