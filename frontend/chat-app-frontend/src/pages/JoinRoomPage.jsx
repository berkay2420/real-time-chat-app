import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const JoinRoomPage = ({ socket }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (!user || !room) return;

    socket.emit("join_room", {
      username: user.username,
      room,
    });

    navigate(`/chat?room=${room}`);
  };

  return (
    <div>
      <h1>{`<>DevRooms</>`}</h1>
      <p>
        Logged in as: <b>{user.username}</b>
      </p>

      <select value={room} onChange={(e) => setRoom(e.target.value)}>
        <option value="">-- Select Room --</option>
        <option value="javascript">JavaScript</option>
        <option value="node">Node</option>
        <option value="express">Express</option>
        <option value="react">React</option>
        <option value="spring">Spring</option>
      </select>

      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoomPage;