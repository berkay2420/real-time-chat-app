import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      login(res.data); // { id, username }
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default LoginPage;
