import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import JoinRoomPage from "./pages/JoinRoomPage.jsx";
import { io } from "socket.io-client";
import ChatRoomPage from "./pages/ChatPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Login from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import { useAuth } from "./context/AuthContext";


function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
            <span className="mt-2 font-medium">Loading...</span>
          </div>
        </div>
      );
  }

  const socket = user
    ? io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true
    })
    : null;

  return (
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
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;