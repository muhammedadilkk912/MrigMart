import React, { useEffect, useRef, useState } from "react";

// ChatWidget.jsx
// Single-file React component for a responsive chat widget using Tailwind CSS.
// Usage: import ChatWidget from './ChatWidget';
// <ChatWidget user={{ id: 'u1', name: 'Adil' }} onSend={(msg)=>...} />

export default function ChatWidget({
  user = { id: "visitor", name: "You" },
  messages: initialMessages = [],
  onSend = null, // optional callback when a message is sent (msg => void)
  position = "bottom-right", // bottom-right | bottom-left
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    // auto-scroll to bottom whenever messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Simulate incoming reply (for demo) — remove for production
  useEffect(() => {
    // if last message is from current user, simulate a short reply
    const last = messages[messages.length - 1];
    if (last && last.sender?.id === user.id) {
      setIsTyping(true);
      const t = setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: `bot-${Date.now()}`,
            text: "Thanks for your message! We'll reply shortly.",
            sender: { id: "agent", name: "Support" },
            time: new Date().toISOString(),
          },
        ]);
        setIsTyping(false);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [messages, user.id]);

  function handleSend(e) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !fileRef.current?.files?.length) return;
    setSending(true);

    const newMsg = {
      id: `msg-${Date.now()}`,
      text: trimmed || "[file]",
      sender: { id: user.id, name: user.name },
      time: new Date().toISOString(),
    };

    // Add to UI immediately
    setMessages((m) => [...m, newMsg]);

    // If file attached, show a separate message (demo only)
    if (fileRef.current?.files?.length) {
      const f = fileRef.current.files[0];
      setMessages((m) => [
        ...m,
        {
          id: `file-${Date.now()}`,
          text: `${f.name} (attachment)`,
          sender: { id: user.id, name: user.name },
          time: new Date().toISOString(),
          fileName: f.name,
        },
      ]);
      fileRef.current.value = null;
    }

    // optional callback to parent (e.g., to send to server)
    if (typeof onSend === "function") {
      try {
        onSend(newMsg);
      } catch (err) {
        // swallow
      }
    }

    setText("");
    setSending(false);
  }

  function handleFileClick() {
    fileRef.current?.click();
  }

  const containerPositionClass =
    position === "bottom-left" ? "left-6 bottom-6" : "right-6 bottom-6";

  return (
    <div className={`fixed ${containerPositionClass} z-50`}>
      <div className="flex flex-col items-end">
        {/* widget button */}
        <div className="mb-2">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4v-4H7a2 2 0 01-2-2V10a2 2 0 012-2h2"
              />
            </svg>
            <span className="text-sm font-medium">Support</span>
          </button>
        </div>

        {/* panel */}
        <div
          className={`${
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          } w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-200`}
          role="dialog"
          aria-label="Chat widget"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">S</div>
              <div>
                <div className="text-sm font-semibold">Support</div>
                <div className="text-xs opacity-80">We typically reply within a few minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                title="Minimize"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-72 md:h-80">
            {/* messages list */}
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-sm text-gray-500">Say hello 👋</div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender?.id === user.id ? "justify-end" : "justify-start"}`}>
                  <div className={`${m.sender?.id === user.id ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border"} max-w-xs px-3 py-2 rounded-lg shadow-sm` }>
                    <div className="text-xs opacity-80 mb-1">{m.sender?.name}</div>
                    <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                    <div className="text-[10px] opacity-60 mt-1 text-right">{new Date(m.time).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border max-w-xs px-3 py-2 rounded-lg shadow-sm">
                    <div className="text-sm">Support is typing<span className="animate-pulse">...</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* input */}
            <form onSubmit={handleSend} className="px-3 py-2 border-t bg-white">
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleFileClick} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none" title="Attach file">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828V7h-2.828z" />
                  </svg>
                </button>

                <input ref={fileRef} type="file" className="hidden" />

                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 px-3 py-2 rounded-full border focus:outline-none focus:ring-1 focus:ring-indigo-300"
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 rounded-full bg-indigo-600 text-white font-medium disabled:opacity-60 hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
