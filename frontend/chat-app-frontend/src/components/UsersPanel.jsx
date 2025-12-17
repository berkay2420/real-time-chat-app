import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPanel = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState(() => {
    const saved = localStorage.getItem(`room_users_${room}`);
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    const handleRoomUsers = (data) => {
      console.log(data);
      setRoomUsers(data);
      localStorage.setItem(`room_users_${room}`, JSON.stringify(data));
    };

    socket.on('chatroom_users', handleRoomUsers);

    return () => socket.off('chatroom_users', handleRoomUsers);
  }, [socket, room]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    navigate('/', { replace: true });
  };

  const uniqueUsers = Array.from(new Set(roomUsers.map(user => user.username)));
  const currentUsername = username;

  return (
    <div style={styles.roomAndUsersColumn}>
      <h2 style={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && (
          <h5 style={styles.usersTitle}>Users:</h5>
        )}

        <ul style={styles.usersList}>
          {uniqueUsers.map((user) => (
            <li
              key={user}
              style={{
                ...styles.userItem,
                fontWeight: user === currentUsername ? 'bold' : 'normal',
              }}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      <button style={styles.leaveButton} onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

const styles = {
  roomAndUsersColumn: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  roomTitle: {
    margin: 0,
  },
  usersTitle: {
    marginBottom: '6px',
  },
  usersList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  userItem: {
    padding: '4px 0',
  },
  leaveButton: {
    marginTop: 'auto',
  },
};

export default UsersPanel;