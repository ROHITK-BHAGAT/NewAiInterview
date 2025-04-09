import React, { useEffect, useState } from "react";
import axios from "../helper/Axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SiderBar2 from "../Components/SiderBar2";
import './HrActivity.css';

const HRResumeStatistics = () => {
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedHRId, setSelectedHRId] = useState(null);
  const [activeTab, setActiveTab] = useState("selected");
  const token = localStorage.getItem('token');


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

  return (
    <div className="flex hrresume">
      {/* Sidebar - 20% width */}
      <div className="w-1/6">
        <SiderBar2 />
      </div>

      {/* Main Content - 80% width */}
      <div className="ml-72 flex-grow min-h-screen bg-gray-50 p-8 ">
        <div className="mx-auto w-full">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-900 p-6">
              <h1 className="text-3xl font-bold text-center text-white resumeanalytics">
                HR Resume Analytics
              </h1>
            </div>

            <div className="p-6">
              {/* HR Selection Dropdown */}
              <div className="mb-6 max-w-md mx-auto">
                <select
                  onChange={(e) => setSelectedHRId(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg  resumeanalytics"
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
              {stats && (
                <div className="gap-6 mb-8 flex justify-center resumeanalytics">
                  {barChartData.map((stat) => (
                    <div
                      key={stat.name}
                      className="bg-white border-2 border-gray-100 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all resumeanalytics"
                    >
                      <h3 className="text-lg font-semibold text-gray-600 mb-2 resumeanalytics">
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
              )}

              {/* Resume Tabs & Table */}
              {selectedHRId && (
                <div>
                  <div className="flex justify-center gap-5 mb-6 resumeanalytics">
                    <button
                      onClick={() => setActiveTab("selected")}
                      className={`py-2 px-6 rounded-lg transition-all resumeanalytics ${activeTab === "selected"
                          ? "bg-blue-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      Selected Resumes
                    </button>
                    <button
                      onClick={() => setActiveTab("rejected")}
                      className={`py-2 px-6 rounded-lg transition-all resumeanalytics ${activeTab === "rejected"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      Rejected Resumes
                    </button>
                  </div>

                  {filteredResumes.length > 0 ? (
                    <div className="overflow-x-auto resumeanalytics">
                      <table className="w-full bg-white border border-gray-200 ">
                        <thead>
                          <tr className="bg-gray-100 border-b ">
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
                                className="p-4 text-left text-gray-600 font-semibold resumeanalytics"
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
                              className="border-b hover:bg-gray-50 transition-colors "
                            >
                              <td className="resumeanalytics">
                                {resume.candidate_info.name}
                              </td>
                              <td className="p-4 resumeanalytics">{resume.candidate_email}</td>
                              <td className="p-4 resumeanalytics">
                                {resume.candidate_info.phone}
                              </td>
                              <td
                                className="p-4 font-semibold resumeanalytics"
                                style={{
                                  color:
                                    resume.resume_status === "resume selected"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {resume.resume_status.toUpperCase()}
                              </td>
                              <td className="p-4 resumeanalytics">{resume.job_title}</td>
                              <td className="p-4 resumeanalytics">
                                {new Date(resume.uploaded_at).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 mt-10 ">
                      No resumes found for the selected tab
                    </div>
                  )}
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