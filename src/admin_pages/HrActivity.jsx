import React, { useEffect, useState } from "react";
import axios from "../helper/Axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SiderBar2 from "../Components/SiderBar2";
import './HrActivity.css';

const HRResumeStatistics = () => {
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedHRId, setSelectedHRId] = useState(null);
  const [activeTab, setActiveTab] = useState("selected");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const token = localStorage.getItem('token');

  // Monitor sidebar collapse state
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarState = JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
      setIsSidebarCollapsed(sidebarState);
    };

    checkSidebarState();
    window.addEventListener('storage', checkSidebarState);
    window.addEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
    
    return () => {
      window.removeEventListener('storage', checkSidebarState);
      window.removeEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
    };
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/get_all_users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hrAndAhrUsers = response.data.filter(user => user.user_type === "HR");
      setUsers(hrAndAhrUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch HR users');
    }
  };

  const fetchData = async (user_id) => {
    setLoading(true);
    try {
      const statsResponse = await axios.get(`/api/Total_resumeUploaded_by_hr/`, {
        params: { hr_id: user_id },
        headers: { Authorization: `Bearer ${token}` },
      });

      const resumesResponse = await axios.get(`/api/get_resumes_analysis_report/`, {
        params: { hr_id: user_id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(statsResponse.data);
      setResumes(resumesResponse.data);
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError('Error fetching resume data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedHRId) {
      fetchData(selectedHRId);
    }
  }, [selectedHRId]);

  const barChartData = [
    { name: "Uploaded", value: stats?.total_uploaded || 0, fill: "#0EA5E9" },
    { name: "Selected", value: stats?.total_selected || 0, fill: "#10B981" },
    { name: "Rejected", value: stats?.total_rejected || 0, fill: "#EF4444" },
  ];

  const filteredResumes = activeTab === "selected"
    ? resumes.filter(resume => resume.resume_status === "resume selected")
    : resumes.filter(resume => resume.resume_status !== "resume selected");

  // Loading Skeleton Components
  const SkeletonRow = () => (
    <tr className="border-b animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-5 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );

  const SkeletonStats = () => (
    <div className="gap-6 mb-8 flex justify-center">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border-2 border-gray-100 rounded-xl p-6 text-center shadow-md w-32 animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-4 mx-auto w-20"></div>
          <div className="h-10 bg-gray-200 rounded mx-auto w-16"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen">
      <SiderBar2 />
      <div className={`admin-content ${isSidebarCollapsed ? 'admin-content-collapsed' : ''} bg-white text-black`}>
        <div className="mx-auto w-full">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-6">
              <h1 className="text-3xl font-bold text-center text-white">
                HR Resume Analytics
              </h1>
            </div>

            <div className="p-6">
              {/* HR Selection Dropdown */}
              <div className="mb-6 max-w-md mx-auto hrsel">
                <select
                  onChange={(e) => setSelectedHRId(e.target.value)}
                  className="w-full p-3 border-1 border-blue-300 rounded-lg cursor-pointer hropt"
                  disabled={loading}
                >
                  <option value="">Select HR</option>
                  {users.map((ele) => (
                    <option key={ele.user_id} value={ele.user_id}>
                      {ele.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume Statistics */}
              {loading ? (
                <SkeletonStats />
              ) : (
                stats && (
                  <div className="gap-6 mb-8 flex justify-center hract">
                    {barChartData.map((stat) => (
                      <div
                        key={stat.name}
                        className="bg-white border-2 border-gray-100 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all"
                      >
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          {stat.name} Resumes
                        </h3>
                        <p
                          className="text-4xl font-bold"
                          style={{ color: stat.fill }}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Loading Overlay */}
              {loading && (
                <div className="flex justify-center items-center my-10">
                  <div className="spinner-container">
                    <div className="spinner-ring"></div>
                    <div className="spinner-text">Loading data...</div>
                  </div>
                </div>
              )}

              {/* Resume Tabs & Table */}
              {selectedHRId && !loading && (
                <div>
                  <div className="flex justify-center gap-5 mb-6">
                    <button
                      onClick={() => setActiveTab("selected")}
                      className={`py-2 px-6 rounded-lg transition-all ${activeTab === "selected"
                          ? "bg-blue-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      Selected Resumes
                    </button>
                    <button
                      onClick={() => setActiveTab("rejected")}
                      className={`py-2 px-6 rounded-lg transition-all ${activeTab === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      Rejected Resumes
                    </button>
                  </div>

                  {filteredResumes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 border-b">
                            {[
                              "Candidate Name",
                              "Email",
                              "Phone",
                              "Status",
                              "Job Title",
                              "Uploaded At",
                            ].map((head) => (
                              <th
                                key={head}
                                className="p-4 text-left text-gray-600 font-semibold"
                              >
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResumes.map((resume, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="p-4">
                                {resume.candidate_info.name}
                              </td>
                              <td className="p-4">{resume.candidate_email}</td>
                              <td className="p-4">
                                {resume.candidate_info.phone}
                              </td>
                              <td
                                className="p-4 font-semibold"
                                style={{
                                  color:
                                    resume.resume_status === "resume selected"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {resume.resume_status.toUpperCase()}
                              </td>
                              <td className="p-4">{resume.job_title}</td>
                              <td className="p-4">
                                {new Date(resume.uploaded_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-10">
                      No resumes found for the selected tab
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && !loading && (
                <div className="text-center text-red-500 p-4 border border-red-200 rounded-lg bg-red-50 mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRResumeStatistics;