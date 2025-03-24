import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom'; // 🔥 Import useNavigate

function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const navigate = useNavigate(); // 🔥 Initialize navigate

  useEffect(() => {
    const db = getDatabase();
    const propertyRef = ref(db, `properties/${propertyId}`);

    get(propertyRef).then((snapshot) => {
      if (snapshot.exists()) {
        setProperty(snapshot.val());
      } else {
        setProperty(null);
      }
    });
  }, [propertyId]);

  if (!property) {
    return <h2>Loading Property Details...</h2>;
  }

  // 🔥 Handle Buy Button Click (Redirect)
  const handleBuyClick = () => {
    navigate(`/checkout/${propertyId}`); // Redirect to Checkout Page
  };

  return (
    <>
    <div className="property-details">
      <div className="property-images">
        {property.images?.map((image, index) => (
          <img key={index} src={image} alt={`Property ${index}`} />
        ))}
    </div>

      
    </div>
    <div className="nextdetails">
    <h2>{property.title}</h2>
    <p className='loc'><strong>Location:</strong> <b>{property.location}</b></p>
    <p className='type-p'><strong>Type:</strong> {property.type}</p>
    <p className='price-p'><strong>Price💲:</strong> <b>₹{property.price}</b></p>
    <p><strong>Status:</strong> {property.status}</p>
    <p className='descrip'><strong>Description:</strong> {property.description}</p>

    {/* 🔥 Contact Details */}
    <p><strong>Dealer Number:</strong> <b>{property.contactNumber}</b></p>
    {property.altContactNumber && <p><strong>Alternate Contact:</strong> {property.altContactNumber}</p>}

    {/* 🔥 Buy Button */}
    {/* <button className="buy-button" onClick={handleBuyClick}>Buy This Property</button> */}
  </div>
  </>
  );
}

export default PropertyDetails;
