import React, { useState } from "react";
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithPopup } from "../firebase";
import google from '../images/Google__G__logo.jpg'
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Email & Password Sign-Up
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account Created Successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    // Google Sign-Up
    const handleGoogleSignUp = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Google Sign-Up Successful!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signup">
            <div >
                <h2 style={{textAlign: 'center'}}>Sign Up</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                        Register
                    </button>
                </form>
                <h3 style={{textAlign: 'center'}}>continue with</h3>
                <button 
                    onClick={handleGoogleSignUp} 
                    className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                   <img src={google} alt="Google" />
                    
                </button>
                
            </div>
        </div>
    );
};

export default SignUp;
