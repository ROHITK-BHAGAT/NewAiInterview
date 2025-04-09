import React from 'react'
import Swal from "sweetalert2";
import { MdOutlineCancel } from "react-icons/md";
import axios from "../helper/Axios"; // Ensure the correct path
import { useLogin } from "../auth/LoginContext";
import { useState,useEffect } from 'react';
const StudentProfileSetting = ({handleCancel}) => {


    const token = localStorage.getItem("token");
    const [profileData, setProfileData] = useState({});


    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get("/api/get_my_profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setProfileData(response.data.data);
          } catch (e) {
          
            console.log(e);
          }
        };
    
        fetchProfile();
      }, [token]);
  const { logout } = useLogin();

    const handleLogout = () => {
        // console.log('hi')
        logout();
      };
  return (
    <div>
      <div className="absolute inset-0 flex justify-center items-start p-6 z-30 top-10 ">
  <div className=" rounded-lg shadow-lg p-6 bg-gray-50 text-gray-700 profilelogout">
    <div className="flex justify-between items-center gap-10 profilehead">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <MdOutlineCancel
        size={22}
        onClick={handleCancel}
        className="cursor-pointer"
      />
    </div>

    <div className="space-y-4">
      {/* Admin Profile Section */}
      <div className="flex items-center gap-1 space-x-4 profileimg">
        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {profileData?.username?.slice(0, 1)}
        </div>
        <div>
          <p className="text-lg font-semibold">{profileData.username}</p>
        </div>
      </div>

      <div className="space-y-2 flex items-center profilemail">
        <label className="text-lg  font-bold">Email :-</label>
        <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
          <p>{profileData.email}</p>
        </div>
      </div>
      <div className="space-y-2 flex items-center profilemail">
        <label className="text-lg font-bold">Phone No. :-</label>
        <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
          <p>{profileData.phone_no}</p>
        </div>
      </div>

    

      {/* Logout Button */}
      {/* <Link> */}
        <button
        type='button'
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-yellow-500 to-red-500 m-2 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 cursor-pointer addmore"
        >
          Log out
        </button>
      {/* </Link> */}
    </div>
  </div>
</div>

    </div>
  )
}

export default StudentProfileSetting