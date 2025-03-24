import React from 'react'
import poster from '../images/main_poster.jpg'
import fsec from '../images/fsphoto1.jpg'
import fsec2 from '../images/fsphoto2.jpg'
import fsec3 from '../images/tsphoto3.jpg'
import Footer from './Footer'
import Login from './Login'
function Home() {
  return (
    <div className='home'>
        {/* <h1>Welcome to the property world</h1> */}
        <h1>Welcome to the new state world</h1>
        <img src={poster} alt="" />
       


        <div className="firstsection">
            <div className="fsec-container">
                <img src={fsec} alt="Apartment building" />
                
                <div className="fsec-content">
                    <h2>We Provide Quality Flats</h2>
                    <p>Discover your dream home with our extensive collection of modern, well-maintained flats. We offer comfortable living spaces with premium amenities, strategic locations, and competitive prices to match your lifestyle needs.</p>
                    <button>View More</button>
                </div>
            </div>
        </div>
        <div className="secondsection">
            <div className="fsec2-container">
                
                <div className="fsec2-content">
                    <h2>We Provide Quality Ploting</h2>
                    <p>Invest in your future with our premium residential plots in prime locations. We offer carefully selected land parcels with clear titles, excellent connectivity, and essential infrastructure. Our plotting projects feature well-planned layouts, proper documentation, and great potential for value appreciation, making them ideal for both building your dream home or investment purposes.</p>
                    <button>View More</button>
                </div>
                <img src={fsec2} alt="Apartment building" />
            </div>
        </div>
        <div className="thirdsection">
            <div className="fsec3-container">
            <img src={fsec3} alt="Apartment building" />
                
                <div className="fsec3-content">
                    <h2>We Provide Quality Banglows</h2>
                    <p>Experience luxury living at its finest with our exclusive collection of premium bungalows. Each property is thoughtfully designed with spacious layouts, high-end finishes, private gardens, and modern amenities. Our bungalows offer the perfect blend of elegance, comfort, and privacy for those seeking an upscale residential experience.</p>
                    <button>View More</button>
                </div>
                
            </div>
        </div>
        <Login/>
        <Footer/>
    </div>
    
  )
}

export default Home