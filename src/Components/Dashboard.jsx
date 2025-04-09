import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import { FaRegBell } from "react-icons/fa";
import { HiVideoCamera } from "react-icons/hi2";
import { FaFileAlt } from "react-icons/fa";
import { IoBagRemoveSharp } from "react-icons/io5";
import { BsPeopleFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { IoCodeSlashOutline } from "react-icons/io5";
import { FaPencilRuler } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import axios from "../helper/Axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import './Dashboard.css'
import { CgProfile } from "react-icons/cg";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const userName = user.user_name;
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [totalUpload, setTotalUpload] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [showAllInterviews, setShowAllInterviews] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarState = JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
      setIsSidebarCollapsed(sidebarState);
    };

    checkSidebarState();
    window.addEventListener('storage', checkSidebarState);
    return () => {
      window.removeEventListener('storage', checkSidebarState);
    };
  }, []);

  const data = [
    { month: "Jan", value: 3 },
    { month: "Feb", value: 2 },
    { month: "Mar", value: 4 },
    { month: "Apr", value: 3 },
    { month: "May", value: 5 },
    { month: "Jun", value: 4 },
    { month: "Jul", value: 6 },
    { month: "Aug", value: 3 },
    { month: "Sep", value: 4.5 },
    { month: "Oct", value: 5 },
    { month: "Nov", value: 3.5 },
    { month: "Dec", value: 4 },
  ];

  useEffect(() => {
    const fetchRecentInterviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`/api/get_resumes_analysis_report/?hr_id=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const selectedResumes = response.data.filter(resume =>
          resume.resume_status.toLowerCase() === 'resume selected'
        );
        setRecentInterviews(selectedResumes);
      } catch (e) {
        console.error('Error fetching recent interviews:', e);
      }
    };

    if (userId) fetchRecentInterviews();
  }, [userId]);

  const toggleProfileCard = () => setShowProfileCard(!showProfileCard);
  const toggleShowAllInterviews = () => setShowAllInterviews(!showAllInterviews);
  const toggleShowAllJobs = () => setShowAllJobs(!showAllJobs);

  const token = localStorage.getItem("token");
  const [totalInterview, setTotalInteview] = useState([]);

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await axios.get("api/selected-resumes/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    getCandidates();
  }, [token]);

  const TotalResumeUpload = async () => {
    try {
      const response = await axios.get(
        `/api/Total_resumeUploaded_by_hr/?hr_id=${userId}`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      setTotalUpload(response.data);
    } catch (e) {
      console.error("Error fetching total uploads:", e);
    }
  };

  useEffect(() => {
    const fetchResumeReports = async () => {
      try {
        const response = await axios.get("/api/resume_report_pdf/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalInteview(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchResumeReports();
  }, [token]);

  const getJobData = async () => {
    try {
      const response = await axios.get(`api/get_all_job_postings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobData();
    TotalResumeUpload();
  }, []);

  const displayedInterviews = showAllInterviews ? recentInterviews : recentInterviews.slice(0, 2);
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 2);

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className={`flex-1 dash-container ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        <div className="dash">
          {/* Header row with single profile icon */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">Welcome back, {userName}</p>
              <p className="text-gray-500 mt-2 text-xl margin1">Master Your Skills with AI</p>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div className="relative">
                <div
                  className="w-[60px] h-[60px] rounded-full cursor-pointer flex items-center justify-center"
                  onClick={toggleProfileCard}
                >
                  <CgProfile color="hotpink" size={40} />
                </div>
                {showProfileCard && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <ProfileCard onClose={toggleProfileCard} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Data cards */}
          <div className="data-cards-container">
            <div className="data border-2 border-gray-200 w-full">
              <div>
                <p className="text-lg text-gray-700">Total Interviews</p>
                <p className="text-2xl font-bold">{totalInterview.length}</p>
              </div>
              <div className="text-2xl rounded-full dashicon">
                <HiVideoCamera className="text-blue-500" />
              </div>
            </div>

            <div className="data border-2 border-gray-200">
              <div>
                <p className="text-lg text-gray-700">Resumes Analyzed</p>
                <p className="text-2xl font-bold">{totalUpload.total_uploaded}</p>
              </div>
              <div className="text-2xl rounded-full dashicon1">
                <FaFileAlt className="text-green-500" />
              </div>
            </div>

            <div className="data border-2 border-gray-200">
              <div>
                <p className="text-lg text-gray-700">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <div className="text-2xl rounded-full dashicon2">
                <IoBagRemoveSharp className="text-purple-500" />
              </div>
            </div>

            <div className="data border-2 border-gray-200">
              <div>
                <p className="text-lg text-gray-700">Selected Candidates</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
              <div className="text-2xl rounded-full dashicon3">
                <BsPeopleFill className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* Recent sections */}
          <div className="recent-container">
            <div className="rounded-2xl border-2 border-gray-200 recent1 overflow-hidden">
              <div className="flex justify-between p-4">
                <div>
                  <p className="text-2xl font-bold">Recent Interview</p>
                </div>
                <div>
                  <button
                    className="text-xl text-[#4F46E5] cursor-pointer"
                    onClick={() => navigate("/selectedcandidate")}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="px-4" style={{ maxHeight: "220px" }}>
                {displayedInterviews.length > 0 ? (
                  displayedInterviews.map((interview, index) => (
                    <div key={index} className="flex items-center justify-between frontend bg-gray-100 rounded-2xl mb-3 p-3">
                      <div className="flex gap-2 items-center">
                        <div className="border-2 border-gray-300 w-[50px] h-[50px] rounded-full flex items-center justify-center bg-gray-200">
                          <span className="text-xl font-semibold">{interview?.candidate_info?.name?.slice(0, 1) || '?'}</span>
                        </div>
                        <div>
                          <p className="text-xl font-medium">{interview?.candidate_info?.name || 'N/A'}</p>
                          <p className="text-gray-400">{interview?.job_title || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent interviews found</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-gray-200 recent1 overflow-hidden">
              <div className="flex justify-between p-4">
                <div>
                  <p className="text-2xl font-bold">Recent Applications</p>
                </div>
                <div>
                  <button
                    className="text-xl text-[#4F46E5] cursor-pointer"
                    onClick={() => navigate("/jobposting")}
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="px-4" style={{ maxHeight: "220px" }}>
                {displayedJobs.length > 0 ? (
                  displayedJobs.map((job, index) => (
                    <div key={index} className="flex items-center justify-between frontend bg-gray-100 rounded-2xl mb-3 p-3">
                      <div className="flex gap-2 items-center">
                        <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
                          <IoCodeSlashOutline className="text-3xl" />
                        </div>
                        <div>
                          <p className="text-xl font-medium">{job.job_title || 'N/A'}</p>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span><FaLocationDot /></span>
                            <span>{job.location}</span>
                            <span>{job.job_type}</span>
                            <span className="flex items-center">
                              <LiaRupeeSignSolid />
                              {job.salary_range}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span><IoIosArrowForward /></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No job applications found</div>
                )}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-container bg-white p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb4">Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;