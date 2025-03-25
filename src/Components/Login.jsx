import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";
import google from '../Images/Google__G__logo.jpg'
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Email & Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Set display name as email username if not set
            if (!userCredential.user.displayName) {
                await userCredential.user.updateProfile({
                    displayName: email.split('@')[0]
                });
            }
            alert("Login Successful");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    // Google Sign-In
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Google Login Successful");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    // Register New User
    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Set display name as email username for new users
            await userCredential.user.updateProfile({
                displayName: email.split('@')[0]
            });
            alert("Account Created Successfully");
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
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
                <p>Don't have an account? <button onClick={handleRegister}>Register</button></p>
            </form>
           
            <br />
            {/* <h1>continue with</h1> */}
            <button onClick={handleGoogleLogin}><img style={{height:40}} src={google} alt="Google" /></button>
            <br />
            {/* <p>Don't have an account? <button onClick={handleRegister}>Register</button></p> */}
        </div>
    );
};

export default Login;
