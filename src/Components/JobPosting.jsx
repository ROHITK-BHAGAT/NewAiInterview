import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import logoimage from "../assets/react.svg";
import { FaRegBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import './jobposting.css'
import axios from "../helper/Axios";
import Swal from "sweetalert2";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { IoMdCreate } from "react-icons/io";
import { IoMdCopy } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

const JobPosting = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const userName = user.user_name;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  
  useEffect(() => {
    const handleStorageChange = () => {
      setIsSidebarCollapsed(JSON.parse(localStorage.getItem("sidebarCollapsed")) || false);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };

  const handleCreateNewJob = () => {
    setShowCreateForm(true);
  };

  const handleCancelJob = () => {
    setShowCreateForm(false);
  };

  const getJobData = async () => {
    try {
      const response = await axios.get("api/get_all_job_postings/", {
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      });
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getJobData();
  }, []);

  const [jobposting, setJobPosting] = useState({
    job_title: "",
    job_description: "",
    company_name: "",
    department: "",
    location: "",
    job_type: "",
    experience_required: "",
    employment_type: "",
    requirements: "",
    responsibilities: "",
    salary_range: "",
    benefits: "xyz",
    application_deadline: "",
    status: "Draft",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobPosting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [PublishData, setpublishData] = useState([]);
  
  const getAllPublishJob = async () => {
    try {
      const response = await axios.get('/api/get_all_published_job_postings/', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      setpublishData(response.data);
    } catch (e) {
      // console.log(e);
    }
  }

  useEffect(() => { 
    getAllPublishJob(); 
  }, []);

  const PutpublishedJobs = async (jobId) => {
    const swalResponse = await Swal.fire({
      icon: "question",
      text: "Are you sure you want to publish this job?",
      showCancelButton: true,
      confirmButtonText: "Yes, Publish",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (swalResponse.isConfirmed) {
      try {
        const response = await axios.put(
          `/api/published_job_post/${jobId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
        );

        if (response) {
          Swal.fire({
            icon: "success",
            text: "Job published successfully!",
          });
          getJobData();
          getAllPublishJob();
        }
      } catch (e) {
        console.log(e.response);
        Swal.fire({
          icon: "error",
          text: "Something went wrong. Please try again!",
        });
      }
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);

  const JobPost = async () => {
    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `api/job_postings/${currentJobId}/`,
          jobposting,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(`api/job_postings/`, jobposting, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response) {
        Swal.fire({
          icon: "success",
          title: isEditing ? "Job Updated" : "Job Posted",
          text: isEditing
            ? "Your job has been updated successfully!"
            : "Your job has been posted successfully!",
        });

        setShowCreateForm(false);
        setIsEditing(false);
        setCurrentJobId(null);
        setJobPosting({
          job_title: "",
          job_description: "",
          company_name: "",
          department: "",
          location: "",
          job_type: "",
          experience_required: "",
          employment_type: "",
          requirements: "",
          responsibilities: "",
          salary_range: "",
          benefits: "xyz",
          application_deadline: "",
          status: "Draft",
        });
        getJobData();
      }
    } catch (e) {
      // console.log(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${e?.response?.data?.detail}`,
      });
    }
  };

  const handleSaveJob = (e) => {
    JobPost();
    e.preventDefault();
    setShowCreateForm(false);
  };

  const handleCopyLink = (id) => {
    let jobLink = `${window.location.origin}/ai_hr/job_details/${id}`;
    navigator.clipboard
      .writeText(jobLink)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Link Copied",
          text: "The job posting link has been copied to your clipboard.",
        });
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to copy the link.",
        });
      });
  }

  const handleDeleteJob = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const response = await axios.delete(`api/job_postings/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          await Swal.fire({
            title: "Deleted!",
            text: "Your announcement has been deleted.",
            icon: "success",
          });
          getJobData();
          setJobs(jobs.filter((job) => job.id !== id));
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Your content was not deleted.",
        icon: "error",
      });
    }
  };

  const handleEditJob = async (job) => {
    setJobPosting({
      job_title: job.job_title || "",
      job_description: job.job_description || "",
      company_name: job.company_name || "",
      department: job.department || "",
      location: job.location || "",
      job_type: job.job_type || "",
      experience_required: job.experience_required || "",
      employment_type: job.employment_type || "",
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
      salary_range: job.salary_range || "",
      benefits: job.benefits || "xyz",
      application_deadline: job.application_deadline
        ? job.application_deadline.split("T")[0]
        : "",
      status: job.status || "Draft",
    });

    setShowCreateForm(true);
    setIsEditing(true);
    setCurrentJobId(job.id);
  }

  const [allJobs, setAllJobs] = useState(true);
  const [PublishJob, setPublishJob] = useState(false);

  const filteredJobs2 = React.useMemo(() => {
    return PublishData.filter((job) =>
      job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [PublishData, searchTerm]);

  return (
      // responsive


    // <div className="flex w-full">
    //   <Sidebar />
    //   <div className={`flex-1 dash flex-col ${isSidebarCollapsed ? "ml-20" : "ml-84"}`}>
    //     {/* Header row with profile icon */}
    //     <div className="flex justify-between dash1">
    //       <div>
    //         <p className="text-3xl font-bold">HR Job Portal</p>
    //         <p className="text-gray-500 dash2 text-xl job1">
    //           Manage and track all your job postings
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


    <div className="flex md:w-full ">
    <Sidebar />
    <div className={`flex-1 dash flex-col overflow-x-hidden ${isSidebarCollapsed ? "ml-20" : "ml-84"}`}>
      {/* Header row with profile icon */}
      <div className="flex justify-between items-center dash1">
        <div className="hr">
          <p className="md:text-3xl text-xl font-bold">HR Job Portal</p>
          <p className="text-gray-500 dash2 md:text-xl job1">
            Manage and track all your job postings
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 relative">
          <div className="relative">
            <div 
              className="w-[60px] h-[60px] cursor-pointer flex items-center justify-center"
              onClick={toggleProfileCard}
            >
              <CgProfile color="hotpink" size={40} className="pl absolute top-0 right-0 md:static"/>
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

        {/* Search and create job button */}
       {
        !showCreateForm && (
          <>
           <div className="flex items-center justify-between dash1 flex-wrap gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg md:w-[50%] h-[45px] w-full p-2">
            <IoIosSearch className="text-gray-500 text-2xl font-extrabold jobsearchicon" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-gray-500 flex-grow pl-2 text-md border-none outline-none search2 placeholder:text-[20px]"
            />
          </div>
          <div>
            <button
              onClick={handleCreateNewJob}
              className="bg-blue-700 text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-800 search2 cursor-pointer"
            >
              + Create New Job
            </button>
          </div>
        </div>
          </>
        )
       }

        {/* Main content area */}
        <div className="relative">
          {showCreateForm ? (
            <div className="dash1 bg-white rounded-2xl p-6 formcreatejob">
              <form autoComplete="off">
                <div className="flex flex-col">
                  <div className="w-full flex flex-col gap-5">
                    {/* Job Title and Department */}
                    <div className="flex items-center justify-between gap-8 mb-6">
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Job Title<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="job_title"
                          value={jobposting.job_title}
                          onChange={handleInputChange}
                          placeholder="Enter job title"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Department<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={jobposting.department}
                          onChange={handleInputChange}
                          placeholder="Enter department"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                    </div>

                    {/* Company Name and Employment Type */}
                    <div className="flex items-center justify-between gap-8 mb-6">
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Company Name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={jobposting.company_name}
                          onChange={handleInputChange}
                          placeholder="Enter company name"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Employment Type<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="employment_type"
                          value={jobposting.employment_type}
                          onChange={handleInputChange}
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Employment Type</option>
                          <option value="On_site">On-site</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    {/* Location and Job Type */}
                    <div className="flex items-center justify-between gap-8 mb-6">
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Location<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={jobposting.location}
                          onChange={handleInputChange}
                          placeholder="Enter location"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Job Type<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="job_type"
                          value={jobposting.job_type}
                          onChange={handleInputChange}
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Job Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>

                    {/* Experience and Salary */}
                    <div className="flex items-center justify-between gap-8 mb-6">
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Experience Required<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="experience_required"
                          value={jobposting.experience_required}
                          onChange={handleInputChange}
                          placeholder="e.g, 2-3 year"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                      <div className="flex flex-col w-1/2">
                        <label className="md:text-xl mb-2">
                          Salary Range<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="salary_range"
                          value={jobposting.salary_range}
                          onChange={handleInputChange}
                          placeholder="e.g. $50,000-70,000"
                          required
                          className="shift-placeholder writeText w-full h-[60px] p-2 border border-gray-300 rounded-md placeholder-gray-400 md:placeholder:text-lg placeholder:text-sm"
                        />
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="flex flex-col mb-6">
                      <label className="md:text-xl mb-2">
                        Job Description<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="job_description"
                        value={jobposting.job_description}
                        onChange={handleInputChange}
                        placeholder="Enter job description"
                        required
                        className="shift-placeholder writeText w-full h-[120px] p-2 border border-gray-300 rounded-md placeholder-gray-400 paddingtop"
                      ></textarea>
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col mb-6">
                      <label className="md:text-xl mb-2">
                        Requirements<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="requirements"
                        value={jobposting.requirements}
                        onChange={handleInputChange}
                        placeholder="Enter job requirements"
                        required
                        className="shift-placeholder writeText w-full h-[120px] p-2 border border-gray-300 rounded-md placeholder-gray-400 paddingtop"
                      ></textarea>
                    </div>

                    {/* Responsibilities */}
                    <div className="flex flex-col mb-6">
                      <label className="md:text-xl mb-2">
                        Responsibilities<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="responsibilities"
                        value={jobposting.responsibilities}
                        onChange={handleInputChange}
                        placeholder="Enter job responsibilities"
                        required
                        className="shift-placeholder writeText w-full h-[120px] p-2 border border-gray-300 rounded-md placeholder-gray-400 paddingtop"
                      ></textarea>
                    </div>

                    {/* Application Deadline */}
                    <div className="flex flex-col mb-6">
                      <label className="md:text-xl mb-2">
                        Application Deadline<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        name="application_deadline"
                        value={jobposting.application_deadline}
                        onChange={handleInputChange}
                        className="w-full h-14 p-2 border border-gray-300 rounded-md text-lg text-gray-400 paddingleft"
                        onFocus={(e) => e.target.classList.add("text-black")}
                        onBlur={(e) => {
                          if (!e.target.value)
                            e.target.classList.remove("text-black");
                        }}
                        placeholder="MM/DD/YY"
                      />
                    </div>
                  </div>

                  {/* Form buttons */}
                  <div className="flex savejobcreate items-center justify-center gap-6 mt-6">
                    <button
                      type="button"
                      onClick={handleCancelJob}
                      className="w-[200px] cursor-pointer h-14 text-xl bg-gray-400 text-black rounded-md transition duration-200 flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSaveJob}
                      className="w-[200px] h-14 cursor-pointer text-xl bg-blue-700 text-white rounded-md transition duration-200 flex items-center justify-center space-x-2"
                    >
                      {isEditing ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Stats cards */}
              <div className="flex items-center justify-between dash1 jobp">
                <div className="flex data1 border-2 border-gray-200 rounded-lg">
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-xl text-gray-500 md:text-2xl">Draft</p>
                      <div className="text-lg md:text-xl jobno bg-[#F3F4F6] rounded-full">
                        <p className="text-gray-400">{jobs.length}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xl md:text-2xl font-semibold">{jobs.length} Jobs</p>
                      <p className="text-gray-400">Last updated 2h ago</p>
                    </div>
                  </div>
                </div>

                <div className="flex data1 border-2 border-gray-200 rounded-lg">
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-xl text-gray-500 md:text-2xl">Published</p>
                      <div className="text-lg md:text-xl bg-[#D1FAE5] jobno rounded-full">
                        <p className="text-green-400">{PublishData.length}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xl md:text-2xl font-semibold">{PublishData.length} Jobs</p>
                      <p className="text-gray-400">Last updated 30m ago</p>
                    </div>
                  </div>
                </div>

                <div className="flex data1 border-2 border-gray-200 rounded-lg">
                  <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-xl text-gray-500 md:text-2xl">Closed</p>
                      <div className="text-lg md:text-xl bg-[#FEE2E2] jobno rounded-full">
                        <p className="text-red-400">16</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xl md:text-2xl font-semibold">32 Jobs</p>
                      <p className="text-gray-400">Last updated 1day ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tab buttons */}
              <div className="flex items-center justify-center gap-5 mt-2">
                <button
                  className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-200 all ${allJobs
                      ? "bg-blue-700 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                    }`}
                  onClick={() => {
                    setAllJobs(true);
                    setPublishJob(false);
                  }}
                >
                  All Jobs
                </button>
                <button
                  className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-200 publish ${PublishJob
                      ? "bg-blue-700 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                    }`}
                  onClick={() => {
                    setAllJobs(false);
                    setPublishJob(true);
                  }}
                >
                  Publish Jobs
                </button>
              </div>

              {/* Job listings */}
              {allJobs ? (
                <div className="recent">
                  <div className="w-full rounded-2xl border-2 border-gray-200 recent1">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl md:text-3xl font-semibold">Recent Job Posting</p>
                      </div>
                    </div>
                    <hr className="text-gray-200 mb-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                          <div key={job.id} className="frontend flex flex-col bg-gray-100 rounded-2xl ">
                            <div className="flex flex-col ">
                              <p className="text-xl font-medium">{job.job_title}</p>
                              <div className="flex  items-center flex-wrap gap-3 text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <FaLocationDot />
                                  {job.location}
                                </span>
                                <span className="bg-gray-200 px-2 py-1 padd rounded-md text-sm">{job.job_type}</span>
                                <span className="flex items-center">
                                  <LiaRupeeSignSolid />
                                  {job.salary_range}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center">
                              {!job.is_published && (
                                <button 
                                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md cursor-pointer transition-all duration-200 padd" 
                                  onClick={() => PutpublishedJobs(job.id)}
                                >
                                  Publish
                                </button>
                              )}
                              <div className="flex gap-4">
                                <IoMdCreate 
                                  className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" 
                                  onClick={() => handleEditJob(job)} 
                                />
                                <IoMdCopy 
                                  className="text-gray-500 text-xl cursor-pointer hover:text-gray-700" 
                                  onClick={() => handleCopyLink(job.id)} 
                                />
                                <MdDelete 
                                  className="text-red-500 text-xl cursor-pointer hover:text-red-700" 
                                  onClick={() => handleDeleteJob(job.id)} 
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 frontend bg-gray-100 rounded-2xl">
                          <p className="text-gray-500">No job postings available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="recent">
                  <div className="w-full rounded-2xl border-2 border-gray-200 recent1">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl md:text-3xl font-semibold">Recent Published Jobs</p>
                      </div>
                    </div>
                    <hr className="text-gray-200 mb-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.isArray(filteredJobs2) && filteredJobs2.length > 0 ? (
                        filteredJobs2.map((job) => (
                          <div key={job.id} className="frontend flex flex-col bg-gray-100 rounded-2xl ">
                            <div className="flex flex-col">
                              <p className="text-xl font-medium">{job.job_title}</p>
                              <div className="flex items-center flex-wrap gap-3 text-gray-500 mt-2">
                                <span className="flex items-center gap-1">
                                  <FaLocationDot />
                                  {job.location}
                                </span>
                                <span className="bg-gray-200 px-2 py-1 padd rounded-md text-sm">{job.job_type}</span>
                                <span className="flex items-center">
                                  <LiaRupeeSignSolid />
                                  {job.salary_range}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-center">
                              <div className="flex gap-4">
                                <IoMdCreate 
                                  className="text-blue-500 text-xl cursor-pointer hover:text-blue-700" 
                                  onClick={() => handleEditJob(job)} 
                                />
                                <IoMdCopy 
                                  className="text-gray-500 text-xl cursor-pointer hover:text-gray-700" 
                                  onClick={() => handleCopyLink(job.id)} 
                                />
                                <MdDelete 
                                  className="text-red-500 text-xl cursor-pointer hover:text-red-700" 
                                  onClick={() => handleDeleteJob(job.id)} 
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8 frontend bg-gray-100 rounded-2xl">
                          <p className="text-gray-500">No published jobs available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPosting;