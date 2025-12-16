import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPanel = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState(() => {
    const saved = localStorage.getItem(`room_users_${room}`);
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

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

  return (
    <div style={styles.roomAndUsersColumn}>
      <h2 style={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && (
          <h5 style={styles.usersTitle}>Users:</h5>
        )}

        <ul style={styles.usersList}>
          {Array.from(new Set(roomUsers.map(user => user.username))).map((username) => (
        <li
          key={username}
          style={{
            ...styles.userItem,
            fontWeight:
              username === username ? 'bold' : 'normal',
          }}
        >
          {username}
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
