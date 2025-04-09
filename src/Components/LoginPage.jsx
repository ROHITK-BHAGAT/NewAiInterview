import React from "react";
import Login from "./Login";
import axios from "../helper/Axios";
// import { useLogin } from "../login/LoginContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../auth/LoginContext";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import logo from '../assets/maitri-logo.png';


const LoginPage = () => {
  const { dispatch } = useLogin();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    user_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/api/AI_Interviewers/login/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.token) {
        // Swal.fire({ title: "Login successful!", icon: "success" });
        const user_data = response.data;
        const { token: newToken, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user_data));
        localStorage.setItem("token", newToken);

        dispatch({
          type: "LOGIN",
          payload: { user: user_data, token: newToken },
        });

        switch (user.user_type) {
          case "HR":
            navigate("/dashboard");
            break;
          case "admin":
            navigate("/admin_business_msg");
            break;
          case "candidate":
            navigate("/StudentProfile");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        Swal.fire({
          title: "Login failed!",
          text: "Invalid email or password.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "Login failed!",
        text: "An error occurred while logging in.",
        icon: "error",
      });
    }
  };

  const handleChange = (name, value) => {
    setPayload((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [showPassword, setShowPassword] = useState(true);
  return (
    <>
      {/* <Login /> */}
       <div className='flex  flex-col items-center justify-center login-image'>
              <img src={logo} alt="logo" className='w-[200px]' />
              {/* <p className='login-para'>Please select your role to continue</p> */}
            </div>
            <div className="flex items-center justify-center login">
                    <h2 className="text-3xl font-bold  text-blue-500">Login</h2>
                  </div>
      <div className="flex items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className=" w-[510px] h-[400px] rounded-2xl  shadow-2xl login-page "
        >
          <div className="flex flex-col items-center justify-center login1-page">
            <div>
              <div className="flex flex-col">
                <label className="text-xl">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={payload.email}
                  placeholder="Enter your email"
                  required
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="writeText shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 rounded-md placeholder-gray-500 placeholder:text-lg border-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col login2-page">
                <label className="text-xl">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "password" : "text"}
                  name="password"
                  value={payload.user_password}
                  onChange={(e) =>
                    handleChange("user_password", e.target.value)
                  }
                  maxLength={8}
                  placeholder="Enter your password"
                  required
                  className="writeText shift-placeholder w-[350px] h-[60px] mt-1 p-2  border-2 border-black-500 rounded-md placeholder-gray-500 placeholder:text-lg border-blue-500 focus:border-blue-500 focus:outline-none"
                />
                <span
                  className="relative left-[305px] bottom-17 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoIosEyeOff size={25} />
                  ) : (
                    <IoIosEye size={25} />
                  )}
                </span>
              </div>
            </div>
            <div className="login-btn">
              <button
                type="submit"
                className="w-[120px] h-[50px] mt-5 text-2xl bg-gradient-to-br from-[#6363f3] to-[#f531d1] hover:from-[#3b3bce] hover:to-[#c61aa7] text-white rounded-md transition-all duration-200 px-4 py-3 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
