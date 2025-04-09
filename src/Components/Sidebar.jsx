import React, { useState, useEffect } from "react";
import logo from "../assets/maitri-logo.png";
import { NavLink } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import logoimage from "../assets/MAITRI AI LOGO 3.png";
import './Sidebar.css'

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IoBagRemoveSharp } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { useLogin } from "../auth/LoginContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false);

  const { logout } = useLogin();

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));

    // Create a custom event to notify other components
    const event = new Event('storage');
    window.dispatchEvent(event);
  }, [isCollapsed]);

  const handlelogut = () => {
    logout();
  }

  return (
    <>
      <div
        className={`sticky top-0 bottom-0 left-0 flex flex-col h-screen shadow transition-all duration-300 ${isCollapsed ? "w-20" : "w-80"}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-5 transition-all duration-300 border-gray-300 rounded-lg shadow-md bg-white border-1 cursor-pointer ${isCollapsed ? "-right-5" : "-right-3"}`}
        >
          {isCollapsed ? (
            <IoIosArrowForward size={28} className="text-black-300" />
          ) : (
            <IoIosArrowBack size={28} className="text-black-300" />
          )}
        </button>

        {/* Sidebar Content - Main Content */}
        <div className="flex flex-col flex-grow">
          <div
            className={`flex flex-col gap-2 transition-all duration-300 ${isCollapsed ? "items-center" : "items-start pl-4"}`}
          >
            <div className="flex items-center justify-center mt-7 sidebarsmalllogo1">
              {isCollapsed ? (
                <img
                  src={logoimage}
                  alt="Collapsed Logo"
                  className="w-[50px] h-[50px] mt-5"
                />
              ) : (
                <img
                  src={logo}
                  alt="Expanded Logo"
                  className="w-[200px] sidebarlogo transition-all duration-300"
                />
              )}
            </div>
            <hr
              className={`w-[80%] flex items-center bg-gray-300 border-none h-[2.0px] justify-center sidebarhrline ${isCollapsed ? "sidebarsmalllogo" : ""}`}
            />
            <nav className="w-full margin sidenav text-lg">
              <ul className="flex flex-col gap-4">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `${isActive
                        ? isCollapsed
                          ? "collapsed-active"
                          : "activeside"
                        : ""
                      } 
                      flex items-center gap-2 sidebarbtn ${isCollapsed
                        ? "sidebarbtnsm"
                        : "w-[80%]"
                      }`
                    }
                  >
                    <FiHome size={24} className="text-gray-700"/>
                    {!isCollapsed && <span>Dashboard</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobposting"
                    className={({ isActive }) => `${isActive
                      ? isCollapsed
                        ? "collapsed-active"
                        : "activeside"
                      : ""
                      } 
                      flex items-center gap-2 sidebarbtn ${isCollapsed
                        ? "sidebarbtnsm"
                        : "w-[80%]"
                      }`}
                  >
                    <IoBagRemoveSharp size={24} className="text-gray-700"/>
                    {!isCollapsed && <span>Job Posting</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/candidatescreening"
                    className={({ isActive }) => `${isActive ? (isCollapsed ? "collapsed-active" : "activeside") : ""} flex items-center gap-2 sidebarbtn ${isCollapsed ? "sidebarbtnsm justify-center" : "w-full"}`}
                  >
                    <BsPeopleFill size={24} className="text-gray-700"/>
                    {!isCollapsed && <span className="whitespace-nowrap">Candidate Screening</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/resumeanalysis"
                    className={({ isActive }) => `${isActive
                      ? isCollapsed
                        ? "collapsed-active"
                        : "activeside"
                      : ""
                      } 
                      flex items-center gap-2 sidebarbtn ${isCollapsed
                        ? "sidebarbtnsm"
                        : "w-[80%]"
                      }`}
                  >
                    <FaFileAlt size={24} className="text-gray-700"/>
                    {!isCollapsed && <span>Resume Analysis</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/selectedcandidate"
                    className={({ isActive }) => `${isActive
                      ? isCollapsed
                        ? "collapsed-active"
                        : "activeside"
                      : ""
                      } 
                      flex items-center gap-2 sidebarbtn ${isCollapsed
                        ? "sidebarbtnsm"
                        : "w-[80%]"
                      }`}
                  >
                    <IoIosPeople size={24} className="text-gray-700" />
                    {!isCollapsed && <span>Selected Candidates</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/interviewreport"
                    className={({ isActive }) => `${isActive
                      ? isCollapsed
                        ? "collapsed-active"
                        : "activeside"
                      : ""
                      } 
                      flex items-center gap-2 sidebarbtn ${isCollapsed
                        ? "sidebarbtnsm"
                        : "w-[80%]"
                      }`}
                  >
                    <TbReportAnalytics size={24} className="text-gray-700"/>
                    {!isCollapsed && <span>Interview Report</span>}
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>

          <div className={`sidebarlogout mt-auto mb-4 fexl ${isCollapsed ? " mx-auto w-[60%] " : "ml-4"}`}>
            <div
              className="flex  justify-center items-center gap-2 cursor-pointer text-xl    rounded-lg w-full text-red-500 logout  font-medium"
              onClick={handlelogut}
            
            >
              <IoLogOutOutline size={24} className="font-medium" />
              {!isCollapsed &&
               <span className="logoutText">Logout</span>}
     
            </div>
          </div>
      </div>
      
    </>
  );
};

export default Sidebar;