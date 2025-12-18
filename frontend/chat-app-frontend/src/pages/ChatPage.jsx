import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UsersPanel from "../components/UsersPanel";
import MessagesPanel from "../components/MessagesPanel";
import MessageInput from "../components/MessageInput";
import { Menu, X } from "lucide-react";


const ChatRoomPage = ({ socket }) => {
  const { user, isLoading } = useAuth();
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const room = searchparams.get("room");

  useEffect(() => {
    if (!room) {
      navigate("/");
    }
  }, [room, navigate]);

  useEffect(() => {
    if (room && user && socket) {
      socket.emit("join_room", {
        username: user.username,
        room,
      });
    }
  }, [room, user, socket]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
          <span className="mt-2 font-medium">Connecting...</span>
        </div>
      </div>
    );
  }
  
  if (!room) return null;

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-20 shadow-sm">
        <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {room}
        </h1>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Responsive Wrapper) */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-80 md:shadow-none md:border-r md:border-slate-200
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <UsersPanel socket={socket} room={room} username={user.username} />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="hidden md:flex items-center px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <span className="text-2xl">#</span> {room}
           </h2>
        </div>
        
        <MessagesPanel socket={socket} room={room} />
        
        <div className="flex-shrink-0 p-4 bg-white md:bg-transparent border-t md:border-t-0 md:border-slate-100">
          <MessageInput
            socket={socket}
            room={room}
            username={user.username}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;