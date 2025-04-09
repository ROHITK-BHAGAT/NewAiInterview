import React from 'react'
import HiringCard from './HiringCard'
import { FaRobot } from "react-icons/fa";
import { MdPhotoCameraFront } from "react-icons/md";
import { GiHighlighter } from "react-icons/gi";
import { MdOutlineEdgesensorHigh } from "react-icons/md";
import { GiHighKick } from "react-icons/gi";
import { PiHighDefinitionFill } from "react-icons/pi";
import { HiVideoCamera } from "react-icons/hi2";
import { GoGraph } from "react-icons/go";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaCalendarCheck } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const HCard = () => {
  return (
    <div className='hiring'>
      <HiringCard
        icon={<FaRobot className='text-blue-500' />}
        bgColor="bg-blue-200"
        title="Automated Screening & Shortlisting"
        descr="Let AI handle the initial selection process, saving time and ensuring efficient candidate evaluation."
      />
      <HiringCard
      icon={<HiVideoCamera className='text-[#9333EA]'/>}
      bgColor="bg-purple-100"
      title={"Live Interview Process"}
      descr={"Customize role-specific questions and set clear hiring criteria for structured interviews."}
      />
      <HiringCard
      icon={<GoGraph className='text-[#EF4774]'/>}
      bgColor="bg-pink-200"
      title={"Data-Driven Insights"}
      descr={"Access comprehensive analytics and reports to make informed hiring decisions."}
      />
      <HiringCard
      icon={<BsFillLightningChargeFill className='text-[#2563EB]'/>}
      bgColor="bg-blue-100"
      title={"Faster & Fairer Hiring"}
      descr={"Eliminate bias and accelerate your hiring process while securing top talent effortlessly."}
      />
      <HiringCard
      icon={<FaCalendarCheck className='text-[#DB2777]'/>}
      bgColor="bg-pink-100"
      title={"Automated Interview Scheduling"}
      descr={"Streamline the interview coordination process with smart scheduling automation."}
      />
  <NavLink to="/companylogin">
    <HiringCard
    icon={<FaRocket className='text-white'/>}
    bgColor="bg-[#6280E8]"
    title4="text-white"
    fourthCard="bg-[linear-gradient(105deg,_#525BD8,_#f531d1)]"
    title={"Ready to tranform?"}
    isButton={true}
              

buttonText={"Get Started"}
              
    

        
    />
      </NavLink>


    </div>
  )
}

export default HCard
