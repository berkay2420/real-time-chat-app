import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, LogOut, CircleUser } from "lucide-react";


const UsersPanel = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState(() => {
    const saved = localStorage.getItem(`room_users_${room}`);
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomUsers = (data) => {
      setRoomUsers(data);
      localStorage.setItem(`room_users_${room}`, JSON.stringify(data));
    };

    socket.on("chatroom_users", handleRoomUsers);
    return () => socket.off("chatroom_users", handleRoomUsers);
  }, [socket, room]);

  const leaveRoom = () => {
    socket.emit("leave_room", {
      username,
      room,
      __createdtime__: Date.now(),
    });
    navigate("/", { replace: true });
  };

  const uniqueUsers = [...new Set(roomUsers.map((u) => u.username))];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{room}</h2>
        <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
          <Users size={16} />
          <span>{uniqueUsers.length} members online</span>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {uniqueUsers.map((user) => (
          <div
            key={user}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              user === username
                ? "bg-blue-50 border border-blue-100"
                : "hover:bg-slate-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
               user === username ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {user.substring(0, 2).toUpperCase()}
            </div>
            
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${
                 user === username ? "text-blue-900" : "text-slate-700"
              }`}>
                {user} {user === username && "(You)"}
              </span>
              <span className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <button
          onClick={leaveRoom}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 py-3 rounded-xl font-semibold transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default UsersPanel;