import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { IoPerson } from "react-icons/io5";
import { IoBagRemoveSharp } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "../helper/Axios";
import { useLocation } from "react-router-dom";
import "./ResumeDetailsCard.css";
import { IoArrowBackOutline } from "react-icons/io5";
import "./ResumeDetailsCard.css";
import { useLogin } from "../auth/LoginContext";
import { MdOutlineCancel } from "react-icons/md";

const StdResumeUploadData = () => {
  const location = useLocation();
  const selectedResume = location.state?.resume;

  // if (!selectedResume) {
  //   return <p className="text-center text-gray-500">Loading resume details...</p>;
  // }
  const token = localStorage.getItem("token");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchResumeDetails();
    }
  }, [userId]);
  const fetchResumeDetails = async () => {
    //   console.log(userId)
    //   setLoading(true);
    try {
      const response = await axios.get(
        "/api/candidate_level_resume_analysis/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Resume Details:", );
      setCount(response.data[0].resume_upload_count);
      // console.log("Resume Details:", response.data[0].uploaded_at);
      // console.log(
      //   "Resume Details:",
      //   response.data[0].resume_analysis.job_title
      // );

      setResume(response.data[0]);
      handleCancel();
    } catch (error) {
      //   console.error("Error fetching resume details:", error);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchResumeDetails;
  }, []);
  // profile
  const { logout } = useLogin();
  // const token = localStorage.getItem("token");

  const [studenteData, setStudentData] = useState({
    job_title: "",
    upload_resumes: null,
  });
  const handleChange = (e) => {
    setStudentData({
      ...studenteData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e) => {
    setStudentData({
      ...studenteData,
      upload_resumes: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studenteData.job_title || !studenteData.upload_resumes) {
      Swal.fire({
        title: "Please fill all required fields",
        icon: "warning",
      });
      return; // Don't disable the button if fields aren't filled
    }
    setIsDisabled(true);
    // Ensure a file is selected


    // Prepare form data for upload
    const formData = new FormData();
    formData.append("job_title", studenteData.job_title);
    formData.append("upload_resumes", studenteData.upload_resumes);

    try {
      const response = await axios.post(
        "/api/resume_upload/candidate_level/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchResumeDetails();
        setIsDisabled(false);
        Swal.fire({
          title: "Your resume has been uploaded successfully!",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
      setIsDisabled(false);

      Swal.fire({
        title: "Failed to upload resume",
        text: `${error?.response?.data?.detail}`,
        icon: "error",
      });
    }
  };
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = (e) => {
    // disable button after click only if validation passes
  };
  const [count, setCount] = useState(0);
  const [showProfile, setShowProfile] = useState(true);
  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };
  return (
    <>
      {showProfile && (
        <div className="absolute inset-0 flex justify-center items-center   p-6 z-30 backdrop-blur-xs  ">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg shadow-lg p-6 bg-gray-50 text-gray-700 profilelogout"
          >
            <div className="flex justify-end items-center gap-10 profilehead">
              <MdOutlineCancel
                size={26}
                onClick={handleCancel}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-lg font-bold mb-6 profilemail">
                No. of trials available :-{" "}
                <span className="text-red-500">{2 - count}</span>
              </h1>

              <div className="space-y-2 flex flex-col profilemail">
                <label className="text-lg font-bold">Job Title :-</label>
                <input
                  type="text"
                  className="w-full border border-gray-600 p-2 rounded-md resumeanalysis"
                  placeholder="e.g fronted or backend developer"
                  required
                  name="job_title"
                  value={studenteData.job_title}
                  // onchange={()=>}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 flex flex-col profilemail">
                <label className="text-lg font-bold">Upload Resume :-</label>
                <input
                  type="file"
                  className="w-full border border-gray-600 p-2 rounded-md resumeanalysis"
                  required
                  accept="pdf"
                  onChange={handleFileChange}
                />
              </div>

              <button
                type="submit"
                // onClick={handleClick}
                disabled={isDisabled}
                className="w-full bg-green-400 m-2 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 cursor-pointer addmore"
              >
                {isDisabled ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex w-full md1">
        <div className="resumed w-full ">
          <div className="flex justify-between w-full">
            <button
              className="flex rounded-lg bg-blue-600 hover:bg-blue-800 cursor-pointer text-white abcd "
              onClick={() => navigate(-1)}
            >
              <IoArrowBackOutline className="text-xl relative right-1  md" />
              back
            </button>
            <button
              className="flex rounded-lg bg-blue-600 hover:bg-blue-800 cursor-pointer text-white abcd "
              onClick={handleCancel}
            >
              Upload Resume
            </button>
          </div>
          {resume ? (
            <div>
              <div>
                <div className="flex justify-between md2">
                  <div>
                    <p className="font-bold  text-3xl">
                      Resume Analysis Report
                    </p>
                  </div>
                </div>
                <table className="w-[80%]  table table-auto text-xl ">
                  <tbody className="w-full">
                    <tr className="grid grid-cols-2 gap-4">
                      <td className="flex items-center gap-2">
                        <IoPerson className="text-gray-500" />
                        {resume?.result.candidate_info?.name || "N/A"}
                      </td>
                      <td className="flex items-center gap-2">
                        <IoBagRemoveSharp className="text-gray-500" />
                        {resume?.resume_analysis?.job_title || "N/A"}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2 gap-4">
                      <td className="flex items-center gap-2">
                        <MdMailOutline className="text-gray-500" />
                        {resume?.result.candidate_info?.email || "N/A"}
                      </td>
                      <td className="flex items-center gap-2">
                        <GoClock className="text-gray-500" />
                        {resume?.uploaded_at
                          ? new Date(resume.uploaded_at).toLocaleString('en-GB', {
                            dateStyle: 'medium',
                            timeStyle: 'medium', // includes seconds
                          })
                          : "N/A"}
                      </td>
                    </tr>
                    <tr className="grid grid-cols-2 gap-4">
                      <td className="flex items-center gap-2">
                        <FaPhoneAlt className="text-gray-500" />{" "}
                        {resume?.result.candidate_info?.phone || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between gap-5  ">
                <div className="flex data bg-[#EFF6FF]  items-center justify-between ">
                  <div className=" text-2xl">
                    <p>Overall Score</p>
                    <p className="text-3xl font-bold text-[#2563EB]">
                      {resume?.result.overall_score || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex data bg-[#ECFDF5] items-center justify-between gap-5 ">
                  <div className=" text-2xl">
                    <p>Relevance</p>
                    <p className="text-3xl font-bold text-[#059669]">
                      {resume?.result.relevance || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex data bg-[#FFFBEB] items-center justify-between gap-5 ">
                  <div className=" text-2xl">
                    <p>Skills Fit</p>
                    <p className="text-3xl font-bold text-[#D97706]">
                      {resume?.result.skills_fit || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex data bg-[#F5F3FF] items-center justify-between gap-5">
                  <div className=" text-2xl">
                    <p>Cultural Fit</p>
                    <p className="text-3xl font-bold text-[#7C3AED]">
                      {resume?.result.cultural_fit || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex data bg-[#F5F3FF] items-center justify-between gap-5">
                  <div className=" text-2xl">
                    <p>Experience Match</p>
                    <p className="text-3xl font-bold text-[#7C3]">
                      {resume?.result.experience_match || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#ECFDF5] strength rounded-lg">
                <div className="strength1">
                  <p className="text-2xl font-medium">Strength</p>
                </div>
                <div className="strginfo flex flex-col gap-3 text-lg text-gray-700">
                  <p>{resume?.result.strengths || "N/A"}</p>
                </div>
              </div>
              <div className="bg-[#FEF2F2] strength rounded-lg">
                <div className="strength1">
                  <p className="text-2xl font-medium">Weaknesses</p>
                </div>
                <div className="strginfo flex flex-col gap-3 text-lg text-gray-700">
                  <p>{resume?.result.weaknesses || "N/A"}</p>
                </div>
              </div>
              <div className="bg-[#EFF6FF] strength rounded-lg">
                <div className="strength1">
                  <p className="text-2xl font-medium">Recommendations</p>
                </div>
                <div className="strginfo flex flex-col gap-3 text-lg text-gray-700">
                  <p>{resume?.result.recommendations || "N/A"}</p>
                </div>
              </div>
              <div className="bg-[#FFFBEB] strength rounded-lg">
                <div className="strength1">
                  <p className="text-2xl font-medium">Missing Elements</p>
                </div>
                <div className="strginfo flex flex-col gap-3 text-lg text-gray-700">
                  <p>{resume?.result.missing_elements || "N/A"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center ">
              <span className="text-red-500 text-3xl">
                {" "}
                please upload Resume
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StdResumeUploadData;
