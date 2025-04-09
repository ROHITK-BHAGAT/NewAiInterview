import React from 'react'
import './Card.css'
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaLongArrowAltRight } from "react-icons/fa";
import { BiSolidZap } from "react-icons/bi";
import img1 from '../assets/img (1).png'
const Card2 = () => {
  return (
    
      <div className='feedback-resume'>
            <div className="fresume">
              <div className='fresume1'>
              <h2 className="">Real Time Feedback</h2>
              
              </div>
            <div className='resume22'>
            <div className='feedback'>
                  <div className='feedback1'>
                  <h1 className='text-[#2563EB] text-sm border-lg size-fit bg-blue-50 rounded-3xl flex items-center gap-2 realtime hidden lg:block '><BiSolidZap />Real-Time Feedback</h1>
                    <h2>Know your strength and areas of improvement instatly</h2>
                      <p className='text-gray-700'>Get immediate insights into your performance with our advanced real-time feedback system. Track progress, identify patterns, and make data-driven improvements.</p>
                      <div className='btn'>
                      <button className='demo'>Get Started<FaLongArrowAltRight/></button>
                      <button className='demo1'><IoPlayCircleOutline className='text-4xl'/>Watch Demo</button>
                      </div>
                  </div>
              </div>
              <div className=' w-[300px] lg:w-[300px] lg:h-[300px]'>
                  <img src={img1} alt="" />
              </div>
              
            </div>
          
          
      
          </div>
          </div>
    
  )
}

export default Card2