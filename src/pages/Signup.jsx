import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import "../styles/AuthForm.css";

const Signup = () => {
  const navigate = useNavigate();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleEmailSignup}>
        <h2>Create Account</h2>

        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />

        <button type="submit" className="primary-btn">Sign Up</button>

        <button type="button" onClick={handleGoogleSignup} className="google-btn">
          Sign up with Google
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;