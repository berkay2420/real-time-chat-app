import UsersPanel from "../components/UsersPanel";
import MessagesPanel from "../components/MessagesPanel";
import MessageInput from "../components/MessageInput";

const ChatRoomPage = ({ username, room, socket }) => {
  return (
    <div style={styles.container}>
      <div style={styles.usersPanel}>
        <UsersPanel
          socket={socket}
          room={room}
          username={username}
        />
      </div>

      <div style={styles.chatPanel}>
        <div style={styles.messagesPanel}>
          <MessagesPanel socket={socket} />
        </div>

        <div style={styles.inputPanel}>
          <MessageInput
            socket={socket}
            room={room}
            username={username}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },

  usersPanel: {
    padding: "10px",
    borderRight: "1px solid #ddd",
    backgroundColor: "#fff",
  },

  chatPanel: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  messagesPanel: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    backgroundColor: "#fafafa",
  },

  inputPanel: {
    padding: "10px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#fff",
  },
};

export default ChatRoomPage;
