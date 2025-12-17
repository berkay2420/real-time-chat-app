import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Code2, Plus, X } from "lucide-react";

const JoinRoomPage = ({ socket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState("");


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customRoomName, setCustomRoomName] = useState("");
  const [customRooms, setCustomRooms] = useState([]);
  
  const predefinedRooms = [
    { id: "javascript", name: "JavaScript", members: 12 },
    { id: "node", name: "Node.js", members: 8 },
    { id: "express", name: "Express", members: 5 },
    { id: "react", name: "React", members: 15 },
    { id: "spring", name: "Spring", members: 3 },
  ];


  const allRooms = [...predefinedRooms, ...customRooms];
  
  const joinRoom = () => {
    if (!user || !selectedRoom) return;

    socket.emit("join_room", {
      username: user.username,
      room: selectedRoom,
    });

    navigate(`/chat?room=${selectedRoom}`);
  };


  const createRoom = () => {
    if (!customRoomName.trim()) return;

    const roomId = customRoomName.toLowerCase().replace(/\s+/g, "-");

    if (allRooms.find((r) => r.id === roomId)) return;

    setCustomRooms([
      ...customRooms,
      { id: roomId, name: customRoomName, members: 1, isCustom: true },
    ]);

    setSelectedRoom(roomId);
    setCustomRoomName("");
    setShowCreateModal(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900">DevRooms</h1>
          <p className="text-gray-600">Connect with developers worldwide</p>
        </div>

        {/* User */}
        <div className="mb-10">
          <p className="text-sm text-gray-600">Logged in as</p>
          <p className="font-semibold text-lg">{user?.username}</p>
        </div>

        {/* Rooms */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Rooms
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {allRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`border-2 rounded-xl p-6 text-left transition ${
                selectedRoom === room.id
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-blue-200 bg-white hover:border-blue-500 hover:shadow"
              }`}
            >
              <div
                className={`p-2 rounded-lg mb-3 inline-block ${
                  selectedRoom === room.id
                    ? "bg-blue-600"
                    : "bg-blue-100"
                }`}
              >
                <Code2
                  className={`w-5 h-5 ${
                    selectedRoom === room.id
                      ? "text-white"
                      : "text-blue-600"
                  }`}
                />
              </div>

              <p className="font-semibold text-gray-900">{room.name}</p>
              <p className="text-sm text-gray-500 mt-2">
                {room.members} members
              </p>
            </button>
          ))}
        </div>

        {/* Join Button (FIXED – NOW VISIBLE) */}
        <button
          onClick={joinRoom}
          disabled={!selectedRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg"
        >
          Join Room
        </button>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Room</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              value={customRoomName}
              onChange={(e) => setCustomRoomName(e.target.value)}
              placeholder="Room name"
              className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 mb-4"
              autoFocus
            />

            <button
              onClick={createRoom}
              disabled={!customRoomName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg"
            >
              Create & Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRoomPage;