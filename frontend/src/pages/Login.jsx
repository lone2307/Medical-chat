import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const backendUrl = "http://localhost:8000";

  const handleLogin = async () => {
    if (!username.trim()) return;
    const res = await axios.post(`${backendUrl}/login`, { username });
    localStorage.setItem("username", username);
    localStorage.setItem("chatHistory", JSON.stringify(res.data.history));
    navigate("/chat");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
