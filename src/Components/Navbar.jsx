import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import Login from './Login';

function Navbar() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Check if user logged in with email/password
        if (!user.displayName) {
          setUserName(user.email.split('@')[0]); // Use email username as display name
        } else {
          setUserName(user.displayName); // Use displayName for Google login
        }
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        setUserName('');
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div className='nav'>
        <Link to="/"><h2>Mystate.com</h2></Link>
        <Link to="/">Home</Link>
        <Link to="/near-you">Near you</Link>
        
        <Link to="/search"><button>Search</button></Link>
        <Link to="/about">About</Link>
        {!userName && <Link to="/login">Login</Link>}
        {userName && (
          <>
            <Link to="/Profile"><h3 style={{margin:20,color:'black',padding:10}}>Welcome {userName}</h3></Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
    </div>
  )
}

export default Navbar