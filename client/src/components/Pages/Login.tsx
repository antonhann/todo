import React, { useState } from "react";
import { useSession } from "../../SessionContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setError(""); // Clear error
      navigate("/")
    } catch (err) {
      setError("Failed to log in");
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h1>Login</h1>
      <form onSubmit={handleLogin}
        className="d-flex flex-column gap-2"
      >
        <input
          type="text"
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
        <button type="submit">Log In</button>
      </form>
      <div>
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/Register")}>
            Register
        </button>
      </div>
      
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
