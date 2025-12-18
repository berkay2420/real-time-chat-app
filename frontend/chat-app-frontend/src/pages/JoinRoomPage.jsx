import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Code2, Plus, X, MessageSquareLock, ArrowRight, Hash } from "lucide-react";
import {toast} from "react-hot-toast";

const JoinRoomPage = ({ socket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomPassword, setNewRoomPassword] = useState("");
  
  const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

  //get rooms
  useEffect(() => {
    fetch(`${API_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch(() => setRooms([]));
  }, []);


  const joinRoom = async () => {
    if (!selectedRoom || !roomPassword) return;

    try {
      const res = await fetch(`${API_URL}/rooms/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomname: selectedRoom, password: roomPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid room password");
      }

      socket.emit("join_room", { username: user.username, room: selectedRoom });

      toast.success(`Joined room ${selectedRoom}`); 

      navigate(`/chat?room=${selectedRoom}`);
    } catch (error) {
      toast.error(error.message); 
    }
  };


  const createRoom = async () => {

    if (!newRoomName || !newRoomPassword) return;

    try {
      
      const res = await fetch(`${API_URL}/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomname: newRoomName,
          creator: user.username,
          entrancePassword: newRoomPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create new room");
      }

      setRooms([{ roomname: newRoomName, creator: user.username }, ...rooms]);
      setSelectedRoom(newRoomName);

      toast.success(`Room "${newRoomName}" created!`);

      setNewRoomName("");
      setNewRoomPassword("");
      setShowCreateModal(false);
      
    } catch (error) {
      toast.error(error.message);
    }
    
  };
  
return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Join a Room</h1>
            <p className="mt-2 text-lg text-slate-600">Select a room below or create your own secure room.</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8">
            
            {/* Rooms Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2lg font-semibold text-slate-800 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-500" /> Available Rooms
                </h2>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{rooms.length} Active</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {rooms.map((room) => (
                  <button
                    key={room.roomname}
                    onClick={() => setSelectedRoom(room.roomname)}
                    className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      selectedRoom === room.roomname
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20"
                        : "border-slate-100 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-bold text-lg ${selectedRoom === room.roomname ? "text-blue-700" : "text-slate-700"}`}>
                          {room.roomname}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                           by <span className="font-medium text-slate-600">@{room.creator}</span>
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg transition-colors ${selectedRoom === room.roomname ? "bg-blue-200 text-blue-700" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-500"}`}>
                        <MessageSquareLock className="w-5 h-5" />
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Create New Trigger Card */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all gap-2"
                >
                  <div className="p-2 bg-slate-100 rounded-full group-hover:bg-blue-100">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Create New Room</span>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                joinRoom();
              }}
              className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100"
            >
              <div className="flex-1">
                <input
                  type="password"
                  placeholder="Enter room password..."
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedRoom || !roomPassword}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95"
              >
                Join Room <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Create New Room</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Room Name</label>
                <input
                  placeholder="e.g. Hello World"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Set Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newRoomPassword}
                  onChange={(e) => setNewRoomPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRoom}
                  className="flex-1 px-4 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRoomPage;