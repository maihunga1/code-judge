import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from '@aws-amplify/auth';
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isMFA, setIsMFA] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already logged in, redirect to problems page
    Auth.currentAuthenticatedUser()
      .then(() => navigate("/problems"))
      .catch(() => {}); // Not authenticated, ignore the error
  }, [navigate]);

  // Handle normal login or MFA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(username, password);
      if (
        user.challengeName === "SMS_MFA" ||
        user.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        setIsMFA(true); // Trigger MFA step
      } else {
        navigate("/problems"); // If login is successful, redirect to problems
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials");
    }
  };

  // Handle MFA code submission
  const handleMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Auth.confirmSignIn(username, code, "SMS_MFA");
      navigate("/problems");
    } catch (err) {
      console.error("MFA error:", err);
      setError("Invalid MFA code");
    }
  };

  // Federated Sign-In (Google)
  const handleGoogleLogin = async () => {
    try {
      await Auth.federatedSignIn({ provider: "Google" });
    } catch (error) {
      console.error("Google Sign-in error:", error);
      setError("Google sign-in failed");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {!isMFA ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="register-button"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-login-button"
            >
              Login with Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleMFA}>
            <div className="input-group">
              <label htmlFor="code">MFA Code:</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
