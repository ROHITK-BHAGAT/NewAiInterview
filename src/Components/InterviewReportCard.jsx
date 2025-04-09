import React from 'react'
import logoimage from '../assets/react.svg';
import { NavLink } from 'react-router-dom';

const InterviewReportCard = () => {
  return (
    <div className="candi bg-white p-6 rounded-lg shadow-lg">
          
    
          {/* Candidate Row */}
          <div className="  grid grid-cols-5 gap-10 py-4 items-center border-b border-gray-200">
            {/* Name */}
            <div className="flex items-center gap-3">
              <img
                src={logoimage}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-400"
              />
              <span className="font-medium text-lg">Yash Piyus Trivedi</span>
            </div>
    
            {/* Status */}
            <p className=" font-medium">10/02/25, 06:57:47</p>
    
            {/* Email */}
            <NavLink className="text-blue-700">View</NavLink>
    
            {/* Phone */}
            <NavLink className="text-blue-700">View</NavLink>
    
            {/* Score */}
            <NavLink className="text-blue-500 font-medium">View</NavLink>
    
            
          </div>
        </div>
  )
}

export default InterviewReportCard
