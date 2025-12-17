import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UsersPanel from "../components/UsersPanel";
import MessagesPanel from "../components/MessagesPanel";
import MessageInput from "../components/MessageInput";

const ChatRoomPage = ({ socket }) => {
  const { user, isLoading } = useAuth();
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();

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
    return <div>Loading...</div>;
  }
  
  if (!room) return null;

  return (
    <div style={styles.container}>
      <div style={styles.usersPanel}>
        <UsersPanel socket={socket} room={room} username={user.username} />
      </div>

      <div style={styles.chatPanel}>
        <MessagesPanel socket={socket} room={room} />
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