import React, { useState } from 'react';
import axios from '../helper/Axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './SignUpFormHR.css'

const SignUpFormHR = () => {
    const [userData, setUserData] = useState({
        user_name: '',
        user_email: '',
        user_password: '',
        company_name: '',
        industry: '',
        phone_no: '',
    });
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            Swal.fire({
                title: 'Error',
                text: 'Token not found. Please log in again.',
                icon: 'error',
            });
            return;
        }

        if (!userData.user_name || !userData.user_email || !userData.user_password) {
            Swal.fire({
                title: 'Error',
                text: 'Please fill in all required fields.',
                icon: 'error',
            });
            return;
        }

        try {
            const response = await axios.post(
                '/api/insert/ai_Interviewer_register/',
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: response.data.message,
                    icon: 'success',
                });
            }
            navigate("/all_users");
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.detail || 'An error occurred while registering.',
                icon: 'error',
            });
        }
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <>
    <div className="min-h-screen flex items-center justify-center">
  <div className=" signin max-w-md w-full mx-auto p-6 shadow-lg rounded-lg bg-white">
    <button 
      onClick={handleBackClick} 
      className="flex items-center space-x-2 text-teal-900 hover:text-blue-900 cursor-pointer"
    >
      <ArrowLeft className="w-6 h-6" />
      <span>Back</span>
    </button>
    <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
    <form onSubmit={handleSubmit}>
      {['user_name', 'user_email', 'user_password', 'company_name', 'industry', 'phone_no'].map((field, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </label>
          <input
            type={field === 'user_email' ? 'email' : field === 'user_password' ? 'password' : 'text'}
            id={field}
            name={field}
            value={userData[field]}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg singin1"
          />
        </div>
      ))}
      <button type="submit" className=" singin1 signinbtn w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
        Sign Up
      </button>
    </form>
  </div>
</div>

        </>
    );
};

export default SignUpFormHR;