import { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

const MessageInput = ({ room, username, socket }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handlers = {
      rate_limit: (msg) => toast.error(msg),
      join_error: (msg) => toast.error(msg),
      message_error: (msg) => toast.error(msg),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);

  const send = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      room,
      username,
      message,
      __createdtime__: Date.now(),
    });

    setMessage("");
  };

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
          <input
            value={message}
            inputMode="text"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type your message..."
            maxLength={100}
            className="flex-1 bg-transparent px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none text-sm sm:text-base"
          />

          <button
            onClick={send}
            disabled={!message.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
  );
};

export default MessageInput;