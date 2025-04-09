import React, { useEffect, useState } from "react";
import axios from "../helper/Axios"; // Ensure the correct path
import Loader3 from "./Loader";
import logo from "../assets/logo.png";
import StudentProfileSetting from "./StudentProfileSetting";
import StudentSiderBar from "./StudentSiderbar";
import {
  Award,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Mail,
  Phone,
  UserCircle,
  UserCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
// import { json } from "stream/consumers";
import SiderBar2 from "./SiderBar2";
import qs from "qs";
import "./Profile.css";
import Candidate_Interview from "./Candidate_Interview";
// Define the User interface based on API response structure
const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobDataPost, setJobPostData] = useState({
    gender: "",
    date_of_birth: "",
    country: "",
    province_state: "",
    city: "",
    job_domain_function: "",
    job_sub_role: "",
    experience: "",
    total_experience_years: "",
    current_company_name: "",
    current_job_title: "",
    joining_date: "",
    current_ctc: "",
    expected_ctc: "",
    job_profile: "",
    notice_period: "",
    educations: [
      {
        degree: "",
        field_of_study: "",
        institution_name: "",
        year_of_passing: "",
      },
    ],
    projects: [
      {
        project_name: "",
        description: "",
        technologies_used: "",
      },
    ],
    certifications: [
      {
        certification_name: "",
        issued_by: "",
        issued_date: "",
      },
    ],
    job_details: [
      {
        job_title: "",
        company_name: "",
        job_duration_from: "",
        job_duration_to: "",
        job_skills: "",
        job_summary: "",
      },
    ],
  });

  // Add the provided token to localStorage
  // const token =localStorage.getItem('token');

  const [Joblink, setJoblink] = useState("");

  const [jobdesc, setJobDesc] = useState(null);

  const [jobResponse, setjobResponse] = useState(false);
  //   const fetchLink = async (id) => {
  //     try {
  //       const response = await axios.get(`/api/tings/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log("job des", response.data);
  //       setJobDesc(response.data);
  //       console.log("jobdesc after setJobDesc:", response.data);
  //     } catch (e) {
  //         console.log(e)
  //       Swal.fire({
  //         icon: "error",
  //         text: `${e}`,
  //       });
  //     }
  //   };
  const fetchLink = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`/api/job_postings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("job des", response.data);
      // console.log("jobdesc after setJobDesc:", response.data);

      if (response) {
        setJobDesc(response.data); // This will update jobdesc asynchronously

        //  setjobResponse(true);
      }
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: `${e}`,
      });
    }
  };
  const handleResumeAnalysis = async () => {
    try {
      // console.log("candidate_data", submittedProfile);
      // console.log("jobdesc in handleResumeAnalysis:", jobdesc);
      // console.log("hr_id", jobdesc.hr_id);

      const response = await axios.post(
        `/api/job_apply_resume_analysis/`,
        qs.stringify({
          candidate_data: JSON.stringify(submittedProfile),
          job_description: JSON.stringify(jobdesc),
          hr_id: JSON.stringify(jobdesc.hr_id),
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: `Your profile is submitted successfully for ${jobdesc?.job_title}  position `,
      });
      // console.log(response);
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        text: `${e?.response?.data?.detail}`,
      });
    }
  };

  const [Load, setLoad] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };

  const handleLoader = () => {
    setLoad(!Load);
    setTimeout(() => {
      setLoad(false);
    }, 3000);
  };

  const handleJoblink = async () => {
    let lastPart = Joblink.split("/").pop() ?? "";
    await fetchLink(lastPart);
    handleLoader();
    setJoblink("");
  };

  useEffect(() => {
    if (jobdesc) {
      // console.log("Updated jobdesc:", jobdesc);
      handleResumeAnalysis();
    }
  }, [jobdesc]);

  const user = localStorage.getItem("user");

  if (user) {
    try {
      // Parse the string into an object
      const parsedToken = JSON.parse(user);

      var token = parsedToken.token;

      // Access the user_id from the parsed object
      var candidate_id = parsedToken.user_id;
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  } else {
    console.log("No token found in localStorage");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJobPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const getJobData = async () => {
      try {
        const response = await axios.get(`api/job_postings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setJob(response.data);
      } catch (error) {
        // console.log(error);
      }
    };

    getJobData();
  }, [id]);

  const handleNestedChange = (e, index, section) => {
    const { name, value } = e.target;
    setJobPostData((prevData) => ({
      ...prevData,
      [section]: prevData[section].map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      ),
    }));
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/get_my_profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
        setLoading(false);
      } catch (e) {
        setError("Failed to fetch profile data.");
        setLoading(false);
        console.log(e);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(jobDataPost);

    try {
      console.log(jobDataPost);
      const response = await axios.post(
        `/api/candidate_profiles`,
        jobDataPost,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Job Posted",
        text: "Your job has been posted successfully!",
      }).then(() => {
        window.location.reload();
      });
      // console.log(response);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error posting job",
      });
      console.error("Error posting job:", error);
    }
  };

  const [submittedProfile, setSubmittedProfile] = useState(null);
  const [candidateData, setCandidateData] = useState(undefined);

  useEffect(() => {
    const fetchSubmittedProfile = async () => {
      try {
        const response = await axios.get(
          `/api/candidate_profiles/${candidate_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmittedProfile(response.data);
        setCandidateData(response.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchSubmittedProfile();
  }, [token]);

  const addEducationField = () => {
    setJobPostData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          degree: "",
          field_of_study: "",
          institution_name: "",
          year_of_passing: "",
        },
      ],
    }));
  };

  const addProjectField = () => {
    setJobPostData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          project_name: "",
          description: "",
          technologies_used: "",
        },
      ],
    }));
  };

  const addCertificateField = () => {
    setJobPostData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          certification_name: "",
          issued_by: "",
          issued_date: "",
        },
      ],
    }));
  };

  const addJobField = () => {
    setJobPostData((prev) => ({
      ...prev,
      job_details: [
        ...prev.job_details,
        {
          job_title: "",
          company_name: "",
          job_duration_from: "",
          job_duration_to: "",
          job_skills: "",
          job_summary: "",
        },
      ],
    }));
  };

  const removeJobField = (index) => {
    if (index === 0) return;
    setJobPostData((prevState) => ({
      ...prevState,
      job_details: prevState.job_details.filter((_, i) => i !== index),
    }));
  };

  const removeCertificateField = (index) => {
    if (index === 0) return;
    setJobPostData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const removeProjectField = (index) => {
    if (index === 0) return;
    setJobPostData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const removeEducationField = (index) => {
    if (index === 0) return;
    setJobPostData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const [isFresher, setIsFresher] = useState(false);

  const handleCheckbox = (e) => {
    setIsFresher(e.target.checked);
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      {profile?.user_type === "candidate" && (
        <div className="flex justify-center">
          {/* Added Sidebar - No other changes made */}
          <StudentSiderBar className="w-[20%]" handleCancel={handleCancel} />

          {/* Your existing content exactly as you wrote it */}
          <div className="parentmain"></div>
          <div className="ml-64 bg-gray-200 py-8 flex justify-center items-center w-[100%]  mainStudent">
            <div className="max-w-6xl mx-auto px-4 w-[100%] studentContainer">
              <form action="" onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-1.5">
                  <div className="p-6 border-b">
                    <div className="flex items-center profilenav ">
                      <div className="flex items-center justify-between w-full p-4">
                        {/* Left Side: Profile Icon */}
                       

                        {/* Right Side: User Details */}
                        <div className="flex flex-col gap-2">
                          <h2 className="text-xl font-semibold">
                            Welcome {profile?.username}
                          </h2>
                          <div className="mt-2 space-y-2 flex flex-col gap-2">
                            <button className="flex items-center gap-2 text-gray-600 text-sm">
                              <Phone size={16} /> {profile?.phone_no}
                            </button>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <Mail size={16} /> {profile?.email}
                            </div>
                          </div>
                        </div>
                        {profile?.username && (
                          <div
                            className="w-20 h-20 rounded-full bg-pink-400 flex items-center justify-center text-white text-3xl font-bold cursor-pointer"
                            onClick={handleCancel}
                          >
                            {profile.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {showProfile && (
                    <div>
                      <StudentProfileSetting
                        handleCancel={handleCancel}
                      ></StudentProfileSetting>
                    </div>
                  )}
                  {submittedProfile ? (
                    <div className="flex justify-center">
                      <div className="w-full max-w-4xl mx-auto space-y-6 p-8">
                        <div className="bg-white   p-6 mx-auto ">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2  perhead">
                            <UserCircle2 className="w-5 h-5" />
                            Personal Information
                          </h2>
                          <div className="space-y-6 ">
                            <div className="p-4 border rounded-lg bg-gray-200 perinfo">
                              <div className="grid grid-cols-2 gap-4 ">
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Gender
                                  </p>
                                  <p className="mt-1">
                                    {candidateData?.candidate_profile?.gender}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Date of Birth
                                  </p>
                                  <p className="mt-1">
                                    {candidateData?.candidate_profile
                                      ?.date_of_birth
                                      ? (() => {
                                          const date = new Date(
                                            candidateData.candidate_profile.date_of_birth
                                          );
                                          return `${date
                                            .getFullYear()
                                            .toString()
                                            .slice(2)} ${String(
                                            date.getMonth() + 1
                                          ).padStart(2, "0")} ${String(
                                            date.getDate()
                                          ).padStart(2, "0")}`;
                                        })()
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Location
                                  </p>
                                  <p className="mt-1">{`${candidateData?.candidate_profile?.city}, ${candidateData?.candidate_profile?.province_state}, ${candidateData?.candidate_profile?.country}`}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Total Experience
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.total_experience_years
                                    }{" "}
                                    years
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg  p-6 ">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 perhead">
                            <Briefcase className="w-5 h-5" />
                            Current Employment
                          </h2>
                          <div className="space-y-6">
                            <div className="p-4 border rounded-lg bg-gray-200 perinfo">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Company
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.current_company_name
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Job Title
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.current_job_title
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Domain
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.job_domain_function
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Role
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.job_sub_role
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Current CTC
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.current_ctc
                                    }
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-600">
                                    Expected CTC
                                  </p>
                                  <p className="mt-1">
                                    {
                                      candidateData?.candidate_profile
                                        ?.expected_ctc
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className=" rounded-lg  p-6 ">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 personaltitle perhead">
                            <GraduationCap className="w-5 h-5" />
                            Education
                          </h2>
                          <div className="flex flex-col gap-2">
                            {candidateData?.educations?.map((edu, index) => (
                              <div
                                key={index}
                                className="p-4 border rounded-lg bg-gray-200 perinfo"
                              >
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Degree
                                    </p>
                                    <p className="mt-1">{edu.degree}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Field of Study
                                    </p>
                                    <p className="mt-1">{edu.field_of_study}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Institution
                                    </p>
                                    <p className="mt-1">
                                      {edu.institution_name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Year of Passing
                                    </p>
                                    <p className="mt-1">
                                      {edu.year_of_passing}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white rounded-lg  p-6 ">
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 perhead">
                            <FolderGit2 className="w-5 h-5" />
                            Projects
                          </h2>
                          <div className="space-y-6">
                            {candidateData?.projects?.map((project, index) => (
                              <div
                                key={index}
                                className="p-4 border rounded-lg bg-gray-200 perinfo"
                              >
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Project Name
                                    </p>
                                    <p className="mt-1">
                                      {project.project_name}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Technologies Used
                                    </p>
                                    <p className="mt-1">
                                      {project.technologies_used}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                      Description
                                    </p>
                                    <p className="mt-1">
                                      {project.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {candidateData?.certifications?.length > 0 && (
                          <div className="bg-white rounded-lg p-6 mb-6 ">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                              <Award className="w-5 h-5 text-blue-600" />
                              Certifications
                            </h2>
                            <div className="space-y-4">
                              {candidateData.certifications.map(
                                (cert, index) => (
                                  <div
                                    key={`cert-${index}`}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">
                                          Certification Name
                                        </p>
                                        <p className="mt-1 font-medium text-gray-800">
                                          {cert.certification_name ||
                                            "Not specified"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">
                                          Issued By
                                        </p>
                                        <p className="mt-1 text-gray-800">
                                          {cert.issued_by || "Not specified"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">
                                          {cert.expiry_date
                                            ? "Issue Date"
                                            : "Date"}
                                        </p>
                                        <p className="mt-1 text-gray-800">
                                          {cert.issued_date || "Not specified"}
                                          {cert.expiry_date && (
                                            <span className="block text-xs text-gray-500">
                                              Expires: {cert.expiry_date}
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    {cert.certification_url && (
                                      <div className="mt-3">
                                        <a
                                          href={cert.certification_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline inline-flex items-center"
                                        >
                                          <ExternalLink className="w-4 h-4 mr-1" />
                                          View Certificate
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto bg-white  ">
                        <div className="p-6 border-b bg-white rounded-lg  personaldiv">
                          <h3 className="text-xl font-semibold flex items-center gap-2 mb-6 text-gray-800 personaltitle">
                            Personal Details
                          </h3>

                          <div className="grid grid-cols-2 gap-x-7 personal2">
                            <div className="flex flex-col gap-3">
                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Select Gender*
                                </label>
                                <div className="flex gap-4 border border-gray-300 p-3 rounded-lg bg-gray-50 profileinput">
                                  {["Male", "Female", "Other"].map((gender) => (
                                    <label
                                      key={gender}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <input
                                        type="radio"
                                        name="gender"
                                        value={gender}
                                        onChange={handleChange}
                                        className="text-blue-600 focus:ring-blue-500 profileinput"
                                        required
                                      />
                                      <span>{gender}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Date of Birth*
                                </label>
                                <input
                                  type="date"
                                  name="date_of_birth"
                                  value={jobDataPost.date_of_birth}
                                  onChange={handleChange}
                                  className=" profileinput w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Country*
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter your country"
                                  name="country"
                                  value={jobDataPost.country}
                                  onChange={handleChange}
                                  className=" profileinput w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Province/State*
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter your state"
                                  name="province_state"
                                  value={jobDataPost.province_state}
                                  onChange={handleChange}
                                  className=" profileinput w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  City*
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter your city"
                                  name="city"
                                  value={jobDataPost.city}
                                  onChange={handleChange}
                                  className=" profileinput w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Total Experience (Years)*
                                </label>
                                <input
                                  type="number"
                                  placeholder="e.g., 5"
                                  name="total_experience_years"
                                  value={jobDataPost.total_experience_years}
                                  onChange={handleChange}
                                  className=" profileinput w-full p-3 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-6 mt-6 ml-5 freshtick">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2 w-6 h-6 "
                                checked={isFresher}
                                onChange={handleCheckbox}
                              />
                              <span className="text-lg font-medium checkboxText text-gray-700">
                                I am a Fresher
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="p-8 border-b personaldiv">
                          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 personaltitle">
                            Current company details{" "}
                          </h3>

                          <div className="flex justify-between personal2">
                            <div className="w-[48%] ">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Job domain*
                              </label>
                              <input
                                type="text"
                                placeholder=" e.g IT or Marketing"
                                name="job_domain_function"
                                value={jobDataPost.job_domain_function}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                required
                                disabled={isFresher}
                              />
                            </div>

                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2 ">
                                Job Role*
                              </label>
                              <input
                                type="text"
                                placeholder="e.g frontend or backend"
                                name="job_sub_role"
                                value={jobDataPost.job_sub_role}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                required
                                disabled={isFresher}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between personal2">
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Experience*
                              </label>
                              <input
                                type="text"
                                placeholder="Current company exp"
                                name="experience"
                                value={jobDataPost.experience}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                required
                                disabled={isFresher}
                              />
                            </div>
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Current company name*
                              </label>
                              <input
                                type="text"
                                placeholder="Company name"
                                name="current_company_name"
                                value={jobDataPost.current_company_name}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between personal2">
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Current job title*
                              </label>
                              <input
                                type="text"
                                placeholder="e.g Senior Frontend Developer"
                                name="current_job_title"
                                value={jobDataPost.current_job_title}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Joining_date*
                              </label>
                              <input
                                type="date"
                                placeholder="Join Date"
                                name="joining_date"
                                value={jobDataPost.joining_date}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between personal2">
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Current ctc*
                              </label>
                              <input
                                type="text"
                                placeholder="Current ctc"
                                name="current_ctc"
                                value={jobDataPost.current_ctc}
                                onChange={handleChange}
                                className="profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>

                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Expected ctc*
                              </label>
                              <input
                                type="text"
                                placeholder="Expected ctc"
                                name="expected_ctc"
                                value={jobDataPost.expected_ctc}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between personal2">
                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Job profile*
                              </label>
                              <input
                                type="text"
                                placeholder="Profile"
                                name="job_profile"
                                value={jobDataPost.job_profile}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>

                            <div className="w-[48%]">
                              <label className="block text-lg font-medium text-gray-700 mb-2">
                                Notice period*
                              </label>
                              <input
                                type="text"
                                placeholder="Notice period"
                                name="notice_period"
                                value={jobDataPost.notice_period}
                                onChange={handleChange}
                                className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                required
                                disabled={isFresher}
                              />
                            </div>
                          </div>
                        </div>

                        {jobDataPost.job_details.map((job, index) => (
                          <div className="p-6 border-b personaldiv" key={index}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 personaltitle">
                              Previous Company
                            </h3>

                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Job title
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g Frontend Developer"
                                  name="job_title"
                                  value={job.job_title}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                />
                              </div>

                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2 ">
                                  Company name
                                </label>
                                <input
                                  type="text"
                                  placeholder="Company name"
                                  name="company_name"
                                  value={job.company_name}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Job Skills
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g HTML,CSS.."
                                  name="job_skills"
                                  value={job.job_skills}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Job summary
                                </label>
                                <input
                                  type="text"
                                  placeholder="summary"
                                  name="job_summary"
                                  value={job.job_summary}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                />
                              </div>
                            </div>

                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Job duration from
                                </label>
                                <input
                                  type="date"
                                  placeholder="City"
                                  name="job_duration_from"
                                  value={job.job_duration_from}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Job duration to
                                </label>
                                <input
                                  type="date"
                                  placeholder="City"
                                  name="job_duration_to"
                                  value={job.job_duration_to}
                                  disabled={isFresher}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "job_details")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end ">
                              {index > 0 && (
                                <button
                                  type="button"
                                  className=" addmore border-2 text-white bg-red-600 hover:bg-red-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg mr-4"
                                  onClick={() => removeJobField(index)}
                                >
                                  Remove
                                </button>
                              )}
                              {index === jobDataPost.job_details.length - 1 && (
                                <button
                                  type="button"
                                  className={`${
                                    isFresher
                                      ? "hover:bg-green-600 hover:shadow"
                                      : "hover:bg-green-500 hover:shadow-lg"
                                  } text-white border-2 bg-green-600 duration-150 transition-all px-4 py-1 rounded-lg addmore`}
                                  onClick={addJobField}
                                  disabled={isFresher}
                                >
                                  Add More
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {jobDataPost.educations.map((education, index) => (
                          <div className="p-6 border-b personaldiv" key={index}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 personaltitle">
                              Education
                            </h3>
                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Degree*
                                </label>
                                <input
                                  type="text"
                                  name="degree"
                                  placeholder="degree"
                                  value={education.degree}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "educations")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                  required
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Field of study*
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g Computer Science"
                                  name="field_of_study"
                                  value={education.field_of_study}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "educations")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Institution Name*
                                </label>
                                <input
                                  type="text"
                                  placeholder="Name"
                                  name="institution_name"
                                  value={education.institution_name}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "educations")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                  required
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Year of passing*
                                </label>
                                <input
                                  type="number"
                                  placeholder="year"
                                  name="year_of_passing"
                                  value={education.year_of_passing}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "educations")
                                  }
                                  className=" profileinput no-arrow rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                  required
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              {index > 0 && (
                                <button
                                  type="button"
                                  className=" addmore border-2 text-white bg-red-600 hover:bg-red-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg mr-4"
                                  onClick={() => removeEducationField(index)}
                                >
                                  Remove
                                </button>
                              )}
                              {index === jobDataPost.educations.length - 1 && (
                                <button
                                  type="button"
                                  className="addmore text-white border-2 bg-green-600 hover:bg-green-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg"
                                  onClick={addEducationField}
                                >
                                  Add More
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {jobDataPost.projects.map((project, index) => (
                          <div className="p-6 border-b personaldiv" key={index}>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 personaltitle">
                              Projects
                            </h3>
                            <div className="flex justify-between personal2">
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Project name
                                </label>
                                <input
                                  type="text"
                                  placeholder="project name"
                                  name="project_name"
                                  value={project.project_name}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "projects")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Technologies
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g react.js , node.js"
                                  name="technologies_used"
                                  value={project.technologies_used}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "projects")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                />
                              </div>
                            </div>

                            <div className="flex justify-between personal2">
                              <div className="w-full">
                                <label className="block text-lg font-medium text-gray-700 mb-2">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  placeholder=" Project description"
                                  name="description"
                                  value={project.description}
                                  onChange={(e) =>
                                    handleNestedChange(e, index, "projects")
                                  }
                                  className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              {index > 0 && (
                                <button
                                  type="button"
                                  className="border-2 text-white bg-red-600 hover:bg-red-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg mr-4 addmore"
                                  onClick={() => removeProjectField(index)}
                                >
                                  Remove
                                </button>
                              )}
                              {index === jobDataPost.projects.length - 1 && (
                                <button
                                  type="button"
                                  className="text-white border-2 bg-green-600 hover:bg-green-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg addmore"
                                  onClick={addProjectField}
                                >
                                  Add More
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {jobDataPost.certifications.map(
                          (certificate, index) => (
                            <div
                              className="p-6 border-b personaldiv"
                              key={index}
                            >
                              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 personaltitle">
                                Certificate
                              </h3>
                              <div className="flex justify-between personal2">
                                <div className="w-[48%]">
                                  <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Certification name
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="name"
                                    name="certification_name"
                                    value={certificate.certification_name}
                                    onChange={(e) =>
                                      handleNestedChange(
                                        e,
                                        index,
                                        "certifications"
                                      )
                                    }
                                    className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-2"
                                  />
                                </div>
                                <div className="w-[48%]">
                                  <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Issued by
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="issued by"
                                    name="issued_by"
                                    value={certificate.issued_by}
                                    onChange={(e) =>
                                      handleNestedChange(
                                        e,
                                        index,
                                        "certifications"
                                      )
                                    }
                                    className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between personal2">
                                <div className="w-full">
                                  <label className="block text-lg font-medium text-gray-700 mb-2">
                                    Date of Completion
                                  </label>
                                  <input
                                    type="date"
                                    placeholder="Date completion"
                                    name="issued_date"
                                    value={certificate.issued_date}
                                    onChange={(e) =>
                                      handleNestedChange(
                                        e,
                                        index,
                                        "certifications"
                                      )
                                    }
                                    className=" profileinput rounded-lg block w-full text-sm font-medium border-gray-300 border-[1px] p-3 text-gray-700 mb-5 h-[47px]"
                                  />
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="border-2 text-white bg-red-600 hover:bg-red-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg mr-4 addmore"
                                    onClick={() =>
                                      removeCertificateField(index)
                                    }
                                  >
                                    Remove
                                  </button>
                                )}
                                {index ===
                                  jobDataPost.certifications.length - 1 && (
                                  <button
                                    type="button"
                                    className="text-white border-2 bg-green-600 hover:bg-green-500 duration-150 transition-all hover:shadow-lg px-4 py-1 rounded-lg addmore"
                                    onClick={addCertificateField}
                                  >
                                    Add More
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="mt-6 flex justify-end gap-4 cancel">
                        <button
                          className="cursor-pointer addmore px-4 py-2 text-gray-600 border rounded-lg"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="cursor-pointer addmore px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </form>

              {submittedProfile && (
                <div className="mt-8 bg-white  rounded-xl shadow-sm p-6 joblink">
                  <h2 className="text-xl font-semibold text-center mb-6 joblink1">
                    Paste Your Job Link here
                  </h2>
                  <div className="flex  items-center justify-center  gap-4  joblink2">
                    <input
                      type="text"
                      className=" profileinput p-4 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all w-[560px]"
                      placeholder="Paste your Job link "
                      name="jobLink"
                      value={Joblink}
                      onChange={(e) => setJoblink(e.target.value)}
                      required
                    />
                    {Load ? (
                      <Loader3 />
                    ) : (
                      <button
                        type="submit"
                        name="jobLink"
                        className={` addmore px-6 py-4 rounded-lg text-white transition-all duration-200
                    ${
                      Joblink
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-blue-400 cursor-not-allowed"
                    }`}
                        onClick={handleJoblink}
                        disabled={!Joblink}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProfile;
