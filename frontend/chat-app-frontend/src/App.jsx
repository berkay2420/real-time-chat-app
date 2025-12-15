import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import JoinRoomPage from "./pages/JoinRoomPage.jsx";
import { io } from "socket.io-client";
import ChatRoomPage from "./pages/ChatPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

const socket = io("http://localhost:4000");

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <JoinRoomPage socket={socket} />
              </RequireAuth>
            }
          />

          <Route
            path="/chat"
            element={
              <RequireAuth>
                <ChatRoomPage socket={socket} />
              </RequireAuth>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
