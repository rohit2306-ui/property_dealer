import React, { useState } from 'react';
import { auth } from '../firebase';
import { ref as dbRef, set, getDatabase } from 'firebase/database';
import { put } from '@vercel/blob';
import { useNavigate } from 'react-router-dom';

function PropertyForm() {
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
    "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
  ];

  const amenitiesList = ["Parking", "Swimming Pool", "Gym", "Garden", "Security", "Lift"];

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    location: '',
    description: '',
    amenities: [],
    images: [],
    contactNumber: '',
    altContactNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const navigate = useNavigate();
  const database = getDatabase();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for amenities
  const handleAmenitiesChange = (e) => {
    const { checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value),
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setLoading(true);
      const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;

      if (!token) {
        throw new Error("Vercel Blob token is missing. Check your .env.local file.");
      }

      const uploadPromises = files.map(async (file) => {
        const { url } = await put(`properties/${Date.now()}-${file.name}`, file, {
          access: "public",
          token,
        });
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Image Upload Error:", error);
      alert("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Please login to add a property');
      navigate('/login');
      return;
    }

    if (!agreementAccepted) {
      alert('You must accept the agreement before listing your property.');
      return;
    }

    try {
      setLoading(true);

      const propertyData = {
        ...formData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'Available',
      };

      const propertyRef = dbRef(database, 'properties/' + Date.now());
      await set(propertyRef, propertyData);

      alert('Property submitted successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to upload property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-container">
      <h2>List Your Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Bedrooms</label>
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Bathrooms</label>
          <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Alternate Contact Number</label>
          <input type="tel" name="altContactNumber" value={formData.altContactNumber} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label>Location (State)</label>
          <select name="location" value={formData.location} onChange={handleInputChange} required>
            <option value="">Select State</option>
            {indianStates.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-list">
            {amenitiesList.map((amenity) => (
              <div key={amenity}>
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                />
                <label>{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" />
        </div>

        <div className="form-group">
          <label>Upload Property Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        </div>

        <div className="form-group agreement">
          <input type="checkbox" id="agreement" checked={agreementAccepted} onChange={() => setAgreementAccepted(!agreementAccepted)} />
          <label htmlFor="agreement">I agree that once my property is listed, I am responsible for marking it as sold.</label>
        </div>

        <button type="submit" className="submit-btn" disabled={loading || !agreementAccepted}>
          {loading ? 'Uploading Property...' : 'List Property'}
        </button>
      </form>
    </div>
  );
}

export default PropertyForm;
