import UsersPanel from "../components/UsersPanel";
import MessagesPanel from "../components/MessagesPanel"
import MessageInput from "../components/MessageInput";

const ChatRoomPage = ({ username, room, socket  }) => {
  return (
    <div >

      <MessagesPanel socket={socket} />
      <MessageInput  socket={socket} room={room} username={username}/>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gridTemplateRows: "1fr auto",
    height: "100vh",
    gap: "10px",
    padding: "10px",
  }
};

export default ChatRoomPage;
