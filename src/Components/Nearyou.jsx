import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Footer from './Footer';

function NearMe() {
  const [location, setLocation] = useState(null);
  const [stateName, setStateName] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // ✅ Free OpenStreetMap API se state detect karenge
          const state = await fetchStateFromCoords(latitude, longitude);
          if (state) {
            setStateName(state);
            fetchProperties(state); // ✅ Step 3: Fetch Properties for that state
          } else {
            console.error('Failed to get state name');
            setLoading(false);
          }
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

  // ✅ OpenStreetMap (Nominatim API) se state detect karna (FREE)
  const fetchStateFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.address && data.address.state) {
        return data.address.state; // ✅ Exact State Name
      }
      return '';
    } catch (error) {
      console.error('Error fetching state:', error);
      return '';
    }
  };

  // ✅ Step 3: Fetch Properties for the User's State from Firestore
  const fetchProperties = async (state) => {
    try {
      const propertiesRef = collection(db, 'properties');
      const querySnapshot = await getDocs(propertiesRef);

      let fetchedProperties = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.state === state) { // 🔥 Filter by state
          fetchedProperties.push({ id: doc.id, ...data });
        }
      });

      setProperties(fetchedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="near-me-container">
      <h2>Properties in {stateName || 'Your State'}</h2>

      {loading ? <p>Loading properties...</p> : null}

      {!loading && properties.length === 0 ? (
        <p>No properties found in your state.</p>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/300'} 
                alt={property.title} 
              />
              <h4>{property.title}</h4>
              <p>Location: {property.state}</p>
              <p>Price: ₹{property.price}</p>
              <p>Type: {property.type}</p>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default NearMe;
