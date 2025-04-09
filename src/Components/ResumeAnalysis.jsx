import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaFileArrowUp } from "react-icons/fa6";
import { BsCheckCircleFill } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";
import ProfileCard from "./ProfileCard";
import axios from "../helper/Axios";
import { CgProfile } from "react-icons/cg";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./ResumeAnalysis.css";

const ResumeAnalysis = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const [totalUpload, setTotalUpload] = useState({});
  const [resumes, setResumes] = useState([]);
  const [activeTab, setActiveTab] = useState("selected");
  const [loading, setLoading] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const popUp = () => {
    setShowDetails(!showDetails);
  };

  const TotalResumeUpload = async () => {
    try {
      const response = await axios.get(
        `/api/Total_resumeUploaded_by_hr/?hr_id=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalUpload(response.data);
    } catch (e) {
      console.error("Error fetching total uploads:", e);
    }
  };

  const fetchResumes = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/get_resumes_analysis_report/?hr_id=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const filteredResumes = response.data.filter((resume) => {
        const apiStatus = `resume ${status}`;
        return resume.resume_status.toLowerCase() === apiStatus.toLowerCase();
      });

      filteredResumes.sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );
      setResumes(filteredResumes);
      setActiveTab(status);
    } catch (e) {
      console.error(`Error fetching ${status} resumes:`, e);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    TotalResumeUpload();
    fetchResumes("selected");
  }, []);

  const maxValue = Math.max(
    totalUpload.total_uploaded || 1,
    totalUpload.total_selected || 1,
    totalUpload.total_rejected || 1
  );
  const getBarHeight = (value) => `${(value / maxValue) * 450}px`;

  const data = [
    {
      name: "Uploaded",
      value: totalUpload.total_uploaded || 0,
      color: "#2563eb",
    },
    {
      name: "Selected",
      value: totalUpload.total_selected || 0,
      color: "#22c55e",
    },
    {
      name: "Rejected",
      value: totalUpload.total_rejected || 0,
      color: "#dc2626",
    },
  ];

  const [showProfileCard, setShowProfileCard] = useState(false);
  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 dash flex-col ml-84">
        {/* Header */}
        <div className="flex justify-between dash1">
          <p className="text-3xl font-bold">HR Resume Analytics</p>
          <div className="flex justify-center items-center gap-4 relative">
            <div className="relative">
              <div
                className="w-[60px] h-[60px] cursor-pointer flex items-center justify-center"
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

        {/* Stats */}
        <div className="flex items-center gap-5 dash1 mt-6">
          {[
            {
              label: "Upload Resume",
              value: totalUpload.total_uploaded || 0,
              icon: <FaFileArrowUp className="text-blue-500" />,
            },
            {
              label: "Selected Resumes",
              value: totalUpload.total_selected || 0,
              icon: <BsCheckCircleFill className="text-green-500" />,
            },
            {
              label: "Rejected Resume",
              value: totalUpload.total_rejected || 0,
              icon: <RxCrossCircled className="text-red-500" />,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex data items-center justify-between gap-5 p-4 rounded-lg shadow border border-gray-100 w-1/3"
            >
              <div>
                <p className="text-xl text-gray-600">{stat.label}</p>
                <p className="text-4xl resumeAnaly">{stat.value}</p>
              </div>
              <div className="text-2xl rounded-full dashicon">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Resume Statistics */}
        <div className=" flex justify-items-start">
          <p className="text-2xl font-bold ">Resume Statistics </p>
        </div>
         
        <div className="flex justify-between items-center dash1 resumeSta gap-10 mt-10">
          {/* Left Box - Bar Chart */}

          <div className="w-1/2 h-[560px] p-6 border rounded-lg shadow-md flex flex-col items-center padd">
            <p className="text-2xl font-bold"> Bar Chart</p>
            <div className="flex items-end justify-evenly p-6 gap-10 padd">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-gray-700">
                  {totalUpload.total_uploaded || 0}
                </p>
                <div
                  className="w-30 bg-[#2563eb] rounded-t-lg transition-all"
                  style={{
                    height: getBarHeight(totalUpload.total_uploaded || 0),
                  }}
                ></div>
                <p className="mt-2 text-gray-600 text-xl">Uploaded</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-gray-800">
                  {totalUpload.total_selected || 0}
                </p>
                <div
                  className="w-30 bg-[#22c55e] rounded-t-lg transition-all"
                  style={{
                    height: getBarHeight(totalUpload.total_selected || 0),
                  }}
                ></div>
                <p className="mt-2 text-gray-600 text-xl">Selected</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold text-gray-800">
                  {totalUpload.total_rejected || 0}
                </p>
                <div
                  className="w-30 bg-[#dc2626] rounded-t-lg transition-all"
                  style={{
                    height: getBarHeight(totalUpload.total_rejected || 0),
                  }}
                ></div>
                <p className="mt-2 text-gray-600 text-xl">Rejected</p>
              </div>
            </div>
          </div>

          {/* Right Box - Pie Chart */}
          <div className="w-1/2 h-[560px] p-6 border rounded-lg shadow-md flex flex-col items-center padd">
            <p className="text-2xl font-bold"> Pie Chart</p>
            <PieChart width={400} height={400} className="padd">
              <Pie
                data={data}
                cx={200}
                cy={200}
                innerRadius={60}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                align="center"
                verticalAlign="bottom"
                layout="horizontal"
              />
            </PieChart>
          </div>
        </div>

        {/* Resume Analysis Report */}
        <h2 className="text-2xl font-bold my-10 paddingtop">
          Resume Analysis Report
        </h2>
        <div className="flex justify-end gap-8 my-6 padd">
          <button
            onClick={() => fetchResumes("selected")}
            className={`py-2 px-6 rounded-lg resumebtn ${
              activeTab === "selected"
                ? "bg-green-300 text-green-800"
                : "bg-gray-200"
            }`}
          >
            Selected Resumes
          </button>
          <button
            onClick={() => fetchResumes("rejected")}
            className={`py-2 px-6 rounded-lg resumebtn ${
              activeTab === "rejected"
                ? "bg-red-300 text-red-800"
                : "bg-gray-200"
            }`}
          >
            Rejected Resumes
          </button>
        </div>

        {/* Resumes Table */}
        <div className="w-full p-6 bg-white rounded-lg padd1">
          {loading ? (
            <p className="text-center text-gray-500">Loading resumes...</p>
          ) : (
            <table className="w-full border-collapse resumeanatable">
              <thead className="margintop">
                <tr className="text-left bg-gray-100 shadow-md">
                  <th className="p-4 text-gray-600 padd2">Name</th>
                  <th className="p-4 text-gray-600">Contact</th>
                  <th className="p-4 text-gray-600">Job Title</th>
                  <th className="p-4 text-gray-600">Status</th>
                  <th className="p-4 text-gray-600">Uploaded At</th>
                  <th className="p-4 text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {resumes.length > 0 ? (
                  resumes.map((resume, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 rounded-lg"
                    >
                      <td className="p-4 padd2">
                        {resume?.candidate_info?.name || "N/A"}
                      </td>
                      <td className="p-4 text-gray-800 paddingtop">
                        {resume?.candidate_info?.email || "-"}
                        <div className="text-sm text-gray-500 mar1">
                          {resume?.candidate_info?.phone || "-"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-800">
                        {resume?.job_title || "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resume.resume_status === "resume selected"
                              ? "bg-green-100 text-green-600 padd"
                              : "bg-red-100 text-red-600 padd"
                          }`}
                        >
                          {resume.resume_status === "resume selected"
                            ? "RESUME SELECTED"
                            : "RESUME REJECTED"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-800">
                        {resume?.uploaded_at || "-"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            navigate("/resumedetail", { state: { resume } })
                          }
                          className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer transition padd"
                        >
                          Show Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No {activeTab} resumes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;
