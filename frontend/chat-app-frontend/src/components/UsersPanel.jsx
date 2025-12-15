import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPanel = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

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
          {roomUsers.map((user) => (
            <li
              key={user.id}
              style={{
                ...styles.userItem,
                fontWeight:
                  user.username === username ? 'bold' : 'normal',
              }}
            >
              {user.username}
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
