import { useState } from "react";

const MessageInput = ({ room, username, socket }) => {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message) return;

    const __createdtime__ = Date.now();

    socket.emit("send_message", {
      room,
      username,
      message,
      __createdtime__
    });

    setMessage("");
  };

  return (
    <div style={styles.box}>
      <input
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button style={styles.btn} onClick={send}>
        Send
      </button>
    </div>
  );
};

const styles = {
  box: {
    gridColumn: "1 / 3",
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "8px"
  },
  btn: {
    padding: "8px 12px"
  }
};

export default MessageInput;
