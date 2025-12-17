import { useEffect, useState, useRef } from "react";

const MessagesPanel = ({ socket, room }) => {
  const [messagesRecieved, setMessagesReceived] = useState(() => {
    //read messages from storage
    const savedMessages = localStorage.getItem(`chat_messages_${room}`);

    //parse messages from storage else return empty list
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const messagesColumnRef = useRef(null);
  const hasLoadedLastMessagesRef = useRef(false);

  useEffect(() => {

    console.log('listening CLIENT: receive_message .');
    const handleReceiveMessage = (data) => {
      console.log('MESSAGE RECEIVED:', data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    }
    
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      console.log('UNMOUNTING CLIENT: receive_message listener .')
    }
    
  }, [socket]);

  //fetch last 100 messages 
  useEffect(() => {
    if (!hasLoadedLastMessagesRef.current) {
      const handleLastMessages = (lastMessages) => {
        console.log(`fetched last 100 messages from room`);
        const sorted = sortMessagesByDate(lastMessages);
        setMessagesReceived(sorted);
        hasLoadedLastMessagesRef.current = true;
      };

      socket.on('last_messages', handleLastMessages);

      return () => socket.off('last_messages', handleLastMessages);
    }
  }, [socket]);

  useEffect(() => {
    //save messages to the local storage 
    localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesRecieved));

  }, [messagesRecieved, room]); //works when this updated

  //scroll
  useEffect(() => {
    if (messagesColumnRef.current) {
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }


  function formatTimeFromTimestamp(timestamp) {
    if (!timestamp) return 'Invalid time';
    
    const time = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    
    if (isNaN(time.getTime())) return 'Invalid time';
    
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }

  
   return (  
    <div ref={messagesColumnRef} style={styles.box}>
      <div style={styles.messages}>
        {messagesRecieved.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>No messages yet</p>
        ) : (
          messagesRecieved.map((msg, i) => (
            <div key={i} style={styles.messageItem}>
              <div style={styles.metaRow}>
                <span style={styles.msgMeta}>{msg.username}</span>
                <span style={styles.msgMeta}>
                  {formatTimeFromTimestamp(msg.__createdtime__ || msg.createdAt)}
                </span>
              </div>
              <p style={styles.msgText}>{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  box: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "8px",
    height: "100%",
    overflowY: "auto",
    background: "#f9f9f9"
  },

  messages: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  messageItem: {
    background: "white",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
    fontSize: "12px",
    color: "#555"
  },

  msgMeta: {
    fontWeight: "600"
  },

  msgText: {
    margin: 0,
    fontSize: "14px"
  }
};

export default MessagesPanel;