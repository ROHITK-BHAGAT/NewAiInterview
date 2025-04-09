import React from "react";
import axios from "../helper/Axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useLogin } from "../auth/LoginContext";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import Login from "./Login";

const RecruiterRegister = ({ isModal = false, isInline = false, closeModal }) => {
  // Add state for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    description: '',
    password: ''
  });
  
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(true);
  
  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
    // You'll want to add validation and API calls here
    
    // If it's a modal, close it after successful submission
    if (isModal && closeModal) {
      // Add a success message if needed
      Swal.fire({
        title: "Success!",
        text: "Registration submitted successfully!",
        icon: "success",
        confirmButtonText: "Ok"
      }).then(() => {
        closeModal();
      });
    } else {
      // Show success message for inline form
      Swal.fire({
        title: "Success!",
        text: "Registration submitted successfully!",
        icon: "success",
        confirmButtonText: "Ok"
      });
    }
  };
 
  return (
    <>
    {/* <Login/> */}
    <div className="flex items-center justify-center  recruterpadding ">
      <form
        onSubmit={handleSubmit}
        className={`${isModal ? 'w-full' : isInline ? 'w-full' : 'w-[910px]'} rounded-2xl shadow-2xl login-page register px-8 py-6 `}
      >
        <div className="flex flex-col items-center justify-center login1-page ">
          {/* Name and Email row */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-lg">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                placeholder="Enter Your Name"
                onChange={(e) => handleChange("name", e.target.value)}
                className="writeText shift-placeholder h-[60px] p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
              />
            </div>
            
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-lg">
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                placeholder="Enter your email"
                onChange={(e) => handleChange("email", e.target.value)}
                className="writeText shift-placeholder h-[60px] p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
              />
            </div>
          </div>
          
          {/* Company Name and Phone row */}
          <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-lg">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                required
                placeholder="Enter Company Name"
                onChange={(e) => handleChange("company", e.target.value)}
                className="writeText shift-placeholder h-[60px] p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
              />
            </div>
            
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-lg">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                required
                placeholder="Enter Phone Number" 
                pattern="[0-9]{10}"
                onChange={(e) => handleChange("phone", e.target.value)}
                className="writeText shift-placeholder h-[60px] p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
              />
            </div>
          </div>
          
          {/* Description and Password row */}
          <div className="flex flex-row gap-4 w-full mb-4">
            <div className="flex flex-col w-[100%]">
              <label className="text-lg">
                Company Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                required
                placeholder="Brief description"
                onChange={(e) => handleChange("description", e.target.value)}
                className="writeText shift-placeholder h-[90px] p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
              />
            </div>
          </div>
          
          <div className="w-full flex justify-center mt-4">
            <button
              type="submit"
              className="w-[180px] h-[50px] text-xl bg-gradient-to-br from-[#6363f3] to-[#f531d1] hover:from-[#3b3bce] hover:to-[#c61aa7] text-white rounded-md transition-all duration-200 px-4 py-3 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
};

export default RecruiterRegister;