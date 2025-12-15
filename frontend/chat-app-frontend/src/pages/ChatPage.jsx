import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UsersPanel from "../components/UsersPanel";
import MessagesPanel from "../components/MessagesPanel";
import MessageInput from "../components/MessageInput";

const ChatRoomPage = ({ socket }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  useEffect(() => {
    if (!room) {
      navigate("/");
    }
  }, [room]);

  if (!room) return null;

  return (
    <div style={styles.container}>
      <div style={styles.usersPanel}>
        <UsersPanel socket={socket} room={room} username={user.username} />
      </div>

      <div style={styles.chatPanel}>
        <MessagesPanel socket={socket} />
        <MessageInput
          socket={socket}
          room={room}
          username={user.username}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    height: "100vh",
  },
  usersPanel: {
    borderRight: "1px solid #ddd",
    padding: "10px",
  },
  chatPanel: {
    display: "flex",
    flexDirection: "column",
  },
};

export default ChatRoomPage;
