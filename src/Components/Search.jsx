import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useNavigate } from 'react-router-dom'  // Import useNavigate
import Footer from './Footer'

function SearchPage() {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const navigate = useNavigate()  // Initialize navigation

  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    status: ''
  })

  useEffect(() => {
    const db = getDatabase()
    const propertiesRef = ref(db, 'properties')

    onValue(propertiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const propertiesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        setProperties(propertiesArray)
        setFilteredProperties(propertiesArray)
      }
    })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenitiesChange = (e) => {
    const { checked, value } = e.target
    setSearchFilters(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(item => item !== value)
    }))
  }

  const filterProperties = () => {
    let filtered = properties.filter(property => {
      return (
        (searchFilters.location === '' || property.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
        (searchFilters.type === '' || property.type === searchFilters.type) &&
        (searchFilters.minPrice === '' || property.price >= parseInt(searchFilters.minPrice)) &&
        (searchFilters.maxPrice === '' || property.price <= parseInt(searchFilters.maxPrice)) &&
        (searchFilters.amenities.length === 0 || searchFilters.amenities.every(a => property.amenities.includes(a))) &&
        (searchFilters.status === '' || 
          (searchFilters.status.toLowerCase() === 'available' && property.status.toLowerCase() !== 'sold') ||
          (searchFilters.status.toLowerCase() === 'sold' && property.status.toLowerCase() === 'sold'))
      )
    })

    setFilteredProperties(filtered)
  }

  return (
    <div className="search-page">
      <h2>Search for Properties</h2>

      {/* Search Filters */}
      <div className="search-filters">
        <input type="text" name="location" value={searchFilters.location} onChange={handleInputChange} placeholder="Enter location" />

        <select name="type" value={searchFilters.type} onChange={handleInputChange}>
          <option value="">All Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <input type="number" name="minPrice" value={searchFilters.minPrice} onChange={handleInputChange} placeholder="Min Price" />

        <input type="number" name="maxPrice" value={searchFilters.maxPrice} onChange={handleInputChange} placeholder="Max Price" />

        <select name="status" value={searchFilters.status} onChange={handleInputChange}>
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>

        <div className="amenities">
          {['Parking', 'Swimming Pool', 'Garden', 'Gym', 'Security', 'Power Backup', 'Lift', 'Club House', 'Kids Play Area'].map(amenity => (
            <label key={amenity}>
              <input
                type="checkbox"
                value={amenity}
                checked={searchFilters.amenities.includes(amenity)}
                onChange={handleAmenitiesChange}
              />
              {amenity}
            </label>
          ))}
        </div>

        <button className='but' onClick={filterProperties}>Search</button>
      </div>

      {/* Properties List */}
      <div className="property-list">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div key={property.id} className="property-card">
              <img src={property.images?.[0] || 'https://via.placeholder.com/150'} alt={property.title} />
              <h3>{property.title}</h3>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Type:</strong> {property.type}</p>
              <p><strong>Price:</strong> ₹{property.price}</p>
              {/* <p><strong>Status:</strong> {property.status === "sold" ? "sold" : "✅ Available"}</p> */}
              <p><strong>Amenities:</strong> {property.amenities?.join(', ') || 'None'}</p>

              {/* Buy Property Button */}
              <button className="buy-btn" onClick={() => navigate(`/property/${property.id}`)}>Buy Property</button>
            </div>
          ))
        ) : (
          <p>No properties found matching your criteria.</p>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default SearchPage
