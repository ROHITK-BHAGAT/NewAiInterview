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

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/companies/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(response.data);
        // console.log(response.data);
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
  const response=      await axios.put(`/api/verify_company_details/${messageId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setCompanies(prev => prev.map(company => 
        //   company.id === messageId ? { ...company, is_checked: true } : company
        // ));
        // Swal.fire({
        //   title: "Checked successfully!",
        //   icon: "success",
        //   confirmButtonColor: "#3085d6",
        // });
        // console.log(response);
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

    await checked(newCheckData,id);
  };

  const checked = async (data,id) => {
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
          handleCheckMessage(id)
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

  // Render logic
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/6">
        <SiderBar2 />
      </div>
      <div className="bg-white text-black bms">
        <div className="bg-white shadow rounded-lg overflow-hidden w-[95%] bm">
          <div className="bg-blue-900 text-white px-6 py-4 business">
            <h2 className="text-2xl font-bold">Business Message</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {["Company Name", "Contact Person", "Email", "Phone", "Company Size", 
                    "Industry", "Company Website", "Description", "Created On", "Actions"]
                    .map(header => (
                      <th key={header} className="text-left text-md font-medium text-gray-600 uppercase company">
                        {header}
                      </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map(company => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-200 company">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 company">{company.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 company">{company.contact_person_name}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 hover:underline company">
                      <a href={`mailto:${company.business_email}`}>{company.business_email}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 company">{company.phone_number}</td>
                    <td className="px-6 py-4 company">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 company">
                        {company.company_size}
                      </span>
                    </td>
                    <td className="px-6 py-4 company">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full company">
                        {company.Industry || company.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 company">
                      <a href={company.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.company_website}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-normal company" style={{ maxWidth: "300px", wordWrap: "break-word" }}>
                      <span className="text-sm text-gray-500">
                        {expandedDescription.has(company.id)
                          ? company.company_description
                          : getShortDescription(company.company_description)}
                      </span>
                      {company.company_description.split(" ").length > 10 && (
                        <button className="text-blue-600 ml-2" onClick={() => handleToggleDescription(company.id)}>
                          {expandedDescription.has(company.id) ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 company">{formatDate(company.created_on)}</td>
                    <td className="px-6 py-4 text-center company">
                      {!company.is_checked ? (
                        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg company" onClick={() => getData(company.id)}>
                          Check
                        </button>
                      ) : (
                        <span className="px-4 py-2 text-green-600">Checked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminbusinessmsg;