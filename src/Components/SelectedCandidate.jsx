import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import Sidebar from './Sidebar';
import { FaRegBell } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { MdEmail } from 'react-icons/md';
import logoimage from '../assets/react.svg';
import Swal from "sweetalert2";
import axios from "../helper/Axios";
import './SelectedCandidte.css'
import { CgProfile } from "react-icons/cg";

const SelectedCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const userName = user.user_name;
      
  const toggleProfileCard = () => {
    setShowProfileCard(!showProfileCard);
  };
  
  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await axios.get('api/selected-resumes/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidates(response.data);
        setFilteredCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    getCandidates();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = candidates.filter(candidate => {
      const name = candidate.candidate_name || '';
      return name.toLowerCase().includes(term.toLowerCase());
    });

    setFilteredCandidates(filtered);
  };

  const handleSendEmail = async (email) => {
    try {
      const response = await axios.post('/api/send-selection-email/', null, {
        params: { send_to: email },
      });

      const status = response.data.results[email]?.status;
      if (status === "Emails sent") {
        setStatusMessage('Email sent successfully!');
        Swal.fire({
          title: "Email sent successfully!",
          icon: "success",
        });
      } else {
        setStatusMessage('Failed to send email.');
        Swal.fire({
          title: "Failed to send email",
          icon: "error",
        });
      }
    } catch (error) {
      setStatusMessage('Error sending email.');
      console.error('Error sending email:', error);
      Swal.fire({
        title: "Error sending email",
        text: "Please try again later",
        icon: "error",
      });
    }
  };

  const CandidateRow = ({ candidate }) => {
    const [sending, setSending] = useState(false);

    const handleSendEmailClick = async () => {
      setSending(true);
      await handleSendEmail(candidate.candidate_email);
      setSending(false);
    };

    return (
      <div className='grid grid-cols-12 py-4 items-center border-b rounded-lg selectcan border-gray-200 px-4 my-2 '>
        <div className='col-span-2 flex items-center '>
          <span className=' text-md truncate '>{candidate.candidate_name}</span>
        </div>
        <div className='col-span-2'>
          <p className='text-green-500 font-medium text-sm'>{candidate.candidate_resume_selection_status}</p>
        </div>
        <div className='col-span-3'>
          <p className='text-gray-700 text-sm truncate'>{candidate.candidate_email}</p>
        </div>
        <div className='col-span-2 text-center'>
          <p className='text-gray-700 text-sm'>{candidate.candidate_phone || 'N/A'}</p>
        </div>
        <div className='col-span-1 text-center'>
          <p className='text-blue-500 font-medium text-sm'>{candidate.candidate_overall_score || 'N/A'}%</p>
        </div>
        <div className='col-span-2 flex items-center justify-center'>
          <button 
            onClick={handleSendEmailClick} 
            disabled={sending} 
            className={`flex items-center gap-1 text-sm cursor-pointer text-blue-500 hover:text-blue-700 ${sending ? 'opacity-70' : ''}`}
          >
            <MdEmail className='text-lg' />
            <span>{sending ? 'Sending...' : 'Send Email'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='flex w-full'>
      <Sidebar />
      <div className='flex-1 flex-col dash'>
        {/* Header with profile icon */}
        <div className='flex justify-between dash1'>
          <p className='text-3xl font-bold'>Selected Candidates</p>
          <div className='flex items-center gap-4 relative'>
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

        {/* Search bar */}
        <div className='flex items-center justify-between dash1 searchjob'>
          <div className='flex items-center border border-gray-300 rounded-lg w-[50%] h-[50px] p-2'>
            <IoIosSearch className='text-gray-500 text-2xl sam sam1' />
            <input
              type='text'
              placeholder='Search candidates...'
              className='flex-grow pl-2 text-xl border-none outline-none search2 placeholder:text-[18px]'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className={`text-center py-2 px-4 rounded-md ${
            statusMessage.includes('successfully') ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Candidates table */}
        <div className='flex flex-col dash1'>
          <div className='candi1 selectedtable shadow-md padd bg-gray-100 grid grid-cols-12 px-4 py-3 text-gray-600 font-semibold padd2'>
            <div className='col-span-2'><p className='text-md'>Name</p></div>
            <div className='col-span-2'><p className='text-md'>Status</p></div>
            <div className='col-span-3'><p className='text-md'>Email</p></div>
            <div className='col-span-2 text-center'><p className='text-md'>Phone</p></div>
            <div className='col-span-1 text-center'><p className='text-md'>Score</p></div>
            <div className='col-span-2 text-center'><p className='text-md'>Action</p></div>
          </div>
          <div className='mar1 bg-white p-4 rounded-lg'>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, index) => (
                <CandidateRow key={index} candidate={candidate} />
              ))
            ) : (
              <div className='flex items-center justify-center py-4 bg-gray-100 rounded-2xl'>
                <p className='text-gray-500'>
                  {searchTerm ? 'No matching candidates found' : 'No candidates available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedCandidate;