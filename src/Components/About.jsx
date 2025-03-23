import React from "react";
import Footer from "./Footer";


function About() {
  return (
    <div className="about-section">
      <h2>🏡 About Our Platform</h2>
      <p>
        Welcome to <strong>Mystate.com</strong>, your one-stop solution for buying and selling properties effortlessly.
        We provide a seamless platform for property dealers and buyers to connect, ensuring transparency and trust in every transaction.
      </p>

      <div className="features">
        <div className="about-card">
          <h3>🔍 Advanced Search</h3>
          <p>Filter properties by location, price, type, and amenities to find your perfect match.</p>
        </div>

        <div className="about-card">
          <h3>✅ Verified Listings</h3>
          <p>All property listings are verified to ensure authenticity and avoid fraudulent transactions.</p>
        </div>

        <div className="about-card">
          <h3>💰 Secure Transactions</h3>
          <p>Direct communication between buyers and sellers with no hidden charges.</p>
        </div>

        <div className="about-card">
          <h3>📍 Easy Listings</h3>
          <p>Property dealers can list properties within minutes and manage them effortlessly.</p>
        </div>
      </div>

      <div className="commitment">
        <h3>💡 Our Commitment</h3>
        <p>
          At <strong>Mystate.com</strong>, we strive to create a trustworthy real estate marketplace where
          transactions are smooth, secure, and hassle-free. Whether you're looking to sell your property or find your dream home, we've got you covered.
        </p>
      </div>
      <Footer/>
    </div>
  );
}

export default About;
