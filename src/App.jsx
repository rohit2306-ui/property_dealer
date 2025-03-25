import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Components/Signup";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import PropertyForm from "./Components/Propertyform";
import EditProperty from "./Components/EditProperty";
import Search from "./Components/Search";
import About from "./Components/About";
import NearMe from "./Components/Nearyou";
import PropertyDetails from "./Components/PropertyDetails";
import Homes from "./Components/Homes";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/propertyform" element={<PropertyForm />} />
                <Route path="/edit-property/:id" element={<EditProperty/>} />
                <Route path="/search" element={<Search/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/near-you" element={<NearMe/>} />
                <Route path="/property/:propertyId" element={<PropertyDetails/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
