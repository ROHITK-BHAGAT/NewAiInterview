import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../helper/Axios";
import Swal from 'sweetalert2';

const CompanyLoginPage = ({ isModal = false, closeModal }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person_name: '',
    business_email: '',
    phone_number: '',
    company_description: '',
    company_website: '',
    company_size: '',
    company_location: "",
    Industry: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setFormData({
      company_name: '',
      contact_person_name: '',
      business_email: '',
      phone_number: '',
      company_description: '',
      company_website: '',
      company_size: '',
      company_location: "",
      Industry: '',
    });

    try {
      const response = await axios.post('/api/companies/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        // setSuccessMessage('Message Sent successfully123!');

        Swal.fire({
          title: 'Message Sent successfully!',
          text: 'Your message has been sent successfully and is being processed. Kindly wait for further response.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            if (isModal && closeModal) {
              closeModal();
            } else {
              navigate("/");
            }
          }
        });
      }
    } catch (err) {
      console.error('Error:', err);

      if (err.response && err.response.status === 422) {
        const errorMessages = err.response.data.detail || [];
        setError(errorMessages.join(', ') || 'Validation failed.');
      } else {
        setError('Something went wrong, please try again later.');
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className='flex items-center justify-center px-4 py-6 recruterpadding'>
      {/* {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>} */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className='w-full max-w-5xl rounded-2xl shadow-2xl p-4 md:p-8 login-page comp-login-page' autoComplete="off">
        <div className='flex flex-col items-center justify-center login1-page'>
          <div className='w-full'>
            {/* Form fields remain the same */}
            {/* First row - Company Name and Contact Person */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between md:gap-6 mb-4'>
              <div className='flex flex-col w-full md:w-1/2 mb-4 md:mb-0'>
                <label htmlFor="companyName" className='text-lg md:text-xl mb-1'>Company Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="company_name"
                  id="companyName"
                  placeholder="Enter Company Name"
                  required
                  value={formData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <label className='text-lg md:text-xl mb-1' htmlFor="contactName">Contact Person Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="contact_person_name"
                  id="contactName"
                  placeholder="Enter full name"
                  value={formData.contact_person_name}
                  onChange={(e) => handleChange("contact_person_name", e.target.value)}
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
            </div>

            {/* Second row - Email and Phone */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between md:gap-6 mb-4'>
              <div className='flex flex-col w-full md:w-1/2 mb-4 md:mb-0'>
                <label className='text-lg md:text-xl mb-1'>Business Email<span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="business_email"
                  id="email"
                  value={formData.business_email}
                  onChange={(e) => handleChange("business_email", e.target.value)}
                  placeholder="Enter Business email"
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <label className='text-lg md:text-xl mb-1'>Phone Number<span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone"
                  pattern="\d{10}"
                  maxLength={10}
                  placeholder="Enter Phone Number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
            </div>

            {/* Third row - Website and Company Size */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between md:gap-6 mb-4'>
              <div className='flex flex-col w-full md:w-1/2 mb-4 md:mb-0'>
                <label className='text-lg md:text-xl mb-1'>Company Website<span className="text-red-500">*</span></label>
                <input
                  type="url"
                  name="company_website"
                  id="website"
                  placeholder="https://example.com"
                  value={formData.company_website}
                  onChange={(e) => handleChange("company_website", e.target.value)}
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <label className='text-lg md:text-xl mb-1'>Company Size<span className="text-red-500">*</span></label>
                <select
                  name="company_size"
                  id="size"
                  required
                  value={formData.company_size}
                  onChange={(e) => handleChange("company_size", e.target.value)}
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 "
                >
                  <option value="">Select Company Size</option>
                  <option value="1-10">1 - 10 employees</option>
                  <option value="11-50">11 - 50 employees</option>
                  <option value="51-200">51 - 200 employees</option>
                  <option value="201-500">201 - 500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>

            {/* Fourth row - Industry and Location */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between md:gap-6 mb-4'>
              <div className='flex flex-col w-full md:w-1/2 mb-4 md:mb-0'>
                <label className='text-lg md:text-xl mb-1'>Industry Type<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="Industry"
                  id="industry"
                  placeholder="e.g IT or Healthcare"
                  value={formData.Industry}
                  onChange={(e) => handleChange("Industry", e.target.value)}
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <label className='text-lg md:text-xl mb-1'>Company Location<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="company_location"
                  id="location"
                  placeholder="e.g Mumbai or Delhi"
                  value={formData.company_location}
                  onChange={(e) => handleChange("company_location", e.target.value)}
                  required
                  className="shift-placeholder writeText w-full h-12 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-gray-300"
                />
              </div>
            </div>

            {/* Company Description */}
            <div className='flex flex-col w-full mt-4'>
              <label className='text-lg md:text-xl mb-1'>Company Description<span className="text-red-500">*</span></label>
              <textarea
                name="company_description"
                id="description"
                placeholder="Tell us about your company.."
                required
                value={formData.company_description}
                onChange={(e) => handleChange("company_description", e.target.value)}
                className="shift-placeholder writeText company-descp w-full h-24 md:h-32 p-2 border-2 border-black-500 rounded-md placeholder-gray-500 border-gray-300"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className='login-btn flex justify-center w-full mt-6'>
            <button
              type="submit"
              className="w-full max-w-xs h-12 text-lg md:text-xl bg-gradient-to-br from-[#6363f3] to-[#f531d1] text-white rounded-md transition duration-200 px-4 py-2 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Submit Application</span> <FaLongArrowAltRight className="ml-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CompanyLoginPage;