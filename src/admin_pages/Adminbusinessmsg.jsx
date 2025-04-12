import React, { useEffect, useState } from "react";
import axios from "../helper/Axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SiderBar2 from "../Components/SiderBar2";
import './Adminbusinessmsg.css';

const Adminbusinessmsg = () => {
  // Define all Hooks at the top
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDescription, setExpandedDescription] = useState(new Set());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // This state is unused in the current logic, but let's keep it for now
  const [checkData, setCheckData] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    user_type: "user",
    phone_no: "",
    company_name: "",
    industry: "",
  });

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

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/companies/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch companies");
        setLoading(false);
        console.error(err);
      }
    };
    fetchCompanies();
  }, [token]);

  // Define all functions after Hooks
  const handleCheckMessage = async (messageId) => {
    try {
      const response = await axios.put(`/api/verify_company_details/${messageId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Success handling would go here if needed
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update the message status.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      console.error("Error updating message:", error);
    }
  };

  const handleToggleDescription = (companyId) => {
    setExpandedDescription(prev => {
      const newSet = new Set(prev);
      newSet.has(companyId) ? newSet.delete(companyId) : newSet.add(companyId);
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getShortDescription = (description) => {
    const words = description.split(" ");
    return words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");
  };

  const getData = async (id) => {
    const company = companies.find(company => company.id === id);
    if (!company) return;

    const newCheckData = {
      user_name: company.contact_person_name || "",
      user_email: company.business_email || "",
      user_password: company.phone_number || "",
      user_type: "user",
      phone_no: company.phone_number || "",
      company_name: company.company_name || "",
      industry: company.Industry || company.industry || "",
    };

    await checked(newCheckData, id);
  };

  const checked = async (data, id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to check this message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, check it",
    });

    if(result.isConfirmed){
      try {
        const response = await axios.post(
          '/api/insert/ai_Interviewer_register/',
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response) {
          Swal.fire({
            title: 'Success',
            text: response.data.message || 'Registered successfully',
            icon: 'success',
          });
          setCompanies(prev => prev.map(company => 
            company.company_name === data.company_name ? { ...company, is_checked: true } : company
          ));
          handleCheckMessage(id);
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.detail || 'Registration failed',
          icon: 'error',
        });
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <div className="flex h-screen">
      <SiderBar2 />
      <div className={`admin-content ${isSidebarCollapsed ? 'admin-content-collapsed' : ''} bg-white text-black px-4 py-6 relative`}>
        {loading ? (
          <div className="absolute top-0 left-8 right-0 bottom-0 flex flex-col justify-center items-center bg-white bg-opacity-80 z-10">
            <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-900 font-medium">Loading data...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-8">{error}</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full border border-gray-200">
            <div className="bg-blue-900 text-white px-6 py-4 business">
              <h2 className="text-2xl font-bold">Business Message</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed ">
                <thead className="">
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap tableleft" style={{width: "12%"}}>Company Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "10%"}}>Contact Person</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "12%"}}>Email</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "8%"}}>Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "8%"}}>Company Size</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "8%"}}>Industry</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "10%"}}>Company Website</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "14%"}}>Description</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "10%"}}>Created On</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase whitespace-nowrap" style={{width: "8%"}}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {companies.map(company => (
                    <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 ">{company.company_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{company.contact_person_name}</td>
                      <td className="px-4 py-3 text-sm">
                        <a href={`mailto:${company.business_email}`} className="text-blue-600 hover:text-blue-800 hover:underline transition">
                          {company.business_email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{company.phone_number}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 compsize">
                          {company.company_size}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {company.Industry || company.industry}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition">
                          {company.company_website}
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-normal" style={{ maxWidth: "300px", wordWrap: "break-word" }}>
                        <span className="text-sm text-gray-600">
                          {expandedDescription.has(company.id)
                            ? company.company_description
                            : getShortDescription(company.company_description)}
                        </span>
                        {company.company_description.split(" ").length > 10 && (
                          <button className="text-blue-600 hover:text-blue-800 ml-2 text-sm font-medium transition" onClick={() => handleToggleDescription(company.id)}>
                            {expandedDescription.has(company.id) ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(company.created_on)}</td>
                      <td className="px-4 py-3 text-center">
                        {!company.is_checked ? (
                          <button className="px-3 py-1 bg-blue-900 text-white rounded hover:bg-blue-800 transition" onClick={() => getData(company.id)}>
                            Check
                          </button>
                        ) : (
                          <span className="text-green-600 font-medium flex items-center justify-center">
                            
                            Checked
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminbusinessmsg;