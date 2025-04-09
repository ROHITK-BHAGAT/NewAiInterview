import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaCloudArrowUp } from "react-icons/fa6";
import axios from "../helper/Axios";
import ResumeResults from "./ResumeResults";
import ProfileCard from "./ProfileCard";
import './CandidateScreening.css';
import Swal from "sweetalert2";
import { CgProfile } from "react-icons/cg";

const CandidateScreening = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    upload_resumes: [], // Will store all selected File objects
  });
  const [results, setResults] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // File validation constants
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ["application/pdf", "application/msword", 
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  useEffect(() => {
    const handleStorageChange = () => {
      const collapsed = JSON.parse(localStorage.getItem("sidebarCollapsed")) || false;
      setSidebarCollapsed(collapsed);
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleProfileCard = () => {
    setShowProfileCard(prev => !prev);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => !ALLOWED_TYPES.includes(file.type));
    if (invalidFiles.length > 0) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Only PDF and Word documents are allowed.",
        icon: "error"
      });
      e.target.value = "";
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: "File Too Large",
        text: `Each file must be under ${MAX_FILE_SIZE_MB}MB.`,
        icon: "error"
      });
      e.target.value = "";
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      upload_resumes: [...prev.upload_resumes, ...files] // Add all new files
    }));
    
    setSelectedFiles(prev => [
      ...prev,
      ...files.map(file => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type.split('/')[1] || file.type
      }))
    ]);
    
    e.target.value = ""; // Reset input for additional selections
  };

  const uploadResumes = async (e) => {
    e.preventDefault();
    
    if (formData.upload_resumes.length === 0) {
      Swal.fire({
        title: "No Resumes Selected",
        text: "Please select at least one resume to upload.",
        icon: "warning"
      });
      return;
    }

    setIsDisabled(true);
    
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("job_title", formData.job_title);
      formDataToSend.append("job_description", formData.job_description);
      
      // Append all files with the same field name
      formData.upload_resumes.forEach((file) => {
        formDataToSend.append("upload_resumes", file); // Same field name for array
      });

      const response = await axios.post("/api/resume_upload/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setResults(response.data);
      Swal.fire({
        title: "Success!",
        text: `${formData.upload_resumes.length} resume(s) uploaded successfully`,
        icon: "success"
      });
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        upload_resumes: []
      }));
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Failed to upload resumes";
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to upload resumes";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error"
      });
    } finally {
      setIsDisabled(false);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...formData.upload_resumes];
    const newSelectedFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    newSelectedFiles.splice(index, 1);
    setFormData(prev => ({ ...prev, upload_resumes: newFiles }));
    setSelectedFiles(newSelectedFiles);
  };

  return (
    <div className="candidate-screening-container">
      <Sidebar />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="header-section">
          <div>
            <h1>Candidate Screening</h1>
            <p className="subtitle">Upload multiple candidate resumes</p>
          </div>
          
          <div className="relative">
            <button 
              className="profile-icon-container"
              onClick={toggleProfileCard}
              aria-label="Toggle profile card"
            >
              <CgProfile color="hotpink" size={40} />
            </button>
            
            {showProfileCard && (
              <div className="profile-card-position">
                <ProfileCard onClose={toggleProfileCard} />
              </div>
            )}
          </div>
        </div>

        <form className="form-container" onSubmit={uploadResumes}>
          <div className="job-details-section">
            <div className="form-group">
              <label htmlFor="job-title">Job Title *</label>
              <input
                id="job-title"
                required
                type="text"
                placeholder="Enter job title"
                value={formData.job_title}
                onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="job-description">Job Description *</label>
              <textarea
                id="job-description"
                required
                placeholder="Enter job description"
                value={formData.job_description}
                onChange={(e) => setFormData({...formData, job_description: e.target.value})}
              />
            </div>
          </div>

          <div className="upload-section">
            <div className="upload-box">
              <FaCloudArrowUp className="upload-icon" />
              <h3>Upload Resumes *</h3>
              <p>Select multiple resumes to upload</p>
              <p className="file-types">Supports PDF, DOC, DOCX (Max {MAX_FILE_SIZE_MB}MB each)</p>
              
              <input
                type="file"
                id="resume-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                multiple
              />
              <label htmlFor="resume-upload" className="upload-button">
                {selectedFiles.length > 0 ? 'Add More Files' : 'Select Files'}
              </label>
              
              {selectedFiles.length > 0 && (
                <div className="selected-files-container">
                  <h4>Selected Files ({selectedFiles.length}):</h4>
                  <ul className="selected-files-list">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="selected-file-item">
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-meta">{file.size} • {file.type.toUpperCase()}</span>
                        </div>
                        <button 
                          type="button" 
                          className="remove-file-btn"

                          onClick={() => removeFile(index)}
                          aria-label={`Remove ${file.name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button 
              className={`submit-button ${selectedFiles.length > 0 ? 'active' : ''}`}
              type="submit" 
              disabled={isDisabled || selectedFiles.length === 0}
            >
              {isDisabled ? 'Uploading...' : `Upload ${selectedFiles.length} Resume(s)`}
            </button>
          </div>
        </form>

        {results.length > 0 && <ResumeResults results={results} />}
      </div>
    </div>
  );
};

export default CandidateScreening;