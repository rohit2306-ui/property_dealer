import React, { useState, useEffect } from 'react'
import { auth, db, realtimeDB } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ref, onValue, remove, update } from 'firebase/database' // Firebase Delete & Update Function
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  })
  const [properties, setProperties] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setUserData({
            name: auth.currentUser.displayName || userSnap.data().name,
            email: auth.currentUser.email
          })
        }
      } else {
        navigate('/login')
      }
    }

    fetchUserData()
  }, [navigate])

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid
      const propertiesRef = ref(realtimeDB, 'properties')

      onValue(propertiesRef, (snapshot) => {
        if (snapshot.exists()) {
          const allProperties = snapshot.val()
          const userProperties = Object.entries(allProperties)
            .filter(([id, data]) => data.userId === userId)
            .map(([id, data]) => ({
              id,
              ...data
            }))

          setProperties(userProperties)
        } else {
          setProperties([])
        }
      })
    }
  }, [])

  // ✅ DELETE PROPERTY FUNCTION WITH IMAGE DELETION FROM VERCEL BLOB
  const deleteProperty = async (propertyId, imageUrls) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        // 🔹 Vercel Blob Delete API Call (if images exist)
        if (imageUrls && Array.isArray(imageUrls)) {
          await Promise.all(
            imageUrls.map(async (imageUrl) => {
              try {
                await fetch(imageUrl, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN}`,
                    'Content-Type': 'application/json'
                  }
                })
              } catch (err) {
                console.error(`Error deleting image from Vercel: ${imageUrl}`, err)
              }
            })
          )
        }
  
        // 🔹 Firebase se property delete karna
        await remove(ref(realtimeDB, `properties/${propertyId}`))
  
        alert("Property deleted succesfull")
        setProperties(properties.filter(property => property.id !== propertyId))
      } catch (error) {
        console.error("Error deleting property:", error)
      }
    }
  }
  
  // ✅ MARK AS SOLD FUNCTION
  const markAsSold = (propertyId) => {
    update(ref(realtimeDB, `properties/${propertyId}`), { status: "Sold" })
      .then(() => {
        alert("Property marked as Sold!")
        setProperties(properties.map(property => 
          property.id === propertyId ? { ...property, status: "Sold" } : property
        ))
      })
      .catch(error => console.error("Error updating property:", error))
  }

  if (!auth.currentUser) {
    return (
      <div className="profile-dashboard">
        <div className="not-logged-in">
          <h2>Please log in to view your profile</h2>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-dashboard">
      <div className="user-info">
        <button className="upload" onClick={() => navigate('/propertyform')}>Add New Property</button>
        <h2>Welcome {auth.currentUser.displayName || userData.name}</h2>
        <div className="user-details">
          <p>Name: {auth.currentUser.displayName || userData.name}</p>
          <p>Your Email: {auth.currentUser.email}</p>
        </div>
      </div>

      {/* User's Properties Section */}
      <div className="user-properties">
        <h3>Your Properties</h3>
        {properties.length > 0 ? (
          <div className='card'>
            {properties.map((property) => (
              <div className='cardin' key={property.id}>
                {/* ✅ MULTIPLE IMAGE DISPLAY */}
                <div className="image-container">
                  {property.images && Array.isArray(property.images) ? (
                    property.images.map((imageUrl, index) => (
                      <img key={index} src={imageUrl} alt={`Property ${index}`} className="property-image" />
                    ))
                  ) : (
                    <img src={property.images} alt="Property" className="property-image" />
                  )}
                </div>

                <h4>{property.title}</h4>
                <p>Type: <b>{property.type}</b></p>
                <p>Location: <b>{property.location}</b></p>
                <p>Price: ₹<b>{property.price}</b></p>
                <p>Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}</p>
                <p>Status: <strong>{property.status}</strong></p>
                <p>Description: {property.description}</p>

                {/* Edit, Delete, and Mark as Sold Buttons */}
                <button className="edit-btn" onClick={() => navigate(`/edit-property/${property.id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProperty(property.id, property.images)}>Delete</button>
                {property.status !== "Sold" && (
                  <button className="sold-btn" onClick={() => markAsSold(property.id)}>Mark as Sold</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No properties added yet.</p>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Profile
