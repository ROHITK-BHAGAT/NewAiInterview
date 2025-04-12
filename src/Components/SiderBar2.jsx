import logo from "../assets/maitri-logo.png";
import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { useLogin } from '../auth/LoginContext';
import logoimage from "../assets/MAITRI AI LOGO 3.png";
import { IoLogOutOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import './SideBar2.css';
import { IoBagRemoveSharp } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";

const SideBar2 = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );

  const { logout } = useLogin();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));

    // Dispatch custom event for other components
    const event = new CustomEvent('sidebarChange', { detail: { isCollapsed } });
    window.dispatchEvent(event);

    // Also dispatch storage event for components that listen to that
    const storageEvent = new Event('storage');
    window.dispatchEvent(storageEvent);
  }, [isCollapsed]);

  const handlelogut = () => {
    logout();
  }

  return (
    <div
      className={`sidebar shadow transition-all duration-300 ${isCollapsed ? "w-27" : "w-72"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-5 transition-all duration-300 border-gray-300 rounded-lg shadow-md  border-1 cursor-pointer bg-white ${isCollapsed ? "-right-4" : "-right-3"}`}
      >
        {isCollapsed ? (
          <IoIosArrowForward size={28} className="text-black-300" />
        ) : (
          <IoIosArrowBack size={28} className="text-black-300" />
        )}
      </button>

      {/* Logo */}
      <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "space-x-4"} adminlogo`}>
        {isCollapsed ? (
          <img src={logoimage} alt="Logo" className="w-[50px] h-[50px]" />
        ) : (
          <img src={logo} alt="Logo" className="w-[200px]" />
        )}
      </div>

      <hr className={` mx-auto bg-gray-300 border-none h-[1.5px] hrtwo ${isCollapsed ? "hrside2" : "w-[80%]"}`} />

      {/* Navigation */}
      <nav className={`flex-grow mt-6 list-none flex flex-col ${isCollapsed ? "gap-4" : "gap-6"} text-lg adminlogo1`}>
        <li>
          <NavLink
            to="/admin_business_msg"
            className={({ isActive }) =>
              `${isActive
                ? isCollapsed
                  ? "collapsed-active"
                  : "activeside"
                : ""
              } flex items-center ${isCollapsed ? "justify-center px-2 " : "px-4"} py-2 rounded sidebarbtn ${isCollapsed ? "sidebarbtnsm" : "w-[80%] "}`
            }
            end
          >
            <div className="flex items-center gap-2">
           <IoBagRemoveSharp className={`${isCollapsed ? "text-3xl " : "text-2xl"} shrink-0 `} />
            {!isCollapsed && <span className="text-base leading-[1]">Business Message</span>}
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/all_users"
            className={({ isActive }) =>
              `${isActive
                ? isCollapsed
                  ? "collapsed-active"
                  : "activeside"
                : ""
              } flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"} py-2 rounded sidebarbtn ${isCollapsed ? "sidebarbtnsm" : "w-[80%]"}`
            }
          >
            <div className="flex items-center gap-2">
            <MdPeopleAlt className={`${isCollapsed ? "text-3xl " : "text-2xl"} shrink-0`} />
            {!isCollapsed && <span className="text-base leading-[1]">All Users</span>}
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hr_Total_ResumeUploaded"
            className={({ isActive }) =>
              `${isActive
                ? isCollapsed
                  ? "collapsed-active"
                  : "activeside"
                : ""
              } flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"} py-2 rounded sidebarbtn ${isCollapsed ? "sidebarbtnsm" : "w-[80%]"}`
            }
          >
            <div className="flex items-center gap-2">
            <FaUserTie className={`${isCollapsed ? "text-3xl " : "text-2xl"} shrink-0`} />
            {!isCollapsed && <span className="text-base leading-[1]">HR Activity</span>}
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/All_hr_candidate_report"
            className={({ isActive }) =>
              `${isActive
                ? isCollapsed
                  ? "collapsed-active"
                  : "activeside"
                : ""
              } flex items-center ${isCollapsed ? "justify-center px-2" : "px-4"} py-2 rounded sidebarbtn ${isCollapsed ? "sidebarbtnsm" : "w-[80%]"}`
            }
          >
            <div className="flex items-center gap-2">
              <IoIosPeople className={`${isCollapsed ? "text-3xl" : "text-2xl"} shrink-0`} />
              {!isCollapsed && (
                <span className="text-base leading-[1]">All HR Candidates</span>
              )}
            </div>
          </NavLink>

        </li>
      </nav>

      {/* Logout Button */}
      <div className={`mt-auto mb-6 ${isCollapsed ? "mx-auto" : "ml-4"}`}>
        <button
          onClick={handlelogut}
          className={`flex items-center text-red-500 cursor-pointer sidebar2logout ${isCollapsed ? "justify-center" : "space-x-2"}`}
        >
          <IoLogOutOutline size={24} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default SideBar2;