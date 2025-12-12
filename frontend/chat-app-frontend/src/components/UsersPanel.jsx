const UsersPanel = ({ room, socket }) => {
  // room kullanıcı listesi state'i burada tutulur (örneğin useEffect + socket.on)

  return (
    <div style={styles.box}>
      <h2>{room}</h2>

      <h4>Users</h4>
      <ul>
        <li>User 1</li>
        <li>User 2</li>
      </ul>

      <button>Leave</button>
    </div>
  );
};

const styles = {
  box: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "8px",
  },
};

export default UsersPanel;
