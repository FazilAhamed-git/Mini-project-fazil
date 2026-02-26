import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "../styles/main.css";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Load previously used email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("lastUsedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      await signIn(email, password);
      // Save the email for future login suggestions
      localStorage.setItem("lastUsedEmail", email);
      navigate("/dashboard");
    } catch (err) {
      // Check for network connection error (Backend down)
      if (err.message === "Failed to fetch") {
        setError("Cannot connect to server. Please ensure the backend is running on port 8080.");
      } else {
        setError(err.message || err || "Invalid email or password.");
      }
    }
  };

  return (
    <div className="auth-container">
      <button
        className="theme-toggle-btn"
        onClick={(e) => {
          e.preventDefault();
          toggleTheme();
        }}
        aria-label="Toggle theme"
        title={theme === "day" ? "Switch to night" : "Switch to day"}
      >
        {theme === "day" ? "🌞" : "🌙"}
      </button>
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to access the fraud monitoring dashboard.</p>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit">Sign in</button>

        <p className="auth-link">
          New to the platform?{" "}
          <span className="link-like" onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
