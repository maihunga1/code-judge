import React, { useState } from "react";
import { Amplify } from "aws-amplify";
import { signUp } from "aws-amplify/auth";
import awsconfig from "../aws-export";
import "../styles/Register.css";

Amplify.configure(awsconfig);

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { isSignUpComplete, userId } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: username, // Assuming the username is the email
          },
          // You can add additional options here if needed
        },
      });

      if (isSignUpComplete) {
        setSuccess(
          "Registration successful! Check your email for verification."
        );
      } else {
        // Handle cases where additional confirmation might be needed
        setSuccess(
          "Registration initiated. Further confirmation may be required."
        );
      }
      console.log("User registration successful. User ID:", userId);
    } catch (err) {
      console.error("Registration error:", err);
      setError(getErrorMessage(err));
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error.name === "UsernameExistsException") {
      return "An account with this email already exists.";
    } else if (error.name === "InvalidPasswordException") {
      return "Password does not meet the requirements. Please try a stronger password.";
    } else if (error.name === "InvalidParameterException") {
      return "Invalid email format. Please enter a valid email address.";
    } else {
      return "Registration failed. Please try again.";
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
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
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
