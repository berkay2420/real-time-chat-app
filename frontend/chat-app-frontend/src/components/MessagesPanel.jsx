import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"; 
import { Clock } from "lucide-react";

const MessagesPanel = ({ socket, room }) => {

  const { user, isLoading } = useAuth();

  const [messagesRecieved, setMessagesReceived] = useState(() => {
    //read messages from storage
    const savedMessages = localStorage.getItem(`chat_messages_${room}`);

    //parse messages from storage else return empty list
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const messagesColumnRef = useRef(null);
  const hasLoadedLastMessagesRef = useRef(false);

  useEffect(() => {

    
    const handleReceiveMessage = (data) => {
      
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    }
    
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      
    }
    
  }, [socket]);

  //fetch last 100 messages 
  useEffect(() => {
    if (!hasLoadedLastMessagesRef.current) {
      const handleLastMessages = (lastMessages) => {
        
        const sorted = sortMessagesByDate(lastMessages);
        setMessagesReceived(sorted);
        hasLoadedLastMessagesRef.current = true;
      };

      socket.on('last_messages', handleLastMessages);

      return () => socket.off('last_messages', handleLastMessages);
    }
  }, [socket]);

  useEffect(() => {
    //save messages to the local storage 
    localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesRecieved));

  }, [messagesRecieved, room]); //works when this updated

  //scroll
  useEffect(() => {
    if (messagesColumnRef.current) {
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }


  function formatTimeFromTimestamp(timestamp) {
    if (!timestamp) return '...';
    
    const time = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    
    if (isNaN(time.getTime())) return '...';
    
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }

  
  return (
    <div
      ref={messagesColumnRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6 custom-scrollbar"
    >
      {messagesRecieved.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 animate-pulse"></div>
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}

      {messagesRecieved.map((msg, i) => {
        const isMe = user?.username === msg.username;
        const isSystem = msg.username === 'ChatBot'; // Assuming there might be a system bot

        if (isSystem) {
           return (
             <div key={i} className="flex justify-center my-4">
               <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                 {msg.message}
               </span>
             </div>
           )
        }

        return (
          <div
            key={i}
            className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
              
              <div className={`flex items-baseline gap-2 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <span className="text-xs font-bold text-slate-700">{msg.username}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                   {formatTimeFromTimestamp(msg.__createdtime__ || msg.createdAt)}
                </span>
              </div>

              <div
                className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative wrap-break-word ${
                  isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                }`}
              >
                {msg.message}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesPanel;