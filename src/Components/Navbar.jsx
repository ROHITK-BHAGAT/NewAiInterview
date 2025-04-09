import React, { useEffect } from 'react';
import logo from '../assets/maitri-logo.png';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // Load Calendly script when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Function to open Calendly popup
  // Function to open Calendly popup with custom height
  const openCalendly = () => {
    window.Calendly.initPopupWidget({
      url: 'https://calendly.com/maitriai-sales/business-meet',
      prefill: {},
      utm: {},
      parentElement: undefined,
      text: {
        // Customize text elements
        submitText: "Schedule Meeting",
        headerText: "Book Your Demo Session"
      },
      color: {
        // Add your brand colors
        primary: "#2C3E50",
        secondary: "#3498DB",
        background: "#F8F9FA"
      },
      
      pageSettings: {
        height: 5500
      }
    });
    return false;
  };

  return (
    <div className='nav'>
      <a href="#"><img src={logo} alt="logo" /></a>

      <div className="button-container">
        <NavLink to="/loginPage">
          <button className='btndemo'>Login</button>
        </NavLink>
        <NavLink to="/calendly"><button className='btndemo' onClick={openCalendly}>Book a Demo</button></NavLink>
        
      </div>
    </div>
  );
};

export default Navbar;
