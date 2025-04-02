import React, { useState, useEffect } from "react";
import "./styles/Dashboard.css"; // Ensure this CSS file exists
import image from "../assets/image.png"; // Import your popup image

const Dashboard = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setShowPopup(true); // Show popup when the page loads
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Welcome to LandLedger</h1>
            <p className="tagline">Secure. Transparent. Digital.</p>
            <p>Visit your government office, verify your land, and bring it to the blockchain.</p>
            <p>Empower your ownership—be smart, be digital, be future-ready!</p>

            {/* Popup Modal */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <span className="close-btn" onClick={() => setShowPopup(false)}>&times;</span>
                        <img src={image} alt="LandLedger Banner" className="popup-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
