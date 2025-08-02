import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import "../styles/AuthForm.css";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Email Login Error:", error);
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleEmailLogin}>
        <h2>Login</h2>

        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />

        <button type="submit" className="primary-btn">Login</button>

        <button type="button" onClick={handleGoogleLogin} className="google-btn">
          Sign in with Google
        </button>

        <p>
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
