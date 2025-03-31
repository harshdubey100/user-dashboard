import React from "react";
 import { Link } from "react-router-dom";
 import logo from "../assets/logo.png"; // Ensure your logo is in the assets folder
 import "../styles.css"; // Import global styles
 
 const Navbar = () => {
     return (
         <nav className="navbar">
             <div className="navbar-brand">
                 <img src={logo} alt="LandLedger Logo" className="navbar-logo" />
                 <h1 className="navbar-title">LandLedger</h1>
             </div>
 
             <ul className="nav-links">
                 <li><Link to="/">Dashboard</Link></li>
                 <li><Link to="/my-lands">My Lands</Link></li>
                 <li><Link to="/LandDetails">LandDetails</Link></li>
             </ul>
         </nav>
     );
 };
 
 export default Navbar;