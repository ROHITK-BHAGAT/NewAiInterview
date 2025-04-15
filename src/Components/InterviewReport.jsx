import React, { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard";
import Sidebar from "./Sidebar";
import { FaRegBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import logoimage from "../assets/react.svg";
import { NavLink } from "react-router-dom";
import { FaRegFilePdf } from "react-icons/fa";
import { FaVideo } from "react-icons/fa6";
import axios from "../helper/Axios";
import './InterviewReport.css'
import { CgProfile } from "react-icons/cg";

const InterviewReport = () => {
  const token = localStorage.getItem("token");
  const [report, setReport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileCard, setShowProfileCard] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const userName = user.user_name;

  const getReport = async () => {
    try {
      const response = await axios.get("/api/resume_report_pdf/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReport();
  }, []);

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const filteredReports = report.filter((reports) =>
    reports.candidate_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    // responsive

    // <div className="flex w-full">
    //   <Sidebar />
    //   <div className="flex-1 flex-col dash">
    //     {/* Header row with profile icon */}
    //     <div className="flex justify-between dash1">
    //       <div>
    //         <p className="text-3xl font-bold">Interview Reports</p>
    //         <p className="text-gray-500 dash2 text-xl">
    //           View and manage interview reports
    //         </p>
    //       </div>
    //       <div className="flex justify-center items-center gap-4 relative">
    //         <div className="relative">
    //           <div 
    //             className="w-[60px] h-[60px] cursor-pointer flex items-center justify-center"
    //             onClick={toggleProfileCard}
    //           >
    //             <CgProfile color="hotpink" size={40} />
    //           </div>

    <div className="flex w-full ">
    <Sidebar />
    <div className="flex-1 flex-col dash">
      {/* Header row with profile icon */}
      <div className="flex justify-between dash1">
        <div>
          <p className="md:text-3xl text-xl font-bold ml">Interview Reports</p>
          <p className="text-gray-500 dash2 md:text-xl ml ">
            View and manage interview reports
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 relative">
          <div className="relative">
            <div
              className="w-[60px] h-[60px] cursor-pointer flex items-center justify-center"
              onClick={toggleProfileCard}
            >
              <CgProfile color="hotpink" size={40} className="absolute top-0 right-0" />
            </div>
              {/* // */}
              {showProfileCard && (
                <div className="absolute right-0 top-full mt-2 z-50">
                  <ProfileCard onClose={toggleProfileCard} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search row */}
        <div className="flex items-center justify-between dash1 searchjob">
          <div className="flex items-center border border-gray-300 rounded-lg md:w-[50%] w-[100%] h-[50px] p-2">
            <IoIosSearch className="text-gray-500 text-2xl sam sam1" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-grow pl-2 text-2xl border-none outline-none search2 placeholder:text-[18px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
         
        </div>

        {/* Reports table */}
        <div className="flex flex-col dash1">
          <div className="overflow-x-auto">
            <div className="min-w-[700px] ">
              {/* Table Header */}
              <div className="candi1 shadow grid grid-cols-5 md:text-lg gap-4 md:gap-10 text-gray-600 font-semibold bg-gray-100 padd2 px-2 md:px-6">
                <p>Candidate Name</p>
                <p>Created On</p>
                <p>Interview Report</p>
                <p>Resume</p>
                <p>Video</p>
              </div>

              <div className="mar1 bg-white p-6">
                {Array.isArray(filteredReports) && filteredReports.length > 0 ? (
                  filteredReports.map((reports) => (
                    <div
                      key={reports.id}
                      className="grid grid-cols-5 gap-4 md:gap-6 py-4 items-center border-b border-gray-200 selectcan rounded-lg px-2 md:px-6 text-sm md:text-base"
                    >

                      <div className="flex items-center gap-3">
                        <span className="text-md">
                          {reports.candidate_name || "Unknown Name"}
                        </span>
                      </div>

                      <p className="font-md">
                        {reports.created_on.replace("T", ", ")}
                      </p>

                      <NavLink
                        to={reports.Interview_report}
                        className="text-blue-700 flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaRegFilePdf className="text-red-500 text-xl" />
                        View
                      </NavLink>

                      <NavLink
                        to={reports.resume}
                        className="text-blue-700 flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaRegFilePdf className="text-green-400 text-xl" />
                        View
                      </NavLink>

                      <NavLink
                        to={reports.video_url}
                        className="text-blue-500 font-medium flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaVideo className="text-amber-400 text-xl" />
                        View
                      </NavLink>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-4 frontend bg-gray-100 rounded-2xl">
                    <p className="text-gray-500">No Candidates available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      );
};

export default InterviewReport;