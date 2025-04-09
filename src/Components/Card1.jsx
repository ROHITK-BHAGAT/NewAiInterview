import React from 'react'
import './Card.css'
import { FaWandMagicSparkles, FaPalette,} from "react-icons/fa6";
import { BiSolidZap } from "react-icons/bi";
import span from '../assets/span.png'
import img from '../assets/img.png'
const Card1 = () => {
  return (
    <>
    <div className=''>
    <div className='head-resume'>
      <div className="resume ">
        <div className='resume1'>
          <h2>Build Your Professional Resume</h2>
          <p>Create stunning resumes that stand out and get you hired</p>
        </div>
        <div className='resume2'>
          <div className='resume21'>
            <img src={img} alt="Image" className='img'/>
          </div>
         
          <div className='resume3 '>
          <img src={span} alt="" className='relative  lg:bottom-5 lg:right-15 hidden lg:block'/>
            <div className='resume31'>
              <p><FaWandMagicSparkles className='icon1 text-[#4F46E5] bg-[#E0E7FF]' /> AI-Powered Writing</p>
              <span>Let AI help you craft compelling content for your resume</span>
              <p><FaPalette className='icon1 text-[#9333EA] bg-[#F3E8FF]'/> Customized Templates</p>
              <span>Choose from 50+ ATS-friendly templates</span>
              <p><BiSolidZap className='icon1 text-[#2563EB] bg-[#DBEAFE]'/> Quick Generation</p>
              <span>Create your resume in minutes, not hours</span>
              <div>
                
              <button className='join'>Join the Waitlist</button>
              
              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Card1
