import React from 'react'

function Footer() {
  return (
    <div className='footer'>
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We are dedicated to helping you find your perfect home. With years of experience in real estate, we provide exceptional service and expertise.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/search">Properties</a></li>
            <li><a href="/about">Services</a></li>
            <li><a href="/about">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 My state.com Agra UP 282007</p>
          <p>📞 +91 9368646810</p>
          <p>✉️ Mystate2025@gmail.com</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Real Estate mystate.com. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer