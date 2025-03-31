import React from "react";
 import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
 import Navbar from "./components/Navbar";
 import Dashboard from "./pages/Dashboard";
 import "./styles.css";
 import LandDetails from "./pages/LandDetails";
 import MyLands from "./pages/MyLands";
import LandSale from "./pages/LandSale";
 
 const App = () => {
     return (
         <Router>
           <Navbar />
             <Routes>
                 <Route path="/" element={<Dashboard />} />
                 <Route path="/my-lands" element={<MyLands />} />
                 <Route path="/LandDetails" element={<LandDetails />} />
                 <Route path="/LandSale" element={<LandSale />} />
             </Routes>
         </Router>
     );
 };
 
 export default App;