import React from 'react'
import BenefitCard from './BenefitCard'
import { FaRobot } from "react-icons/fa";
import { MdPhotoCameraFront } from "react-icons/md";
import { GiHighlighter } from "react-icons/gi";
import { FaRocket } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { PiDatabaseBold } from "react-icons/pi";
import './HiringCard.css'

const BCard = () => {
  return (
    <>
      <div className='smart'>
        <h3>Key Benefits of Smart Hiring</h3>
      </div>
      <div className='hiring'>
        <BenefitCard
          icon={<FaRocket className='text-[#2563EB]' />}
          bgColor="bg-blue-200"
          title={"Future Ready"}
          descr={"With the shift towards remote and hybrid work, recruitment is evolving rapidly. Al- driven interview solutions ensure you're always at the forefront of digital transformation, keeping your hiring process future-proof."}
        />
        <BenefitCard
          icon={<PiDatabaseBold className='text-[#6B4EFF]' />}
          bgColor="bg-blue-200"
          title={"Cost-Effective"}
          descr={"Maximize every dollar spent by choosing the right hiring tool. Al-powered pre- screening software streamlines the recruitment process, significantly reducing hiring costs while boosting efficiency."}
        />
        <BenefitCard
          icon={<FaClock className='text-[#EF4774]' />}
          bgColor="bg-blue-200"
          title={"Time-Saving"}
          descr={"As a business leader, your time is valuable. Automate time-consuming tasks like pre- screening and onboarding with Al-enabled video interviewing, allowing you to focus on what matters most."}
        />
      </div>

    </>
  )
}

export default BCard
