import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { MdEmail } from "react-icons/md";
import { FaBuilding, FaPhoneAlt, FaIndustry } from "react-icons/fa";
import axios from "../helper/Axios";
import { useLogin } from "../auth/LoginContext";
import './ProfileCard.css';

const ProfileCard = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { logout } = useLogin();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("api/get_my_profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data.data);
      } catch (e) {
        console.error("Profile fetch error:", e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-card-container">
      {/* Header with close button */}
      <div className="profile-header">
        <RxCross2 className="close-icon" onClick={onClose} />
      </div>

      {/* Profile picture */}
      <div className="profile-picture">
        <div className="avatar">
          {user.user_name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Profile info */}
      <div className="profile-info">
        
        <div className="tags">
        <h3 className="username">{profile.username || 'User'}</h3>
          <div className="flex gap-2">
          {/* {profile.user_type && (
            <span className="user-type">{profile.user_type}</span>
          )} */}
          {/* {profile.company_name && (
            <span className="company">{profile.company_name}</span>
          )} */}
          </div>
          
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <MdEmail className="icon email-icon" />
            <div>
              <p className="label">Email</p>
              <p className="value">{profile.email || 'N/A'}</p>
            </div>
          </div>

          <div className="detail-item">
            <FaBuilding className="icon building-icon" />
            <div>
              <p className="label">Company</p>
              <p className="value">{profile.company_name || 'N/A'}</p>
            </div>
          </div>

          <div className="detail-item">
            <FaPhoneAlt className="icon phone-icon" />
            <div>
              <p className="label">Phone</p>
              <p className="value">{profile.phone_no || 'N/A'}</p>
            </div>
          </div>

          <div className="detail-item">
            <FaIndustry className="icon industry-icon" />
            <div>
              <p className="label">Industry</p>
              <p className="value">{profile.industry || 'N/A'}</p>
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;