import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "../firebase";
import google from '../Images/Google__G__logo.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // useNavigate Hook

    // Email & Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login Successful");
            navigate('/'); // Home page redirect
        } catch (err) {
            setError(err.message);
        }
    };

    // Google Sign-In
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Google Login Successful");
            navigate('/'); // Home page redirect
        } catch (err) {
            setError(err.message);
        }
    };

    // Navigate to SignUp Page
    const handleNavigateToSignUp = () => {
        navigate('/signup'); // Redirecting to Signup Page
    };

    return (
        <div className="login">
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <button type="submit">Login</button>
                <p>Don't have an account? <button onClick={handleNavigateToSignUp}>Register</button></p>
            </form>

            <br />
            <button onClick={handleGoogleLogin}>
                <img style={{ height: 40 }} src={google} alt="Google" />
            </button>
        </div>
    );
};

export default Login;
