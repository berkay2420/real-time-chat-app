import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

  const handleAnonymousLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/new-anon`, 
        {},
        { withCredentials: true }
      );

      login(res.data);

      toast.success("Logged In as anonous user ");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to login, try again");
    }
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      login(res.data); // { id, username }

      toast.success("Login successful!");

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg mb-3">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-sm text-gray-500">Connect with everybody, again.</p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-center text-gray-600 mt-6">
          New to here?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
        <div className="mt-6">
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Want to continue without creating an account?
            </p>

            <button
              type="button"
              onClick={handleAnonymousLogin}
              className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition"
            >
              Continue as Guest
            </button>
        </div>
      </div>
      </form>
    </div>
  );
};

export default LoginPage;