import React from "react";
import axios from "../helper/Axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../auth/LoginContext";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import Login from "./Login";

const LoginPage1 = ({ isModal = false, closeModal }) => {
  const { dispatch } = useLogin();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    user_password: "",
  });
  const [singUp, setSignUp] = useState(true); // Changed to true to show signup by default
  const handleSignUp = () => {
    setSignUp(!singUp);
  };
  const token = localStorage.getItem("token");

  const [payload2, setPayload2] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    phone_no: "",
  });

  const handleSingnUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/insert/candidate_register/?user_type=candidate",
        payload2,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        Swal.fire({
          icon: "success",
          text: "Successfully Registered ",
        });

        setSignUp(!singUp);
        setPayload2({
          user_name: "",
          user_email: "",
          user_password: "",
          phone_no: "",
        });
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: `${e}`,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        const user_data = response.data;
        const { token: newToken, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user_data));
        localStorage.setItem("token", newToken);

        dispatch({
          type: "LOGIN",
          payload: { user: user_data, token: newToken },
        });

        // Close the modal if it's open
        if (isModal && closeModal) {
          closeModal();
        }

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
  
  const handleChange2 = (name, value) => {
    setPayload2((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const [showPassword, setShowPassword] = useState(true);

  return (
    <>
    {/* <Login/> */}
    <div className="flex items-center justify-center">
      {singUp ? (
        <form
          onSubmit={handleSingnUp}
          className="w-[510px] h-[590px] rounded-2xl shadow-2xl login-page"
        >
          <div className="flex flex-col items-center justify-center login1-page">
            <div>
              <div className="flex flex-col">
                <label className="text-xl">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={payload2.user_name}
                  placeholder="Enter your Name"
                  required
                  onChange={(e) => handleChange2("user_name", e.target.value)}
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col login2-page">
                <label className="text-xl">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="user_email"
                  value={payload2.user_email}
                  placeholder="Enter your email"
                  required
                  onChange={(e) =>
                    handleChange2("user_email", e.target.value)
                  }
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
              </div>

              <div className="flex flex-col login2-page">
                <label className="text-xl">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "password" : "text"}
                  name="user_password"
                  value={payload2.user_password}
                  onChange={(e) =>
                    handleChange2("user_password", e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  maxLength={8}
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
                <span
                  className="relative left-[305px] bottom-13"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoIosEyeOff size={25} />
                  ) : (
                    <IoIosEye size={25} />
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <label className="text-xl">
                  Phone no.<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone_no"
                  pattern="\d{10}"
                  maxLength={10}
                  value={payload2.phone_no}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only update if the input is a number or empty string
                    if (value === "" || /^[0-9\b]+$/.test(value)) {
                      handleChange2("phone_no", value);
                    }
                  }}
                  placeholder="Enter your Number"
                  required
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="login-btn flex flex-col items-center gap-1">
              <button
                type="submit"
                className="w-[120px] h-[50px] mt-5 text-2xl bg-gradient-to-br from-[#6363f3] to-[#f531d1] hover:from-[#3b3bce] hover:to-[#c61aa7] text-white rounded-md transition duration-200 px-4 py-3 cursor-pointer"
              >
                SignUp
              </button>
              <span className="text-red-600">
                Already have an Account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={handleSignUp}
                >
                  Login to Your account
                </span>
              </span>
            </div>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-[510px] h-[590px] rounded-2xl shadow-2xl login-page"
        >
          <div className="flex flex-col items-center justify-center login1-page">
            <div>
              <div className="flex flex-col login2-page">
                <label className="text-xl">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={payload.email}
                  placeholder="Enter your email"
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
              </div>

              <div className="flex flex-col login2-page">
                <label className="text-xl">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "password" : "text"}
                  name="user_password"
                  value={payload.user_password}
                  onChange={(e) => handleChange("user_password", e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="writeText writeText1 shift-placeholder w-[350px] h-[60px] mt-1 p-2 border-2 border-gray-300 rounded-md placeholder-gray-500 placeholder:text-lg focus:outline-none"
                />
                <span
                  className="relative left-[305px] bottom-13"
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
            <div className="login-btn flex flex-col items-center gap-1">
              <button
                type="submit"
                className="w-[120px] h-[50px] mt-5 text-2xl bg-gradient-to-br from-[#6363f3] to-[#f531d1] hover:from-[#3b3bce] hover:to-[#c61aa7] text-white rounded-md transition duration-200 px-4 py-3 cursor-pointer"
              >
                Login
              </button>
              <span className="text-red-600">
                Don't have an Account?{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={handleSignUp}
                >
                  Sign Up for free
                </span>
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default LoginPage1;