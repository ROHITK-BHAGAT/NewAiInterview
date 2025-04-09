import React from "react";
import logoimage from "../assets/react.svg";
import { MdEmail } from "react-icons/md";

const CandidateCard = ({ SelectedCandidate }) => {
  return (
    <div className="candi bg-white p-8 rounded-lg shadow-lg">
      {/* Candidate Row */}
      <div className="  grid grid-cols-6 gap-10 py-6 items-center border-b border-gray-200">
        {/* Name */}
        <div className="flex items-center gap-3">
          <span className=" p-2 font-medium text-lg">Sam</span>
        </div>

        {/* Status */}
        <p className="text-green-500 font-medium">Resume Selected</p>

        {/* Email */}
        <p className="text-gray-700">sam@gmail.com</p>

        {/* Phone */}
        <p className="text-gray-700">1234567890</p>

        {/* Score */}
        <p className="text-blue-500 font-medium">75%</p>

        {/* Action */}
        <div className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-700">
          <MdEmail className="text-xl" />
          <p>Send Email</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
