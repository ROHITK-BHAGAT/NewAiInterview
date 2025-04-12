import React, { useEffect, useState } from "react";
import axios from '../helper/Axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users as CandidateIcon, UserCheck as UserCheckIcon, BarChart2 as BarChartIcon } from 'lucide-react';
import SiderBar2 from "../Components/SiderBar2";
import './HRCandidateCounts.css';

const HRCandidateCounts = () => {
  const [hrData, setHrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const token = localStorage.getItem('token');

  // Listen for sidebar collapse/expand events
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarState = JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
      setIsSidebarCollapsed(sidebarState);
    };

    // Initial check
    checkSidebarState();
    
    // Listen to storage events (for when localStorage changes in other tabs/windows)
    window.addEventListener('storage', checkSidebarState);
    
    // Listen to custom events dispatched by SideBar2
    window.addEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkSidebarState);
      window.removeEventListener('sidebarChange', (e) => setIsSidebarCollapsed(e.detail.isCollapsed));
    };
  }, []);

  const fetchHRData = async () => {
    try {
      const response = await axios.get("/api/get_all_hr_count_with_candidate/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data || !response.data.hr_counts) {
        throw new Error("Invalid response structure");
      }
      setHrData(response.data.hr_counts);
    } catch (err) {
      console.error("Error fetching HR data:", err);
      setError("Failed to load HR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const chartData = hrData.map(hr => ({
    name: hr.hr_name,
    candidates: hr.candidate_count
  }));

  

  return (
    <div className="flex h-screen">
      <SiderBar2 />
      
      {/* Main Content - Adjusts based on sidebar state */}
      <div className={`hr-candidate-content ${isSidebarCollapsed ? 'hr-candidate-content-collapsed' : ''} flex-grow bg-gray-50 p-8 relative`}>

      {loading ? (
          <div className="absolute top-0 left-8 right-0 bottom-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-10">
            <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-900 font-medium">Loading data...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-8">{error}</div>
        ) : (
        <div className="container mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
            <BarChartIcon className="mr-4 text-blue-600" size={48} />
            HR Candidate Dashboard
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Counts Chart */}
            <div className="border rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BarChartIcon className="mr-2 text-blue-600" />
                Candidate Counts by HR
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="candidates"
                    fill="#3b82f6"
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* HR Candidate Details Table */}
            <div className="border rounded-lg shadow-md p-4 bg-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <UserCheckIcon className="mr-2 text-blue-600" />
                HR Candidate Details
              </h3>
              <div className="max-h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="border rounded-lg">
                    <tr className="bg-gray-100">
                      <th className="w-[200px] p-3 text-left">HR Name</th>
                      <th className="text-center p-3">Candidate Count</th>
                      <th className="p-3">Candidate Names</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrData.map((hr) => (
                      <tr key={hr.hr_id} className="border-b">
                        <td className="font-medium p-3">{hr.hr_name}</td>
                        <td className="text-center p-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                            {hr.candidate_count}
                          </span>
                        </td>
                        <td className="p-3">
                          <ul className="space-y-1 max-h-[285px] overflow-y-auto text-left">
                            {hr.candidate_names.map((name, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 truncate"
                              >
                                {name}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default HRCandidateCounts;