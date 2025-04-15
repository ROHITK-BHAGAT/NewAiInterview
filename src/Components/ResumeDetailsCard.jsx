import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { IoPerson } from "react-icons/io5";
import { IoBagRemoveSharp } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { GoClock } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "../helper/Axios";
import { useLocation } from "react-router-dom";
import './ResumeDetailsCard.css'
import { IoArrowBackOutline } from "react-icons/io5";
import './ResumeDetailsCard.css'



const ResumeDetailsCard = () => {
  const location = useLocation();
  const selectedResume = location.state?.resume;

  // if (!selectedResume) {
  //   return <p className="text-center text-gray-500">Loading resume details...</p>;
  // }
  const token = localStorage.getItem("token");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeDetails = async () => {
      // console.log(userId)
      setLoading(true);
      try {
        const response = await axios.get(`/api/get_resumes_analysis_report/?hr_id=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Resume Details:", response.data);
        setResume(response.data);

      } catch (error) {
        console.error("Error fetching resume details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchResumeDetails();
    }
  }, [userId]);

  if (loading) {
    return <p className="text-center">Loading resume details...</p>;
  }

  if (!resume) {
    return <p className="text-center">No resume details found.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row w-full px-4 md:px-10 py-5">
      {/* <div>
        
        <Sidebar />
      </div> */}

      <div className='resumed '>
        <button className='flex items-center w-fit rounded-lg bg-blue-600 hover:bg-blue-800 cursor-pointer text-white abcd'
          onClick={() => navigate(-1)}
        > <IoArrowBackOutline className='text-xl relative right-1  md' />back</button>

        {/* 1st row */}
        <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-0 md2'>

          <div>
            <p className='font-bold md:text-3xl text-2xl'>Resume Analysis Report</p>
          </div>

          <div>

            <p className={`text-sm md:text-xl rounded-3xl w-fit mt-2 md:mt-0 resumeselect ${selectedResume.resume_status === "Resume Selected" ? "text-green-700 bg-green-200"
              : "text-red-700 bg-red-200"}`}>{selectedResume.resume_status.toUpperCase()}</p>
          </div>
        </div>
        {/* 2nd row */}
        <div>
          <div className='overflow-x-auto'>
            <table className="min-w-full text-sm md:text-base table-auto ">
              <tbody className="w-full">
                <tr className="grid grid-cols-2 gap-4">
                  <td className="flex items-center gap-2"><IoPerson className='text-gray-500' /> {selectedResume?.candidate_info?.name || "N/A"}</td>
                  <td className="flex items-center gap-2"><IoBagRemoveSharp className='text-gray-500' />{selectedResume?.job_title || "N/A"}</td>
                </tr>
                <tr className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <td className="flex items-center gap-2"><MdMailOutline className='text-gray-500' />{selectedResume?.candidate_info?.email || "N/A"}</td>
                  <td className="flex items-center gap-2"><GoClock className='text-gray-500' />{selectedResume?.uploaded_at || "N/A"}</td>
                </tr>
                <tr className="grid grid-cols-2 gap-4">
                  <td className="flex items-center gap-2"><FaPhoneAlt className='text-gray-500' /> {selectedResume?.candidate_info?.phone || "N/A"}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* 3rd row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
        <div className='flex data bg-[#EFF6FF]  items-center justify-between '>
            <div className=' md:text-2xl text-xl'>
              <p>Overall Score</p>
              <p className='md:text-3xl font-bold text-[#2563EB]'>{selectedResume?.overall_score || "N/A"}</p>
            </div>

          </div>
          <div className='flex data bg-[#ECFDF5] items-center justify-between gap-5 '>
            <div className=' md:text-2xl text-xl'>
              <p>Relevance</p>
              <p className='md:text-3xl font-bold text-[#059669]'>{selectedResume?.relevance || "N/A"}/10</p>
            </div>

          </div>
          <div className='flex data bg-[#FFFBEB] items-center justify-between gap-5 '>
            <div className=' md:text-2xl text-xl'>
              <p>Skills Fit</p>
              <p className='md:text-3xl font-bold text-[#D97706]'>{selectedResume?.skills_fit || "N/A"}/10</p>
            </div>

          </div>
          <div className='flex data bg-[#F5F3FF] items-center justify-between gap-5'>
            <div className=' md:text-2xl text-xl'>
              <p>Cultural Fit</p>
              <p className='md:text-3xl font-bold text-[#7C3AED]'>{selectedResume?.cultural_fit || "N/A"}/10</p>
            </div>
          </div>
          <div className='flex data bg-[#F5F3FF] items-center justify-between gap-5'>
            <div className=' md:text-2xl text-xl'>
              <p>Experience Match</p>
              <p className='md:text-3xl font-bold text-[#7C3]'>{selectedResume?.experience_match || "N/A"}/10</p>
            </div>
          </div>
        </div>

        {/* 4th row */}
        <div className='bg-[#ECFDF5] strength rounded-lg'>
          <div className='strength1'>
            <p className='text-2xl font-medium'>Strength</p>
          </div>
          <div className='strginfo flex flex-col gap-3 text-lg text-gray-700'>
            <p>{selectedResume?.strengths || "N/A"}</p>
          </div>
        </div>
        <div className='bg-[#FEF2F2] strength rounded-lg'>
          <div className='strength1'>
            <p className='text-2xl font-medium'>Weaknesses</p>
          </div>
          <div className='strginfo flex flex-col gap-3 text-lg text-gray-700'>
            <p>{selectedResume?.weaknesses || "N/A"}</p>
          </div>
        </div>
        <div className='bg-[#EFF6FF] strength rounded-lg'>
          <div className='strength1'>
            <p className='text-2xl font-medium'>Recommendations</p>
          </div>
          <div className='strginfo flex flex-col gap-3 text-lg text-gray-700'>
            <p>{selectedResume?.recommendations || "N/A"}</p>
          </div>
        </div>
        <div className='bg-[#FFFBEB] strength rounded-lg'>
          <div className='strength1'>
            <p className='text-2xl font-medium'>Missing Elements</p>
          </div>
          <div className='strginfo flex flex-col gap-3 text-lg text-gray-700'>
            <p>{selectedResume?.missing_elements || "N/A"}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ResumeDetailsCard;


