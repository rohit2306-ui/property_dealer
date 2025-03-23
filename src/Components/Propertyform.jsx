import React, { useState } from 'react'
import { auth } from '../firebase'
import { ref as dbRef, set, getDatabase } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

function Propertyform() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    price: '',
    bedrooms: '',
    bathrooms: '', 
    area: '',
    location: '',
    description: '',
    amenities: [],
    images: []
  })

  const [loading, setLoading] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false) // ✅ Agreement state
  const navigate = useNavigate()
  const database = getDatabase()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAmenitiesChange = (e) => {
    const { checked, value } = e.target
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, value]
        : prev.amenities.filter(item => item !== value)
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setFormData(prev => ({
      ...prev,
      images: imageUrls
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!auth.currentUser) {
      alert('Please login to add a property')
      navigate('/login')
      return
    }

    if (!agreementAccepted) {
      alert("You must accept the agreement before listing your property.")
      return
    }

    try {
      setLoading(true)

      // Prepare property data
      const propertyData = {
        ...formData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'active'
      }

      // Add to Firebase Realtime Database
      const propertyRef = dbRef(database, 'properties/' + Date.now())
      await set(propertyRef, propertyData)

      alert('Property submitted successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Error adding property:', error)
      alert('Failed to upload property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="property-form-container">
      <h2>List Your new Property</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Property Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter property title"
            required
          />
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter property price"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              placeholder="No. of bedrooms"
            />
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              placeholder="No. of bathrooms"
            />
          </div>

          <div className="form-group">
            <label>Area (sq ft)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Total area"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Property location"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your property"
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-grid">
            {['Parking', 'Swimming Pool', 'Garden', 'Gym', 'Security', 'Power Backup', 'Lift', 'Club House', 'Kids Play Area'].map(amenity => (
              <label key={amenity} className="checkbox-label">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Upload Property Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          <small>You can select multiple images</small>
        </div>

        {/* ✅ Agreement Section */}
        <div className="form-group agreement">
          <input
            type="checkbox"
            id="agreement"
            checked={agreementAccepted}
            onChange={() => setAgreementAccepted(!agreementAccepted)}
          />
          <label htmlFor="agreement">
            I agree that once my property is listed, I am responsible for marking it as sold when sold. 
            If I fail to do so and the platform facilitates a sale, I will be held accountable.
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading || !agreementAccepted} // ✅ Disabled until agreement is accepted
        >
          {loading ? 'Uploading Property...' : 'List Property'}
        </button>
      </form>
    </div>
  )
}

export default Propertyform
