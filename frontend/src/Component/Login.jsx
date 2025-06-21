import React, { useState } from "react";
import "../Css/Login.css";
import { Link, useNavigate } from "react-router-dom";



function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const success = await fakeAuth(email, password);
      if (success) {
        // On successful login, navigate to the home page or dashboard
        navigate("/"); // or "/dashboard"
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login">
      <Link to="/">
        {/* 
          If you imported the logo at top:
          <img className="login__logo" src={AmazonLogo} alt="Logo" /> 
          Otherwise ensure the relative path resolves correctly; 
          in many setups you might place images in public/ and refer to "/images/amazon_black.jpg". 
        */}
        <img
          className="login__logo"
          src="../images/amazon_black.jpg"
          alt="Logo"
        />
      </Link>

      <div className="login__container">
        <h1>Sign-In</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="login__error">{error}</p>}

          <h5>Email</h5>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="login__signInButton"
            type="submit"
          >
            Sign In
          </button>

          <p className="login__text">
            By signing in you agree to the Terms and Conditions of the Amazon fake
            clone. Please see our privacy notice and cookies policy.
          </p>

          {/* Example: if you have a /register route */}
          <Link to="/register">
            <button className="login__registerButton" type="button">
              Create your Amazon account
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;

// Example fake auth; remove/replace with real API call
async function fakeAuth(email, password) {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 500));
  // Dummy check; replace or remove
  return email === "user@example.com" && password === "password";
}
