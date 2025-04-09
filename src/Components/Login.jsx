import React, { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom';
import logo from '../assets/maitri-logo.png';
import { FaUserTie } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa";
import RecruiterRegister from './RecruiterRegister';
import CompanyLoginPage from './CompanyLoginPage';
import LoginPage1 from './LoginPage1';

const Login = ({ initialActiveRole = null }) => {
  const location = useLocation();
  // State to track which role is active (for styling)
  const [activeRole, setActiveRole] = useState(initialActiveRole);

  // Check URL parameters to set active role on component mount or URL change
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');
    
    if (role) {
      setActiveRole(role);
    } else if (location.pathname.includes('recruiter')) {
      setActiveRole('recruiter');
    } else if (location.pathname.includes('company')) {
      setActiveRole('company');
    } else if (location.pathname.includes('candidate') || location.pathname.includes('loginPage')) {
      setActiveRole('candidate');
    } else if (!activeRole) {
      // Set a default active role if none is selected
      setActiveRole('recruiter');
    }
  }, [location, activeRole]);

  // Function to handle role clicks
  const handleRoleClick = (role) => {
    setActiveRole(role);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-4xl logindivpadding">
        <div className="flex flex-col items-center justify-center login-image">
          <img src={logo} alt="logo" className="w-[200px]" />
          <p className="login-para">Please select your role to register</p>
        </div>

        <div className="flex items-center justify-center gap-5 lg:gap-11 login-image mb-8">
          {/* Recruiter Role - Using NavLink */}
          <NavLink 
            to="#recruiter" 
            className={({ isActive }) => `group font-semibold ${activeRole === 'recruiter' ? "text-[#3978ED]" : "text-gray-600"}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleRoleClick('recruiter');
            }}
          >
            <div className="relative rounded-[18px]">
              {/* Gradient border effect */}
              <div
                className={`
                  absolute inset-0 rounded-[18px] popupdiv
                  ${activeRole === 'recruiter' ? "bg-gradient-to-r from-white via-[#3978ED] to-[#3978ED]" : "bg-gray-300"}
                  pointer-events-none
                `}
              >
                <div className="w-full h-full bg-white rounded-[16px]"></div>
              </div>

              {/* Actual content */}
              <div className="relative w-[90px] h-[80px] lg:w-[160px] lg:h-[100px] flex flex-col items-center justify-center rounded-[16px] cursor-pointer z-10">
                <FaUserTie className="text-2xl" />
                <p>Recruiter</p>
              </div>
            </div>
          </NavLink>

          {/* Company Role - Using NavLink */}
          <NavLink 
            to="#company" 
            className={({ isActive }) => `group font-semibold ${activeRole === 'company' ? "text-[#3978ED]" : "text-gray-600"}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleRoleClick('company');
            }}
          >
            <div className="relative rounded-[18px]">
              {/* Gradient border effect */}
              <div
                className={`
                  absolute inset-0 rounded-[18px] popupdiv
                  ${activeRole === 'company' ? "bg-gradient-to-r from-white via-[#3978ED] to-[#3978ED]" : "bg-gray-300"}
                  pointer-events-none
                `}
              >
                <div className="w-full h-full bg-white rounded-[16px]"></div>
              </div>

              {/* Actual content */}
              <div className="relative w-[90px] h-[80px] lg:w-[160px] lg:h-[100px] flex flex-col items-center justify-center rounded-[16px] cursor-pointer z-10">
                <FaBuilding className="text-2xl" />
                <p>Company</p>
              </div>
            </div>
          </NavLink>

          {/* Candidate Role - Using NavLink */}
          <NavLink 
            to="#candidate" 
            className={({ isActive }) => `group font-semibold ${activeRole === 'candidate' ? "text-[#3978ED]" : "text-gray-600"}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent navigation
              handleRoleClick('candidate');
            }}
          >
            <div className="relative rounded-[18px]">
              {/* Gradient border effect */}
              <div
                className={`
                  absolute inset-0 rounded-[18px] popupdiv
                  ${activeRole === 'candidate' ? "bg-gradient-to-r from-white via-[#3978ED] to-[#3978ED]" : "bg-gray-300"}
                  pointer-events-none
                `}
              >
                <div className="w-full h-full bg-white rounded-[16px]"></div>
              </div>

              {/* Actual content */}
              <div className="relative w-[90px] h-[80px] lg:w-[160px] lg:h-[100px] flex flex-col items-center justify-center rounded-[16px] cursor-pointer z-10">
                <FaUserGraduate className="text-2xl" />
                <p>Candidate</p>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Render the appropriate form based on activeRole */}
        <div className="w-full">
          {activeRole === 'recruiter' && <RecruiterRegister />}
          {activeRole === 'company' && <CompanyLoginPage />}
          {activeRole === 'candidate' && <LoginPage1 />}
        </div>
      </div>
    </div>
  )
}

export default Login;