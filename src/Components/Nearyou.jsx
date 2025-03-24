import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Footer from './Footer';

function NearMe() {
  const [location, setLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Step 1: User ki Current Location Fetch Karna
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchProperties(latitude, longitude); // ✅ Step 2: Properties Fetch
        },
        (error) => {
          console.error('Error fetching location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  // ✅ Step 2: Fetch Properties from Firestore
  const fetchProperties = async (lat, lng) => {
    const propertiesRef = collection(db, 'properties');
    const querySnapshot = await getDocs(propertiesRef);

    let fetchedProperties = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.latitude && data.longitude) {
        // ✅ Step 3: Filter Nearby Properties
        const distance = getDistance(lat, lng, data.latitude, data.longitude);
        if (distance <= 10) { // 🔥 10 KM range ke andar wali properties dikhayenge
          fetchedProperties.push({ id: doc.id, ...data, distance });
        }
      }
    });
    console.log(fetchProperties);
    fetchedProperties.sort((a, b) => a.distance - b.distance); // Nearest properties first
    setProperties(fetchedProperties);
    setLoading(false);
  };

  // ✅ Step 3: Haversine Formula for Distance Calculation
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
  };

  return (
    <div className="near-me-container">
      <h2>Properties Near You</h2>
      
      {loading ? <p>Loading properties...</p> : null}

      {!loading && properties.length === 0 ? (
        <p>No properties found near your location.</p>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/300'} 
                alt={property.title} 
              />
              <h4>{property.title}</h4>
              <p>Location: {property.location}</p>
              <p>Price: ₹{property.price}</p>
              <p>Type: {property.type}</p>
              <p>Distance: {property.distance.toFixed(2)} KM</p>
            </div>
          ))}
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default NearMe;
