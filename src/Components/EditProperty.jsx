import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ref, get, update } from 'firebase/database'
import { realtimeDB } from '../firebase'

function EditProperty() {
  const { id } = useParams()  // Get property ID from URL
  const navigate = useNavigate()
  const [property, setProperty] = useState({
    title: '',
    type: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    status: '',
    description: ''
  })

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyRef = ref(realtimeDB, `properties/${id}`)
      const snapshot = await get(propertyRef)
      if (snapshot.exists()) {
        setProperty(snapshot.val()) // Set property details
      } else {
        alert('Property not found!')
        navigate('/profile')
      }
    }
    fetchProperty()
  }, [id, navigate])

  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const propertyRef = ref(realtimeDB, `properties/${id}`)
    await update(propertyRef, property)  // ✅ Update Firebase
    alert('Property updated successfully!')
    navigate('/profile')  // Redirect back to profile page
  }

  return (
    <div className="edit-property-container">
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={property.title} onChange={handleChange} required />

        <label>Type:</label>
        <input type="text" name="type" value={property.type} onChange={handleChange} required />

        <label>Location:</label>
        <input type="text" name="location" value={property.location} onChange={handleChange} required />

        <label>Price (₹):</label>
        <input type="number" name="price" value={property.price} onChange={handleChange} required />

        <label>Bedrooms:</label>
        <input type="number" name="bedrooms" value={property.bedrooms} onChange={handleChange} required />

        <label>Bathrooms:</label>
        <input type="number" name="bathrooms" value={property.bathrooms} onChange={handleChange} required />

        <label>Status:</label>
        <select name="status" value={property.status} onChange={handleChange} required>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>

        <label>Description:</label>
        <textarea name="description" value={property.description} onChange={handleChange} required />

        <button type="submit">Update Property</button>
      </form>
    </div>
  )
}

export default EditProperty
