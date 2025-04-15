import React from "react";
import { Link } from "react-router-dom";
import { FileText, Video,LogOut } from "lucide-react";
import './Profile.css';
import { useLogin } from "../auth/LoginContext";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { BiSolidReport } from "react-icons/bi";

const StudentSiderBar = ({handleCancel}) => {
    const { logout } = useLogin();
    const handleLogout = () => {
      // console.log('hi')
      logout();
    };
  return (
    <div className="sidebar-container w-full  ">
      <div className="sidebar-inner">
        <div className="sidebar-header">
                                  <img src={logo} loading="lazy" alt="Logo" />
          
        {/* <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Candidate
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dashboard">
              dashboard
            </span>
          </h2  > */}
          <hr />
        </div>
        
        <nav className="sidebar-nav">
          <ul className="sidebar-list">
            <li className="sidebar-item" onClick={handleCancel}>
              <Link
                to="/C_Resume_Analysis_Report"
                className="sidebar-link"
              >
                <FileText className="sidebar-icon" />
                <span>Resume Analysis</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <NavLink
              // onClick={()=>{console.log(console.log('Interview Demo'))}}
                to="/Demo_Interview"
                className="sidebar-link"
              >
                <Video className="sidebar-icon" />
                <span>Interview Demo</span>
              </NavLink>
            </li>

            {/* remaining to integrate api */}
            
            <li>
              <NavLink
              className="sidebar-link"
              >

              <BiSolidReport className="sidebar-icon"/>
                <span>Interview Report</span>
              </NavLink>
            </li>
            <li className="sidebar-item  border border-gray-300 rounded-lg w-full text-red-500 flex justify-center hover:bg-gray-300">
              <Link onClick={handleLogout}
                to="#"
                className="logoutSiderbar"
              >
                <LogOut className="sidebar-icon" color="red" />
                <span className="text-red">Logout</span>
              </Link>
            </li>
            
          </ul>
          
        </nav>
      </div>

    </div>
  );
};

export default StudentSiderBar;

