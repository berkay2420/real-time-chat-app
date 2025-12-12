
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const JoinRoomPage = ({username, setUsername, room, setRoom, socket}) =>{

  const navigate = useNavigate();

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('custom_event', 10,"Hi");
      socket.emit('join_room', { username, room });
      navigate('/chat', { replace: true });
    }
  }

  return (
    <div >
      <div >
        <h1>{`<>DevRooms</>`}</h1>
        <input  
          placeholder="Username..."
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />

        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">-- Select Room --</option>
          <option value="javascript">JavaScript</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="react">React</option>
        </select>

        <button className="btn btn-secondary" onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default JoinRoomPage;